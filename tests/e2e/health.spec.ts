import { expect, test } from "@playwright/test";

test("candidate can complete onboarding and does not see the wizard again", async ({
  page,
  request,
}) => {
  const health = await request.get("/api/health");
  await expect(health).toBeOK();
  await expect(health.json()).resolves.toMatchObject({ status: "ok" });

  const reset = await request.post("/api/v1/onboarding/dev-reset", { data: {} });
  await expect(reset).toBeOK();

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Найм начинается с одного ясного шага" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Начать" }).click();
  await expect(page.getByRole("heading", { name: "Что вы хотите делать?" })).toBeVisible();

  await page.getByRole("button", { name: "Я кандидат" }).click();
  await page.getByRole("button", { name: "Chatter" }).click();
  await page.getByRole("button", { name: "1–3 года" }).click();
  await page.getByRole("button", { name: "Upper-Intermediate · B2" }).click();
  await page.getByRole("button", { name: "UTC+3" }).click();

  const salary = page.getByLabel("Минимальная зарплата в долларах США за месяц");
  await salary.fill("2200");
  await page.getByRole("button", { name: "Завершить" }).click();
  await expect(page.getByRole("heading", { name: "Профиль готов" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Профиль готов" })).toBeVisible();
});
