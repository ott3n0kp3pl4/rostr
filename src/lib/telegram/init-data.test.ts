import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";

import { TelegramInitDataError, validateTelegramInitData } from "./init-data";

function signInitData(params: URLSearchParams, botToken: string): string {
  const checkString = [...params.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  params.set("hash", createHmac("sha256", secretKey).update(checkString).digest("hex"));
  return params.toString();
}

describe("validateTelegramInitData", () => {
  it("accepts a signed, recent payload and returns only verified fields", () => {
    const now = new Date("2026-07-22T10:00:00.000Z");
    const raw = signInitData(
      new URLSearchParams({
        auth_date: String(Math.floor(now.getTime() / 1000)),
        query_id: "query-1",
        user: JSON.stringify({ id: 42, first_name: "Ada", username: "ada" }),
      }),
      "test-token",
    );

    expect(validateTelegramInitData(raw, "test-token", 60, now)).toMatchObject({
      queryId: "query-1",
      user: { id: 42, firstName: "Ada", username: "ada" },
    });
  });

  it("rejects a tampered payload", () => {
    const now = new Date("2026-07-22T10:00:00.000Z");
    const raw = signInitData(
      new URLSearchParams({ auth_date: String(Math.floor(now.getTime() / 1000)) }),
      "test-token",
    ).replace("auth_date", "auth_date_tampered");

    expect(() => validateTelegramInitData(raw, "test-token", 60, now)).toThrow(
      TelegramInitDataError,
    );
  });
});
