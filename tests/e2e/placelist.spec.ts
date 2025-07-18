import { test, expect } from "@playwright/test";

test("모바일에서 장소 목록이 보인다.", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const firstItem = page.locator("ul > li").first();
  await expect(firstItem).toBeVisible({ timeout: 10000 });
});
