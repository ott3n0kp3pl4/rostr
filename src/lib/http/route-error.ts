import { z } from "zod";

import { ApiError, errorResponse } from "@/lib/http/api-error";
import { logger } from "@/lib/logger";
import { TelegramInitDataError } from "@/lib/telegram/init-data";

export function routeErrorResponse(error: unknown, event: string) {
  if (error instanceof ApiError) {
    return errorResponse(error);
  }
  if (error instanceof TelegramInitDataError) {
    return errorResponse(
      new ApiError(401, "INVALID_TELEGRAM_INIT_DATA", "Authentication data is invalid."),
    );
  }
  if (error instanceof z.ZodError || error instanceof SyntaxError) {
    return errorResponse(new ApiError(400, "INVALID_REQUEST", "The submitted data is invalid."));
  }

  logger.error(event, { error: error instanceof Error ? error.name : "unknown" });
  return errorResponse(new ApiError(500, "INTERNAL_ERROR", "Unexpected server error."));
}
