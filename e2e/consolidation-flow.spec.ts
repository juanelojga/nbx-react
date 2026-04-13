import { test, expect } from "./fixtures/mockBackend";
import path from "path";

const screenshotsDir = path.join(__dirname, "screenshots");

// Unique test data per run
const testTimestamp = Date.now();
const testEmail = `e2e-consolidation-${testTimestamp}@example.com`;
const testFirstName = "E2E Consol";
const testLastName = "Client";
const testFullName = `${testFirstName} ${testLastName}`;

// Package data - three packages with distinct pricing scenarios
const packageA = {
  barcode: `PKG-A-${testTimestamp}`,
  courier: "DHL",
  weight: "2.50",
  realPrice: "45.00",
  description: "Test package A with pricing",
};

const packageB = {
  barcode: `PKG-B-${testTimestamp}`,
  courier: "FedEx",
  weight: "1.75",
  realPrice: "120.50",
  description: "Test package B higher price",
};

const packageC = {
  barcode: `PKG-C-${testTimestamp}`,
  courier: "UPS",
  weight: "0.80",
  // No realPrice - tests null handling in totals
  description: "Test package C no price",
};

// Consolidation form data
const testDescription = `E2E Consolidation ${testTimestamp}`;
const updatedDescription = `${testDescription} updated`;
const testDeliveryDate = "2026-05-15";
const testComment = "E2E test consolidation comment";

// Extra attributes
const extraAttr1 = { name: "Insurance", amount: "25.50" };
const extraAttr2 = { name: "Handling Fee", amount: "10.00" };

// Mutable state shared across serial tests
let createdConsolidationId: string;

test.describe.serial("Consolidation Flow", () => {
  // ─── Test 1: Create a test client ───────────────────────────────

  test("should create a test client for consolidation flow", async ({
    page,
  }) => {
    await page.goto("/en/admin/clients");
    await page.waitForLoadState("networkidle");

    // Open Add Client dialog
    await page.getByRole("button", { name: "Add Client" }).click();
    await expect(
      page.getByRole("heading", { name: "Add New Client" })
    ).toBeVisible();

    // Fill personal information
    await page.locator("#firstName").fill(testFirstName);
    await page.locator("#lastName").fill(testLastName);
    await page.locator("#email").fill(testEmail);
    await page.locator("#identificationNumber").fill("0912345678");

    // Fill contact information
    await page.locator("#mobilePhoneNumber").fill("0991234567");

    // Fill address information
    await page.locator("#state").fill("Guayas");
    await page.locator("#city").fill("Guayaquil");
    await page.locator("#mainStreet").fill("Av. Test");

    // Submit form
    await page.getByRole("button", { name: "Create Client" }).click();

    // Wait for success toast
    await expect(
      page.locator('[data-sonner-toast][data-type="success"]').first()
    ).toBeVisible({ timeout: 10000 });

    // Dialog should close
    await expect(
      page.getByRole("heading", { name: "Add New Client" })
    ).not.toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "consolidation-client-created.png"),
      fullPage: true,
    });
  });

  // ─── Test 2: Full wizard flow with pricing verification ─────────

  test("should complete full consolidation wizard with pricing verification", async ({
    page,
  }) => {
    await page.goto("/en/admin/packages");
    await page.waitForLoadState("networkidle");

    // ── Step 1: Client Selection ──────────────────────────────────

    // Open the client combobox
    await page
      .locator('button[role="combobox"][aria-label="Select a client"]')
      .click();

    // Wait for popover to appear and search for our test client
    const searchInput = page.getByPlaceholder(
      "Search clients by name or email..."
    );
    await expect(searchInput).toBeVisible();
    await searchInput.fill(testEmail);

    // Wait for debounce + GraphQL response
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");

    // Click the matching client in the dropdown
    await page.getByText(testFullName).click();

    // Verify client details are displayed
    await expect(page.getByText(testFullName).first()).toBeVisible();
    await expect(page.getByText(testEmail).first()).toBeVisible();
    await expect(page.getByText("Guayaquil, Guayas").first()).toBeVisible();

    await page.screenshot({
      path: path.join(
        screenshotsDir,
        "consolidation-step1-client-selected.png"
      ),
      fullPage: true,
    });

    // Continue to step 2
    await page
      .getByRole("button", { name: "Continue to Group Packages" })
      .click();

    // Wait for step 2 UI
    await expect(page.getByText("Available Packages")).toBeVisible({
      timeout: 10000,
    });
    await page.waitForLoadState("networkidle");

    // ── Step 2: Create Package A ──────────────────────────────────

    await page.getByRole("button", { name: "Add Package" }).click();
    await expect(
      page.getByRole("heading", { name: "Create New Package" })
    ).toBeVisible();

    await page.locator("#barcode").fill(packageA.barcode);
    await page.locator("#description").fill(packageA.description);
    await page.locator("#courier").fill(packageA.courier);
    await page.locator("#weight").fill(packageA.weight);
    await page.locator("#realPrice").fill(packageA.realPrice);

    await page.getByRole("button", { name: "Create Package" }).click();
    await expect(
      page.locator('[data-sonner-toast][data-type="success"]').first()
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole("heading", { name: "Create New Package" })
    ).not.toBeVisible();
    await page.waitForLoadState("networkidle");

    // Verify Package A appears in table
    await expect(page.getByText(packageA.barcode, { exact: true })).toBeVisible(
      {
        timeout: 10000,
      }
    );

    // ── Step 2: Create Package B ──────────────────────────────────

    await page.getByRole("button", { name: "Add Package" }).click();
    await expect(
      page.getByRole("heading", { name: "Create New Package" })
    ).toBeVisible();

    await page.locator("#barcode").fill(packageB.barcode);
    await page.locator("#description").fill(packageB.description);
    await page.locator("#courier").fill(packageB.courier);
    await page.locator("#weight").fill(packageB.weight);
    await page.locator("#realPrice").fill(packageB.realPrice);

    await page.getByRole("button", { name: "Create Package" }).click();
    await expect(
      page.locator('[data-sonner-toast][data-type="success"]').first()
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole("heading", { name: "Create New Package" })
    ).not.toBeVisible();
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(packageB.barcode, { exact: true })).toBeVisible(
      {
        timeout: 10000,
      }
    );

    // ── Step 2: Create Package C (no realPrice) ───────────────────

    await page.getByRole("button", { name: "Add Package" }).click();
    await expect(
      page.getByRole("heading", { name: "Create New Package" })
    ).toBeVisible();

    await page.locator("#barcode").fill(packageC.barcode);
    await page.locator("#description").fill(packageC.description);
    await page.locator("#courier").fill(packageC.courier);
    await page.locator("#weight").fill(packageC.weight);
    // Skip realPrice intentionally

    await page.getByRole("button", { name: "Create Package" }).click();
    await expect(
      page.locator('[data-sonner-toast][data-type="success"]').first()
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole("heading", { name: "Create New Package" })
    ).not.toBeVisible();
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(packageC.barcode, { exact: true })).toBeVisible(
      {
        timeout: 10000,
      }
    );

    await page.screenshot({
      path: path.join(
        screenshotsDir,
        "consolidation-step2-packages-created.png"
      ),
      fullPage: true,
    });

    // ── Step 2: Select packages and verify panel stats ────────────

    // Select Package A
    const rowA = page.locator("tr").filter({ hasText: packageA.barcode });
    await rowA.locator('[role="checkbox"]').click();

    // Verify panel after selecting Package A only
    // Total packages: 1, weight: 2.50, realPrice: $45.00
    await expect(page.getByText("$45.00")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("2.50")).toBeVisible();

    // Select Package B
    const rowB = page.locator("tr").filter({ hasText: packageB.barcode });
    await rowB.locator('[role="checkbox"]').click();

    // Verify panel after selecting A + B
    // Total weight: 2.50 + 1.75 = 4.25
    // Total real price: 45.00 + 120.50 = $165.50
    await expect(page.getByText("$165.50")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("4.25")).toBeVisible();

    // Select Package C (no realPrice)
    const rowC = page.locator("tr").filter({ hasText: packageC.barcode });
    await rowC.locator('[role="checkbox"]').click();

    // Verify panel after selecting A + B + C
    // Total packages: 3
    // Total weight: 2.50 + 1.75 + 0.80 = 5.05
    // Total real price: $165.50 (unchanged - Package C has no realPrice)
    await expect(page.getByText("5.05")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("$165.50")).toBeVisible();

    await page.screenshot({
      path: path.join(
        screenshotsDir,
        "consolidation-step2-packages-selected.png"
      ),
      fullPage: true,
    });

    // Continue to step 3
    await page.getByRole("button", { name: "Continue to Review" }).click();

    // ── Step 3: Fill Consolidation Form ───────────────────────────

    await expect(page.getByText("Consolidation Details")).toBeVisible({
      timeout: 10000,
    });

    // Verify client name is shown
    await expect(page.getByText(testFullName).first()).toBeVisible();

    // Verify all 3 package barcodes in the right panel
    await expect(
      page.getByText(packageA.barcode, { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText(packageB.barcode, { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText(packageC.barcode, { exact: true })
    ).toBeVisible();

    // Fill description
    await page.locator("#description").fill(testDescription);

    // Change status to "Processing"
    await page.locator("#status").click();
    await page.getByRole("option", { name: /Processing/ }).click();

    // Fill delivery date
    await page.locator("#deliveryDate").fill(testDeliveryDate);

    // Fill comment
    await page.locator("#comment").fill(testComment);

    // Add extra attribute 1: Insurance = $25.50
    await page.getByRole("button", { name: "Add Charge" }).click();
    const chargeRow1 = page.getByPlaceholder("Charge Name").first();
    await chargeRow1.fill(extraAttr1.name);
    await page.getByPlaceholder("Amount").first().fill(extraAttr1.amount);

    // Add extra attribute 2: Handling Fee = $10.00
    await page.getByRole("button", { name: "Add Charge" }).click();
    const chargeRow2 = page.getByPlaceholder("Charge Name").nth(1);
    await chargeRow2.fill(extraAttr2.name);
    await page.getByPlaceholder("Amount").nth(1).fill(extraAttr2.amount);

    // Uncheck "Send email notification" to avoid sending real emails
    await page.locator("#sendEmail").click();

    await page.screenshot({
      path: path.join(screenshotsDir, "consolidation-step3-form-filled.png"),
      fullPage: true,
    });

    // Submit the consolidation
    await page.getByRole("button", { name: "Create Consolidation" }).click();

    // Wait for success toast
    await expect(
      page.locator('[data-sonner-toast][data-type="success"]').first()
    ).toBeVisible({ timeout: 15000 });

    // ── Step 4: Verify Success Screen ─────────────────────────────

    await expect(
      page.getByText("Consolidation Created Successfully!")
    ).toBeVisible({ timeout: 10000 });

    // Capture the consolidation ID
    const idBadge = page.locator(".consolidation-id").first();
    const idText = await idBadge.textContent();
    createdConsolidationId = idText?.replace("#", "").trim() || "";
    expect(createdConsolidationId).toBeTruthy();

    // Verify client info
    await expect(page.getByText(testFullName).first()).toBeVisible();
    await expect(page.getByText(testEmail).first()).toBeVisible();

    // Verify description
    await expect(page.getByText(testDescription)).toBeVisible();

    // Verify status shows "Processing"
    await expect(page.getByText("Processing", { exact: true })).toBeVisible();

    // Verify statistics: package count = 3
    const statsSection = page.locator(".pt-4.border-t-2");
    await expect(statsSection.getByText("3")).toBeVisible();

    // Verify statistics: total weight = 5.05
    await expect(statsSection.getByText("5.05")).toBeVisible();

    // Verify statistics: real price = $165.50
    await expect(statsSection.getByText("$165.50")).toBeVisible();

    // Verify all package barcodes in the success package list
    await expect(
      page.getByText(packageA.barcode, { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText(packageB.barcode, { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText(packageC.barcode, { exact: true })
    ).toBeVisible();

    // Verify action buttons
    await expect(
      page.getByRole("button", { name: "View Consolidation Details" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Create Another" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Back to Packages" })
    ).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "consolidation-step4-success.png"),
      fullPage: true,
    });
  });

  // ─── Test 3: Package form validation ────────────────────────────

  test("should show validation errors on empty package form submit", async ({
    page,
  }) => {
    await page.goto("/en/admin/packages");
    await page.waitForLoadState("networkidle");

    // Select the test client
    await page
      .locator('button[role="combobox"][aria-label="Select a client"]')
      .click();
    const searchInput = page.getByPlaceholder(
      "Search clients by name or email..."
    );
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

    // Open Add Package dialog
    await page.getByRole("button", { name: "Add Package" }).click();
    await expect(
      page.getByRole("heading", { name: "Create New Package" })
    ).toBeVisible();

    // Submit empty form
    await page.getByRole("button", { name: "Create Package" }).click();

    // Verify validation errors
    await expect(page.getByText("Barcode is required.")).toBeVisible();
    await expect(page.getByText("Courier is required.")).toBeVisible();
    await expect(page.getByText("Weight is required.")).toBeVisible();

    await page.screenshot({
      path: path.join(
        screenshotsDir,
        "consolidation-add-package-validation.png"
      ),
    });

    // Close dialog
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(
      page.getByRole("heading", { name: "Create New Package" })
    ).not.toBeVisible();
  });

  // ─── Test 4: Extra attributes max limit ─────────────────────────

  test("should enforce max 5 extra attributes limit", async ({ page }) => {
    await page.goto("/en/admin/packages");
    await page.waitForLoadState("networkidle");

    // Select the test client and navigate to step 3
    await page
      .locator('button[role="combobox"][aria-label="Select a client"]')
      .click();
    const searchInput = page.getByPlaceholder(
      "Search clients by name or email..."
    );
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

    // Select at least one package to enable continue
    const firstPackageRow = page
      .locator("tr")
      .filter({ hasText: packageA.barcode });
    await firstPackageRow.locator('[role="checkbox"]').click();

    await page.getByRole("button", { name: "Continue to Review" }).click();
    await expect(page.getByText("Consolidation Details")).toBeVisible({
      timeout: 10000,
    });

    // Add 5 extra attributes
    const addChargeButton = page.getByRole("button", { name: "Add Charge" });
    for (let i = 0; i < 5; i++) {
      await addChargeButton.click();
    }

    // After 5, button text should change to "Maximum of 5 charges reached" and be disabled
    await expect(
      page.getByRole("button", { name: "Maximum of 5 charges reached" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Maximum of 5 charges reached" })
    ).toBeDisabled();

    await page.screenshot({
      path: path.join(screenshotsDir, "consolidation-extra-attributes-max.png"),
      fullPage: true,
    });

    // Remove one charge (click the X button on the last row)
    const removeButtons = page.locator(
      '.space-y-2 button[class*="hover:text-destructive"]'
    );
    await removeButtons.last().click();

    // Add Charge button should be enabled again
    await expect(
      page.getByRole("button", { name: "Add Charge" })
    ).toBeEnabled();
  });

  // ─── Test 5: Consolidation form validation ──────────────────────

  test("should show consolidation form validation errors", async ({ page }) => {
    await page.goto("/en/admin/packages");
    await page.waitForLoadState("networkidle");

    // Select the test client and navigate to step 3
    await page
      .locator('button[role="combobox"][aria-label="Select a client"]')
      .click();
    const searchInput = page.getByPlaceholder(
      "Search clients by name or email..."
    );
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

    // Select a package
    const firstPackageRow = page
      .locator("tr")
      .filter({ hasText: packageA.barcode });
    await firstPackageRow.locator('[role="checkbox"]').click();

    await page.getByRole("button", { name: "Continue to Review" }).click();
    await expect(page.getByText("Consolidation Details")).toBeVisible({
      timeout: 10000,
    });

    // Leave description empty and submit
    await page.getByRole("button", { name: "Create Consolidation" }).click();

    // Verify description required error
    await expect(page.getByText("Description is required")).toBeVisible();

    await page.screenshot({
      path: path.join(
        screenshotsDir,
        "consolidation-form-validation-errors.png"
      ),
    });
  });

  // ─── Test 6: Consolidations list page ───────────────────────────

  test("should display consolidations list page", async ({ page }) => {
    await page.goto("/en/admin/consolidations");
    await page.waitForLoadState("networkidle");

    // Assert page header
    await expect(
      page.getByRole("heading", { name: "Consolidations Management" })
    ).toBeVisible();

    // Assert table column headers
    await expect(page.getByRole("columnheader", { name: "ID" })).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Client" })
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Description" })
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Status" })
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Actions" })
    ).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "consolidations-list-page.png"),
      fullPage: true,
    });
  });

  // ─── Test 7: Search for created consolidation ───────────────────

  test("should search for the created consolidation", async ({ page }) => {
    await page.goto("/en/admin/consolidations");
    await page.waitForLoadState("networkidle");

    // Search for the consolidation by description
    await page
      .getByPlaceholder("Search by client or description...")
      .fill(testDescription);

    // Wait for debounce + network response
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");

    // Assert the consolidation row appears
    await expect(page.getByText(testDescription)).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText(testFullName)).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "consolidations-search-results.png"),
      fullPage: true,
    });
  });

  // ─── Test 8: View consolidation details with pricing ────────────

  test("should view consolidation details with pricing breakdown", async ({
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

    // Wait for dialog
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

    // Verify extra attributes
    await expect(dialog.getByText("Extra Charges")).toBeVisible();
    await expect(dialog.getByText(extraAttr1.name)).toBeVisible();
    await expect(dialog.getByText("$25.50")).toBeVisible();
    await expect(dialog.getByText(extraAttr2.name)).toBeVisible();
    await expect(dialog.getByText("$10.00")).toBeVisible();

    // Verify packages table
    await expect(dialog.getByText(packageA.barcode)).toBeVisible();
    await expect(dialog.getByText(packageB.barcode)).toBeVisible();
    await expect(dialog.getByText(packageC.barcode)).toBeVisible();

    // Verify per-package realPrice in the table
    // Package A: $45.00, Package B: $120.50, Package C: -
    const packageRows = dialog.locator("tbody tr");
    const rowCount = await packageRows.count();
    expect(rowCount).toBe(3);

    // Check that $45.00 and $120.50 appear in the Real Price column
    await expect(dialog.getByText("$45.00")).toBeVisible();
    await expect(dialog.getByText("$120.50")).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "consolidation-view-dialog.png"),
    });

    // Close dialog
    await dialog.getByRole("button", { name: "Close" }).first().click();
    await expect(
      page.getByRole("heading", { name: "View Consolidation Details" })
    ).not.toBeVisible();
  });

  // ─── Test 9: Edit consolidation ─────────────────────────────────

  test("should edit consolidation", async ({ page }) => {
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

    // Wait for edit dialog
    await expect(
      page.getByRole("heading", { name: "Edit Consolidation" })
    ).toBeVisible({ timeout: 10000 });

    const dialog = page.getByRole("dialog");

    // Verify form is prefilled
    await expect(dialog.locator("#description")).toHaveValue(testDescription);

    await page.screenshot({
      path: path.join(
        screenshotsDir,
        "consolidation-edit-dialog-prefilled.png"
      ),
    });

    // Update description
    await dialog.locator("#description").clear();
    await dialog.locator("#description").fill(updatedDescription);

    // Change status to "In Transit"
    await dialog.locator('[role="combobox"]').click();
    await page.getByRole("option", { name: "In Transit" }).click();

    // Submit
    await dialog.getByRole("button", { name: "Update Consolidation" }).click();

    // Wait for success toast
    await expect(
      page.locator('[data-sonner-toast][data-type="success"]').first()
    ).toBeVisible({ timeout: 10000 });

    // Dialog should close
    await expect(
      page.getByRole("heading", { name: "Edit Consolidation" })
    ).not.toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "consolidation-after-edit.png"),
      fullPage: true,
    });

    // Search for updated description to confirm
    await page.getByPlaceholder("Search by client or description...").clear();
    await page
      .getByPlaceholder("Search by client or description...")
      .fill(updatedDescription);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(updatedDescription)).toBeVisible({
      timeout: 10000,
    });
  });

  // ─── Test 10: Delete consolidation ──────────────────────────────

  test("should delete consolidation", async ({ page }) => {
    await page.goto("/en/admin/consolidations");
    await page.waitForLoadState("networkidle");

    // Search for the consolidation (now with updated description)
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

    // Wait for delete confirmation dialog
    await expect(
      page.getByRole("heading", { name: "Delete Consolidation" })
    ).toBeVisible();

    const deleteDialog = page.getByRole("dialog");

    // Assert client name is shown
    await expect(deleteDialog.getByText(testFullName)).toBeVisible();

    // Assert warning message
    await expect(deleteDialog.getByText("Warning:")).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "consolidation-delete-dialog.png"),
    });

    // Set up response listener
    const responsePromise = page.waitForResponse((res) =>
      res.url().includes("graphql")
    );

    // Confirm deletion
    await deleteDialog
      .getByRole("button", { name: "Delete Consolidation" })
      .click();

    // Wait for GraphQL response
    await responsePromise;

    // Wait for dialog to close
    await expect(
      page.getByRole("heading", { name: "Delete Consolidation" })
    ).not.toBeVisible({ timeout: 10000 });

    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(screenshotsDir, "consolidation-after-delete.png"),
      fullPage: true,
    });

    // Reload and search again to verify deletion
    await page.reload();
    await page.waitForLoadState("networkidle");

    await page
      .getByPlaceholder("Search by client or description...")
      .fill(updatedDescription);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");

    // Consolidation should no longer appear
    await expect(
      page.getByText(updatedDescription, { exact: true })
    ).not.toBeVisible({ timeout: 10000 });
  });

  // ─── Test 11: Cleanup - delete test client ──────────────────────

  test("should cleanup test client", async ({ page }) => {
    await page.goto("/en/admin/clients");
    await page.waitForLoadState("networkidle");

    // Search for the test client
    await page.getByPlaceholder("Search by name or email...").fill(testEmail);
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(testFullName)).toBeVisible({ timeout: 10000 });

    // Click delete button
    await page
      .getByRole("button", {
        name: new RegExp(`^Delete ${testFullName}`),
      })
      .click();

    // Wait for delete confirmation dialog
    await expect(
      page.getByRole("heading", { name: "Delete Client" })
    ).toBeVisible();

    const deleteDialog = page.getByRole("dialog");

    // Set up response listener
    const responsePromise = page.waitForResponse((res) =>
      res.url().includes("graphql")
    );

    // Confirm deletion
    await deleteDialog.getByRole("button", { name: "Delete Client" }).click();

    // Wait for GraphQL response
    await responsePromise;

    // Wait for dialog to close
    await expect(
      page.getByRole("heading", { name: "Delete Client" })
    ).not.toBeVisible({ timeout: 10000 });

    await page.waitForTimeout(1000);

    // Reload and verify client is gone
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
