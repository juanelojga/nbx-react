# Claude Code Prompt – Build Clients Admin Page

You are assisting in a **Next.js + TypeScript + GraphQL** application that uses **shadcn/ui** for components and \*
\*Playwright\*\* for UI/UX testing.

---

## Context (applies to all admin pages)

- The app is for **package handling** with users, clients, packages, and consolidates.
- There are 2 user types: **admin** and **client**.
- Only **admin** users can manage clients.
- Each client is associated with a user of type client.
- Admin sections follow the **UI/UX refinement process** described in `UI_REFINEMENT_GUIDE.md` (visual audit →
  improvements → test interactions → iterate → document).
- Follow the **global design system** and **shadcn styling patterns** already established.

---

## Task

- Build the **Clients** admin page.
- Add a new route: `/admin/clients`.
- Add the corresponding **navigation link** in the admin sidebar.
- Page should show a **paginated table** of clients.
- The table must support **ordering** by: `full_name`, `email`, `created_at`.
- Available **page size options**: 10, 20, 50, 100.

Use the following **GraphQL query** to fetch data:

```graphql
allClients(
  search: String
  page: Int
  pageSize: Int
  orderBy: String
): ClientConnection

type ClientConnection {
  results: [ClientType]
  totalCount: Int
  page: Int
  pageSize: Int
  hasNext: Boolean
  hasPrevious: Boolean
}

type ClientType {
  id: ID!
  user: MeType
  email: String!
  identificationNumber: String
  state: String
  city: String
  mainStreet: String
  secondaryStreet: String
  buildingNumber: String
  mobilePhoneNumber: String
  phoneNumber: String
  createdAt: DateTime!
  updatedAt: DateTime!
  fullName: String
}

type MeType {
  id: ID!
  isSuperuser: Boolean!
  email: String!
  firstName: String
  lastName: String
}
```

## Goals

1. **Create the Clients Admin Page**
   - Add a new page at `/admin/clients`.
   - Include the navigation entry in the admin sidebar.

2. **Implement a Paginated & Sortable Table**
   - Use **shadcn/ui** table components.
   - Support sorting by: `full_name`, `email`, `created_at`.
   - Provide page size options: **10, 20, 50, 100**.

3. **Connect to GraphQL Data**
   - Fetch data using the `allClients` GraphQL query.
   - Support query parameters: `search`, `page`, `pageSize`, `orderBy`.

4. **Enhance UX**
   - Add **loading states**, **empty state**, and **error state**.
   - Follow responsive and accessible UI patterns.

5. **Follow the UI Refinement Process**
   - Apply the process described in `UI_REFINEMENT_GUIDE.md` when creating or updating components.

6. **Create Playwright E2E Tests**
   - Validate:
     - Table rendering and pagination.
     - Sorting by `full_name`, `email`, and `created_at`.
     - Page size selector behavior.
     - Loading, empty, and error states.

7. **Generate a Reusable Documentation Template**
   - Create `/documents/ADMIN_SECTION_PROMPT_TEMPLATE.md` containing:
     - The **global context** for all admin sections.
     - A **prompt template** with placeholders:
       - `{{SECTION_NAME}}`
       - `{{ROUTE_PATH}}`
       - `{{SORTABLE_COLUMNS}}`
       - `{{PAGE_SIZE_OPTIONS}}`
       - `{{GRAPHQL_QUERY}}`
     - An **example section** using the Clients page as reference.

⸻

Important
• Do not add or modify any unit test cases, only create the code.
• Keep the focus on implementing the requested feature and creating the reusable documentation.

---

### Prompt: Update Page Size Selector to Dropdown (Admin Clients Page)

**Context:**  
This project is a **Next.js + TypeScript + GraphQL** application that uses **shadcn/ui** and **Playwright** for UI
testing. The page `/admin/clients` is an admin-only section displaying a paginated and sortable table of clients.  
All UI components and visual changes must follow the **refinement process described in `UI_REFINEMENT_GUIDE.md`**.

---

**Task:**  
Update the page size selection mechanism in the `AdminClients` page (`src/app/admin/clients/page.tsx`) as follows:

1. **Replace the existing page size buttons** with a **dropdown selector** using shadcn/ui’s `Select` component (or
   equivalent).
   - Keep the same page size options: `10`, `20`, `50`, and `100`.
   - When the user selects a value, it should call the same handler (`handlePageSizeChange`).
   - The label should read: **“Rows per page”**.

2. **Relocate the selector** to the **bottom of the table**, positioned next to the pagination controls, maintaining
   consistent spacing and alignment with the layout guidelines in `UI_REFINEMENT_GUIDE.md`.

3. **Follow refinement process:**
   - Ensure consistent padding, typography, and component spacing.
   - Validate responsiveness and alignment on mobile and desktop.
   - Verify visual consistency with other admin section controls.

---

**Do NOT:**

- Add or modify any unit test cases.

---

**Deliverables:**

- Updated `page.tsx` implementing dropdown-based page size selector.
- Visually refined according to `UI_REFINEMENT_GUIDE.md`.
- Existing pagination and table behavior must remain functional.

---

### Prompt: Refine Bottom Table Layout (Admin Clients Page)

**Context:**  
This project is a **Next.js + TypeScript + GraphQL** admin application using **shadcn/ui** and **Playwright**.  
The file to update is `src/app/admin/clients/page.tsx`.  
Follow the visual refinement process and layout standards defined in **`UI_REFINEMENT_GUIDE.md`**.

---

**Task:**  
Redesign the **bottom section of the Clients table** to improve alignment and visual hierarchy.  
Currently, it includes three elements displayed with poor distribution:

- `Rows per page` selector (dropdown)
- `Showing X to Y of Z entries` label
- Pagination controls (`Previous / Next` buttons and page indicator)

These elements should be visually balanced and aligned according to admin UI layout standards.

---

**Expected Layout:**

Arrange the elements in a **single horizontal container** below the table with proper spacing and responsiveness:

| Left Section               | Center Section               | Right Section           |
| -------------------------- | ---------------------------- | ----------------------- |
| **Rows per page selector** | **Showing X–Y of Z entries** | **Pagination controls** |

- Ensure equal vertical alignment for all elements.
- Maintain consistent spacing between sections (`gap`, `padding`, and margins should follow spacing tokens from the
  design system).
- On **smaller screens**, stack vertically in this order:
  1. Rows per page selector
  2. Showing entries label
  3. Pagination controls

---

**Implementation Notes:**

- Use `flex` or `grid` layout utilities from Tailwind or shadcn/ui to achieve proper alignment.
- Use the same typography scale and muted foreground colors as the rest of the admin layout.
- Validate alignment and responsiveness using the **UI refinement checklist** (typography, spacing, contrast).

---

**Testing:**

- No unit tests should be added or modified.
- Verify visually that:
  - Elements are properly aligned and evenly spaced.
  - Layout adapts correctly between desktop and mobile breakpoints.
  - Pagination and page size selection remain fully functional.

---

**Deliverables:**

- Updated bottom table section with improved distribution.
- Layout and visual hierarchy consistent with admin UI patterns.

---

### Prompt: Redesign Pagination Component (Admin Clients Page)

**Context:**  
This project is a **Next.js + TypeScript + GraphQL** admin application using **shadcn/ui** and **Playwright**.  
The file to update is `src/app/admin/clients/page.tsx`.  
All UI modifications must follow the visual refinement and component standards defined in **`UI_REFINEMENT_GUIDE.md`**.

---

**Task:**  
Redesign the pagination section below the Clients table to improve usability and visual consistency.

The new pagination design should:

- Display **page numbers** (e.g., `1 2 3 4 5 … 10`) for direct navigation.
- Include **Previous** and **Next** controls **using only icons**:
  - Use `<` for Previous and `>` for Next (no text labels).
  - Align icon sizes and padding with other button components.
- Highlight the **current page** (active state) with a filled or emphasized button style.
- Disable the Previous icon when on the first page and the Next icon when on the last page.
- Ensure accessible navigation:
  - Add `aria-label="Previous page"` and `aria-label="Next page"` to the buttons.
  - Maintain keyboard accessibility.

---

**Implementation Details:**

- Use **shadcn/ui** components (`Button`, `Pagination`, or custom button composition).
- Maintain existing pagination logic (`page`, `hasNext`, `hasPrevious`, `totalCount`).
- Support clicking a specific page number to navigate directly.
- Keep consistent alignment with the new bottom table layout:
  - Left: “Rows per page” selector
  - Center: “Showing X–Y of Z entries”
  - Right: pagination controls (icon + page numbers)
- Apply spacing and typography tokens as described in the refinement guide.
- On small screens, collapse into a minimal version with just the `<` and `>` icons centered.

---

**Follow the UI Refinement Process:**

- Validate visual balance and spacing.
- Ensure proper focus, hover, and disabled states.
- Check color contrast and component alignment.
- Test responsiveness and behavior consistency.

---

**Testing Notes:**

- Do **not** add or modify any unit test files.
- Ensure Playwright tests verify:
  - Pagination renders with icon-only controls.
  - Clicking icons and page numbers updates the data.
  - Active page and disabled states render correctly.

---

**Deliverables:**

- Updated pagination section with icon-only navigation.
- Functional numbered pagination with accessible `<` and `>` controls.
- Visual and behavioral consistency with other admin pages and `UI_REFINEMENT_GUIDE.md`.

---

### Prompt: Add Visual Sorting Indicator to Table Headers (Admin Clients Page)

**Context:**  
This project is a **Next.js + TypeScript + GraphQL** admin application using **shadcn/ui** and **Playwright**.  
The file to modify is `src/app/admin/clients/page.tsx`.  
All UI improvements must follow the layout, spacing, and state guidelines defined in **`UI_REFINEMENT_GUIDE.md`**.

---

**Task:**  
Enhance the **sortable table headers** in the Clients table to provide a clear **visual indicator** showing:

1. Which column is currently being used for sorting (`orderBy`).
2. The **sort direction** (ascending or descending).

Currently, the sort icon (`<ArrowUpDown />`) is static and does not indicate the active sort field or direction.  
The logic for sorting already exists (`sortField` and `sortOrder` states, with `orderBy` values such as `"email"` or
`"-email"`).

---

**Expected Behavior:**

- When a column is actively sorted:
  - The column header should appear **highlighted** (e.g., bold text, accent color, or background tint as per design
    system).
  - The icon should **change** to visually indicate direction:
    - **Ascending (A → Z / ↑)** — up arrow.
    - **Descending (Z → A / ↓)** — down arrow.
- When a column is **not** sorted:
  - The default icon (`<ArrowUpDown />`) remains neutral and less prominent.

---

**Implementation Details:**

- Update the table header buttons for sortable fields (`full_name`, `email`, `created_at`):
  - Conditionally render an icon based on `sortField` and `sortOrder`:
    - `ArrowUp` for ascending.
    - `ArrowDown` for descending.
    - `ArrowUpDown` (default) for unsorted.
  - Apply a highlighted style (e.g., `text-primary font-semibold`) when the column matches the active `sortField`.
- Use shadcn/ui styling conventions for color and typography tokens.
- Follow accessibility best practices:
  - Add `aria-sort="ascending"` or `aria-sort="descending"` for the active header.
- Maintain existing functionality for toggling sort order when clicking the header.

---

**Follow the UI Refinement Process:**

- Ensure color contrast meets accessibility standards.
- Validate active/hover/focus states visually.
- Check icon alignment and spacing consistency.
- Confirm typography and layout follow admin design tokens.

---

**Testing Notes:**

- Do **not** add or modify any unit test cases.
- Playwright E2E tests should verify:
  - Clicking column headers changes sorting and visual indicator.
  - The correct column is highlighted.
  - The icon direction matches the applied order (`orderBy` value).

---

**Deliverables:**

- Updated sortable table headers with active highlighting and directional icons.
- Consistent, accessible design aligned with `UI_REFINEMENT_GUIDE.md`.
- Verified with Playwright visual checks or manual validation.

---

### Prompt: Add Search Input for Filtering Clients (Admin Clients Page)

**Context:**  
This project is a **Next.js + TypeScript + GraphQL** admin application using **shadcn/ui** and **Playwright**.  
The file to update is `src/app/admin/clients/page.tsx`.  
All UI elements and interactions must follow the visual and behavioral rules from **`UI_REFINEMENT_GUIDE.md`**.

---

**Task:**  
Add a **search input** above the Clients table to allow admins to filter the list of clients by name or email.  
This input must include **input sanitization**, **trimming**, and a **clear button (icon)** for deleting the term.  
The search should integrate with the existing GraphQL query and only trigger when the value is valid.

---

**Expected Behavior:**

1. **Search Bar Placement**
   - Place the search input **above the table** and below the page header (`PageHeader`).
   - Maintain consistent spacing and alignment using spacing tokens from the design system.

2. **Functional Behavior**
   - On user input, **trim** leading and trailing spaces.
   - Do **not send a GraphQL request** if the trimmed value is empty.
   - Sanitize the input to prevent risky terms (e.g., remove special characters such as `<`, `>`, `{`, `}`, `;`, etc.).
   - Allow search by **full name** or **email**.
   - Use a **debounced update** (e.g., 300–500ms) before triggering the query variable change.

3. **Clear (Delete) Icon**
   - Display a small **clear icon (✕ or Lucide’s `X` icon)** inside the input when there is text.
   - Clicking the icon clears the text and triggers the query again with no search term.
   - The icon must only clear the term when explicitly clicked, not when typing or losing focus.

4. **GraphQL Integration**
   - Extend the existing `GET_ALL_CLIENTS` query variable set to include a `search` argument.
   - When the sanitized and trimmed input is valid, pass it as `search`.
   - When cleared or empty, omit `search` from the query variables.

---

**UI & UX Requirements:**

- Use **shadcn/ui’s** `Input` component for styling.
- Add a search icon (`<Search />`) to the left inside the input field.
- Use subtle border and muted text styles consistent with other admin forms.
- Follow spacing and responsive rules defined in `UI_REFINEMENT_GUIDE.md`.
- Ensure keyboard and screen reader accessibility (use `aria-label="Search clients"`).

---

**Example Layout:**

---

# Claude Code Prompt

## Context

This project is a **Next.js + TypeScript + GraphQL** admin application using **shadcn/ui** and **Playwright**.  
The file to modify is:  
`src/app/admin/clients/page.tsx`

All code must follow the interaction and performance guidelines described in `UI_REFINEMENT_GUIDE.md`.  
Do **not** add or execute any unit test or e2e test cases.

## Task

Add an **“Add Client”** button at the top of the page.  
When this button is clicked, a **dialog** (modal) should open.  
Inside the dialog, display a **form with two columns** containing fields for the GraphQL mutation `createClient`.

### Requirements

- Use **shadcn/ui components** for the dialog, form, inputs, buttons, and layout.
- The form must include **client-side validation** consistent with the GraphQL schema:
  - `firstName`, `lastName`, and `email` are **required**.
  - Other fields are optional.
  - `email` must be a valid email format.
  - `mobilePhoneNumber` and `phoneNumber` should allow only numeric values.
- The form layout must be **two-column responsive** (adjust for smaller screens).
- On submit, call the GraphQL mutation `createClient`.
- When the mutation succeeds:
  - Close the dialog.
  - Update the client list on the page (according to the project’s preferred pattern in `UI_REFINEMENT_GUIDE.md`).
- Handle and display user feedback for validation and mutation errors.
- Keep the interaction performant, following the optimization recommendations in `UI_REFINEMENT_GUIDE.md`.

### GraphQL Mutation

```graphql
mutation CreateClient(
  $buildingNumber: String
  $city: String
  $email: String!
  $firstName: String!
  $identificationNumber: String
  $lastName: String!
  $mainStreet: String
  $mobilePhoneNumber: String
  $phoneNumber: String
  $secondaryStreet: String
  $state: String
) {
  createClient(
    buildingNumber: $buildingNumber
    city: $city
    email: $email
    firstName: $firstName
    identificationNumber: $identificationNumber
    lastName: $lastName
    mainStreet: $mainStreet
    mobilePhoneNumber: $mobilePhoneNumber
    phoneNumber: $phoneNumber
    secondaryStreet: $secondaryStreet
    state: $state
  ) {
    client {
      id
      fullName
      email
      identificationNumber
      state
      city
      mainStreet
      secondaryStreet
      buildingNumber
      mobilePhoneNumber
      phoneNumber
      createdAt
      updatedAt
    }
  }
}
```

Rules
• Do not create, modify, or run any test cases (unit or e2e).
• Follow the component creation, structure, and styling conventions defined in UI_REFINEMENT_GUIDE.md.
• Write clean, typed, and accessible code.
• Use idiomatic Next.js + TypeScript + GraphQL practices.
