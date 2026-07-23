-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM (
  'ACTIVE',
  'PENDING_MODERATION',
  'SUSPENDED',
  'DEACTIVATED',
  'DELETED'
);

-- CreateTable
CREATE TABLE "users" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "telegram_user_id" BIGINT,
  "telegram_username" TEXT,
  "display_name" TEXT NOT NULL,
  "avatar_url" TEXT,
  "status" "UserStatus" NOT NULL DEFAULT 'PENDING_MODERATION',
  "age_confirmed_at" TIMESTAMPTZ(3),
  "terms_accepted_at" TIMESTAMPTZ(3),
  "privacy_accepted_at" TIMESTAMPTZ(3),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  "deleted_at" TIMESTAMPTZ(3),

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_user_id_key" ON "users"("telegram_user_id");
CREATE INDEX "users_status_idx" ON "users"("status");
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");
