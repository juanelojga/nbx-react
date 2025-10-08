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
