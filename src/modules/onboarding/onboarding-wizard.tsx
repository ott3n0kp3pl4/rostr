"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Fingerprint,
  Globe2,
  LoaderCircle,
  Milestone,
  ShieldCheck,
  Sparkles,
  UserRound,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { TelegramContext } from "@/components/telegram-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type {
  AgencyProfileFoundation,
  CandidateProfileFoundation,
  ClientOnboardingAction,
  ClientOnboardingStep,
  OnboardingRole,
  OnboardingSnapshot,
} from "@/modules/onboarding/contracts";

type ApiErrorPayload = {
  error?: {
    code?: string;
    message?: string;
  };
};

type ApiResponse = {
  onboarding: OnboardingSnapshot;
};

type WizardProps = {
  telegram: TelegramContext;
};

type ChoiceProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  highlighted?: boolean;
};

const agencyNameSchema = z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters").max(80, "Maximum 80 characters"),
});

const salarySchema = z.object({
  minimumSalaryUsd: z
    .string()
    .trim()
    .regex(/^\d+$/, "Enter a whole monthly amount")
    .transform(Number)
    .pipe(z.number().int().min(500, "Minimum is $500").max(100000, "Check the amount")),
});

const specializationLabels: Record<
  NonNullable<CandidateProfileFoundation["specialization"]>,
  string
> = {
  chatter: "Chatter",
  chatter_team_lead: "Chatter Team Lead",
  recruiter: "Recruiter",
};

const experienceLabels: Record<NonNullable<CandidateProfileFoundation["experience"]>, string> = {
  none: "Starting out",
  up_to_one_year: "Up to 1 year",
  one_to_three_years: "1-3 years",
  three_plus_years: "3+ years",
};

const englishLabels: Record<NonNullable<CandidateProfileFoundation["englishLevel"]>, string> = {
  basic: "Basic",
  intermediate: "Intermediate",
  upper_intermediate: "Upper-Intermediate",
  advanced: "Advanced",
};

const teamSizeLabels: Record<NonNullable<AgencyProfileFoundation["teamSize"]>, string> = {
  one_to_five: "1-5 people",
  six_to_twenty: "6-20 people",
  twenty_one_to_fifty: "21-50 people",
  fifty_plus: "50+ people",
};

const monthlyHiringLabels: Record<NonNullable<AgencyProfileFoundation["monthlyHiring"]>, string> = {
  one: "1 person",
  two_to_five: "2-5 people",
  six_to_ten: "6-10 people",
  eleven_plus: "11+ people",
};

type AgencyNameForm = z.infer<typeof agencyNameSchema>;
type SalaryFormInput = z.input<typeof salarySchema>;
type SalaryForm = z.output<typeof salarySchema>;

const candidateProgress: Record<ClientOnboardingStep, { current: number; total: number } | null> = {
  welcome: null,
  role: { current: 1, total: 6 },
  candidateSpecialization: { current: 2, total: 6 },
  candidateExperience: { current: 3, total: 6 },
  candidateEnglish: { current: 4, total: 6 },
  candidateTimezone: { current: 5, total: 6 },
  candidateSalary: { current: 6, total: 6 },
  agencyName: { current: 2, total: 4 },
  agencyTeamSize: { current: 3, total: 4 },
  agencyMonthlyHiring: { current: 4, total: 4 },
  complete: null,
};

async function requestOnboarding<T>(
  path: string,
  method: "POST" | "PATCH",
  body: object,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => ({}))) as T & ApiErrorPayload;
    if (!response.ok) {
      throw new Error(payload.error?.message ?? "Could not save your progress.");
    }

    return payload;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The server did not respond. Check the database connection and try again.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function Choice({
  title,
  description,
  icon,
  onClick,
  disabled,
  highlighted,
}: ChoiceProps): React.ReactNode {
  return (
    <motion.button
      className={cn(
        "group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-60",
        highlighted
          ? "border-[var(--primary)] bg-[var(--primary-soft)]"
          : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:bg-[var(--secondary)]",
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
      whileTap={{ scale: 0.985 }}
    >
      {icon ? (
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--icon-surface)] text-[var(--primary)]">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-5 text-[var(--foreground)]">
          {title}
        </span>
        {description ? (
          <span className="mt-1 block text-sm leading-5 text-[var(--muted)]">{description}</span>
        ) : null}
      </span>
      <ChevronRight className="size-5 shrink-0 text-[var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--primary)]" />
    </motion.button>
  );
}

function Header({
  progress,
}: {
  progress: { current: number; total: number } | null;
}): React.ReactNode {
  return (
    <header className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-[-0.01em] text-[var(--foreground)]">
          Rostr
        </span>
        {progress ? (
          <span className="text-xs font-medium tabular-nums text-[var(--muted)]">
            {progress.current} of {progress.total}
          </span>
        ) : (
          <span className="rounded-full bg-[var(--secondary)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
            Telegram-first
          </span>
        )}
      </div>
      {progress ? (
        <Progress value={(progress.current / progress.total) * 100} />
      ) : (
        <div className="h-1.5" />
      )}
    </header>
  );
}

function Screen({
  children,
  screenKey,
}: {
  children: React.ReactNode;
  screenKey: string;
}): React.ReactNode {
  const reduceMotion = useReducedMotion();
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[430px] flex-1 flex-col"
      exit={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
      key={screenKey}
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

function Title({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}): React.ReactNode {
  return (
    <div className="space-y-3">
      {eyebrow ? <p className="text-sm font-semibold text-[var(--primary)]">{eyebrow}</p> : null}
      <h1 className="text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.045em] text-[var(--foreground)]">
        {title}
      </h1>
      <p className="max-w-sm text-pretty text-[15px] leading-6 text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}

function LoadingState(): React.ReactNode {
  return (
    <main className="telegram-safe mx-auto flex min-h-[var(--app-height)] max-w-md items-center px-5">
      <Card className="w-full p-6">
        <LoaderCircle className="size-5 animate-spin text-[var(--primary)]" />
        <p className="mt-4 text-base font-semibold">Preparing your Rostr space</p>
        <p className="mt-1 text-sm text-[var(--muted)]">Checking saved progress.</p>
      </Card>
    </main>
  );
}

function ErrorState({ message, retry }: { message: string; retry: () => void }): React.ReactNode {
  return (
    <main className="telegram-safe mx-auto flex min-h-[var(--app-height)] max-w-md items-center px-5">
      <Card className="w-full p-6">
        <AlertCircle className="size-6 text-[var(--danger)]" />
        <h1 className="mt-4 text-xl font-semibold tracking-tight">Could not open Rostr</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{message}</p>
        <Button className="mt-6 w-full" onClick={retry} type="button">
          Try again
        </Button>
      </Card>
    </main>
  );
}

function BusyLabel(): React.ReactNode {
  return <LoaderCircle aria-label="Saving" className="size-5 animate-spin" />;
}

function AgencyNameStep({
  busy,
  submit,
}: {
  busy: boolean;
  submit: (name: string) => void;
}): React.ReactNode {
  const form = useForm<AgencyNameForm>({
    resolver: zodResolver(agencyNameSchema),
    defaultValues: { name: "" },
  });

  return (
    <form
      className="mt-10 flex flex-1 flex-col"
      onSubmit={form.handleSubmit((values) => submit(values.name))}
    >
      <label className="sr-only" htmlFor="agency-name">
        Agency name
      </label>
      <Input
        autoComplete="organization"
        autoFocus
        disabled={busy}
        id="agency-name"
        placeholder="For example, North Star"
        {...form.register("name")}
      />
      <p className="mt-2 min-h-5 text-sm text-[var(--danger)]">
        {form.formState.errors.name?.message}
      </p>
      <div className="mt-auto pt-8">
        <Button className="w-full" disabled={busy} size="lg" type="submit">
          {busy ? (
            <BusyLabel />
          ) : (
            <>
              Continue <ArrowRight className="size-5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function SalaryStep({
  busy,
  submit,
}: {
  busy: boolean;
  submit: (salary: number) => void;
}): React.ReactNode {
  const form = useForm<SalaryFormInput, undefined, SalaryForm>({
    resolver: zodResolver(salarySchema),
    defaultValues: { minimumSalaryUsd: "1500" },
  });

  return (
    <form
      className="mt-10 flex flex-1 flex-col"
      onSubmit={form.handleSubmit((values) => submit(values.minimumSalaryUsd))}
    >
      <div className="relative">
        <label className="sr-only" htmlFor="salary">
          Minimum monthly salary in US dollars
        </label>
        <span className="pointer-events-none absolute left-4 top-4 text-xl font-semibold text-[var(--foreground)]">
          $
        </span>
        <Input
          autoFocus
          className="pl-8 text-xl font-semibold tabular-nums"
          disabled={busy}
          id="salary"
          inputMode="numeric"
          min="500"
          placeholder="1500"
          type="number"
          {...form.register("minimumSalaryUsd")}
        />
      </div>
      <p className="mt-2 min-h-5 text-sm text-[var(--danger)]">
        {form.formState.errors.minimumSalaryUsd?.message}
      </p>
      <p className="mt-2 text-sm text-[var(--muted)]">In US dollars per month</p>
      <div className="mt-auto pt-8">
        <Button className="w-full" disabled={busy} size="lg" type="submit">
          {busy ? (
            <BusyLabel />
          ) : (
            <>
              Finish <ArrowRight className="size-5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function DevReset({
  canReset,
  busy,
  onReset,
}: {
  canReset: boolean;
  busy: boolean;
  onReset: () => void;
}): React.ReactNode {
  if (!canReset) {
    return null;
  }

  return (
    <button
      className="mt-6 text-xs font-medium text-[var(--muted)] underline-offset-4 hover:text-[var(--foreground)] hover:underline disabled:opacity-50"
      disabled={busy}
      onClick={onReset}
      type="button"
    >
      Reset onboarding for development
    </button>
  );
}

function fieldValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "Not set yet";
  }
  return String(value);
}

function DashboardField({ label, value }: { label: string; value: string }): React.ReactNode {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)] px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function DashboardCard({
  children,
  description,
  icon,
  title,
}: {
  children?: React.ReactNode;
  description: string;
  icon: React.ReactNode;
  title: string;
}): React.ReactNode {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--icon-surface)] text-[var(--primary)]">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold tracking-[-0.02em] text-[var(--foreground)]">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p>
        </div>
      </div>
      {children ? <div className="mt-5">{children}</div> : null}
    </Card>
  );
}

function CareerPassportFoundation({
  audience,
}: {
  audience: "talent" | "agency";
}): React.ReactNode {
  return (
    <DashboardCard
      description={
        audience === "talent"
          ? "This is the start of your portable professional identity."
          : "This is the trust model your organization will participate in."
      }
      icon={<Fingerprint className="size-5" />}
      title="Career Passport foundation"
    >
      <div className="space-y-3">
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-4">
          <div className="flex items-center gap-2">
            <Milestone className="size-4 text-[var(--primary)]" />
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Verified career timeline is empty
            </p>
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Employment verification is planned and not active yet. Future timeline entries will
            require clear talent and agency confirmation.
          </p>
        </div>
        <div className="rounded-2xl bg-[var(--primary-soft)] p-4 text-sm leading-6 text-[var(--foreground)]">
          Reputation in Rostr will be based on verified career events, not ratings, reviews or paid
          boosts.
        </div>
      </div>
    </DashboardCard>
  );
}

function TalentDashboard({
  profile,
}: {
  profile: CandidateProfileFoundation | null;
}): React.ReactNode {
  return (
    <>
      <Title
        eyebrow="Profile foundation saved"
        title="Career Passport foundation"
        description="Your Rostr profile is ready. Next, this becomes a verified career timeline when employment verification is implemented."
      />
      <DashboardCard
        description="These fields come from onboarding and can seed your professional identity."
        icon={<UserCheck className="size-5" />}
        title="Profile foundation"
      >
        <div className="grid gap-3">
          <DashboardField label="Role" value="Talent" />
          <DashboardField
            label="Specialization"
            value={
              profile?.specialization ? specializationLabels[profile.specialization] : "Not set yet"
            }
          />
          <DashboardField
            label="Experience"
            value={profile?.experience ? experienceLabels[profile.experience] : "Not set yet"}
          />
          <DashboardField
            label="English"
            value={profile?.englishLevel ? englishLabels[profile.englishLevel] : "Not set yet"}
          />
          <DashboardField label="Timezone" value={fieldValue(profile?.timezone)} />
          <DashboardField
            label="Minimum monthly salary"
            value={
              profile?.minimumSalaryUsd
                ? `$${profile.minimumSalaryUsd.toLocaleString("en-US")}`
                : "Not set yet"
            }
          />
        </div>
      </DashboardCard>
      <CareerPassportFoundation audience="talent" />
    </>
  );
}

function AgencyDashboard({
  profile,
}: {
  profile: AgencyProfileFoundation | null;
}): React.ReactNode {
  return (
    <>
      <Title
        eyebrow="Organization foundation saved"
        title="Organization foundation"
        description="Your agency profile is ready. Sprint 1 keeps the focus on trust foundations, not vacancies."
      />
      <DashboardCard
        description="These fields come from agency onboarding and form the first organization profile."
        icon={<BriefcaseBusiness className="size-5" />}
        title="Agency profile"
      >
        <div className="grid gap-3">
          <DashboardField label="Organization" value={fieldValue(profile?.name)} />
          <DashboardField
            label="Team size"
            value={profile?.teamSize ? teamSizeLabels[profile.teamSize] : "Not set yet"}
          />
          <DashboardField
            label="Monthly hiring volume"
            value={
              profile?.monthlyHiring ? monthlyHiringLabels[profile.monthlyHiring] : "Not set yet"
            }
          />
        </div>
      </DashboardCard>
      <DashboardCard
        description="Employment verification is planned and not active yet. No team trust claims are verified in Sprint 1."
        icon={<ShieldCheck className="size-5" />}
        title="Team trust foundation"
      >
        <p className="rounded-2xl border border-dashed border-[var(--border)] p-4 text-sm leading-6 text-[var(--muted)]">
          Future verification will connect agency-confirmed employment history with talent-owned
          Career Passports. No fake agency data is shown here.
        </p>
      </DashboardCard>
      <CareerPassportFoundation audience="agency" />
    </>
  );
}

function DashboardScreen({
  onboarding,
  busy,
  reset,
}: {
  onboarding: OnboardingSnapshot;
  busy: boolean;
  reset: () => void;
}): React.ReactNode {
  const candidateProfile =
    onboarding.profile?.kind === "candidate" ? onboarding.profile.candidate : null;
  const agencyProfile = onboarding.profile?.kind === "agency" ? onboarding.profile.agency : null;

  return (
    <main
      className="telegram-safe mx-auto flex min-h-[var(--app-height)] max-w-md flex-col px-5"
      data-testid="dashboard"
    >
      <header className="flex items-center justify-between pb-6">
        <span className="text-sm font-semibold tracking-[-0.01em] text-[var(--foreground)]">
          Rostr
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--success)]">
          <Check className="size-3.5" />
          Ready
        </span>
      </header>
      <div className="space-y-4">
        {onboarding.profile?.kind === "agency" ? (
          <AgencyDashboard profile={agencyProfile} />
        ) : (
          <TalentDashboard profile={candidateProfile} />
        )}
        <DashboardCard
          description={`Welcome, ${onboarding.displayName}. Rostr is Telegram-first today and designed to stay portable beyond Telegram.`}
          icon={<BadgeCheck className="size-5" />}
          title="Next step"
        />
      </div>
      <DevReset busy={busy} canReset={onboarding.canReset} onReset={reset} />
    </main>
  );
}

export function OnboardingWizard({ telegram }: WizardProps): React.ReactNode {
  const queryClient = useQueryClient();
  const queryKey = ["onboarding", telegram.initData ?? "local"] as const;
  const initData = telegram.initData;

  const onboardingQuery = useQuery({
    queryKey,
    queryFn: () =>
      requestOnboarding<ApiResponse>("/api/v1/onboarding/bootstrap", "POST", { initData }),
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const actionMutation = useMutation({
    mutationFn: (action: ClientOnboardingAction) =>
      requestOnboarding<ApiResponse>("/api/v1/onboarding", "PATCH", { ...action, initData }),
    onSuccess: (data) => queryClient.setQueryData(queryKey, data),
  });

  const resetMutation = useMutation({
    mutationFn: () =>
      requestOnboarding<ApiResponse>("/api/v1/onboarding/dev-reset", "POST", { initData }),
    onSuccess: (data) => queryClient.setQueryData(queryKey, data),
  });

  if (onboardingQuery.isPending) {
    return <LoadingState />;
  }

  if (onboardingQuery.isError || !onboardingQuery.data) {
    const message =
      onboardingQuery.error instanceof Error
        ? onboardingQuery.error.message
        : "Check the connection and try again.";
    return <ErrorState message={message} retry={() => void onboardingQuery.refetch()} />;
  }

  const onboarding = onboardingQuery.data.onboarding;
  const busy = actionMutation.isPending || resetMutation.isPending;
  const progress = candidateProgress[onboarding.step];
  const apply = (action: ClientOnboardingAction): void => actionMutation.mutate(action);
  const beginWithRole = (role: OnboardingRole): void => {
    actionMutation.mutate(
      { action: "start" },
      {
        onSuccess: () => actionMutation.mutate({ action: "role", role }),
      },
    );
  };
  const reset = (): void => resetMutation.mutate();

  if (onboarding.completed) {
    return <DashboardScreen busy={busy} onboarding={onboarding} reset={reset} />;
  }

  return (
    <main className="telegram-safe mx-auto flex min-h-[var(--app-height)] max-w-md flex-col px-5">
      <Header progress={progress} />
      <AnimatePresence mode="wait">
        <Screen screenKey={onboarding.step}>
          {onboarding.step === "welcome" ? (
            <div className="flex flex-1 flex-col justify-center">
              <motion.div
                animate={{ rotate: 0, scale: 1 }}
                className="mb-7 grid size-14 place-items-center rounded-[22px] bg-[var(--primary-soft)] text-[var(--primary)]"
                initial={{ rotate: -12, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
              >
                <Sparkles className="size-7" />
              </motion.div>
              <Title
                eyebrow="Rostr"
                title="Trust starts with a verified story"
                description="Create your profile foundation in under 40 seconds. Rostr begins with Career Passport, verified timeline and agency trust."
              />
              <div className="mt-9 space-y-3">
                <Choice
                  disabled={busy}
                  highlighted
                  icon={<UserRound className="size-5" />}
                  onClick={() => beginWithRole("candidate")}
                  title="Start as talent"
                  description="Build the foundation for your Career Passport."
                />
                <Choice
                  disabled={busy}
                  icon={<BriefcaseBusiness className="size-5" />}
                  onClick={() => beginWithRole("agency")}
                  title="Create agency profile"
                  description="Set up an organization foundation for future verification."
                />
              </div>
            </div>
          ) : null}

          {onboarding.step === "role" ? (
            <div className="flex flex-1 flex-col">
              <Title
                title="Choose your Rostr path"
                description="Select one entry point. Rostr will only ask for what this profile foundation needs."
              />
              <div className="mt-9 space-y-3">
                <Choice
                  description="Create a talent profile foundation"
                  disabled={busy}
                  icon={<UserRound className="size-5" />}
                  onClick={() => apply({ action: "role", role: "candidate" })}
                  title="Talent"
                />
                <Choice
                  description="Create an agency organization foundation"
                  disabled={busy}
                  icon={<BriefcaseBusiness className="size-5" />}
                  onClick={() => apply({ action: "role", role: "agency" })}
                  title="Agency"
                />
              </div>
            </div>
          ) : null}

          {onboarding.step === "candidateSpecialization" ? (
            <div className="flex flex-1 flex-col">
              <Title
                title="Your specialization"
                description="This starts the professional context for your profile foundation."
              />
              <div className="mt-9 space-y-3">
                <Choice
                  disabled={busy}
                  onClick={() => apply({ action: "specialization", specialization: "chatter" })}
                  title="Chatter"
                />
                <Choice
                  disabled={busy}
                  onClick={() =>
                    apply({ action: "specialization", specialization: "chatter_team_lead" })
                  }
                  title="Chatter Team Lead"
                />
                <Choice
                  disabled={busy}
                  onClick={() => apply({ action: "specialization", specialization: "recruiter" })}
                  title="Recruiter"
                />
              </div>
            </div>
          ) : null}

          {onboarding.step === "candidateExperience" ? (
            <div className="flex flex-1 flex-col">
              <Title title="Your experience" description="Choose the closest option." />
              <div className="mt-9 space-y-3">
                <Choice
                  disabled={busy}
                  onClick={() => apply({ action: "experience", experience: "none" })}
                  title="Starting out"
                />
                <Choice
                  disabled={busy}
                  onClick={() => apply({ action: "experience", experience: "up_to_one_year" })}
                  title="Up to 1 year"
                />
                <Choice
                  disabled={busy}
                  onClick={() => apply({ action: "experience", experience: "one_to_three_years" })}
                  title="1-3 years"
                />
                <Choice
                  disabled={busy}
                  onClick={() => apply({ action: "experience", experience: "three_plus_years" })}
                  title="3+ years"
                />
              </div>
            </div>
          ) : null}

          {onboarding.step === "candidateEnglish" ? (
            <div className="flex flex-1 flex-col">
              <Title title="English level" description="No test here, just your honest estimate." />
              <div className="mt-9 space-y-3">
                <Choice
                  disabled={busy}
                  onClick={() => apply({ action: "english", englishLevel: "basic" })}
                  title="Basic · A1–A2"
                />
                <Choice
                  disabled={busy}
                  onClick={() => apply({ action: "english", englishLevel: "intermediate" })}
                  title="Intermediate · B1"
                />
                <Choice
                  disabled={busy}
                  onClick={() => apply({ action: "english", englishLevel: "upper_intermediate" })}
                  title="Upper-Intermediate · B2"
                />
                <Choice
                  disabled={busy}
                  onClick={() => apply({ action: "english", englishLevel: "advanced" })}
                  title="Advanced · C1+"
                />
              </div>
            </div>
          ) : null}

          {onboarding.step === "candidateTimezone" ? (
            <div className="flex flex-1 flex-col">
              <Title
                title="Your timezone"
                description="This keeps future availability and timeline context clear."
              />
              <div className="mt-7 grid grid-cols-2 gap-3">
                {[
                  ["UTC-8", "Pacific"],
                  ["UTC-5", "Eastern"],
                  ["UTC+0", "London"],
                  ["UTC+1", "Europe"],
                  ["UTC+3", "Istanbul"],
                  ["UTC+5", "Karachi"],
                  ["UTC+7", "Bangkok"],
                  ["UTC+8", "Singapore"],
                ].map(([timezone, region]) => (
                  <Choice
                    disabled={busy}
                    key={timezone}
                    onClick={() =>
                      apply({
                        action: "timezone",
                        timezone: timezone as Extract<
                          ClientOnboardingAction,
                          { action: "timezone" }
                        >["timezone"],
                      })
                    }
                    title={timezone}
                    description={region}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {onboarding.step === "candidateSalary" ? (
            <div className="flex flex-1 flex-col">
              <Title
                title="Minimum income"
                description="Set a comfortable monthly minimum. It can change later."
              />
              <SalaryStep
                busy={busy}
                submit={(minimumSalaryUsd) => apply({ action: "salary", minimumSalaryUsd })}
              />
            </div>
          ) : null}

          {onboarding.step === "agencyName" ? (
            <div className="flex flex-1 flex-col">
              <Title
                title="What is the agency called?"
                description="This becomes the first organization profile field."
              />
              <AgencyNameStep
                busy={busy}
                submit={(name) => apply({ action: "agencyName", name })}
              />
            </div>
          ) : null}

          {onboarding.step === "agencyTeamSize" ? (
            <div className="flex flex-1 flex-col">
              <Title title="Team size" description="Choose the current agency size." />
              <div className="mt-9 space-y-3">
                <Choice
                  disabled={busy}
                  icon={<UsersRound className="size-5" />}
                  onClick={() => apply({ action: "teamSize", teamSize: "one_to_five" })}
                  title="1-5 people"
                />
                <Choice
                  disabled={busy}
                  icon={<UsersRound className="size-5" />}
                  onClick={() => apply({ action: "teamSize", teamSize: "six_to_twenty" })}
                  title="6-20 people"
                />
                <Choice
                  disabled={busy}
                  icon={<UsersRound className="size-5" />}
                  onClick={() => apply({ action: "teamSize", teamSize: "twenty_one_to_fifty" })}
                  title="21-50 people"
                />
                <Choice
                  disabled={busy}
                  icon={<UsersRound className="size-5" />}
                  onClick={() => apply({ action: "teamSize", teamSize: "fifty_plus" })}
                  title="50+ people"
                />
              </div>
            </div>
          ) : null}

          {onboarding.step === "agencyMonthlyHiring" ? (
            <div className="flex flex-1 flex-col">
              <Title
                title="How many people do you hire monthly?"
                description="A rough range helps shape the organization foundation."
              />
              <div className="mt-9 space-y-3">
                <Choice
                  disabled={busy}
                  icon={<Globe2 className="size-5" />}
                  onClick={() => apply({ action: "monthlyHiring", monthlyHiring: "one" })}
                  title="1 person"
                />
                <Choice
                  disabled={busy}
                  icon={<Globe2 className="size-5" />}
                  onClick={() => apply({ action: "monthlyHiring", monthlyHiring: "two_to_five" })}
                  title="2-5 people"
                />
                <Choice
                  disabled={busy}
                  icon={<Globe2 className="size-5" />}
                  onClick={() => apply({ action: "monthlyHiring", monthlyHiring: "six_to_ten" })}
                  title="6-10 people"
                />
                <Choice
                  disabled={busy}
                  icon={<Globe2 className="size-5" />}
                  onClick={() => apply({ action: "monthlyHiring", monthlyHiring: "eleven_plus" })}
                  title="11+ people"
                />
              </div>
            </div>
          ) : null}
        </Screen>
      </AnimatePresence>
      {actionMutation.isError ? (
        <p className="pb-2 text-center text-sm text-[var(--danger)]" role="alert">
          {actionMutation.error instanceof Error
            ? actionMutation.error.message
            : "Could not save. Try again."}
        </p>
      ) : null}
      <p className="pb-1 text-center text-xs text-[var(--muted)]">
        {telegram.environment === "telegram"
          ? "Telegram-first identity layer"
          : "Local development mode"}
      </p>
    </main>
  );
}
