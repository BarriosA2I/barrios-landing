/**
 * Mulligan API - One-Time Free Video Recreation
 *
 * Allows customers to recreate their commercial once for free
 * via a secure token sent in their completion email.
 *
 * @route GET /api/mulligan?token=xxx (email link)
 * @route POST /api/mulligan (authenticated dashboard request)
 * @route HEAD /api/mulligan?token=xxx (availability check)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { TokenGuard } from "@/lib/token-guard";

// ============================================================================
// GET /api/mulligan?token=xxx
// Process mulligan from email link (no auth required - token is the auth)
// ============================================================================

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.barriosa2i.com";

  // Validate token exists
  if (!token || token.length < 20) {
    return NextResponse.redirect(`${baseUrl}/dashboard?error=invalid_mulligan_token`);
  }

  try {
    // Find production with this mulligan token
    const production = await db.production.findUnique({
      where: { mulliganToken: token },
      include: {
        account: {
          include: {
            labSubscription: {
              include: {
                cycles: {
                  where: {
                    periodStart: { lte: new Date() },
                    periodEnd: { gte: new Date() },
                  },
                  orderBy: { cycleNumber: "desc" },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    // ===== Validation =====

    if (!production) {
      console.log("[Mulligan] Invalid token:", token.substring(0, 8) + "...");
      return NextResponse.redirect(`${baseUrl}/dashboard?error=mulligan_not_found`);
    }

    if (production.mulliganUsed) {
      console.log("[Mulligan] Already used:", production.id);
      return NextResponse.redirect(
        `${baseUrl}/dashboard/lab?error=mulligan_already_used&production=${production.id}`
      );
    }

    if (production.status !== "COMPLETED") {
      console.log("[Mulligan] Not complete:", production.status);
      return NextResponse.redirect(
        `${baseUrl}/dashboard/lab?error=production_not_complete&production=${production.id}`
      );
    }

    // ===== Process Mulligan =====

    const newMulliganToken = generateSecureToken();
    const cycle = production.account.labSubscription?.cycles[0];

    // Transaction: mark used + create new production
    const { newProduction } = await db.$transaction(async (tx) => {
      // 1. Mark original mulligan as used
      await tx.production.update({
        where: { id: production.id },
        data: { mulliganUsed: true },
      });

      // 2. Create new production (FREE - no token deduction)
      const newProd = await tx.production.create({
        data: {
          accountId: production.accountId,
          title: `${production.title} (Mulligan)`,
          script: production.script,
          targetAudience: production.targetAudience,
          brandVoice: production.brandVoice,
          format: production.format,
          duration: production.duration,
          tokensRequired: 0, // FREE!
          tokensConsumed: 0,
          status: "QUEUED",
          priority: production.priority,
          queuedAt: new Date(),
          mulliganUsed: false,
          mulliganToken: newMulliganToken,
          originalId: production.id,
        },
      });

      // 3. Log transaction (0 tokens but tracked for analytics)
      if (cycle) {
        await tx.tokenLedgerEntry.create({
          data: {
            cycleId: cycle.id,
            type: "DEBIT_PRODUCTION",
            amount: 0,
            balance: cycle.tokensAllocated - cycle.tokensUsed - cycle.tokensExpired,
            referenceType: "mulligan",
            referenceId: newProd.id,
            idempotencyKey: `mulligan_${newProd.id}`,
            description: `Free mulligan: ${production.title}`,
          },
        });
      }

      return { newProduction: newProd };
    });

    // 4. Trigger RAGNAROK pipeline for recreation
    await triggerRecreation(newProduction.id, production);

    console.log(
      `[Mulligan] Created recreation: ${newProduction.id} from ${production.id}`
    );

    // Redirect to dashboard with success
    return NextResponse.redirect(
      `${baseUrl}/dashboard/lab?mulligan=success&production=${newProduction.id}`
    );
  } catch (error) {
    console.error("[Mulligan] Error:", error);
    return NextResponse.redirect(`${baseUrl}/dashboard?error=mulligan_failed`);
  }
}

// ============================================================================
// POST /api/mulligan
// Process mulligan from authenticated dashboard
// ============================================================================

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productionId } = await req.json();

    if (!productionId) {
      return NextResponse.json(
        { error: "Production ID required" },
        { status: 400 }
      );
    }

    // Get account ID from user
    const accountId = await TokenGuard.getAccountIdFromClerkId(userId);
    if (!accountId) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Find production and verify ownership
    const production = await db.production.findFirst({
      where: {
        id: productionId,
        accountId,
      },
      include: {
        account: {
          include: {
            labSubscription: {
              include: {
                cycles: {
                  where: {
                    periodStart: { lte: new Date() },
                    periodEnd: { gte: new Date() },
                  },
                  orderBy: { cycleNumber: "desc" },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!production) {
      return NextResponse.json(
        { error: "Production not found" },
        { status: 404 }
      );
    }

    if (production.mulliganUsed) {
      // Check balance for paid redo
      const balanceCheck = await TokenGuard.checkBalance(accountId, 1);
      return NextResponse.json(
        {
          error: "Mulligan already used",
          message:
            "Your free recreation has already been used. Additional recreations cost 1 token.",
          canPurchase: balanceCheck.success,
          currentBalance: balanceCheck.balance,
        },
        { status: 400 }
      );
    }

    if (production.status !== "COMPLETED") {
      return NextResponse.json(
        {
          error: "Production not complete",
          message: "Wait for your video to complete before using your mulligan.",
          status: production.status,
        },
        { status: 400 }
      );
    }

    // Process mulligan
    const newMulliganToken = generateSecureToken();
    const cycle = production.account.labSubscription?.cycles[0];

    const { newProduction } = await db.$transaction(async (tx) => {
      await tx.production.update({
        where: { id: production.id },
        data: { mulliganUsed: true },
      });

      const newProd = await tx.production.create({
        data: {
          accountId: production.accountId,
          title: `${production.title} (Mulligan)`,
          script: production.script,
          targetAudience: production.targetAudience,
          brandVoice: production.brandVoice,
          format: production.format,
          duration: production.duration,
          tokensRequired: 0,
          tokensConsumed: 0,
          status: "QUEUED",
          priority: production.priority,
          queuedAt: new Date(),
          mulliganUsed: false,
          mulliganToken: newMulliganToken,
          originalId: production.id,
        },
      });

      if (cycle) {
        await tx.tokenLedgerEntry.create({
          data: {
            cycleId: cycle.id,
            type: "DEBIT_PRODUCTION",
            amount: 0,
            balance: cycle.tokensAllocated - cycle.tokensUsed - cycle.tokensExpired,
            referenceType: "mulligan",
            referenceId: newProd.id,
            idempotencyKey: `mulligan_${newProd.id}`,
            description: `Free mulligan: ${production.title}`,
          },
        });
      }

      return { newProduction: newProd };
    });

    await triggerRecreation(newProduction.id, production);

    return NextResponse.json({
      success: true,
      message:
        "Mulligan activated! Your commercial is being recreated with fresh creative direction.",
      newProductionId: newProduction.id,
      originalProductionId: production.id,
      estimatedMinutes: 4,
    });
  } catch (error) {
    console.error("[Mulligan POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to process mulligan" },
      { status: 500 }
    );
  }
}

// ============================================================================
// HEAD /api/mulligan?token=xxx
// Check mulligan availability without processing
// ============================================================================

export async function HEAD(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return new NextResponse(null, { status: 400 });
  }

  const production = await db.production.findUnique({
    where: { mulliganToken: token },
    select: { mulliganUsed: true, status: true },
  });

  if (!production) {
    return new NextResponse(null, { status: 404 });
  }

  const headers = new Headers();

  if (production.mulliganUsed) {
    headers.set("X-Mulligan-Status", "used");
    return new NextResponse(null, { status: 410 }); // Gone
  }

  if (production.status !== "COMPLETED") {
    headers.set("X-Mulligan-Status", "pending");
    return new NextResponse(null, { status: 425 }); // Too Early
  }

  headers.set("X-Mulligan-Status", "available");
  return new NextResponse(null, { status: 200, headers });
}

// ============================================================================
// Helpers
// ============================================================================

function generateSecureToken(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const segments = [8, 4, 4, 12].map((len) =>
    Array.from({ length: len }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("")
  );
  return segments.join("-");
}

async function triggerRecreation(
  newProductionId: string,
  original: {
    id: string;
    title: string;
    script: string;
    targetAudience: string | null;
    brandVoice: string | null;
    format: string;
    duration: number;
  }
) {
  const genesisUrl =
    process.env.GENESIS_API_URL ||
    "https://barrios-genesis-flawless.onrender.com";

  try {
    const response = await fetch(`${genesisUrl}/api/ragnarok/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GENESIS_API_KEY}`,
      },
      body: JSON.stringify({
        productionId: newProductionId,
        isMulligan: true,
        originalProductionId: original.id,
        title: original.title,
        script: original.script,
        targetAudience: original.targetAudience,
        brandVoice: original.brandVoice,
        format: original.format,
        duration: original.duration,
        instructions:
          "Create a fresh variation with different visuals, pacing, and creative direction while maintaining the core message and brand identity.",
      }),
    });

    if (!response.ok) {
      console.error("[Mulligan] GENESIS error:", await response.text());
    } else {
      console.log("[Mulligan] RAGNAROK pipeline started:", newProductionId);
    }
  } catch (error) {
    console.error("[Mulligan] GENESIS connection error:", error);
    // Production record exists - can retry manually
  }
}
