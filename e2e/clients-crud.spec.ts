import { test, expect } from "./fixtures/mockBackend";
import path from "path";

const screenshotsDir = path.join(__dirname, "screenshots");

// Unique email per test run to avoid collisions
const testTimestamp = Date.now();
const testEmail = `e2e-test-${testTimestamp}@example.com`;
const testFirstName = "E2E Test";
const testLastName = "Client";
const testFullName = `${testFirstName} ${testLastName}`;

const updatedFirstName = "E2E Updated";
const updatedFullName = `${updatedFirstName} ${testLastName}`;

test.describe.serial("Clients CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/admin/clients");
    // Wait for table to finish loading (skeleton rows gone)
    await page.waitForLoadState("networkidle");
  });

  test("should display clients list page", async ({ page }) => {
    // Assert page header
    await expect(
      page.getByRole("heading", { name: "Clients Management" })
    ).toBeVisible();

    // Assert Add Client button
    await expect(
      page.getByRole("button", { name: "Add Client" })
    ).toBeVisible();

    // Assert table column headers
    await expect(
      page.getByRole("columnheader", { name: "Full Name" })
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Email" })
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Location" })
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Actions" })
    ).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "clients-list-page.png"),
      fullPage: true,
    });
  });

  test("should create a new client", async ({ page }) => {
    // Open Add Client dialog
    await page.getByRole("button", { name: "Add Client" }).click();

    // Wait for dialog
    await expect(
      page.getByRole("heading", { name: "Add New Client" })
    ).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "add-client-dialog-empty.png"),
    });

    // Fill personal information
    await page.locator("#firstName").fill(testFirstName);
    await page.locator("#lastName").fill(testLastName);
    await page.locator("#email").fill(testEmail);
    await page.locator("#identificationNumber").fill("1234567890");

    // Fill contact information
    await page.locator("#mobilePhoneNumber").fill("0991234567");
    await page.locator("#phoneNumber").fill("042345678");

    // Fill address information
    await page.locator("#state").fill("Guayas");
    await page.locator("#city").fill("Guayaquil");
    await page.locator("#mainStreet").fill("Av. 9 de Octubre");
    await page.locator("#secondaryStreet").fill("Malecon");
    await page.locator("#buildingNumber").fill("100");

    await page.screenshot({
      path: path.join(screenshotsDir, "add-client-dialog-filled.png"),
    });

    // Submit form
    await page.getByRole("button", { name: "Create Client" }).click();

    // Wait for success toast
    await expect(
      page.locator('[data-sonner-toast][data-type="success"]').first()
    ).toBeVisible({
      timeout: 10000,
    });

    // Dialog should close
    await expect(
      page.getByRole("heading", { name: "Add New Client" })
    ).not.toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "clients-list-after-create.png"),
      fullPage: true,
    });
  });

  test("should search for the created client", async ({ page }) => {
    // Type the unique email in the search field
    await page.getByPlaceholder("Search by name or email...").fill(testEmail);

    // Wait for debounce + network response
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");

    // Assert the created client row is visible
    await expect(page.getByText(testFullName)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(testEmail)).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "clients-search-results.png"),
      fullPage: true,
    });
  });

  test("should view client details", async ({ page }) => {
    // Search for the client first
    await page.getByPlaceholder("Search by name or email...").fill(testEmail);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(testFullName)).toBeVisible({ timeout: 10000 });

    // Click view button
    await page
      .getByRole("button", { name: new RegExp(`^View ${testFullName}`) })
      .click();

    // Wait for dialog
    await expect(
      page.getByRole("heading", { name: "View Client Details" })
    ).toBeVisible();

    // Assert client info is displayed inside the dialog
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText(testFullName)).toBeVisible();
    await expect(dialog.getByText(testEmail)).toBeVisible();
    await expect(dialog.getByText("0991234567")).toBeVisible();
    await expect(dialog.getByText("Guayaquil")).toBeVisible();
    await expect(dialog.getByText("Guayas")).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "view-client-dialog.png"),
    });

    // Close dialog (first "Close" is the footer button, second is the X)
    await dialog.getByRole("button", { name: "Close" }).first().click();
    await expect(
      page.getByRole("heading", { name: "View Client Details" })
    ).not.toBeVisible();
  });

  test("should edit client", async ({ page }) => {
    // Search for the client first
    await page.getByPlaceholder("Search by name or email...").fill(testEmail);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(testFullName)).toBeVisible({ timeout: 10000 });

    // Click edit button
    await page
      .getByRole("button", { name: new RegExp(`^Edit ${testFullName}`) })
      .click();

    // Wait for dialog
    await expect(
      page.getByRole("heading", { name: "Edit Client" })
    ).toBeVisible();

    // Assert form is prefilled
    await expect(page.locator("#firstName")).toHaveValue(testFirstName);
    await expect(page.locator("#lastName")).toHaveValue(testLastName);

    // Assert email field is disabled
    await expect(page.locator("#email[disabled]")).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "edit-client-dialog-prefilled.png"),
    });

    // Update fields
    await page.locator("#firstName").clear();
    await page.locator("#firstName").fill(updatedFirstName);
    await page.locator("#city").clear();
    await page.locator("#city").fill("Quito");

    await page.screenshot({
      path: path.join(screenshotsDir, "edit-client-dialog-modified.png"),
    });

    // Submit form
    await page.getByRole("button", { name: "Update Client" }).click();

    // Wait for success toast
    await expect(
      page.locator('[data-sonner-toast][data-type="success"]').first()
    ).toBeVisible({
      timeout: 10000,
    });

    // Dialog should close
    await expect(
      page.getByRole("heading", { name: "Edit Client" })
    ).not.toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "clients-list-after-update.png"),
      fullPage: true,
    });

    // Search for updated name to confirm
    await page.getByPlaceholder("Search by name or email...").fill(testEmail);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(updatedFullName, { exact: true })).toBeVisible({
      timeout: 10000,
    });
  });

  test("should delete client", async ({ page }) => {
    // Search for the client (now with updated name)
    await page.getByPlaceholder("Search by name or email...").fill(testEmail);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(updatedFullName)).toBeVisible({
      timeout: 10000,
    });

    // Click delete button
    await page
      .getByRole("button", { name: new RegExp(`^Delete ${updatedFullName}`) })
      .click();

    // Wait for delete confirmation dialog
    await expect(
      page.getByRole("heading", { name: "Delete Client" })
    ).toBeVisible();

    // Assert client info is shown in the confirmation dialog
    const deleteDialog = page.getByRole("dialog");
    await expect(deleteDialog.getByText(updatedFullName)).toBeVisible();
    await expect(deleteDialog.getByText(testEmail)).toBeVisible();

    // Assert warning message
    await expect(deleteDialog.getByText("Warning:")).toBeVisible();
    await expect(
      deleteDialog.getByText("This action cannot be undone")
    ).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "delete-client-dialog.png"),
    });

    // Set up response listener before clicking
    const responsePromise = page.waitForResponse((res) =>
      res.url().includes("graphql")
    );

    // Confirm deletion (button inside the dialog)
    await deleteDialog.getByRole("button", { name: "Delete Client" }).click();

    // Wait for GraphQL response
    const response = await responsePromise;
    await response.json();

    // Wait for dialog to close
    await expect(
      page.getByRole("heading", { name: "Delete Client" })
    ).not.toBeVisible({ timeout: 10000 });

    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(screenshotsDir, "clients-list-after-delete.png"),
      fullPage: true,
    });

    // Reload page for fresh data
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Search for the deleted client
    await page.getByPlaceholder("Search by name or email...").fill(testEmail);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");

    // Client should no longer appear
    await expect(
      page.getByText(updatedFullName, { exact: true })
    ).not.toBeVisible({ timeout: 10000 });
  });

  test("should show form validation errors on empty submit", async ({
    page,
  }) => {
    // Open Add Client dialog
    await page.getByRole("button", { name: "Add Client" }).click();

    await expect(
      page.getByRole("heading", { name: "Add New Client" })
    ).toBeVisible();

    // Submit empty form
    await page.getByRole("button", { name: "Create Client" }).click();

    // Assert validation errors
    await expect(page.getByText("First name is required")).toBeVisible();
    await expect(page.getByText("Last name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "add-client-validation-errors.png"),
    });

    // Close dialog
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(
      page.getByRole("heading", { name: "Add New Client" })
    ).not.toBeVisible();
  });
});
