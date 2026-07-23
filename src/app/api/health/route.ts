import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export function GET(): NextResponse {
  logger.info("Health check requested");
  return NextResponse.json({
    status: "ok",
    service: "creator-hire-mini-app",
    timestamp: new Date().toISOString(),
  });
}
