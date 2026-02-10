# Performance Optimization: Re-render Optimization

This document details the re-render optimization patterns implemented across the NBX React codebase following Vercel's React Best Practices (Category 5).

## Overview

**Goal:** Reduce unnecessary component re-renders to improve interaction responsiveness and lower CPU usage.

**Expected Impact:**

- 20-50% reduction in render count for complex components
- Faster input/click responses
- Lower CPU usage during interactions
- Smoother UI during search/filter operations

## Optimization Rules Implemented

### ✅ Rule 5.1: Calculate Derived State During Rendering

**Pattern:** Compute values directly from props/state instead of storing in separate state.

**Implementation:**

```typescript
// ❌ Before: Unnecessary state
const [totalPages, setTotalPages] = useState(0);
useEffect(() => {
  setTotalPages(Math.ceil(totalCount / pageSize));
}, [totalCount, pageSize]);

// ✅ After: Calculate during render
const totalPages = Math.ceil(totalCount / pageSize);
```

**Applied in:**

- `AdminClients`: `clients`, `totalCount`, `hasNext`, `hasPrevious`, `totalPages`
- `AdminPackages`: `packages`, `hasError`
- `PackagesTable`: Selection state calculations

### ✅ Rule 5.3: Do Not Wrap Simple Expressions in useMemo

**Pattern:** Only memoize expensive computations, not primitive operations.

**Implementation:**

```typescript
// ❌ Over-memoization
const isActive = useMemo(() => status === "active", [status]);

// ✅ Simple calculation (no memo needed)
const isActive = status === "active";

// ✅ Complex calculation (memo beneficial)
const pageNumbers = useMemo(() => generatePageNumbers(), [page, totalPages]);
```

**Applied in:**

- `AdminClients`: `pageNumbers` calculation (complex algorithm)
- `PackagesTable`: `allSelected`, `someSelected` (prevents table re-render)
- `AdminPackages`: GraphQL variables object

### ✅ Rule 5.4: Extract Default Non-Primitive Values to Constants

**Pattern:** Hoist default objects/arrays outside components to prevent reference changes.

**Implementation:**

```typescript
// ❌ Before: Object recreated on every render
function Component() {
  const [data, setData] = useState({
    name: "",
    email: "",
  });
}

// ✅ After: Constant reference
const INITIAL_FORM_DATA = {
  name: "",
  email: "",
};

function Component() {
  const [data, setData] = useState(INITIAL_FORM_DATA);
}
```

**Applied in:**

- `AddClientDialog`: `INITIAL_FORM_DATA` constant
- `AdminPackages`: `CONSOLIDATION_STEPS` constant (already present)

### ✅ Rule 5.5: Extract to Memoized Components

**Pattern:** Wrap frequently re-rendering components with `React.memo`.

**Implementation:**

```typescript
// ❌ Before: Inline row, re-renders on every parent update
{clients.map(client => (
  <TableRow key={client.id}>
    {/* Complex row content */}
  </TableRow>
))}

// ✅ After: Memoized component, only re-renders when props change
const ClientRow = memo(function ClientRow({ client, onView, onEdit, onDelete }) {
  return (
    <TableRow>
      {/* Complex row content */}
    </TableRow>
  );
});

{clients.map(client => (
  <ClientRow key={client.id} client={client} {...handlers} />
))}
```

**Components Created:**

1. **`ClientRow`** (AdminClients)
   - Prevents re-render when other rows change
   - Memoizes action button renders
   - Improves scrolling performance

2. **`PaginationButton`** (AdminClients)
   - Prevents all buttons from re-rendering on page change
   - Optimizes pagination interactions

3. **`PackageRow`** (PackagesTable)
   - Prevents unnecessary row re-renders
   - Optimizes selection interactions

### ✅ Rule 5.6: Narrow Effect Dependencies

**Pattern:** Use `useCallback` to create stable handler references.

**Handlers Optimized (31+ total):**

**AdminClients (7 handlers):**

- `handleSort`, `handlePageSizeChange`, `handleClearSearch`
- `handleRefresh`, `handleViewClient`, `handleEditClient`, `handleDeleteClient`

**AdminPackages (8 handlers):**

- `handleClientSelect`, `handleContinueToStep2`, `handleBackToStep1`
- `handleSelectionChange`, `handleRemovePackage`, `handleClearAll`
- `handleRetryLoad`, `handleRefetchPackages`

**PackagesTable (8 handlers):**

- `handleSelectAll`, `handleSelectPackage`, `handleClearSelection`
- `handleViewPackage`, `handleEditPackage`, `handleDeletePackage`
- `handlePackageUpdated`, `handlePackageDeleted`

**AddClientDialog (4 handlers):**

- `handleClose`, `handleInputChange`, `handlePhoneInputChange`, `handleSubmit`

**EditClientDialog (4 handlers):**

- `handleClose`, `handleInputChange`, `handlePhoneInputChange`, `handleSubmit`

### ✅ Rule 5.9: Use Functional setState Updates

**Pattern:** Use function form of `setState` when new state depends on previous.

**Applied in:**

- `AdminPackages`: `handleRemovePackage`
- `AddClientDialog`: All form field updates
- `EditClientDialog`: All form field updates

### ✅ Rule 5.12: Use useRef for Transient Values

**Applied in:**

- `EditClientDialog`: `lastClientIdRef` prevents unnecessary form resets

## Summary

This optimization pass focused on:

- ✅ 31+ handlers wrapped with `useCallback`
- ✅ 5 `useMemo` calls for expensive computations
- ✅ 3 `React.memo` components for table rows
- ✅ 1 constant extracted for form defaults
- ✅ 1 `useRef` for transient value tracking

**Result:** Comprehensive re-render optimization following Vercel best practices, ready for production deployment.
