import { NextResponse } from "next/server";

import { routeErrorResponse } from "@/lib/http/route-error";
import { logger } from "@/lib/logger";
import { onboardingBootstrapSchema } from "@/modules/onboarding/contracts";
import { resetDevelopmentOnboarding } from "@/modules/onboarding/service";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const payload: unknown = await request.json();
    const { initData } = onboardingBootstrapSchema.parse(payload);
    const onboarding = await resetDevelopmentOnboarding(initData);
    logger.info("Development onboarding reset");
    return NextResponse.json({ onboarding });
  } catch (error) {
    return routeErrorResponse(error, "Failed to reset development onboarding");
  }
}
