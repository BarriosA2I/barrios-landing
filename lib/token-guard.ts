/**
 * Token Guard - Atomic Token Management for Commercial Lab
 *
 * Adapted for Account-based model with TokenLedgerEntry system.
 * Ensures users have sufficient tokens before production starts.
 *
 * @author Barrios A2I
 */

import { db } from "./db";
import { Prisma } from "@prisma/client";

// ============================================================================
// Types
// ============================================================================

export interface TokenCheckResult {
  success: boolean;
  balance: number;
  required: number;
  error?: string;
}

export interface TokenDeductResult {
  success: boolean;
  productionId: string;
  ledgerEntryId: string;
  newBalance: number;
  error?: string;
}

export interface BalanceDetails {
  currentBalance: number;
  lifetimeTokens: number;
  tokensUsed: number;
  subscriptionTier: string | null;
  monthlyAllocation: number;
  totalProductions: number;
}

// ============================================================================
// Token Costs Configuration
// ============================================================================

export const TOKEN_COSTS = {
  STANDARD_VIDEO: 1,
  RUSH_VIDEO: 2,
  PREMIUM_VIDEO: 3,

  TIERS: {
    STARTER: { tokens: 8, price: 449 },
    CREATOR: { tokens: 18, price: 899 },
    GROWTH: { tokens: 32, price: 1699 },
    SCALE: { tokens: 64, price: 3199 },
  },
} as const;

// ============================================================================
// Token Guard Class
// ============================================================================

export class TokenGuard {
  /**
   * Get the current active cycle for an account
   */
  private static async getActiveCycle(accountId: string) {
    const subscription = await db.commercialLabSubscription.findUnique({
      where: { accountId },
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
    });

    if (!subscription || subscription.status !== "ACTIVE") {
      return null;
    }

    return subscription.cycles[0] || null;
  }

  /**
   * Calculate available token balance for an account
   */
  static async checkBalance(
    accountId: string,
    required: number = 1
  ): Promise<TokenCheckResult> {
    try {
      const cycle = await this.getActiveCycle(accountId);

      if (!cycle) {
        return {
          success: false,
          balance: 0,
          required,
          error: "No active subscription or billing cycle",
        };
      }

      const availableTokens = cycle.tokensAllocated - cycle.tokensUsed - cycle.tokensExpired;

      return {
        success: availableTokens >= required,
        balance: availableTokens,
        required,
        error:
          availableTokens < required
            ? `Insufficient tokens: have ${availableTokens}, need ${required}`
            : undefined,
      };
    } catch (error) {
      console.error("[TokenGuard] checkBalance error:", error);
      return {
        success: false,
        balance: 0,
        required,
        error: "Failed to check token balance",
      };
    }
  }

  /**
   * Atomically deduct tokens and create production record
   * Uses database transaction with optimistic locking
   */
  static async deductForProduction(
    accountId: string,
    productionData: {
      title: string;
      script: string;
      targetAudience?: string;
      brandVoice?: string;
      format?: string;
      duration?: number;
      tokensRequired?: number;
      priority?: "STANDARD" | "EXPEDITED" | "PRIORITY" | "RUSH";
    }
  ): Promise<TokenDeductResult> {
    const tokensRequired = productionData.tokensRequired ?? TOKEN_COSTS.STANDARD_VIDEO;

    try {
      const result = await db.$transaction(
        async (tx) => {
          // 1. Get active cycle with lock
          const subscription = await tx.commercialLabSubscription.findUnique({
            where: { accountId },
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
          });

          if (!subscription || subscription.status !== "ACTIVE") {
            throw new Error("No active subscription");
          }

          const cycle = subscription.cycles[0];
          if (!cycle) {
            throw new Error("No active billing cycle");
          }

          const availableTokens = cycle.tokensAllocated - cycle.tokensUsed - cycle.tokensExpired;
          if (availableTokens < tokensRequired) {
            throw new Error(
              `Insufficient tokens: have ${availableTokens}, need ${tokensRequired}`
            );
          }

          // 2. Generate mulligan token
          const mulliganToken = generateMulliganToken();

          // 3. Create production record
          const production = await tx.production.create({
            data: {
              accountId,
              title: productionData.title,
              script: productionData.script,
              targetAudience: productionData.targetAudience,
              brandVoice: productionData.brandVoice,
              format: productionData.format || "16:9",
              duration: productionData.duration || 64,
              tokensRequired,
              tokensConsumed: tokensRequired,
              status: "QUEUED",
              priority: productionData.priority || "STANDARD",
              queuedAt: new Date(),
              mulliganUsed: false,
              mulliganToken,
            },
          });

          // 4. Update cycle token usage
          await tx.labSubscriptionCycle.update({
            where: { id: cycle.id },
            data: {
              tokensUsed: { increment: tokensRequired },
            },
          });

          // 5. Create ledger entry with idempotency key
          const idempotencyKey = `production_${production.id}_debit`;
          const newBalance = availableTokens - tokensRequired;

          const ledgerEntry = await tx.tokenLedgerEntry.create({
            data: {
              cycleId: cycle.id,
              type: "DEBIT_PRODUCTION",
              amount: -tokensRequired,
              balance: newBalance,
              referenceType: "production",
              referenceId: production.id,
              idempotencyKey,
              description: `Video production: ${productionData.title}`,
            },
          });

          return {
            productionId: production.id,
            ledgerEntryId: ledgerEntry.id,
            newBalance,
          };
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          maxWait: 5000,
          timeout: 10000,
        }
      );

      return {
        success: true,
        ...result,
      };
    } catch (error) {
      console.error("[TokenGuard] deductForProduction error:", error);
      return {
        success: false,
        productionId: "",
        ledgerEntryId: "",
        newBalance: 0,
        error: error instanceof Error ? error.message : "Failed to deduct tokens",
      };
    }
  }

  /**
   * Get token balance with detailed breakdown
   */
  static async getBalanceDetails(accountId: string): Promise<BalanceDetails | null> {
    try {
      const subscription = await db.commercialLabSubscription.findUnique({
        where: { accountId },
        include: {
          cycles: {
            where: {
              periodStart: { lte: new Date() },
              periodEnd: { gte: new Date() },
            },
            orderBy: { cycleNumber: "desc" },
            take: 1,
          },
          account: {
            include: {
              _count: {
                select: { productions: true },
              },
            },
          },
        },
      });

      if (!subscription) {
        return null;
      }

      const cycle = subscription.cycles[0];
      const currentBalance = cycle
        ? cycle.tokensAllocated - cycle.tokensUsed - cycle.tokensExpired
        : 0;

      // Calculate lifetime tokens from all cycles
      const allCycles = await db.labSubscriptionCycle.findMany({
        where: { subscriptionId: subscription.id },
        select: { tokensAllocated: true, tokensUsed: true },
      });

      const lifetimeTokens = allCycles.reduce((sum, c) => sum + c.tokensAllocated, 0);
      const tokensUsed = allCycles.reduce((sum, c) => sum + c.tokensUsed, 0);

      return {
        currentBalance,
        lifetimeTokens,
        tokensUsed,
        subscriptionTier: subscription.tier,
        monthlyAllocation: subscription.monthlyTokens,
        totalProductions: subscription.account._count.productions,
      };
    } catch (error) {
      console.error("[TokenGuard] getBalanceDetails error:", error);
      return null;
    }
  }

  /**
   * Get account ID from Clerk user ID
   */
  static async getAccountIdFromClerkId(clerkId: string): Promise<string | null> {
    try {
      const user = await db.user.findUnique({
        where: { clerkId },
        include: {
          ownedAccounts: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!user || user.ownedAccounts.length === 0) {
        return null;
      }

      return user.ownedAccounts[0].id;
    } catch (error) {
      console.error("[TokenGuard] getAccountIdFromClerkId error:", error);
      return null;
    }
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a secure mulligan token for email links
 */
function generateMulliganToken(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const segments = [8, 4, 4, 12].map((len) =>
    Array.from({ length: len }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("")
  );
  return segments.join("-");
}

/**
 * Calculate tokens for a subscription tier
 */
export function getTokensForTier(tier: string): number {
  const tierKey = tier.toUpperCase() as keyof typeof TOKEN_COSTS.TIERS;
  return TOKEN_COSTS.TIERS[tierKey]?.tokens ?? 0;
}

export default TokenGuard;
