import { expect, test, type APIRequestContext } from "@playwright/test";

async function resetOnboarding(request: APIRequestContext): Promise<void> {
  const reset = await request.post("/api/v1/onboarding/dev-reset", { data: {} });
  await expect(reset).toBeOK();
}

test("talent and agency onboarding reach Rostr dashboards", async ({ page, request }) => {
  const health = await request.get("/api/health");
  await expect(health).toBeOK();
  await expect(health.json()).resolves.toMatchObject({ status: "ok" });

  await resetOnboarding(request);

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Trust starts with a verified story" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Start as talent" }).click();
  await page.getByRole("button", { name: "Chatter" }).click();
  await page.getByRole("button", { name: "1-3 years" }).click();
  await page.getByRole("button", { name: "Upper-Intermediate · B2" }).click();
  await page.getByRole("button", { name: "UTC+3" }).click();

  const salary = page.getByLabel("Minimum monthly salary in US dollars");
  await salary.fill("2200");
  await page.getByRole("button", { name: "Finish" }).click();
  await expect(page.getByTestId("dashboard")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Career Passport foundation" })).toBeVisible();
  await expect(page.getByText("Verified career timeline is empty")).toBeVisible();

  await page.reload();
  await expect(page.getByTestId("dashboard")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Career Passport foundation" })).toBeVisible();

  await resetOnboarding(request);

  await page.goto("/");
  await page.getByRole("button", { name: "Create agency profile" }).click();
  await page.getByLabel("Agency name").fill("North Star");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "6-20 people" }).click();
  await page.getByRole("button", { name: "2-5 people" }).click();
  await expect(page.getByTestId("dashboard")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Organization foundation" })).toBeVisible();
  await expect(
    page.getByText("Employment verification is planned and not active yet."),
  ).toBeVisible();
});
