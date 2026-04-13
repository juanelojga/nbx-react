import { test as base, expect } from "./fixtures/mockBackend";
const setup = base;
import path from "path";

const authFile = path.join(__dirname, ".auth/storage-state.json");

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/en/login");

  await page.locator("#email").fill("admin@example.com");
  await page.locator("#password").fill("password");
  await page.locator('button[type="submit"]').click();

  // Wait for redirect to admin dashboard
  await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15000 });

  // Save signed-in state
  await page.context().storageState({ path: authFile });
});
