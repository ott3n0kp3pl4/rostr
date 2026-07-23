"use client";

import { TelegramShell } from "@/components/telegram-shell";
import { OnboardingWizard } from "@/modules/onboarding/onboarding-wizard";

export function HomeScreen(): React.ReactNode {
  return <TelegramShell>{(telegram) => <OnboardingWizard telegram={telegram} />}</TelegramShell>;
}
