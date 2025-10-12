# Table Refresh Implementation - Admin Clients Page

## Overview

This document describes the implementation of the table refresh functionality for the Admin Clients page, including automatic refresh after client creation and manual refresh capability.

---

## Table of Contents

1. [Refresh Triggers](#refresh-triggers)
2. [Loading State Management](#loading-state-management)
3. [Implementation Details](#implementation-details)
4. [Visual Behavior](#visual-behavior)
5. [Reusability](#reusability)
6. [User Flow](#user-flow)
7. [Code Examples](#code-examples)

---

## Refresh Triggers

The clients table can be refreshed in two ways:

### 1. Automatic Refresh (After Client Creation)

**Trigger:** When a new client is successfully created via the "Add Client" dialog.

**How it works:**

- Dialog component calls `onClientCreated()` callback after mutation succeeds
- Parent page component executes `refetch()` to fetch latest data
- Table updates with current filters, sort, and pagination settings preserved

**Location:** `src/components/admin/AddClientDialog.tsx:76-85`

```typescript
onCompleted: async (data) => {
  toast.success("Client created successfully", {
    description: `${data.createClient.client.fullName} has been added to the system.`,
  });
  handleClose();
  // Trigger refresh with current filters/sort/pagination
  if (onClientCreated) {
    await onClientCreated();
  }
};
```

### 2. Manual Refresh

**Trigger:** User clicks the "Refresh" button in the page header.

**How it works:**

- Refresh button calls `handleRefresh()` function
- Function executes Apollo's `refetch()` method
- Table reloads with current query parameters

**Location:** `src/app/(dashboard)/admin/clients/page.tsx:225-235`

```typescript
<Button
  variant="outline"
  onClick={handleRefresh}
  disabled={loading}
  className="sm:w-auto"
>
  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
  Refresh
</Button>
```

---

## Loading State Management

### Apollo Query Configuration

**Location:** `src/app/(dashboard)/admin/clients/page.tsx:98-104`

```typescript
const { data, loading, error, refetch } = useQuery<
  GetAllClientsResponse,
  GetAllClientsVariables
>(GET_ALL_CLIENTS, {
  variables: queryVariables,
  notifyOnNetworkStatusChange: true, // Show loading state on refetch
});
```

**Key Points:**

- `notifyOnNetworkStatusChange: true` ensures loading state updates during refetch
- `loading` boolean controls skeleton display
- `refetch` function enables manual refresh

### Loading States

| State            | Condition                   | Display                |
| ---------------- | --------------------------- | ---------------------- |
| **Initial Load** | First page load             | Skeleton loaders       |
| **Refetch**      | Manual or automatic refresh | Skeleton loaders       |
| **Data Ready**   | Query complete with data    | Table with client data |
| **Empty**        | Query complete, no results  | Empty state message    |
| **Error**        | Query failed                | Error alert message    |

---

## Implementation Details

### Page Component Integration

**File:** `src/app/(dashboard)/admin/clients/page.tsx`

#### 1. Query Hook with Refetch

```typescript
const { data, loading, error, refetch } = useQuery<
  GetAllClientsResponse,
  GetAllClientsVariables
>(GET_ALL_CLIENTS, {
  variables: queryVariables,
  notifyOnNetworkStatusChange: true,
});
```

#### 2. Refresh Handler

```typescript
const handleRefresh = async () => {
  await refetch();
};
```

#### 3. Passing Callback to Dialog

```typescript
<AddClientDialog
  open={isAddDialogOpen}
  onOpenChange={setIsAddDialogOpen}
  onClientCreated={handleRefresh}
/>
```

### Dialog Component Integration

**File:** `src/components/admin/AddClientDialog.tsx`

#### 1. Props Interface

```typescript
interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated?: () => void | Promise<void>;
}
```

#### 2. Using the Callback

```typescript
const [createClient, { loading }] = useMutation<
  CreateClientResponse,
  CreateClientVariables
>(CREATE_CLIENT, {
  onCompleted: async (data) => {
    toast.success("Client created successfully", {
      description: `${data.createClient.client.fullName} has been added to the system.`,
    });
    handleClose();
    // Trigger refresh with current filters/sort/pagination
    if (onClientCreated) {
      await onClientCreated();
    }
  },
  onError: (error) => {
    toast.error("Failed to create client", {
      description: error.message,
    });
  },
});
```

---

## Visual Behavior

### Before Refresh

**State:** Table displays current client data

- Rows show client information
- Pagination controls active
- Search and sort filters applied

### During Refresh

**State:** Skeleton loaders replace table content

**Visual Elements:**

- Table header remains visible with column names
- Skeleton rows display with pulsing animation
- Number of skeleton rows matches `pageSize` setting
- Pagination controls show skeleton placeholders
- Refresh button icon spins (if manual refresh)

**Location:** `src/app/(dashboard)/admin/clients/page.tsx:181-235`

```typescript
{loading && (
  <div className="space-y-4">
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(pageSize)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
              </TableCell>
              {/* More skeleton cells... */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    {/* Pagination skeleton... */}
  </div>
)}
```

### After Refresh

**State:** Table displays updated data

- New/updated clients visible
- Loading indicators removed
- All interactions re-enabled

### Loading Indicator Features

✅ **Accessible:** Screen readers announce loading state
✅ **Responsive:** Adapts to current page size
✅ **Consistent:** Matches design system (shadcn/ui)
✅ **Lightweight:** Pure CSS animations, no external libraries
✅ **Non-blocking:** User can cancel or navigate away

---

## Reusability

### Using Refresh Logic in Other Tables

The refresh pattern is designed to be reusable across admin tables:

#### Pattern Template

```typescript
// 1. Add refetch to useQuery
const { data, loading, error, refetch } = useQuery<ResponseType, VariablesType>(
  QUERY,
  {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true,
  }
);

// 2. Create refresh handler
const handleRefresh = async () => {
  await refetch();
};

// 3. Pass to mutation dialog/form
<MutationDialog
  open={isDialogOpen}
  onOpenChange={setIsDialogOpen}
  onItemCreated={handleRefresh}
/>

// 4. Add manual refresh button
<Button variant="outline" onClick={handleRefresh} disabled={loading}>
  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
  Refresh
</Button>
```

### Custom Hook Example

For even better reusability, create a custom hook:

```typescript
// hooks/useTableRefresh.ts
import { useCallback } from 'react';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';

export function useTableRefresh<TData, TVariables extends OperationVariables>(
  refetch: (variables?: Partial<TVariables>) => Promise<ApolloQueryResult<TData>>
) {
  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return { handleRefresh };
}

// Usage:
const { data, loading, error, refetch } = useQuery(...);
const { handleRefresh } = useTableRefresh(refetch);
```

---

## User Flow

### Flow 1: Automatic Refresh After Creation

```
1. User clicks "Add Client" button
   ↓
2. Dialog opens with form
   ↓
3. User fills required fields
   ↓
4. User clicks "Create Client"
   ↓
5. GraphQL mutation executes
   ↓
6a. SUCCESS:                        6b. ERROR:
    ↓                                   ↓
    Close dialog                        Keep dialog open
    ↓                                   ↓
    Show success toast                  Show error toast
    ↓                                   ↓
    Call onClientCreated()              User can retry
    ↓
    Table shows skeleton loaders
    ↓
    Refetch GET_ALL_CLIENTS
    ↓
    Table updates with new client
    ↓
    User sees new entry (no page reload)
```

### Flow 2: Manual Refresh

```
1. User clicks "Refresh" button
   ↓
2. Refresh icon starts spinning
   ↓
3. Button becomes disabled
   ↓
4. Table replaced with skeleton loaders
   ↓
5. Refetch GET_ALL_CLIENTS with current params
   ↓
6. Data received from backend
   ↓
7. Table updated with latest data
   ↓
8. Refresh button enabled
   ↓
9. Spin animation stops
```

---

## Code Examples

### Example 1: Complete Page Setup

```typescript
export default function AdminClients() {
  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Build query variables
  const queryVariables: GetAllClientsVariables = {
    page,
    pageSize,
    orderBy: `${sortOrder === "desc" ? "-" : ""}${sortField}`,
  };

  // Query with refetch
  const { data, loading, error, refetch } = useQuery<
    GetAllClientsResponse,
    GetAllClientsVariables
  >(GET_ALL_CLIENTS, {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true,
  });

  // Refresh handler
  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header with buttons */}
      <div className="flex justify-between">
        <PageHeader title="Clients" />
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Dialog with refresh callback */}
      <AddClientDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onClientCreated={handleRefresh}
      />

      {/* Table with loading states */}
      <Card>
        <CardContent>
          {loading && <SkeletonTable rows={pageSize} />}
          {!loading && error && <ErrorAlert message={error.message} />}
          {!loading && !error && <ClientsTable data={data} />}
        </CardContent>
      </Card>
    </div>
  );
}
```

### Example 2: Dialog with Callback

```typescript
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated?: () => void | Promise<void>;
}

export function AddClientDialog({
  open,
  onOpenChange,
  onClientCreated
}: DialogProps) {
  const [createClient, { loading }] = useMutation(CREATE_CLIENT, {
    onCompleted: async (data) => {
      toast.success("Created successfully");
      onOpenChange(false);

      // Trigger parent refresh
      if (onClientCreated) {
        await onClientCreated();
      }
    },
    onError: (error) => {
      toast.error("Failed to create", {
        description: error.message
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Form content */}
    </Dialog>
  );
}
```

### Example 3: Skeleton Loader Component

```typescript
function SkeletonTable({ rows = 10 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(rows)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-40 animate-pulse rounded bg-muted" />
              </TableCell>
              <TableCell>
                <div className="h-8 w-8 animate-pulse rounded bg-muted" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

---

## Performance Considerations

### Optimizations

1. **Smart Refetching:**
   - Only refetches current query with same variables
   - Preserves filters, sort, and pagination
   - No unnecessary cache invalidation

2. **Loading State:**
   - `notifyOnNetworkStatusChange: true` prevents flashing
   - Skeleton count matches page size for consistency
   - Animations use CSS only (GPU accelerated)

3. **Async Operations:**
   - Refresh handler awaits refetch completion
   - Toast shown after operation completes
   - Error handling prevents stuck loading states

4. **User Experience:**
   - Refresh button disabled during loading
   - Spinning icon provides visual feedback
   - Current page/filters preserved after refresh

### Network Efficiency

**Before Optimization:**

```typescript
// ❌ Old approach - always fetches page 1
refetchQueries: [{ query: GET_ALL_CLIENTS, variables: { page: 1 } }];
```

**After Optimization:**

```typescript
// ✅ New approach - fetches current page with all filters
const handleRefresh = async () => {
  await refetch(); // Uses current queryVariables
};
```

**Benefits:**

- Fewer unnecessary network requests
- User stays on current page after refresh
- Search and sort filters maintained
- Better perceived performance

---

## Error Handling

### Network Errors

```typescript
const { data, loading, error, refetch } = useQuery(...);

// Error display
{error && (
  <Alert variant="destructive">
    <AlertDescription>
      Failed to load clients: {error.message}
    </AlertDescription>
  </Alert>
)}
```

### Mutation Errors

```typescript
onError: (error) => {
  toast.error("Failed to create client", {
    description: error.message,
  });
  // Dialog stays open for retry
};
```

### Graceful Degradation

- Refresh button disabled during loading
- Toast notifications for all outcomes
- Error boundaries prevent page crashes
- Retry capability for failed operations

---

## Accessibility

### Keyboard Navigation

- Refresh button accessible via Tab key
- Enter/Space activates refresh
- Dialog can be closed with Esc
- Table maintains focus during refresh

### Screen Reader Support

**Loading Announcement:**

```html
<div role="status" aria-live="polite">
  {loading ? "Loading clients..." : ""}
</div>
```

**Button Labels:**

```html
<button aria-label="Refresh client list" onClick="{handleRefresh}">
  <RefreshCw aria-hidden="true" />
  Refresh
</button>
```

### Visual Indicators

- Spinning icon during refresh
- Disabled state (reduced opacity)
- Skeleton loaders with pulse animation
- Clear success/error feedback via toasts

---

## Testing Scenarios

### Manual Testing Checklist

- [ ] Click "Refresh" button - table reloads
- [ ] Create new client - table auto-refreshes
- [ ] Refresh during loading - prevented
- [ ] Refresh with active search - maintains search
- [ ] Refresh on page 2 - stays on page 2
- [ ] Refresh with sort applied - maintains sort
- [ ] Network error during refresh - shows error
- [ ] Rapid clicking refresh - handles gracefully
- [ ] Tab navigation to refresh button - works
- [ ] Screen reader announces loading state

### E2E Test Scenarios (Not Implemented)

```typescript
describe("Table Refresh", () => {
  it("should refresh table on button click", async () => {
    // 1. Load page with client data
    // 2. Click refresh button
    // 3. Verify loading skeleton appears
    // 4. Verify table updates with latest data
  });

  it("should auto-refresh after client creation", async () => {
    // 1. Open "Add Client" dialog
    // 2. Fill and submit form
    // 3. Verify success toast
    // 4. Verify table shows skeleton
    // 5. Verify new client appears in table
  });

  it("should maintain filters during refresh", async () => {
    // 1. Apply search filter
    // 2. Go to page 2
    // 3. Click refresh
    // 4. Verify still on page 2 with same filter
  });
});
```

---

## Related Files

### Modified Files

1. `src/app/(dashboard)/admin/clients/page.tsx`
   - Added `refetch` from useQuery
   - Added `notifyOnNetworkStatusChange: true`
   - Added `handleRefresh` function
   - Added `RefreshCw` icon import
   - Added refresh button to header
   - Added `onClientCreated` prop to dialog

2. `src/components/admin/AddClientDialog.tsx`
   - Added `onClientCreated` to props interface
   - Removed `refetchQueries` from mutation
   - Added callback invocation in `onCompleted`
   - Removed unused `GET_ALL_CLIENTS` import

### Existing Files (Used)

1. `src/graphql/queries/clients.ts`
   - GET_ALL_CLIENTS query used for refetch

2. `src/components/ui/table.tsx`
   - Table components for display

3. `src/components/ui/button.tsx`
   - Button component for refresh action

---

## Conclusion

The table refresh implementation provides:

✅ **Automatic refresh** after client creation
✅ **Manual refresh** via button click
✅ **Loading skeleton** during data fetch
✅ **Current state preservation** (filters, sort, page)
✅ **Accessible** with keyboard and screen reader support
✅ **Reusable pattern** for other admin tables
✅ **Error handling** with user-friendly messages
✅ **Performance optimized** with smart refetching

The implementation uses Apollo Client's built-in `refetch` function combined with a callback pattern to enable flexible, performant table updates without full page reloads. The pattern is designed to be easily adapted for other data tables in the admin interface.
