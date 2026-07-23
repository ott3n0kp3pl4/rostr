import { NextResponse } from "next/server";

import { routeErrorResponse } from "@/lib/http/route-error";
import { logger } from "@/lib/logger";
import { onboardingActionSchema } from "@/modules/onboarding/contracts";
import { applyOnboardingAction } from "@/modules/onboarding/service";

export async function PATCH(request: Request): Promise<NextResponse> {
  try {
    const payload: unknown = await request.json();
    const action = onboardingActionSchema.parse(payload);
    const onboarding = await applyOnboardingAction(action);
    logger.info("Onboarding action applied", {
      action: action.action,
      completed: onboarding.completed,
    });
    return NextResponse.json({ onboarding });
  } catch (error) {
    return routeErrorResponse(error, "Failed to apply onboarding action");
  }
}
