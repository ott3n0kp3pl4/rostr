"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Globe2,
  LoaderCircle,
  Sparkles,
  UserRound,
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
  ClientOnboardingAction,
  ClientOnboardingStep,
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
  name: z.string().trim().min(2, "Введите минимум 2 символа").max(80, "Максимум 80 символов"),
});

const salarySchema = z.object({
  minimumSalaryUsd: z
    .string()
    .trim()
    .regex(/^\d+$/, "Введите сумму без копеек")
    .transform(Number)
    .pipe(z.number().int().min(500, "Минимум $500").max(100000, "Проверьте сумму")),
});

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
      throw new Error(payload.error?.message ?? "Не удалось сохранить изменения.");
    }

    return payload;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "Сервер не отвечает. Проверьте подключение к базе данных и повторите попытку.",
      );
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
          CreatorHire
        </span>
        {progress ? (
          <span className="text-xs font-medium tabular-nums text-[var(--muted)]">
            {progress.current} из {progress.total}
          </span>
        ) : (
          <span className="rounded-full bg-[var(--secondary)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
            18+
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
        <p className="mt-4 text-base font-semibold">Готовим ваше пространство</p>
        <p className="mt-1 text-sm text-[var(--muted)]">Проверяем сохранённый прогресс.</p>
      </Card>
    </main>
  );
}

function ErrorState({ message, retry }: { message: string; retry: () => void }): React.ReactNode {
  return (
    <main className="telegram-safe mx-auto flex min-h-[var(--app-height)] max-w-md items-center px-5">
      <Card className="w-full p-6">
        <AlertCircle className="size-6 text-[var(--danger)]" />
        <h1 className="mt-4 text-xl font-semibold tracking-tight">Не удалось открыть onboarding</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{message}</p>
        <Button className="mt-6 w-full" onClick={retry} type="button">
          Попробовать снова
        </Button>
      </Card>
    </main>
  );
}

function BusyLabel(): React.ReactNode {
  return <LoaderCircle aria-label="Сохранение" className="size-5 animate-spin" />;
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
        Название агентства
      </label>
      <Input
        autoComplete="organization"
        autoFocus
        disabled={busy}
        id="agency-name"
        placeholder="Например, North Star"
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
              Продолжить <ArrowRight className="size-5" />
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
          Минимальная зарплата в долларах США за месяц
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
      <p className="mt-2 text-sm text-[var(--muted)]">В долларах США за месяц</p>
      <div className="mt-auto pt-8">
        <Button className="w-full" disabled={busy} size="lg" type="submit">
          {busy ? (
            <BusyLabel />
          ) : (
            <>
              Завершить <ArrowRight className="size-5" />
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
      Сбросить onboarding для разработки
    </button>
  );
}

function CompletedScreen({
  name,
  canReset,
  busy,
  reset,
}: {
  name: string;
  canReset: boolean;
  busy: boolean;
  reset: () => void;
}): React.ReactNode {
  return (
    <Screen screenKey="completed">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          className="grid size-16 place-items-center rounded-[24px] bg-[var(--success-soft)] text-[var(--success)]"
          initial={{ scale: 0.8, opacity: 0 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 260, damping: 18 }}
        >
          <Check className="size-8" strokeWidth={2.5} />
        </motion.div>
        <h1 className="mt-6 text-[32px] font-semibold tracking-[-0.045em]">Профиль готов</h1>
        <p className="mt-3 max-w-xs text-pretty text-[15px] leading-6 text-[var(--muted)]">
          Спасибо, {name}. Мы сохранили настройки и подготовили ваш следующий шаг.
        </p>
        <DevReset busy={busy} canReset={canReset} onReset={reset} />
      </div>
    </Screen>
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
        : "Проверьте подключение и повторите попытку.";
    return <ErrorState message={message} retry={() => void onboardingQuery.refetch()} />;
  }

  const onboarding = onboardingQuery.data.onboarding;
  const busy = actionMutation.isPending || resetMutation.isPending;
  const progress = candidateProgress[onboarding.step];
  const apply = (action: ClientOnboardingAction): void => actionMutation.mutate(action);
  const reset = (): void => resetMutation.mutate();

  if (onboarding.completed) {
    return (
      <CompletedScreen
        busy={busy}
        canReset={onboarding.canReset}
        name={onboarding.displayName}
        reset={reset}
      />
    );
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
                eyebrow="CreatorHire"
                title="Найм начинается с одного ясного шага"
                description="Настроим ваш профиль меньше чем за 40 секунд. Только самое необходимое — без длинных форм."
              />
              <div className="mt-10">
                <Button
                  className="w-full"
                  disabled={busy}
                  onClick={() => apply({ action: "start" })}
                  size="lg"
                  type="button"
                >
                  {busy ? (
                    <BusyLabel />
                  ) : (
                    <>
                      Начать <ArrowRight className="size-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : null}

          {onboarding.step === "role" ? (
            <div className="flex flex-1 flex-col">
              <Title
                title="Что вы хотите делать?"
                description="Выберите один сценарий — дальше покажем только нужные шаги."
              />
              <div className="mt-9 space-y-3">
                <Choice
                  description="Ищу новую роль в команде"
                  disabled={busy}
                  icon={<UserRound className="size-5" />}
                  onClick={() => apply({ action: "role", role: "candidate" })}
                  title="Я кандидат"
                />
                <Choice
                  description="Ищу людей в агентство"
                  disabled={busy}
                  icon={<BriefcaseBusiness className="size-5" />}
                  onClick={() => apply({ action: "role", role: "agency" })}
                  title="Я представляю агентство"
                />
              </div>
            </div>
          ) : null}

          {onboarding.step === "candidateSpecialization" ? (
            <div className="flex flex-1 flex-col">
              <Title
                title="Ваша специализация"
                description="Это поможет настроить релевантный опыт дальше."
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
              <Title title="Ваш опыт" description="Выберите ближайший вариант." />
              <div className="mt-9 space-y-3">
                <Choice
                  disabled={busy}
                  onClick={() => apply({ action: "experience", experience: "none" })}
                  title="Начинаю путь"
                />
                <Choice
                  disabled={busy}
                  onClick={() => apply({ action: "experience", experience: "up_to_one_year" })}
                  title="До 1 года"
                />
                <Choice
                  disabled={busy}
                  onClick={() => apply({ action: "experience", experience: "one_to_three_years" })}
                  title="1–3 года"
                />
                <Choice
                  disabled={busy}
                  onClick={() => apply({ action: "experience", experience: "three_plus_years" })}
                  title="3+ года"
                />
              </div>
            </div>
          ) : null}

          {onboarding.step === "candidateEnglish" ? (
            <div className="flex flex-1 flex-col">
              <Title
                title="Уровень английского"
                description="Без теста — просто ваша честная оценка."
              />
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
                title="Ваш часовой пояс"
                description="Так мы будем корректно показывать доступность."
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
                title="Минимальный доход"
                description="Укажите комфортный минимум. Его можно изменить позже."
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
                title="Как называется агентство?"
                description="Это увидят кандидаты после модерации профиля."
              />
              <AgencyNameStep
                busy={busy}
                submit={(name) => apply({ action: "agencyName", name })}
              />
            </div>
          ) : null}

          {onboarding.step === "agencyTeamSize" ? (
            <div className="flex flex-1 flex-col">
              <Title title="Размер команды" description="Выберите текущий масштаб агентства." />
              <div className="mt-9 space-y-3">
                <Choice
                  disabled={busy}
                  icon={<UsersRound className="size-5" />}
                  onClick={() => apply({ action: "teamSize", teamSize: "one_to_five" })}
                  title="1–5 человек"
                />
                <Choice
                  disabled={busy}
                  icon={<UsersRound className="size-5" />}
                  onClick={() => apply({ action: "teamSize", teamSize: "six_to_twenty" })}
                  title="6–20 человек"
                />
                <Choice
                  disabled={busy}
                  icon={<UsersRound className="size-5" />}
                  onClick={() => apply({ action: "teamSize", teamSize: "twenty_one_to_fifty" })}
                  title="21–50 человек"
                />
                <Choice
                  disabled={busy}
                  icon={<UsersRound className="size-5" />}
                  onClick={() => apply({ action: "teamSize", teamSize: "fifty_plus" })}
                  title="50+ человек"
                />
              </div>
            </div>
          ) : null}

          {onboarding.step === "agencyMonthlyHiring" ? (
            <div className="flex flex-1 flex-col">
              <Title
                title="Сколько человек нанимаете в месяц?"
                description="Ориентировочно — это нужно для настройки вашего потока."
              />
              <div className="mt-9 space-y-3">
                <Choice
                  disabled={busy}
                  icon={<Globe2 className="size-5" />}
                  onClick={() => apply({ action: "monthlyHiring", monthlyHiring: "one" })}
                  title="1 человек"
                />
                <Choice
                  disabled={busy}
                  icon={<Globe2 className="size-5" />}
                  onClick={() => apply({ action: "monthlyHiring", monthlyHiring: "two_to_five" })}
                  title="2–5 человек"
                />
                <Choice
                  disabled={busy}
                  icon={<Globe2 className="size-5" />}
                  onClick={() => apply({ action: "monthlyHiring", monthlyHiring: "six_to_ten" })}
                  title="6–10 человек"
                />
                <Choice
                  disabled={busy}
                  icon={<Globe2 className="size-5" />}
                  onClick={() => apply({ action: "monthlyHiring", monthlyHiring: "eleven_plus" })}
                  title="11+ человек"
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
            : "Не удалось сохранить. Повторите попытку."}
        </p>
      ) : null}
      <p className="pb-1 text-center text-xs text-[var(--muted)]">
        {telegram.environment === "telegram"
          ? "Данные защищены Telegram"
          : "Локальный режим разработки"}
      </p>
    </main>
  );
}
