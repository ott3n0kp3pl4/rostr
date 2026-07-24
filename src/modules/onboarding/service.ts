import {
  type AgencyMonthlyHiring,
  type AgencyTeamSize,
  AgencyMemberRole,
  type CandidateExperience,
  type CandidateSpecialization,
  type EnglishLevel,
  type OnboardingStep,
  type User,
  type UserType,
} from "@prisma/client";

import { ApiError } from "@/lib/http/api-error";
import { prisma } from "@/lib/prisma";
import { validateTelegramInitData } from "@/lib/telegram/init-data";
import type {
  AgencyProfileFoundation,
  CandidateProfileFoundation,
  ClientOnboardingStep,
  OnboardingAction,
  OnboardingProfileFoundation,
  OnboardingRole,
  OnboardingSnapshot,
} from "@/modules/onboarding/contracts";

const localDevelopmentTelegramId = BigInt(0);

const specializationToDatabase: Record<
  Extract<OnboardingAction, { action: "specialization" }>["specialization"],
  CandidateSpecialization
> = {
  chatter: "CHATTER",
  chatter_team_lead: "CHATTER_TEAM_LEAD",
  recruiter: "RECRUITER",
};

const experienceToDatabase: Record<
  Extract<OnboardingAction, { action: "experience" }>["experience"],
  CandidateExperience
> = {
  none: "NO_EXPERIENCE",
  up_to_one_year: "UP_TO_ONE_YEAR",
  one_to_three_years: "ONE_TO_THREE_YEARS",
  three_plus_years: "THREE_PLUS_YEARS",
};

const englishToDatabase: Record<
  Extract<OnboardingAction, { action: "english" }>["englishLevel"],
  EnglishLevel
> = {
  basic: "BASIC",
  intermediate: "INTERMEDIATE",
  upper_intermediate: "UPPER_INTERMEDIATE",
  advanced: "ADVANCED",
};

const teamSizeToDatabase: Record<
  Extract<OnboardingAction, { action: "teamSize" }>["teamSize"],
  AgencyTeamSize
> = {
  one_to_five: "ONE_TO_FIVE",
  six_to_twenty: "SIX_TO_TWENTY",
  twenty_one_to_fifty: "TWENTY_ONE_TO_FIFTY",
  fifty_plus: "FIFTY_PLUS",
};

const monthlyHiringToDatabase: Record<
  Extract<OnboardingAction, { action: "monthlyHiring" }>["monthlyHiring"],
  AgencyMonthlyHiring
> = {
  one: "ONE",
  two_to_five: "TWO_TO_FIVE",
  six_to_ten: "SIX_TO_TEN",
  eleven_plus: "ELEVEN_PLUS",
};

const specializationToClient: Record<
  CandidateSpecialization,
  NonNullable<CandidateProfileFoundation["specialization"]>
> = {
  CHATTER: "chatter",
  CHATTER_TEAM_LEAD: "chatter_team_lead",
  RECRUITER: "recruiter",
};

const experienceToClient: Record<
  CandidateExperience,
  NonNullable<CandidateProfileFoundation["experience"]>
> = {
  NO_EXPERIENCE: "none",
  UP_TO_ONE_YEAR: "up_to_one_year",
  ONE_TO_THREE_YEARS: "one_to_three_years",
  THREE_PLUS_YEARS: "three_plus_years",
};

const englishToClient: Record<
  EnglishLevel,
  NonNullable<CandidateProfileFoundation["englishLevel"]>
> = {
  BASIC: "basic",
  INTERMEDIATE: "intermediate",
  UPPER_INTERMEDIATE: "upper_intermediate",
  ADVANCED: "advanced",
};

const teamSizeToClient: Record<AgencyTeamSize, NonNullable<AgencyProfileFoundation["teamSize"]>> = {
  ONE_TO_FIVE: "one_to_five",
  SIX_TO_TWENTY: "six_to_twenty",
  TWENTY_ONE_TO_FIFTY: "twenty_one_to_fifty",
  FIFTY_PLUS: "fifty_plus",
};

const monthlyHiringToClient: Record<
  AgencyMonthlyHiring,
  NonNullable<AgencyProfileFoundation["monthlyHiring"]>
> = {
  ONE: "one",
  TWO_TO_FIVE: "two_to_five",
  SIX_TO_TEN: "six_to_ten",
  ELEVEN_PLUS: "eleven_plus",
};

const stepToClient: Record<OnboardingStep, ClientOnboardingStep> = {
  WELCOME: "welcome",
  ROLE: "role",
  CANDIDATE_SPECIALIZATION: "candidateSpecialization",
  CANDIDATE_EXPERIENCE: "candidateExperience",
  CANDIDATE_ENGLISH: "candidateEnglish",
  CANDIDATE_TIMEZONE: "candidateTimezone",
  CANDIDATE_SALARY: "candidateSalary",
  AGENCY_NAME: "agencyName",
  AGENCY_TEAM_SIZE: "agencyTeamSize",
  AGENCY_MONTHLY_HIRES: "agencyMonthlyHiring",
  COMPLETE: "complete",
};

function isDevelopmentMode(): boolean {
  return process.env.TELEGRAM_DEV_MODE === "true";
}

function initDataMaxAge(): number {
  const parsed = Number(process.env.TELEGRAM_INIT_DATA_MAX_AGE_SECONDS ?? "86400");
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 86400;
}

async function upsertTelegramUser(input: {
  telegramUserId: bigint;
  displayName: string;
  username?: string;
}): Promise<User> {
  return prisma.user.upsert({
    where: { telegramUserId: input.telegramUserId },
    create: {
      telegramUserId: input.telegramUserId,
      telegramUsername: input.username,
      displayName: input.displayName,
    },
    update: {
      telegramUsername: input.username,
      displayName: input.displayName,
      deletedAt: null,
    },
  });
}

export async function resolveOnboardingActor(initData?: string): Promise<User> {
  if (initData) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new ApiError(
        503,
        "TELEGRAM_AUTH_NOT_CONFIGURED",
        "Telegram authentication is not configured.",
      );
    }

    const verified = validateTelegramInitData(initData, botToken, initDataMaxAge());
    if (!verified.user) {
      throw new ApiError(401, "TELEGRAM_USER_MISSING", "Telegram user data is required.");
    }

    const displayName = [verified.user.firstName, verified.user.lastName].filter(Boolean).join(" ");
    return upsertTelegramUser({
      telegramUserId: BigInt(verified.user.id),
      displayName,
      username: verified.user.username,
    });
  }

  if (!isDevelopmentMode()) {
    throw new ApiError(
      401,
      "TELEGRAM_INIT_DATA_REQUIRED",
      "Telegram authentication data is required.",
    );
  }

  return upsertTelegramUser({
    telegramUserId: localDevelopmentTelegramId,
    displayName: "Local Developer",
  });
}

function toRole(userType: UserType | null): OnboardingRole | null {
  if (userType === "CANDIDATE") {
    return "candidate";
  }
  if (userType === "AGENCY_OWNER") {
    return "agency";
  }
  return null;
}

async function snapshotFor(userId: string): Promise<OnboardingSnapshot> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      agencyMembers: {
        orderBy: { createdAt: "asc" },
        take: 1,
        where: { deletedAt: null, agency: { deletedAt: null } },
        select: {
          agency: {
            select: {
              monthlyHiring: true,
              name: true,
              teamSize: true,
            },
          },
        },
      },
      candidateProfile: {
        select: {
          englishLevel: true,
          experience: true,
          minimumSalaryUsd: true,
          specialization: true,
          timezone: true,
        },
      },
      displayName: true,
      userType: true,
      onboardingStatus: true,
      onboardingStep: true,
    },
  });

  const agency = user.agencyMembers[0]?.agency;
  const profile: OnboardingProfileFoundation =
    user.userType === "CANDIDATE"
      ? {
          kind: "candidate",
          candidate: {
            englishLevel: user.candidateProfile?.englishLevel
              ? englishToClient[user.candidateProfile.englishLevel]
              : null,
            experience: user.candidateProfile?.experience
              ? experienceToClient[user.candidateProfile.experience]
              : null,
            minimumSalaryUsd: user.candidateProfile?.minimumSalaryUsd ?? null,
            specialization: user.candidateProfile?.specialization
              ? specializationToClient[user.candidateProfile.specialization]
              : null,
            timezone: user.candidateProfile?.timezone ?? null,
          },
        }
      : user.userType === "AGENCY_OWNER"
        ? {
            kind: "agency",
            agency: {
              monthlyHiring: agency?.monthlyHiring
                ? monthlyHiringToClient[agency.monthlyHiring]
                : null,
              name: agency?.name ?? null,
              teamSize: agency?.teamSize ? teamSizeToClient[agency.teamSize] : null,
            },
          }
        : null;

  return {
    canReset: isDevelopmentMode(),
    completed: user.onboardingStatus === "COMPLETED",
    displayName: user.displayName,
    profile,
    role: toRole(user.userType),
    step: stepToClient[user.onboardingStep],
  };
}

function assertRole(user: User, expected: UserType): void {
  if (user.userType !== expected) {
    throw new ApiError(
      409,
      "ONBOARDING_ROLE_MISMATCH",
      "The onboarding step does not match the selected role.",
    );
  }
}

function assertNotCompleted(user: User): void {
  if (user.onboardingStatus === "COMPLETED") {
    throw new ApiError(
      409,
      "ONBOARDING_ALREADY_COMPLETED",
      "Onboarding has already been completed.",
    );
  }
}

function assertStep(user: User, expected: OnboardingStep): void {
  if (user.onboardingStep !== expected) {
    throw new ApiError(409, "ONBOARDING_STEP_MISMATCH", "The onboarding step is out of sequence.");
  }
}

async function activeAgencyMemberFor(userId: string) {
  return prisma.agencyMember.findFirst({
    where: {
      userId,
      deletedAt: null,
      agency: { deletedAt: null },
    },
    include: { agency: true },
    orderBy: { createdAt: "asc" },
  });
}

async function completeCandidate(user: User): Promise<void> {
  const profile = await prisma.candidateProfile.findFirst({
    where: { userId: user.id, deletedAt: null },
    select: {
      specialization: true,
      experience: true,
      englishLevel: true,
      timezone: true,
      minimumSalaryUsd: true,
    },
  });

  if (
    !profile?.specialization ||
    !profile.experience ||
    !profile.englishLevel ||
    !profile.timezone ||
    profile.minimumSalaryUsd === null
  ) {
    throw new ApiError(
      409,
      "ONBOARDING_INCOMPLETE",
      "Complete all candidate onboarding steps first.",
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      onboardingStatus: "COMPLETED",
      onboardingStep: "COMPLETE",
      onboardingCompletedAt: new Date(),
    },
  });
}

async function completeAgency(user: User): Promise<void> {
  const member = await activeAgencyMemberFor(user.id);
  if (!member?.agency.teamSize || !member.agency.monthlyHiring) {
    throw new ApiError(409, "ONBOARDING_INCOMPLETE", "Complete all agency onboarding steps first.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      onboardingStatus: "COMPLETED",
      onboardingStep: "COMPLETE",
      onboardingCompletedAt: new Date(),
    },
  });
}

export async function bootstrapOnboarding(initData?: string): Promise<OnboardingSnapshot> {
  const actor = await resolveOnboardingActor(initData);
  return snapshotFor(actor.id);
}

export async function applyOnboardingAction(action: OnboardingAction): Promise<OnboardingSnapshot> {
  const actor = await resolveOnboardingActor(action.initData);
  assertNotCompleted(actor);

  switch (action.action) {
    case "start": {
      assertStep(actor, "WELCOME");
      await prisma.user.update({
        where: { id: actor.id },
        data: { onboardingStatus: "IN_PROGRESS", onboardingStep: "ROLE" },
      });
      break;
    }
    case "role": {
      assertStep(actor, "ROLE");
      await prisma.user.update({
        where: { id: actor.id },
        data:
          action.role === "candidate"
            ? {
                userType: "CANDIDATE",
                onboardingStatus: "IN_PROGRESS",
                onboardingStep: "CANDIDATE_SPECIALIZATION",
              }
            : {
                userType: "AGENCY_OWNER",
                onboardingStatus: "IN_PROGRESS",
                onboardingStep: "AGENCY_NAME",
              },
      });
      break;
    }
    case "specialization": {
      assertRole(actor, "CANDIDATE");
      assertStep(actor, "CANDIDATE_SPECIALIZATION");
      await prisma.$transaction([
        prisma.candidateProfile.upsert({
          where: { userId: actor.id },
          create: {
            userId: actor.id,
            specialization: specializationToDatabase[action.specialization],
          },
          update: {
            specialization: specializationToDatabase[action.specialization],
            deletedAt: null,
          },
        }),
        prisma.user.update({
          where: { id: actor.id },
          data: { onboardingStep: "CANDIDATE_EXPERIENCE" },
        }),
      ]);
      break;
    }
    case "experience": {
      assertRole(actor, "CANDIDATE");
      assertStep(actor, "CANDIDATE_EXPERIENCE");
      await prisma.$transaction([
        prisma.candidateProfile.upsert({
          where: { userId: actor.id },
          create: { userId: actor.id, experience: experienceToDatabase[action.experience] },
          update: { experience: experienceToDatabase[action.experience], deletedAt: null },
        }),
        prisma.user.update({
          where: { id: actor.id },
          data: { onboardingStep: "CANDIDATE_ENGLISH" },
        }),
      ]);
      break;
    }
    case "english": {
      assertRole(actor, "CANDIDATE");
      assertStep(actor, "CANDIDATE_ENGLISH");
      await prisma.$transaction([
        prisma.candidateProfile.upsert({
          where: { userId: actor.id },
          create: { userId: actor.id, englishLevel: englishToDatabase[action.englishLevel] },
          update: { englishLevel: englishToDatabase[action.englishLevel], deletedAt: null },
        }),
        prisma.user.update({
          where: { id: actor.id },
          data: { onboardingStep: "CANDIDATE_TIMEZONE" },
        }),
      ]);
      break;
    }
    case "timezone": {
      assertRole(actor, "CANDIDATE");
      assertStep(actor, "CANDIDATE_TIMEZONE");
      await prisma.$transaction([
        prisma.candidateProfile.upsert({
          where: { userId: actor.id },
          create: { userId: actor.id, timezone: action.timezone },
          update: { timezone: action.timezone, deletedAt: null },
        }),
        prisma.user.update({
          where: { id: actor.id },
          data: { onboardingStep: "CANDIDATE_SALARY" },
        }),
      ]);
      break;
    }
    case "salary": {
      assertRole(actor, "CANDIDATE");
      assertStep(actor, "CANDIDATE_SALARY");
      await prisma.$transaction([
        prisma.candidateProfile.upsert({
          where: { userId: actor.id },
          create: { userId: actor.id, minimumSalaryUsd: action.minimumSalaryUsd },
          update: { minimumSalaryUsd: action.minimumSalaryUsd, deletedAt: null },
        }),
        prisma.user.update({ where: { id: actor.id }, data: { onboardingStep: "COMPLETE" } }),
      ]);
      await completeCandidate(actor);
      break;
    }
    case "agencyName": {
      assertRole(actor, "AGENCY_OWNER");
      assertStep(actor, "AGENCY_NAME");
      const member = await activeAgencyMemberFor(actor.id);
      if (member) {
        await prisma.$transaction([
          prisma.agency.update({ where: { id: member.agencyId }, data: { name: action.name } }),
          prisma.user.update({
            where: { id: actor.id },
            data: { onboardingStep: "AGENCY_TEAM_SIZE" },
          }),
        ]);
      } else {
        await prisma.$transaction(async (transaction) => {
          const agency = await transaction.agency.create({ data: { name: action.name } });
          await transaction.agencyMember.create({
            data: { agencyId: agency.id, userId: actor.id, role: AgencyMemberRole.OWNER },
          });
          await transaction.user.update({
            where: { id: actor.id },
            data: { onboardingStep: "AGENCY_TEAM_SIZE" },
          });
        });
      }
      break;
    }
    case "teamSize": {
      assertRole(actor, "AGENCY_OWNER");
      assertStep(actor, "AGENCY_TEAM_SIZE");
      const member = await activeAgencyMemberFor(actor.id);
      if (!member) {
        throw new ApiError(409, "AGENCY_MISSING", "Set an agency name first.");
      }
      await prisma.$transaction([
        prisma.agency.update({
          where: { id: member.agencyId },
          data: { teamSize: teamSizeToDatabase[action.teamSize] },
        }),
        prisma.user.update({
          where: { id: actor.id },
          data: { onboardingStep: "AGENCY_MONTHLY_HIRES" },
        }),
      ]);
      break;
    }
    case "monthlyHiring": {
      assertRole(actor, "AGENCY_OWNER");
      assertStep(actor, "AGENCY_MONTHLY_HIRES");
      const member = await activeAgencyMemberFor(actor.id);
      if (!member) {
        throw new ApiError(409, "AGENCY_MISSING", "Set an agency name first.");
      }
      await prisma.$transaction([
        prisma.agency.update({
          where: { id: member.agencyId },
          data: { monthlyHiring: monthlyHiringToDatabase[action.monthlyHiring] },
        }),
        prisma.user.update({ where: { id: actor.id }, data: { onboardingStep: "COMPLETE" } }),
      ]);
      await completeAgency(actor);
      break;
    }
  }

  return snapshotFor(actor.id);
}

export async function resetDevelopmentOnboarding(initData?: string): Promise<OnboardingSnapshot> {
  if (!isDevelopmentMode()) {
    throw new ApiError(404, "NOT_FOUND", "Not found.");
  }

  const actor = await resolveOnboardingActor(initData);
  const memberships = await prisma.agencyMember.findMany({
    where: { userId: actor.id },
    select: { agencyId: true },
  });
  const agencyIds = memberships.map((membership) => membership.agencyId);

  await prisma.$transaction([
    prisma.candidateProfile.deleteMany({ where: { userId: actor.id } }),
    prisma.agencyMember.deleteMany({ where: { userId: actor.id } }),
    prisma.agency.deleteMany({ where: { id: { in: agencyIds } } }),
    prisma.user.update({
      where: { id: actor.id },
      data: {
        userType: null,
        onboardingStatus: "NOT_STARTED",
        onboardingStep: "WELCOME",
        onboardingCompletedAt: null,
      },
    }),
  ]);

  return snapshotFor(actor.id);
}
