import { createHmac, timingSafeEqual } from "node:crypto";

export type VerifiedTelegramInitData = {
  authDate: Date;
  queryId?: string;
  user?: {
    id: number;
    firstName: string;
    lastName?: string;
    username?: string;
    languageCode?: string;
  };
};

export class TelegramInitDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TelegramInitDataError";
  }
}

function parseUser(value: string | null): VerifiedTelegramInitData["user"] {
  if (!value) {
    return undefined;
  }

  let user: unknown;
  try {
    user = JSON.parse(value);
  } catch {
    throw new TelegramInitDataError("Telegram initData contains invalid user JSON.");
  }

  if (
    !user ||
    typeof user !== "object" ||
    typeof (user as { id?: unknown }).id !== "number" ||
    typeof (user as { first_name?: unknown }).first_name !== "string"
  ) {
    throw new TelegramInitDataError("Telegram initData contains an invalid user.");
  }

  const source = user as {
    id: number;
    first_name: string;
    last_name?: unknown;
    username?: unknown;
    language_code?: unknown;
  };

  return {
    id: source.id,
    firstName: source.first_name,
    ...(typeof source.last_name === "string" ? { lastName: source.last_name } : {}),
    ...(typeof source.username === "string" ? { username: source.username } : {}),
    ...(typeof source.language_code === "string" ? { languageCode: source.language_code } : {}),
  };
}

/**
 * Verifies the signed query string exactly as prescribed by Telegram Web Apps.
 * The caller must pass raw initData, never a client-decoded object.
 */
export function validateTelegramInitData(
  rawInitData: string,
  botToken: string,
  maxAgeSeconds: number,
  now = new Date(),
): VerifiedTelegramInitData {
  if (!rawInitData || !botToken) {
    throw new TelegramInitDataError("Telegram initData and bot token are required.");
  }

  const params = new URLSearchParams(rawInitData);
  const receivedHash = params.get("hash");
  const authDate = Number(params.get("auth_date"));

  if (!receivedHash || !Number.isSafeInteger(authDate) || authDate <= 0) {
    throw new TelegramInitDataError("Telegram initData is missing hash or auth_date.");
  }

  const dataCheckString = [...params.entries()]
    .filter(([key]) => key !== "hash")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const expectedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const receivedHashBuffer = Buffer.from(receivedHash, "hex");
  const expectedHashBuffer = Buffer.from(expectedHash, "hex");
  if (
    receivedHashBuffer.length !== expectedHashBuffer.length ||
    !timingSafeEqual(receivedHashBuffer, expectedHashBuffer)
  ) {
    throw new TelegramInitDataError("Telegram initData signature is invalid.");
  }

  const ageSeconds = Math.floor((now.getTime() - authDate * 1000) / 1000);
  if (ageSeconds > maxAgeSeconds || ageSeconds < -60) {
    throw new TelegramInitDataError("Telegram initData has expired or is not yet valid.");
  }

  return {
    authDate: new Date(authDate * 1000),
    ...(params.get("query_id") ? { queryId: params.get("query_id") ?? undefined } : {}),
    user: parseUser(params.get("user")),
  };
}
