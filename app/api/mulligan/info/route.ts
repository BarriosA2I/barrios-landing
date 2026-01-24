/**
 * Mulligan Info API
 *
 * Returns production info for the mulligan feedback page
 * Does NOT consume the mulligan - just validates and returns data
 *
 * @route GET /api/mulligan/info?token=xxx
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Missing mulligan token" },
      { status: 400 }
    );
  }

  try {
    const production = await db.production.findUnique({
      where: { mulliganToken: token },
      select: {
        id: true,
        title: true,
        mulliganUsed: true,
        status: true,
        createdAt: true,
        assets: {
          where: {
            type: { in: ["VIDEO_FINAL", "VIDEO_PREVIEW", "THUMBNAIL"] },
          },
          select: {
            type: true,
            storageUrl: true,
            cdnUrl: true,
          },
        },
      },
    });

    if (!production) {
      return NextResponse.json(
        { error: "Invalid or expired mulligan link" },
        { status: 404 }
      );
    }

    if (production.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "This production is not yet complete" },
        { status: 400 }
      );
    }

    // Extract video and thumbnail URLs from assets
    const videoAsset = production.assets.find(
      (a) => a.type === "VIDEO_FINAL" || a.type === "VIDEO_PREVIEW"
    );
    const thumbnailAsset = production.assets.find((a) => a.type === "THUMBNAIL");

    return NextResponse.json({
      id: production.id,
      title: production.title || "Your Commercial",
      thumbnailUrl: thumbnailAsset?.cdnUrl || thumbnailAsset?.storageUrl || null,
      videoUrl: videoAsset?.cdnUrl || videoAsset?.storageUrl || null,
      mulliganAvailable: !production.mulliganUsed,
      status: production.status,
    });
  } catch (error) {
    console.error("[Mulligan Info] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch production info" },
      { status: 500 }
    );
  }
}
