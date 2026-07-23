import { NextResponse } from "next/server";

import { routeErrorResponse } from "@/lib/http/route-error";
import { logger } from "@/lib/logger";
import { onboardingBootstrapSchema } from "@/modules/onboarding/contracts";
import { bootstrapOnboarding } from "@/modules/onboarding/service";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const payload: unknown = await request.json();
    const { initData } = onboardingBootstrapSchema.parse(payload);
    const onboarding = await bootstrapOnboarding(initData);
    logger.info("Onboarding bootstrapped", {
      completed: onboarding.completed,
      role: onboarding.role,
    });
    return NextResponse.json({ onboarding });
  } catch (error) {
    return routeErrorResponse(error, "Failed to bootstrap onboarding");
  }
}
