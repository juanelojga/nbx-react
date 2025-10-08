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
