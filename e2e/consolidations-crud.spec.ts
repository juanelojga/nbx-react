import { test, expect } from "@playwright/test";
import path from "path";

const screenshotsDir = path.join(__dirname, "screenshots");

// Unique test data per run
const testTimestamp = Date.now();
const testEmail = `e2e-crud-consol-${testTimestamp}@example.com`;
const testFirstName = "E2E CRUD";
const testLastName = "ConsolClient";
const testFullName = `${testFirstName} ${testLastName}`;

// Package data (single package — focus is on CRUD, not wizard)
const testPackage = {
  barcode: `CRUD-PKG-${testTimestamp}`,
  courier: "DHL",
  weight: "3.00",
  realPrice: "55.00",
  description: "CRUD test package",
};

// Consolidation creation data
const testDescription = `CRUD Test Consolidation ${testTimestamp}`;
const testDeliveryDate = "2026-06-20";
const testComment = "CRUD test comment for auto-fill verification";
const extraAttr1 = { name: "Customs Fee", amount: "15.75" };
const extraAttr2 = { name: "Packing Fee", amount: "8.50" };

// Updated values for edit tests
const updatedDescription = `${testDescription} UPDATED`;
const updatedDeliveryDate = "2026-07-10";
const updatedComment = "Updated comment after edit";
const updatedExtraAttr1 = { name: "Customs Fee Revised", amount: "20.00" };

test.describe.serial("Consolidations CRUD", () => {
  // ─── Test 1: Setup — create test client ────────────────────────

  test("should create a test client for CRUD tests", async ({ page }) => {
    await page.goto("/en/admin/clients");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Add Client" }).click();
    await expect(
      page.getByRole("heading", { name: "Add New Client" })
    ).toBeVisible();

    await page.locator("#firstName").fill(testFirstName);
    await page.locator("#lastName").fill(testLastName);
    await page.locator("#email").fill(testEmail);
    await page.locator("#identificationNumber").fill("0912345678");
    await page.locator("#mobilePhoneNumber").fill("0991234567");
    await page.locator("#state").fill("Guayas");
    await page.locator("#city").fill("Guayaquil");
    await page.locator("#mainStreet").fill("Av. CRUD Test");

    await page.getByRole("button", { name: "Create Client" }).click();

    await expect(
      page.locator('[data-sonner-toast][data-type="success"]')
    ).toBeVisible({ timeout: 10000 });

    await expect(
      page.getByRole("heading", { name: "Add New Client" })
    ).not.toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "crud-consol-client-created.png"),
      fullPage: true,
    });
  });

  // ─── Test 2: Setup — create consolidation with ALL fields ──────

  test("should create a consolidation with all fields populated", async ({
    page,
  }) => {
    await page.goto("/en/admin/packages");
    await page.waitForLoadState("networkidle");

    // Step 1: Select client
    await page
      .locator('button[role="combobox"][aria-label="Select a client"]')
      .click();
    const searchInput = page.getByPlaceholder(
      "Search clients by name or email..."
    );
    await expect(searchInput).toBeVisible();
    await searchInput.fill(testEmail);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");
    await page.getByText(testFullName).click();

    await page
      .getByRole("button", { name: "Continue to Group Packages" })
      .click();
    await expect(page.getByText("Available Packages")).toBeVisible({
      timeout: 10000,
    });
    await page.waitForLoadState("networkidle");

    // Step 2: Create package
    await page.getByRole("button", { name: "Add Package" }).click();
    await expect(
      page.getByRole("heading", { name: "Create New Package" })
    ).toBeVisible();

    await page.locator("#barcode").fill(testPackage.barcode);
    await page.locator("#description").fill(testPackage.description);
    await page.locator("#courier").fill(testPackage.courier);
    await page.locator("#weight").fill(testPackage.weight);
    await page.locator("#realPrice").fill(testPackage.realPrice);

    await page.getByRole("button", { name: "Create Package" }).click();
    await expect(
      page.locator('[data-sonner-toast][data-type="success"]')
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole("heading", { name: "Create New Package" })
    ).not.toBeVisible();
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(testPackage.barcode)).toBeVisible({
      timeout: 10000,
    });

    // Select the package
    const packageRow = page
      .locator("tr")
      .filter({ hasText: testPackage.barcode });
    await packageRow.locator('[role="checkbox"]').click();

    await page.getByRole("button", { name: "Continue to Review" }).click();
    await expect(page.getByText("Consolidation Details")).toBeVisible({
      timeout: 10000,
    });

    // Step 3: Fill ALL consolidation fields
    await page.locator("#description").fill(testDescription);

    // Change status to Processing
    await page.locator("#status").click();
    await page.getByRole("option", { name: /Processing/ }).click();

    // Fill delivery date
    await page.locator("#deliveryDate").fill(testDeliveryDate);

    // Fill comment
    await page.locator("#comment").fill(testComment);

    // Add extra attribute 1
    await page.getByRole("button", { name: "Add Charge" }).click();
    await page.getByPlaceholder("Charge Name").first().fill(extraAttr1.name);
    await page.getByPlaceholder("Amount").first().fill(extraAttr1.amount);

    // Add extra attribute 2
    await page.getByRole("button", { name: "Add Charge" }).click();
    await page.getByPlaceholder("Charge Name").nth(1).fill(extraAttr2.name);
    await page.getByPlaceholder("Amount").nth(1).fill(extraAttr2.amount);

    // Uncheck send email
    await page.locator("#sendEmail").click();

    await page.screenshot({
      path: path.join(screenshotsDir, "crud-consol-form-filled.png"),
      fullPage: true,
    });

    // Submit
    await page.getByRole("button", { name: "Create Consolidation" }).click();

    await expect(
      page.locator('[data-sonner-toast][data-type="success"]')
    ).toBeVisible({ timeout: 15000 });

    await expect(
      page.getByText("Consolidation Created Successfully!")
    ).toBeVisible({ timeout: 10000 });

    await page.screenshot({
      path: path.join(screenshotsDir, "crud-consol-created-success.png"),
      fullPage: true,
    });
  });

  // ─── Test 3: Read — list page displays correctly ───────────────

  test("should display consolidations list with created consolidation", async ({
    page,
  }) => {
    await page.goto("/en/admin/consolidations");
    await page.waitForLoadState("networkidle");

    // Verify page heading
    await expect(
      page.getByRole("heading", { name: "Consolidations Management" })
    ).toBeVisible();

    // Search for our consolidation
    await page
      .getByPlaceholder("Search by client or description...")
      .fill(testDescription);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");

    // Verify the row shows correct data
    await expect(page.getByText(testDescription)).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText(testFullName)).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "crud-consol-list-search.png"),
      fullPage: true,
    });
  });

  // ─── Test 4: Read — search functionality ───────────────────────

  test("should search consolidations by description and clear search", async ({
    page,
  }) => {
    await page.goto("/en/admin/consolidations");
    await page.waitForLoadState("networkidle");

    const searchField = page.getByPlaceholder(
      "Search by client or description..."
    );

    // Search by partial description
    await searchField.fill("CRUD Test Consolidation");
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(testDescription)).toBeVisible({
      timeout: 10000,
    });

    // Clear search
    await searchField.clear();
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");

    // Page should still show consolidations (the table should have rows)
    await expect(
      page.getByRole("heading", { name: "Consolidations Management" })
    ).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "crud-consol-search-cleared.png"),
      fullPage: true,
    });
  });

  // ─── Test 5: Read — view dialog shows all details ──────────────

  test("should view consolidation details with all fields", async ({
    page,
  }) => {
    await page.goto("/en/admin/consolidations");
    await page.waitForLoadState("networkidle");

    // Search for the consolidation
    await page
      .getByPlaceholder("Search by client or description...")
      .fill(testDescription);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(testDescription)).toBeVisible({
      timeout: 10000,
    });

    // Click view button
    await page
      .getByRole("button", {
        name: new RegExp(`^View ${testDescription}`),
      })
      .click();

    await expect(
      page.getByRole("heading", { name: "View Consolidation Details" })
    ).toBeVisible({ timeout: 10000 });

    const dialog = page.getByRole("dialog");

    // Verify general information
    await expect(dialog.getByText(testDescription)).toBeVisible();
    await expect(
      dialog.getByText(`${testFullName} (${testEmail})`)
    ).toBeVisible();
    await expect(dialog.getByText("Processing")).toBeVisible();
    await expect(dialog.getByText(testComment)).toBeVisible();

    // Verify total cost shows a dollar value
    const totalCostRow = dialog.locator("text=Total Cost").locator("..");
    await expect(totalCostRow).toContainText("$");

    // Verify extra charges
    await expect(dialog.getByText("Extra Charges")).toBeVisible();
    await expect(dialog.getByText(extraAttr1.name)).toBeVisible();
    await expect(dialog.getByText("$15.75")).toBeVisible();
    await expect(dialog.getByText(extraAttr2.name)).toBeVisible();
    await expect(dialog.getByText("$8.50")).toBeVisible();

    // Verify package in table
    await expect(dialog.getByText(testPackage.barcode)).toBeVisible();
    await expect(dialog.getByText("$55.00")).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "crud-consol-view-dialog.png"),
    });

    // Close dialog
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(
      page.getByRole("heading", { name: "View Consolidation Details" })
    ).not.toBeVisible();
  });

  // ─── Test 6: Update — edit dialog auto-fills ALL fields ────────

  test("should auto-fill all fields when opening edit dialog", async ({
    page,
  }) => {
    await page.goto("/en/admin/consolidations");
    await page.waitForLoadState("networkidle");

    // Search for the consolidation
    await page
      .getByPlaceholder("Search by client or description...")
      .fill(testDescription);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(testDescription)).toBeVisible({
      timeout: 10000,
    });

    // Click edit button
    await page
      .getByRole("button", {
        name: new RegExp(`^Edit ${testDescription}`),
      })
      .click();

    await expect(
      page.getByRole("heading", { name: "Edit Consolidation" })
    ).toBeVisible({ timeout: 10000 });

    const dialog = page.getByRole("dialog");

    // ── Verify ALL fields are auto-filled ────────────────────────
    // Playwright's toHaveValue auto-retries, handling the queueMicrotask delay

    // 1. Description
    await expect(dialog.locator("#description")).toHaveValue(testDescription);

    // 2. Status — Radix Select renders the selected label in the trigger
    await expect(dialog.locator('[role="combobox"]')).toContainText(
      "Processing"
    );

    // 3. Delivery Date
    await expect(dialog.locator("#deliveryDate")).toHaveValue(testDeliveryDate);

    // 4. Comment
    await expect(dialog.locator("#comment")).toHaveValue(testComment);

    // 5. Extra Attributes — both entries should be populated
    await expect(dialog.getByPlaceholder("Charge Name").nth(0)).toHaveValue(
      extraAttr1.name
    );
    await expect(dialog.getByPlaceholder("Amount").nth(0)).toHaveValue(
      extraAttr1.amount
    );
    await expect(dialog.getByPlaceholder("Charge Name").nth(1)).toHaveValue(
      extraAttr2.name
    );
    await expect(dialog.getByPlaceholder("Amount").nth(1)).toHaveValue(
      extraAttr2.amount
    );

    await page.screenshot({
      path: path.join(screenshotsDir, "crud-consol-edit-autofill-all.png"),
    });

    // Cancel without submitting
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(
      page.getByRole("heading", { name: "Edit Consolidation" })
    ).not.toBeVisible();
  });

  // ─── Test 7: Update — edit all fields and submit ───────────────

  test("should edit all fields and submit successfully", async ({ page }) => {
    await page.goto("/en/admin/consolidations");
    await page.waitForLoadState("networkidle");

    // Search for the consolidation
    await page
      .getByPlaceholder("Search by client or description...")
      .fill(testDescription);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(testDescription)).toBeVisible({
      timeout: 10000,
    });

    // Click edit button
    await page
      .getByRole("button", {
        name: new RegExp(`^Edit ${testDescription}`),
      })
      .click();

    await expect(
      page.getByRole("heading", { name: "Edit Consolidation" })
    ).toBeVisible({ timeout: 10000 });

    const dialog = page.getByRole("dialog");

    // Wait for auto-fill to complete
    await expect(dialog.locator("#description")).toHaveValue(testDescription);

    // 1. Update description
    await dialog.locator("#description").clear();
    await dialog.locator("#description").fill(updatedDescription);

    // 2. Change status to "In Transit"
    await dialog.locator('[role="combobox"]').click();
    await page.getByRole("option", { name: "In Transit" }).click();

    // 3. Update delivery date
    await dialog.locator("#deliveryDate").fill(updatedDeliveryDate);

    // 4. Update comment
    await dialog.locator("#comment").clear();
    await dialog.locator("#comment").fill(updatedComment);

    // 5. Update first extra attribute
    const chargeName0 = dialog.getByPlaceholder("Charge Name").nth(0);
    await chargeName0.clear();
    await chargeName0.fill(updatedExtraAttr1.name);
    const chargeAmount0 = dialog.getByPlaceholder("Amount").nth(0);
    await chargeAmount0.clear();
    await chargeAmount0.fill(updatedExtraAttr1.amount);

    // 6. Remove second extra attribute
    const removeButtons = dialog.locator(
      'button[class*="hover:text-destructive"]'
    );
    await removeButtons.last().click();

    // Verify only 1 charge row remains
    await expect(dialog.getByPlaceholder("Charge Name")).toHaveCount(1);

    await page.screenshot({
      path: path.join(screenshotsDir, "crud-consol-edit-updated-fields.png"),
    });

    // Submit
    await dialog.getByRole("button", { name: "Update Consolidation" }).click();

    // Wait for success toast
    await expect(
      page.locator('[data-sonner-toast][data-type="success"]')
    ).toBeVisible({ timeout: 10000 });

    // Dialog should close
    await expect(
      page.getByRole("heading", { name: "Edit Consolidation" })
    ).not.toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "crud-consol-after-edit.png"),
      fullPage: true,
    });
  });

  // ─── Test 8: Update — re-open edit to verify persistence ───────

  test("should show updated values when re-opening edit dialog", async ({
    page,
  }) => {
    await page.goto("/en/admin/consolidations");
    await page.waitForLoadState("networkidle");

    // Search for the updated description
    await page
      .getByPlaceholder("Search by client or description...")
      .fill(updatedDescription);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(updatedDescription)).toBeVisible({
      timeout: 10000,
    });

    // Click edit button
    await page
      .getByRole("button", {
        name: new RegExp(`^Edit ${updatedDescription}`),
      })
      .click();

    await expect(
      page.getByRole("heading", { name: "Edit Consolidation" })
    ).toBeVisible({ timeout: 10000 });

    const dialog = page.getByRole("dialog");

    // Verify ALL updated fields persisted
    await expect(dialog.locator("#description")).toHaveValue(
      updatedDescription
    );
    await expect(dialog.locator('[role="combobox"]')).toContainText(
      "In Transit"
    );
    await expect(dialog.locator("#deliveryDate")).toHaveValue(
      updatedDeliveryDate
    );
    await expect(dialog.locator("#comment")).toHaveValue(updatedComment);

    // Only 1 extra attribute should remain
    await expect(dialog.getByPlaceholder("Charge Name")).toHaveCount(1);
    await expect(dialog.getByPlaceholder("Charge Name").first()).toHaveValue(
      updatedExtraAttr1.name
    );
    await expect(dialog.getByPlaceholder("Amount").first()).toHaveValue(
      updatedExtraAttr1.amount
    );

    await page.screenshot({
      path: path.join(screenshotsDir, "crud-consol-edit-persistence.png"),
    });

    // Cancel
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(
      page.getByRole("heading", { name: "Edit Consolidation" })
    ).not.toBeVisible();
  });

  // ─── Test 9: Delete — dialog and deletion ──────────────────────

  test("should delete consolidation successfully", async ({ page }) => {
    await page.goto("/en/admin/consolidations");
    await page.waitForLoadState("networkidle");

    // Search for the consolidation
    await page
      .getByPlaceholder("Search by client or description...")
      .fill(updatedDescription);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(updatedDescription)).toBeVisible({
      timeout: 10000,
    });

    // Click delete button
    await page
      .getByRole("button", {
        name: new RegExp(`^Delete ${updatedDescription}`),
      })
      .click();

    // Verify delete dialog
    await expect(
      page.getByRole("heading", { name: "Delete Consolidation" })
    ).toBeVisible();

    const deleteDialog = page.getByRole("dialog");

    // Verify client name and warning
    await expect(deleteDialog.getByText(testFullName)).toBeVisible();
    await expect(deleteDialog.getByText("Warning:")).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "crud-consol-delete-dialog.png"),
    });

    // Set up response listener
    const responsePromise = page.waitForResponse((res) =>
      res.url().includes("graphql")
    );

    // Confirm deletion
    await deleteDialog
      .getByRole("button", { name: "Delete Consolidation" })
      .click();

    await responsePromise;

    // Dialog should close
    await expect(
      page.getByRole("heading", { name: "Delete Consolidation" })
    ).not.toBeVisible({ timeout: 10000 });

    await page.screenshot({
      path: path.join(screenshotsDir, "crud-consol-after-delete.png"),
      fullPage: true,
    });
  });

  // ─── Test 10: Delete — verify consolidation is gone ────────────

  test("should no longer find deleted consolidation", async ({ page }) => {
    await page.goto("/en/admin/consolidations");
    await page.waitForLoadState("networkidle");

    await page
      .getByPlaceholder("Search by client or description...")
      .fill(updatedDescription);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByText(updatedDescription, { exact: true })
    ).not.toBeVisible({ timeout: 10000 });

    await page.screenshot({
      path: path.join(screenshotsDir, "crud-consol-deleted-verified.png"),
      fullPage: true,
    });
  });

  // ─── Test 11: Cleanup — delete test client ─────────────────────

  test("should cleanup test client", async ({ page }) => {
    await page.goto("/en/admin/clients");
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder("Search by name or email...").fill(testEmail);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(testFullName)).toBeVisible({ timeout: 10000 });

    await page
      .getByRole("button", {
        name: new RegExp(`^Delete ${testFullName}`),
      })
      .click();

    await expect(
      page.getByRole("heading", { name: "Delete Client" })
    ).toBeVisible();

    const deleteDialog = page.getByRole("dialog");

    const responsePromise = page.waitForResponse((res) =>
      res.url().includes("graphql")
    );

    await deleteDialog.getByRole("button", { name: "Delete Client" }).click();
    await responsePromise;

    await expect(
      page.getByRole("heading", { name: "Delete Client" })
    ).not.toBeVisible({ timeout: 10000 });

    await page.waitForTimeout(1000);

    // Verify client is gone
    await page.reload();
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder("Search by name or email...").fill(testEmail);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(testFullName, { exact: true })).not.toBeVisible(
      { timeout: 10000 }
    );
  });
});
