import { NextResponse } from "next/server";
import { z } from "zod";

import { ApiError, errorResponse } from "@/lib/http/api-error";
import { logger } from "@/lib/logger";
import { TelegramInitDataError, validateTelegramInitData } from "@/lib/telegram/init-data";

const requestSchema = z.object({
  initData: z.string().min(1).max(8192),
});

function initDataMaxAge(): number {
  const parsed = Number(process.env.TELEGRAM_INIT_DATA_MAX_AGE_SECONDS ?? "86400");
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 86400;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const payload: unknown = await request.json();
    const { initData } = requestSchema.parse(payload);
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      throw new ApiError(
        503,
        "TELEGRAM_AUTH_NOT_CONFIGURED",
        "Telegram authentication is not configured.",
      );
    }

    const verified = validateTelegramInitData(initData, botToken, initDataMaxAge());
    logger.info("Telegram initData verified", { telegramUserId: verified.user?.id ?? null });

    // Deliberately stops after verification: session issuance and onboarding belong to the next task.
    return NextResponse.json({
      authenticated: true,
      telegramUser: verified.user ?? null,
      authDate: verified.authDate.toISOString(),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return errorResponse(error);
    }
    if (error instanceof TelegramInitDataError) {
      logger.warn("Telegram initData rejected", { reason: error.message });
      return errorResponse(
        new ApiError(401, "INVALID_TELEGRAM_INIT_DATA", "Authentication data is invalid."),
      );
    }
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return errorResponse(
        new ApiError(400, "INVALID_REQUEST", "A valid initData payload is required."),
      );
    }

    logger.error("Unhandled Telegram authentication error", {
      error: error instanceof Error ? error.name : "unknown",
    });
    return errorResponse(new ApiError(500, "INTERNAL_ERROR", "Unexpected server error."));
  }
}
