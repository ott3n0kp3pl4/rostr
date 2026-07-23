-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CANDIDATE', 'AGENCY_OWNER');
CREATE TYPE "OnboardingStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
CREATE TYPE "OnboardingStep" AS ENUM (
  'WELCOME',
  'ROLE',
  'CANDIDATE_SPECIALIZATION',
  'CANDIDATE_EXPERIENCE',
  'CANDIDATE_ENGLISH',
  'CANDIDATE_TIMEZONE',
  'CANDIDATE_SALARY',
  'AGENCY_NAME',
  'AGENCY_TEAM_SIZE',
  'AGENCY_MONTHLY_HIRES',
  'COMPLETE'
);
CREATE TYPE "CandidateSpecialization" AS ENUM ('CHATTER', 'CHATTER_TEAM_LEAD', 'RECRUITER');
CREATE TYPE "CandidateExperience" AS ENUM ('NO_EXPERIENCE', 'UP_TO_ONE_YEAR', 'ONE_TO_THREE_YEARS', 'THREE_PLUS_YEARS');
CREATE TYPE "EnglishLevel" AS ENUM ('BASIC', 'INTERMEDIATE', 'UPPER_INTERMEDIATE', 'ADVANCED');
CREATE TYPE "AgencyTeamSize" AS ENUM ('ONE_TO_FIVE', 'SIX_TO_TWENTY', 'TWENTY_ONE_TO_FIFTY', 'FIFTY_PLUS');
CREATE TYPE "AgencyMonthlyHiring" AS ENUM ('ONE', 'TWO_TO_FIVE', 'SIX_TO_TEN', 'ELEVEN_PLUS');
CREATE TYPE "AgencyMemberRole" AS ENUM ('OWNER', 'RECRUITER');

-- AlterTable
ALTER TABLE "users"
  ADD COLUMN "user_type" "UserType",
  ADD COLUMN "onboarding_status" "OnboardingStatus" NOT NULL DEFAULT 'NOT_STARTED',
  ADD COLUMN "onboarding_step" "OnboardingStep" NOT NULL DEFAULT 'WELCOME',
  ADD COLUMN "onboarding_completed_at" TIMESTAMPTZ(3);

-- CreateTable
CREATE TABLE "candidate_profiles" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "specialization" "CandidateSpecialization",
  "experience" "CandidateExperience",
  "english_level" "EnglishLevel",
  "timezone" TEXT,
  "minimum_salary_usd" INTEGER,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  "deleted_at" TIMESTAMPTZ(3),
  CONSTRAINT "candidate_profiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "agencies" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "team_size" "AgencyTeamSize",
  "monthly_hiring" "AgencyMonthlyHiring",
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  "deleted_at" TIMESTAMPTZ(3),
  CONSTRAINT "agencies_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "agency_members" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "agency_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "role" "AgencyMemberRole" NOT NULL DEFAULT 'OWNER',
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  "deleted_at" TIMESTAMPTZ(3),
  CONSTRAINT "agency_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_onboarding_status_idx" ON "users"("onboarding_status");
CREATE UNIQUE INDEX "candidate_profiles_user_id_key" ON "candidate_profiles"("user_id");
CREATE INDEX "candidate_profiles_specialization_idx" ON "candidate_profiles"("specialization");
CREATE INDEX "candidate_profiles_deleted_at_idx" ON "candidate_profiles"("deleted_at");
CREATE INDEX "agencies_deleted_at_idx" ON "agencies"("deleted_at");
CREATE UNIQUE INDEX "agency_members_agency_id_user_id_key" ON "agency_members"("agency_id", "user_id");
CREATE INDEX "agency_members_user_id_idx" ON "agency_members"("user_id");
CREATE INDEX "agency_members_deleted_at_idx" ON "agency_members"("deleted_at");

-- AddForeignKey
ALTER TABLE "candidate_profiles" ADD CONSTRAINT "candidate_profiles_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "agency_members" ADD CONSTRAINT "agency_members_agency_id_fkey"
  FOREIGN KEY ("agency_id") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "agency_members" ADD CONSTRAINT "agency_members_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
