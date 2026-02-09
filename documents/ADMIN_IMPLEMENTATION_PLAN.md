# Admin Workflow Implementation Plan

## Executive Summary

This document provides a comprehensive analysis of the current state of the NBX React admin workflow implementation and a structured plan to complete all missing features. The analysis is based on the GraphQL API documentation and User Workflows documentation, focusing exclusively on admin (superuser) functionality.

## Current State Analysis

### ✅ Fully Implemented Features

#### 1. Client Management (`/admin/clients`)

- **Status**: Complete
- **Implemented Features**:
  - List all clients with pagination, search, and sorting
  - Create new clients (with auto-generated user accounts)
  - Update existing client information
  - Delete clients (including associated user accounts)
  - View client details in modal
- **GraphQL Integration**:
  - ✅ `GET_ALL_CLIENTS` query
  - ✅ `GET_CLIENT` query
  - ✅ `CREATE_CLIENT` mutation
  - ✅ `UPDATE_CLIENT` mutation
  - ✅ `DELETE_CLIENT` mutation
  - ✅ `DELETE_USER` mutation (for associated user deletion)
- **UI Components**:
  - ✅ `AddClientDialog.tsx`
  - ✅ `EditClientDialog.tsx`
  - ✅ `DeleteClientDialog.tsx`
  - ✅ `ViewClientDialog.tsx`
- **File Locations**:
  - Page: `src/app/(dashboard)/admin/clients/page.tsx`
  - Components: `src/components/admin/`
  - Queries: `src/graphql/queries/clients.ts`
  - Mutations: `src/graphql/mutations/clients.ts`

#### 2. Package Management (Partial)

- **Status**: Partially Complete
- **Implemented Features**:
  - Create packages for selected client
  - Update package details
  - Delete packages
  - View package details in modal
  - Filter packages by client
- **GraphQL Integration**:
  - ✅ `RESOLVE_ALL_PACKAGES` query
  - ✅ `GET_PACKAGE` query
  - ✅ `CREATE_PACKAGE` mutation
  - ✅ `UPDATE_PACKAGE` mutation
  - ✅ `DELETE_PACKAGE` mutation
- **UI Components** (in `/admin/packages/components/`):
  - ✅ `AddPackageDialog.tsx`
  - ✅ `UpdatePackageDialog.tsx`
  - ✅ `DeletePackageDialog.tsx`
  - ✅ `PackageDetailsModal.tsx`
  - ✅ `PackagesTable.tsx`
  - ✅ `ClientSelect.tsx`
- **File Locations**:
  - Page: `src/app/(dashboard)/admin/packages/page.tsx`
  - Components: `src/app/(dashboard)/admin/packages/components/`
  - Queries: `src/graphql/queries/packages.ts`
  - Mutations: `src/graphql/mutations/packages.ts`

#### 3. Authentication System

- **Status**: Complete
- **Implemented Features**:
  - JWT token authentication
  - Auto token refresh with 30-second buffer
  - Token rotation on refresh
  - Role-based access control (ADMIN/CLIENT)
  - Protected routes
- **GraphQL Integration**:
  - ✅ `EMAIL_AUTH` mutation
  - ✅ `REFRESH_WITH_TOKEN` mutation
  - ✅ `REVOKE_TOKEN` mutation
- **File Locations**:
  - Context: `src/contexts/AuthContext.tsx`
  - Queries: `src/graphql/queries/auth.ts`
  - Mutations: `src/graphql/mutations/auth.ts`
  - Token utils: `src/lib/auth/tokens.ts`

### ⚠️ Partially Implemented Features

#### 1. Package Consolidation Workflow (`/admin/packages`)

- **Status**: 60% Complete (Steps 1-2 of 3)
- **Implemented**:
  - ✅ Step 1: Client selection with searchable dropdown
  - ✅ Step 2: Package grouping with table selection
  - ✅ Current consolidate preview panel
  - ✅ Step indicator/progress tracker
- **Missing**:
  - ❌ Step 3: Review & Finalize consolidation
  - ❌ Create consolidation mutation integration
  - ❌ Consolidation form with status, delivery date, comments
  - ❌ Email notification toggle
  - ❌ Success/error handling
  - ❌ Navigation after successful creation
- **Validation Logic**:
  - ✅ Status transition validation (`src/lib/validation/status.ts`)
  - ✅ ConsolidationStatus type definition
  - ✅ Status labels and colors
- **Required GraphQL** (Not Implemented):
  - ❌ `CREATE_CONSOLIDATE` mutation
  - ❌ Mutation types and interfaces

### ❌ Not Implemented Features

#### 1. Consolidation Management (Completely Missing)

- **Status**: 0% Complete
- **Required Page**: `/admin/consolidations` (doesn't exist)
- **Missing Features**:
  - List all consolidations with pagination and sorting
  - Filter by status (awaiting_payment, pending, processing, in_transit, delivered, cancelled)
  - Filter by client
  - Search functionality
  - View consolidation details
  - Update consolidation status (with validation)
  - Update delivery date and comments
  - Delete consolidations
  - Status badge visual indicators
  - Package list per consolidation
- **Required GraphQL** (Not Implemented):
  - ❌ `GET_ALL_CONSOLIDATES` query
  - ❌ `GET_CONSOLIDATE_BY_ID` query
  - ❌ `CREATE_CONSOLIDATE` mutation (partially needed for packages page)
  - ❌ `UPDATE_CONSOLIDATE` mutation
  - ❌ `DELETE_CONSOLIDATE` mutation
  - ❌ Query/mutation types and interfaces
- **Required Components** (Not Created):
  - ❌ Consolidations table component
  - ❌ View consolidation dialog
  - ❌ Edit/Update consolidation dialog
  - ❌ Delete consolidation dialog
  - ❌ Status badge component
  - ❌ Status update flow component
- **Required Validations**:
  - Status transition validation (logic exists but not integrated)
  - Package ownership validation
  - Final status protection (cannot edit delivered/cancelled)

#### 2. Dashboard with Real Data (`/admin/dashboard`)

- **Status**: UI Complete, No Data Integration (0% functional)
- **Current State**: Using mock/hardcoded data
- **Missing Features**:
  - Connect to GraphQL `dashboard` query
  - Display real-time statistics:
    - Total packages (with trend)
    - Recent packages count
    - Packages by status (pending, in_transit, delivered)
    - Total consolidations
    - Consolidations by status
    - Total clients
    - Financial data (totalRealPrice, totalServicePrice)
  - Recent packages list with real data
  - Recent consolidations list with real data
  - Clickable items linking to detail pages
  - Auto-refresh capability
  - Loading and error states
- **Required GraphQL** (Not Implemented):
  - ❌ `GET_DASHBOARD` query
  - ❌ DashboardType interface
  - ❌ DashboardStatsType interface
- **File Location**:
  - Page: `src/app/(dashboard)/admin/dashboard/page.tsx` (exists but needs rewrite)
  - Queries: `src/graphql/queries/dashboard.ts` (doesn't exist)

#### 3. User Management (`/admin/users`)

- **Status**: Placeholder Only (0%)
- **Missing Features**:
  - List all user accounts
  - View user details (linked client, role, active status)
  - Activate/deactivate user accounts
  - Delete user accounts
  - View user's packages and consolidations
  - Filter by role (superuser vs regular)
  - Filter by active status
  - Search by email/name
- **Required GraphQL** (Partially Available):
  - ✅ `DELETE_USER` mutation (exists)
  - ❌ `GET_ALL_USERS` query
  - ❌ `GET_USER` query
  - ❌ `UPDATE_USER` mutation (for activation/deactivation)
  - ❌ User types and interfaces
- **Note**: Backend may need verification for these queries/mutations
- **File Location**:
  - Page: `src/app/(dashboard)/admin/users/page.tsx` (placeholder)

#### 4. Reports (`/admin/reports`)

- **Status**: Placeholder Only (0%)
- **Planned Features** (per workflow doc):
  - Revenue reports (by date range)
  - Package delivery statistics
  - Client activity reports
  - Consolidation performance metrics
  - Export functionality (CSV/PDF)
  - Date range filters
  - Visual charts and graphs
- **Required GraphQL**:
  - ❌ Custom report queries (may not exist in backend)
  - ❌ Aggregation endpoints
- **Technologies Needed**:
  - Chart library (e.g., Recharts, Chart.js)
  - Export library (e.g., react-csv, jsPDF)
- **File Location**:
  - Page: `src/app/(dashboard)/admin/reports/page.tsx` (placeholder)

#### 5. Settings (`/admin/settings`)

- **Status**: Placeholder Only (0%)
- **Planned Features** (per workflow doc):
  - General system settings
  - Email/notification configuration
  - Payment gateway settings
  - Shipping rates and zones
  - Security settings
- **Required GraphQL**:
  - ❌ Settings queries and mutations (likely don't exist)
- **File Location**:
  - Page: `src/app/(dashboard)/admin/settings/page.tsx` (placeholder)

---

## Implementation Plan

### Phase 1: Core Consolidation Features (High Priority)

#### Task 1.1: Create Consolidation GraphQL Operations

- **Files to Create**:
  - `src/graphql/queries/consolidations.ts`
  - `src/graphql/mutations/consolidations.ts`
- **Operations**:
  - `GET_ALL_CONSOLIDATES` query
  - `GET_CONSOLIDATE_BY_ID` query
  - `CREATE_CONSOLIDATE` mutation
  - `UPDATE_CONSOLIDATE` mutation
  - `DELETE_CONSOLIDATE` mutation
- **TypeScript Interfaces**:
  - `ConsolidationType`
  - `ConsolidationConnection`
  - Query/mutation variables and response types
- **Acceptance Criteria**:
  - All GraphQL documents properly typed
  - Matches backend schema from GRAPHQL_API.md
  - Exports all necessary types

#### Task 1.2: Complete Package Consolidation Workflow (Step 3)

- **Files to Modify**:
  - `src/app/(dashboard)/admin/packages/page.tsx`
  - `src/app/(dashboard)/admin/packages/components/` (new component)
- **Components to Create**:
  - `ConsolidationForm.tsx` - Form for consolidation details
- **Implementation**:
  - Build Step 3 review interface
  - Add form fields: description, status, delivery date, comment, sendEmail
  - Integrate `CREATE_CONSOLIDATE` mutation
  - Add validation (status must be awaiting_payment, pending, or processing)
  - Handle success (show toast, redirect or reset)
  - Handle errors (display user-friendly messages)
  - Add loading states
- **Acceptance Criteria**:
  - Can create consolidation with selected packages
  - Form validation works correctly
  - Success creates consolidation and shows confirmation
  - Can optionally send email notification
  - Redirects to consolidations list after success

#### Task 1.3: Create Consolidations Management Page

- **Files to Create**:
  - `src/app/(dashboard)/admin/consolidations/page.tsx`
  - `src/app/(dashboard)/admin/consolidations/components/ConsolidationsTable.tsx`
  - `src/components/admin/ViewConsolidationDialog.tsx`
  - `src/components/admin/EditConsolidationDialog.tsx`
  - `src/components/admin/DeleteConsolidationDialog.tsx`
  - `src/components/ui/status-badge.tsx`
- **Features**:
  - List all consolidations with pagination
  - Sort by created date, status, client name
  - Filter by status dropdown
  - Search by client name or description
  - Status badges with appropriate colors
  - View action: Show full details, packages, client info
  - Edit action: Update status, delivery date, comments
  - Delete action: Remove consolidation (with confirmation)
- **Validation**:
  - Integrate status transition validation from `src/lib/validation/status.ts`
  - Show only valid next statuses in edit form
  - Disable editing for delivered/cancelled consolidations
  - Show clear error messages for invalid transitions
- **UI/UX**:
  - Responsive table layout
  - Loading skeletons
  - Empty states
  - Error handling
  - Toast notifications for actions
- **Acceptance Criteria**:
  - Can view all consolidations
  - Can filter and search
  - Can update status with proper validation
  - Can delete consolidation
  - UI matches design system (similar to clients page)

#### Task 1.4: Add Consolidations to Navigation

- **Files to Modify**:
  - `src/lib/navigation.ts`
- **Changes**:
  - Add "Consolidations" nav item with Package2 icon
  - Insert after "All Packages" in admin nav
  - Update `adminNavItems` array
- **Acceptance Criteria**:
  - Link appears in admin sidebar
  - Proper icon and label
  - Active state highlights correctly

---

### Phase 2: Dashboard Integration (High Priority)

#### Task 2.1: Create Dashboard GraphQL Operations

- **Files to Create**:
  - `src/graphql/queries/dashboard.ts`
- **Operations**:
  - `GET_DASHBOARD` query with full field selection
- **TypeScript Interfaces**:
  - `DashboardStatsType`
  - `DashboardType`
  - `GetDashboardResponse`
  - `RecentPackageType`
  - `RecentConsolidationType`
- **Acceptance Criteria**:
  - Query matches backend schema
  - All stats fields included
  - Recent items with configurable limits

#### Task 2.2: Rebuild Dashboard with Real Data

- **Files to Modify**:
  - `src/app/(dashboard)/admin/dashboard/page.tsx`
- **Implementation**:
  - Remove all mock data
  - Integrate `GET_DASHBOARD` query
  - Connect StatCard components to real data
  - Display trends from backend (if available)
  - Wire up recent packages list
  - Wire up recent consolidations list
  - Make items clickable (link to detail pages)
  - Add refresh button
  - Handle loading state with skeletons
  - Handle error state with retry option
- **Acceptance Criteria**:
  - All statistics display real data
  - Recent items are accurate and up-to-date
  - Loading states work properly
  - Error handling is user-friendly
  - Can manually refresh data

---

### Phase 3: User Management (Medium Priority)

#### Task 3.1: Verify Backend User Queries

- **Investigation**:
  - Check if backend has `allUsers` query
  - Check if backend has `updateUser` mutation for activation
  - Document what's available vs what needs to be requested
- **Files to Reference**:
  - `documents/GRAPHQL_API.md` (check for user management section)

#### Task 3.2: Create User Management GraphQL Operations

- **Files to Create**:
  - `src/graphql/queries/users.ts`
  - `src/graphql/mutations/users.ts` (if not fully in clients.ts)
- **Operations** (if backend supports):
  - `GET_ALL_USERS` query
  - `GET_USER` query
  - `UPDATE_USER` mutation
- **TypeScript Interfaces**:
  - `UserType`
  - `UserConnection`
  - Query/mutation variables and responses
- **Note**: May need backend changes

#### Task 3.3: Build Users Management Page

- **Files to Create**:
  - `src/app/(dashboard)/admin/users/page.tsx` (replace placeholder)
  - `src/components/admin/ViewUserDialog.tsx`
  - `src/components/admin/EditUserDialog.tsx`
  - `src/components/admin/DeleteUserDialog.tsx`
- **Features**:
  - List all users with pagination
  - Show email, name, role (superuser badge), active status
  - Link to associated client (if exists)
  - Search by email/name
  - Filter by role and active status
  - View user details (packages count, consolidations)
  - Activate/deactivate toggle
  - Delete user action
- **Acceptance Criteria**:
  - Can view all users
  - Can search and filter
  - Can deactivate/activate users
  - Can delete users
  - Shows proper role badges

---

### Phase 4: Reports & Analytics (Lower Priority)

#### Task 4.1: Define Reporting Requirements

- **Investigation**:
  - Check backend for aggregation/reporting endpoints
  - Define specific reports needed:
    - Revenue report (by date range)
    - Package statistics (status breakdown, delivery times)
    - Client activity (most active clients, package counts)
    - Consolidation metrics (average packages per consolidation, status distribution)
- **Decision Points**:
  - Use existing dashboard query data vs dedicated report queries
  - Chart library selection (Recharts recommended)
  - Export format (CSV, PDF, or both)

#### Task 4.2: Build Reports Page (If Backend Available)

- **Files to Create**:
  - `src/app/(dashboard)/admin/reports/page.tsx` (replace placeholder)
  - `src/components/reports/RevenueChart.tsx`
  - `src/components/reports/PackageStatsChart.tsx`
  - `src/components/reports/DateRangePicker.tsx`
  - `src/components/reports/ExportButton.tsx`
- **Features**:
  - Date range selector
  - Multiple report types (tabs or dropdown)
  - Visual charts (line, bar, pie)
  - Data tables
  - Export to CSV functionality
  - Print view
- **Dependencies**:
  - Install chart library: `recharts` or `chart.js`
  - Install export library: `react-csv`
- **Acceptance Criteria**:
  - Can select date range
  - Charts render correctly
  - Can export data
  - Responsive design

---

### Phase 5: Settings (Lower Priority)

#### Task 5.1: Define Settings Scope

- **Investigation**:
  - Check if backend has settings management
  - Define what settings are configurable:
    - System settings (company name, logo, contact)
    - Email templates and SMTP config
    - Notification preferences
    - Default values (dimension units, weight units, currency)
    - Feature flags
- **Decision**: May be configuration file based vs database stored

#### Task 5.2: Build Settings Page (If Applicable)

- **Files to Create**:
  - `src/app/(dashboard)/admin/settings/page.tsx` (replace placeholder)
  - `src/components/settings/GeneralSettings.tsx`
  - `src/components/settings/EmailSettings.tsx`
  - `src/components/settings/NotificationSettings.tsx`
- **Features**:
  - Tabbed interface for categories
  - Form fields for each setting
  - Save/reset buttons
  - Success/error feedback
- **Note**: This may be deferred if backend doesn't support it

---

## Technical Debt & Improvements

### Code Quality

- [ ] Add unit tests for consolidation workflow
- [ ] Add E2E tests for consolidation creation flow
- [ ] Add unit tests for status validation logic
- [ ] Improve error handling consistency across pages
- [ ] Add loading states to all data fetching

### Internationalization

- [ ] Add translations for consolidations page
- [ ] Add translations for dashboard (replace hardcoded strings)
- [ ] Add translations for users page
- [ ] Add translations for reports page
- [ ] Add translations for settings page

### Performance

- [ ] Implement pagination for consolidations list
- [ ] Add caching strategy for dashboard data
- [ ] Optimize package queries (currently fetches all for client)
- [ ] Consider virtualized tables for large datasets

### Security

- [ ] Verify all admin-only operations are protected
- [ ] Add CSRF protection if needed
- [ ] Audit sensitive data exposure in logs
- [ ] Implement rate limiting on mutations

---

## Dependencies & Prerequisites

### GraphQL Schema Requirements

The following backend operations must be available (verify in backend):

- ✅ `emailAuth` mutation
- ✅ `refreshWithToken` mutation
- ✅ `allClients` query
- ✅ `client` query
- ✅ `createClient` mutation
- ✅ `updateClient` mutation
- ✅ `deleteClient` mutation
- ✅ `allPackages` query
- ✅ `package` query
- ✅ `createPackage` mutation
- ✅ `updatePackage` mutation
- ✅ `deletePackage` mutation
- ❓ `dashboard` query (needs verification)
- ❓ `allConsolidates` query (needs verification)
- ❓ `consolidateById` query (needs verification)
- ❓ `createConsolidate` mutation (needs verification)
- ❓ `updateConsolidate` mutation (needs verification)
- ❓ `deleteConsolidate` mutation (needs verification)
- ❓ `allUsers` query (needs verification)
- ❓ `updateUser` mutation (needs verification)

### Required NPM Packages (for Reports)

- `recharts` - For charts and graphs
- `react-csv` - For CSV export
- `date-fns` - Enhanced date handling (already likely installed)

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

- [ ] Test consolidation form validation
- [ ] Test status transition logic
- [ ] Test dashboard stat calculations
- [ ] Test filter and search logic
- [ ] Test dialog open/close states
- [ ] Test mutation success/error handling

### Integration Tests

- [ ] Test complete consolidation workflow (Step 1 → 2 → 3)
- [ ] Test client → packages → consolidation relationship
- [ ] Test dashboard data refresh
- [ ] Test pagination across all pages

### E2E Tests (Playwright)

- [ ] Test login as admin
- [ ] Test create client → create packages → create consolidation flow
- [ ] Test consolidation status updates
- [ ] Test delete consolidation
- [ ] Test search and filter on all pages
- [ ] Test navigation between pages

---

## Risk Assessment

### High Risk

1. **Backend API Availability**: Some queries/mutations may not exist in backend
   - **Mitigation**: Verify each endpoint before frontend implementation
   - **Fallback**: Mock data for development, coordinate with backend team

2. **Status Transition Complexity**: Business rules must match backend validation
   - **Mitigation**: Use shared validation logic, comprehensive tests
   - **Fallback**: Server-side validation takes precedence, show clear errors

### Medium Risk

1. **Performance with Large Datasets**: Tables may become slow with 1000+ items
   - **Mitigation**: Implement pagination, virtualization if needed
   - **Fallback**: Increase page sizes, add performance warning

2. **Real-time Data Updates**: Dashboard may show stale data
   - **Mitigation**: Implement polling or WebSocket updates
   - **Fallback**: Manual refresh button, show timestamp

### Low Risk

1. **Translation Coverage**: Not all strings may be translated
   - **Mitigation**: Extract strings progressively, use fallback locale
   - **Fallback**: English as default

---

## Success Criteria

### Phase 1 (Core Consolidations) - Complete When:

- ✅ Admin can complete full consolidation workflow (Steps 1-3)
- ✅ Consolidations page exists with full CRUD operations
- ✅ Status transitions are validated and enforced
- ✅ All consolidation operations have proper error handling
- ✅ Navigation includes consolidations link

### Phase 2 (Dashboard) - Complete When:

- ✅ Dashboard displays real data from GraphQL API
- ✅ All statistics are accurate and up-to-date
- ✅ Recent items are clickable and functional
- ✅ Loading and error states work properly

### Phase 3 (Users) - Complete When:

- ✅ Can view all users in system
- ✅ Can activate/deactivate users
- ✅ Can delete users
- ✅ Can search and filter users
- ✅ User roles are clearly displayed

### Phase 4 (Reports) - Complete When:

- ✅ At least 3 report types are available
- ✅ Charts render correctly
- ✅ Can export data to CSV
- ✅ Date range filtering works

### Phase 5 (Settings) - Complete When:

- ✅ Settings page has at least basic configuration options
- ✅ Changes persist correctly
- ✅ Proper validation and feedback

---

## Workplan Checklist

### Phase 1: Core Consolidations ⚠️ In Progress

- [ ] Create `src/graphql/queries/consolidations.ts`
- [ ] Create `src/graphql/mutations/consolidations.ts`
- [ ] Complete Step 3 of package consolidation workflow
- [ ] Create consolidations management page
- [ ] Create consolidation view dialog
- [ ] Create consolidation edit dialog
- [ ] Create consolidation delete dialog
- [ ] Create status badge component
- [ ] Add consolidations to navigation
- [ ] Add translations for consolidations
- [ ] Test consolidation creation flow
- [ ] Test consolidation status updates
- [ ] Test consolidation deletion

### Phase 2: Dashboard Integration ❌ Not Started

- [ ] Create `src/graphql/queries/dashboard.ts`
- [ ] Rebuild dashboard page with real data
- [ ] Connect all stat cards to real data
- [ ] Wire up recent packages list
- [ ] Wire up recent consolidations list
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add refresh functionality
- [ ] Add translations for dashboard
- [ ] Test dashboard data accuracy
- [ ] Test dashboard refresh

### Phase 3: User Management ❌ Not Started

- [ ] Verify backend user queries availability
- [ ] Create `src/graphql/queries/users.ts`
- [ ] Update/create `src/graphql/mutations/users.ts`
- [ ] Build users management page
- [ ] Create view user dialog
- [ ] Create edit user dialog
- [ ] Create delete user dialog
- [ ] Add user search and filters
- [ ] Add translations for users page
- [ ] Test user management operations

### Phase 4: Reports ❌ Not Started

- [ ] Define reporting requirements
- [ ] Verify backend reporting endpoints
- [ ] Install chart library (recharts)
- [ ] Install export library (react-csv)
- [ ] Create reports page structure
- [ ] Build revenue chart component
- [ ] Build package stats chart component
- [ ] Build date range picker
- [ ] Build export functionality
- [ ] Add translations for reports
- [ ] Test report generation and export

### Phase 5: Settings ❌ Not Started

- [ ] Define settings scope
- [ ] Verify backend settings support
- [ ] Create settings page structure
- [ ] Build general settings tab
- [ ] Build email settings tab (if applicable)
- [ ] Build notification settings tab (if applicable)
- [ ] Add translations for settings
- [ ] Test settings persistence

---

## Notes

- This plan focuses exclusively on **admin workflow** as requested
- Client workflow is out of scope for this plan
- Some features (Reports, Settings) depend on backend capabilities
- Consolidations management is the highest priority missing feature
- Dashboard real data integration is second priority
- Testing should be done incrementally, not as a separate phase
- UI/UX should match existing patterns from clients page
- All new pages should follow established architecture and patterns

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-09  
**Status**: Ready for Implementation
