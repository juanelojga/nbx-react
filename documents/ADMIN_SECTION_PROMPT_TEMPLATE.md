# Admin Section Prompt Template

This template provides a reusable structure for creating admin pages in the NarBox package handling application.

---

## Global Context for All Admin Sections

### Application Overview

- **Application**: Next.js + TypeScript + GraphQL package handling system
- **UI Framework**: shadcn/ui components
- **Testing**: Playwright for E2E testing
- **GraphQL Client**: Apollo Client
- **Routing**: Next.js App Router

### User Types

- **Admin**: Full system access, can manage clients, users, packages, and view reports
- **Client**: Limited access to their own packages and profile

### Architecture

- **Pages Location**: `/src/app/(dashboard)/admin/[section]/page.tsx`
- **GraphQL Queries**: `/src/graphql/queries/[entity].ts`
- **Navigation Config**: `/src/lib/navigation.ts`
- **Components**: `/src/components/ui/` (shadcn components)
- **E2E Tests**: `/e2e/[section].spec.ts`

### Design System

- Follow the **UI/UX refinement process** described in `UI_REFINEMENT_GUIDE.md`
- Use **shadcn/ui** components consistently
- Implement **loading states**, **empty states**, and **error states**
- Ensure **responsive design** across all breakpoints
- Maintain **accessibility** standards

### Development Guidelines

- **DO NOT** add or modify unit tests (only create E2E tests)
- Use **TypeScript** with proper types
- Follow **existing patterns** from other admin pages
- Implement **pagination** for data tables
- Support **sorting** where applicable
- Add appropriate **GraphQL queries** with TypeScript types

---

## Prompt Template

Use this template to request new admin sections:

````markdown
# Claude Code Prompt – Build {{SECTION_NAME}} Admin Page

You are assisting in a **Next.js + TypeScript + GraphQL** application that uses **shadcn/ui** for components and **Playwright** for UI/UX testing.

---

## Context (applies to all admin pages)

- The app is for **package handling** with users, clients, packages, and consolidates.
- There are 2 user types: **admin** and **client**.
- Only **admin** users can access this section.
- Admin sections follow the **UI/UX refinement process** described in `UI_REFINEMENT_GUIDE.md` (visual audit → improvements → test interactions → iterate → document).
- Follow the **global design system** and **shadcn styling patterns** already established.

---

## Task

- Build the **{{SECTION_NAME}}** admin page.
- Add a new route: `{{ROUTE_PATH}}`.
- Add the corresponding **navigation link** in the admin sidebar.
- Page should show a **paginated table** of {{SECTION_NAME}}.
- The table must support **ordering** by: {{SORTABLE_COLUMNS}}.
- Available **page size options**: {{PAGE_SIZE_OPTIONS}}.

Use the following **GraphQL query** to fetch data:

```graphql
{{GRAPHQL_QUERY}}
```
````

## Goals

1. **Create the {{SECTION_NAME}} Admin Page**
   - Add a new page at `{{ROUTE_PATH}}`.
   - Include the navigation entry in the admin sidebar.

2. **Implement a Paginated & Sortable Table**
   - Use **shadcn/ui** table components.
   - Support sorting by: {{SORTABLE_COLUMNS}}.
   - Provide page size options: {{PAGE_SIZE_OPTIONS}}.

3. **Connect to GraphQL Data**
   - Fetch data using the GraphQL query provided.
   - Support query parameters: `search`, `page`, `pageSize`, `orderBy`.

4. **Enhance UX**
   - Add **loading states**, **empty state**, and **error state**.
   - Follow responsive and accessible UI patterns.

5. **Follow the UI Refinement Process**
   - Apply the process described in `UI_REFINEMENT_GUIDE.md` when creating or updating components.

6. **Create Playwright E2E Tests**
   - Validate:
     - Table rendering and pagination.
     - Sorting by each sortable column.
     - Page size selector behavior.
     - Loading, empty, and error states.

---

⸻

**Important**
• Do not add or modify any unit test cases, only create the code.
• Keep the focus on implementing the requested feature.

````

---

## Template Variables Reference

Replace these placeholders when using the template:

- **{{SECTION_NAME}}**: Name of the section (e.g., "Clients", "Packages", "Reports")
- **{{ROUTE_PATH}}**: Route path (e.g., "/admin/clients", "/admin/packages")
- **{{SORTABLE_COLUMNS}}**: Comma-separated list of sortable columns using snake_case format (e.g., "`full_name`, `email`, `created_at`")
- **{{PAGE_SIZE_OPTIONS}}**: Comma-separated page sizes (e.g., "**10, 20, 50, 100**")
- **{{GRAPHQL_QUERY}}**: Full GraphQL query definition with types

---

## Example: Clients Admin Section

This example demonstrates how the template was applied for the Clients section.

### Filled Template Values

- **SECTION_NAME**: Clients
- **ROUTE_PATH**: /admin/clients
- **SORTABLE_COLUMNS**: `full_name`, `email`, `created_at`
- **PAGE_SIZE_OPTIONS**: 10, 20, 50, 100
- **GRAPHQL_QUERY**:

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
````

### Implementation Overview

1. **Created Files**:
   - `/src/app/(dashboard)/admin/clients/page.tsx` - Main page component
   - `/src/graphql/queries/clients.ts` - GraphQL query and TypeScript types
   - `/e2e/admin-clients.spec.ts` - E2E tests

2. **Modified Files**:
   - `/src/lib/navigation.ts` - Added Clients nav item with UserCog icon

3. **Key Features**:
   - Paginated table with 10, 20, 50, 100 entries options
   - Sortable columns: Full Name, Email, Created At (using snake_case field names: `full_name`, `email`, `created_at`)
   - Loading spinner during data fetch
   - Empty state with icon and message
   - Error state with alert component
   - Responsive design
   - Proper TypeScript types throughout

4. **E2E Test Coverage**:
   - Page rendering and navigation
   - Page size selection
   - Table sorting (all sortable columns)
   - Pagination controls
   - Loading, empty, and error states
   - Responsive layout
   - Button states (enabled/disabled)

### Navigation Icon Selection

For the Clients section, we used the `UserCog` icon from `lucide-react` to represent client management, distinguishing it from the general `Users` icon used for Users Management.

---

## Common Icons for Admin Sections

Use these icons from `lucide-react` for consistency:

- **Dashboard**: `Home`
- **Packages**: `Package`
- **Clients**: `UserCog`
- **Users**: `Users`
- **Reports**: `BarChart3`
- **Settings**: `Settings`
- **Consolidates**: `Boxes` or `PackageCheck`
- **Analytics**: `TrendingUp` or `LineChart`
- **Notifications**: `Bell`
- **Audit Log**: `FileText` or `ScrollText`

---

## GraphQL Query Pattern

All paginated admin queries should follow this pattern:

```graphql
query GetAll{{EntityPlural}}(
  $search: String
  $page: Int
  $pageSize: Int
  $orderBy: String
) {
  all{{EntityPlural}}(
    search: $search
    page: $page
    pageSize: $pageSize
    orderBy: $orderBy
  ) {
    results {
      # Entity fields here
    }
    totalCount
    page
    pageSize
    hasNext
    hasPrevious
  }
}
```

### TypeScript Types Pattern

```typescript
export interface {{EntityType}} {
  id: string;
  // ... entity fields
  createdAt: string;
  updatedAt: string;
}

export interface {{EntityType}}Connection {
  results: {{EntityType}}[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GetAll{{EntityPlural}}Response {
  all{{EntityPlural}}: {{EntityType}}Connection;
}

export interface GetAll{{EntityPlural}}Variables {
  search?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
}
```

---

## Page Component Pattern

All admin pages should follow this structure:

```tsx
"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, ... } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Admin{{SectionName}}() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { data, loading, error } = useQuery(...);

  // Render: Header, Page Size Selector, Error State, Loading State,
  //         Empty State, Table, Pagination
}
```

---

## E2E Test Pattern

All admin E2E tests should cover:

1. **Page Navigation & Rendering**
2. **Page Size Selection**
3. **Table Sorting** (all sortable columns)
4. **Pagination Controls**
5. **Loading State**
6. **Empty State**
7. **Error State**
8. **Responsive Layout**
9. **Button States** (disabled/enabled)

---

## Checklist for New Admin Section

Use this checklist when implementing a new admin section:

- [ ] Create GraphQL query file with TypeScript types
- [ ] Create page component with pagination and sorting
- [ ] Add navigation item to `/src/lib/navigation.ts`
- [ ] Import appropriate icon from `lucide-react`
- [ ] Implement loading state with spinner
- [ ] Implement empty state with icon and message
- [ ] Implement error state with alert
- [ ] Create E2E test file with comprehensive coverage
- [ ] Add Playwright test scripts to `package.json` (if not already present)
- [ ] Test responsive behavior
- [ ] Verify accessibility (keyboard navigation, focus states)
- [ ] Follow UI/UX refinement process
- [ ] Ensure TypeScript types are properly defined
- [ ] Test all sorting columns
- [ ] Test all page size options
- [ ] Test pagination navigation

---

## Usage Instructions

1. **Copy the Prompt Template** section above
2. **Replace all {{PLACEHOLDERS}}** with your specific values
3. **Paste the filled template** into Claude Code
4. **Review the generated code** against the checklist
5. **Run E2E tests** to validate functionality
6. **Follow UI/UX refinement** process for visual polish

---

## Additional Resources

- **UI/UX Refinement Guide**: `/documents/UI_REFINEMENT_GUIDE.md`
- **shadcn/ui Documentation**: https://ui.shadcn.com/
- **Playwright Documentation**: https://playwright.dev/
- **Apollo Client Documentation**: https://www.apollographql.com/docs/react/

---

**Last Updated**: 2025-10-08
**Version**: 1.0
