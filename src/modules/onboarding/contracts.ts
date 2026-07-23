import { z } from "zod";

export const onboardingRoleSchema = z.enum(["candidate", "agency"]);
export const specializationSchema = z.enum(["chatter", "chatter_team_lead", "recruiter"]);
export const experienceSchema = z.enum([
  "none",
  "up_to_one_year",
  "one_to_three_years",
  "three_plus_years",
]);
export const englishLevelSchema = z.enum([
  "basic",
  "intermediate",
  "upper_intermediate",
  "advanced",
]);
export const timezoneSchema = z.enum([
  "UTC-8",
  "UTC-5",
  "UTC+0",
  "UTC+1",
  "UTC+3",
  "UTC+5",
  "UTC+7",
  "UTC+8",
]);
export const agencyTeamSizeSchema = z.enum([
  "one_to_five",
  "six_to_twenty",
  "twenty_one_to_fifty",
  "fifty_plus",
]);
export const agencyMonthlyHiringSchema = z.enum([
  "one",
  "two_to_five",
  "six_to_ten",
  "eleven_plus",
]);

const initDataSchema = z.string().min(1).max(8192).optional();

export const onboardingBootstrapSchema = z.object({
  initData: initDataSchema,
});

export const onboardingActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("start"), initData: initDataSchema }),
  z.object({ action: z.literal("role"), role: onboardingRoleSchema, initData: initDataSchema }),
  z.object({
    action: z.literal("specialization"),
    specialization: specializationSchema,
    initData: initDataSchema,
  }),
  z.object({
    action: z.literal("experience"),
    experience: experienceSchema,
    initData: initDataSchema,
  }),
  z.object({
    action: z.literal("english"),
    englishLevel: englishLevelSchema,
    initData: initDataSchema,
  }),
  z.object({ action: z.literal("timezone"), timezone: timezoneSchema, initData: initDataSchema }),
  z.object({
    action: z.literal("salary"),
    minimumSalaryUsd: z.number().int().min(500).max(100000),
    initData: initDataSchema,
  }),
  z.object({
    action: z.literal("agencyName"),
    name: z.string().trim().min(2).max(80),
    initData: initDataSchema,
  }),
  z.object({
    action: z.literal("teamSize"),
    teamSize: agencyTeamSizeSchema,
    initData: initDataSchema,
  }),
  z.object({
    action: z.literal("monthlyHiring"),
    monthlyHiring: agencyMonthlyHiringSchema,
    initData: initDataSchema,
  }),
]);

export type OnboardingAction = z.infer<typeof onboardingActionSchema>;
export type ClientOnboardingAction = OnboardingAction extends infer Action
  ? Action extends { initData?: string }
    ? Omit<Action, "initData">
    : never
  : never;
export type OnboardingRole = z.infer<typeof onboardingRoleSchema>;

export type ClientOnboardingStep =
  | "welcome"
  | "role"
  | "candidateSpecialization"
  | "candidateExperience"
  | "candidateEnglish"
  | "candidateTimezone"
  | "candidateSalary"
  | "agencyName"
  | "agencyTeamSize"
  | "agencyMonthlyHiring"
  | "complete";

export type OnboardingSnapshot = {
  canReset: boolean;
  completed: boolean;
  displayName: string;
  role: OnboardingRole | null;
  step: ClientOnboardingStep;
};
