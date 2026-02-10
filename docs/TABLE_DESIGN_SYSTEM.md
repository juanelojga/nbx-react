# NBX React - Table Design System

**Version:** 1.0  
**Last Updated:** 2026-02-10  
**Status:** Active

---

## Table of Contents

1. [Overview](#overview)
2. [Design Philosophy](#design-philosophy)
3. [Visual Components](#visual-components)
4. [Typography & Spacing](#typography--spacing)
5. [Color System](#color-system)
6. [Animations & Transitions](#animations--transitions)
7. [Component Patterns](#component-patterns)
8. [Code Examples](#code-examples)
9. [Migration Guide](#migration-guide)
10. [Accessibility](#accessibility)

---

## Overview

The NBX React Table Design System establishes a consistent, production-grade aesthetic for all data tables across the application. Inspired by the "Warehouse Tech-Luxe" design language—combining industrial precision with refined luxury—this system ensures tables are not only functional but memorable.

### Design Goals

- **Distinctive:** Avoid generic "admin panel" aesthetics
- **Professional:** Production-ready with attention to detail
- **Performant:** Optimized for large datasets
- **Accessible:** WCAG 2.1 AA compliant
- **Consistent:** Unified experience across all tables

---

## Design Philosophy

### Warehouse Tech-Luxe Aesthetic

The table design draws inspiration from high-end logistics centers and Swiss design principles:

- **Industrial Precision:** Monospace typography for data, clean alignment, generous whitespace
- **Refined Luxury:** Subtle gradients, layered depth through shadows, premium micro-interactions
- **Movement & Energy:** Physics-based animations, staggered reveals, magnetic hover states
- **Strategic Color:** Brand colors used as "energy bursts" rather than overwhelming backgrounds

### Core Principles

1. **Data First:** Content is king—styling enhances rather than distracts
2. **Progressive Enhancement:** Start with solid basics, layer on enhancements
3. **Micro-Interactions Matter:** Small details create memorable experiences
4. **Performance Conscious:** Beautiful but fast

---

## Visual Components

### Table Container

The outermost wrapper provides the foundation for the table's visual hierarchy.

**Styling Pattern:**

```tsx
<div className="space-y-6">
  <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
    {/* Table content */}
  </div>
</div>
```

**Key Properties:**

- `rounded-2xl` - Large border radius for modern feel
- `border-border/50` - Subtle border with 50% opacity
- `bg-card/50` - Semi-transparent background
- `shadow-lg` - Prominent shadow for elevation
- `backdrop-blur-sm` - Frosted glass effect
- `hover:shadow-xl` - Enhanced shadow on hover

### Table Header

Headers use bold, uppercase typography with generous letter spacing to establish hierarchy.

**Styling Pattern:**

```tsx
<TableHeader>
  <TableRow className="border-b-2 border-border/50 bg-gradient-to-r from-muted/40 to-muted/20 backdrop-blur-sm transition-colors hover:from-muted/60 hover:to-muted/30">
    <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
      Column Name
    </TableHead>
  </TableRow>
</TableHeader>
```

**Key Properties:**

- `border-b-2` - Stronger bottom border
- `bg-gradient-to-r from-muted/40 to-muted/20` - Subtle gradient background
- `text-xs font-bold uppercase tracking-wider` - Small, bold, spaced capitals
- `text-muted-foreground` - Muted color for headers

### Table Rows

Rows feature dynamic interactions with smooth transitions and visual feedback.

**Default State:**

```tsx
<TableRow className="table-row-optimized group relative transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/80 hover:to-transparent border-l-4 border-l-transparent">
```

**Selected State:**

```tsx
<TableRow className="table-row-optimized group relative transition-all duration-300 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/15 hover:via-primary/8 border-l-4 border-l-primary">
```

**Key Properties:**

- `table-row-optimized` - Performance optimization class (content-visibility)
- `group` - Enables group hover effects
- `transition-all duration-300` - Smooth transitions
- `border-l-4` - Left border accent (transparent default, colored when selected)
- Gradient backgrounds fade from left to right

### Action Buttons

Color-coded buttons with premium gradients and tactile feedback.

**View Button (Blue):**

```tsx
<Button
  variant="ghost"
  size="icon"
  className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-600 shadow-sm ring-1 ring-blue-200/50 transition-all duration-300 hover:scale-110 hover:from-blue-100 hover:to-blue-200/50 hover:text-blue-700 hover:shadow-md hover:ring-blue-300/50 active:scale-95 dark:from-blue-950/30 dark:to-blue-900/20 dark:ring-blue-800/30 dark:hover:from-blue-900/40"
>
  <Eye className="h-4 w-4" />
</Button>
```

**Edit Button (Amber):**

```tsx
<Button
  variant="ghost"
  size="icon"
  className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-600 shadow-sm ring-1 ring-amber-200/50 transition-all duration-300 hover:scale-110 hover:from-amber-100 hover:to-amber-200/50 hover:text-amber-700 hover:shadow-md hover:ring-amber-300/50 active:scale-95 dark:from-amber-950/30 dark:to-amber-900/20 dark:ring-amber-800/30 dark:hover:from-amber-900/40"
>
  <Pencil className="h-4 w-4" />
</Button>
```

**Delete Button (Red):**

```tsx
<Button
  variant="ghost"
  size="icon"
  className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-50 to-red-100/50 text-red-600 shadow-sm ring-1 ring-red-200/50 transition-all duration-300 hover:scale-110 hover:from-red-100 hover:to-red-200/50 hover:text-red-700 hover:shadow-md hover:ring-red-300/50 active:scale-95 dark:from-red-950/30 dark:to-red-900/20 dark:ring-red-800/30 dark:hover:from-red-900/40"
>
  <Trash2 className="h-4 w-4" />
</Button>
```

**Transform States:**

- Default: `scale-100`
- Hover: `scale-110` (10% larger)
- Active: `scale-95` (pressed feedback)

### Tooltips

Tooltips match their associated button colors for visual cohesion.

```tsx
<TooltipContent
  side="top"
  className="rounded-lg bg-blue-950 px-3 py-1.5 text-xs font-medium text-blue-50"
>
  <p>View Details</p>
</TooltipContent>
```

**Color Mapping:**

- View → `bg-blue-950 text-blue-50`
- Edit → `bg-amber-950 text-amber-50`
- Delete → `bg-red-950 text-red-50`

---

## Typography & Spacing

### Font Families

- **Data/Codes:** Monospace (font-mono) with tabular-nums for alignment
- **Headers:** Sans-serif (font-sans), bold, uppercase
- **Body Text:** Sans-serif (font-sans), regular weight

### Type Scale

| Element       | Size      | Weight                           | Transform   | Tracking         |
| ------------- | --------- | -------------------------------- | ----------- | ---------------- |
| Table Headers | `text-xs` | `font-bold`                      | `uppercase` | `tracking-wider` |
| Data Values   | `text-sm` | `font-medium` or `font-semibold` | -           | -                |
| Barcodes/IDs  | `text-sm` | `font-mono font-semibold`        | -           | `tracking-wide`  |
| Descriptions  | `text-sm` | `font-normal`                    | -           | -                |
| Tooltips      | `text-xs` | `font-medium`                    | -           | -                |

### Spacing Guidelines

- **Container Padding:** `space-y-6` (24px vertical gap)
- **Table Cell Padding:** Default (from shadcn/ui table)
- **Action Button Gap:** `gap-1.5` (6px between buttons)
- **Icon Size:** `h-4 w-4` (16px for icons in buttons)
- **Button Size:** `h-9 w-9` (36px square)

---

## Color System

### Semantic Colors

Tables leverage the NBX brand color system with semantic meaning:

| Color                | Usage                | Variable             | Example               |
| -------------------- | -------------------- | -------------------- | --------------------- |
| Primary (Green)      | Selection, success   | `--primary`          | Selected row accent   |
| Secondary (Sky Blue) | Info, links          | `--secondary`        | -                     |
| Muted                | Backgrounds, borders | `--muted`            | Header gradient       |
| Foreground           | Primary text         | `--foreground`       | Data values           |
| Muted Foreground     | Secondary text       | `--muted-foreground` | Descriptions, headers |

### Action Colors

| Action | Base Color | Light Mode                | Dark Mode                  |
| ------ | ---------- | ------------------------- | -------------------------- |
| View   | Blue       | `blue-50` to `blue-100`   | `blue-950` to `blue-900`   |
| Edit   | Amber      | `amber-50` to `amber-100` | `amber-950` to `amber-900` |
| Delete | Red        | `red-50` to `red-100`     | `red-950` to `red-900`     |

### Opacity Scales

- Borders: `/50` (50% opacity)
- Backgrounds: `/10`, `/5` for subtle overlays
- Hover states: Increase opacity by ~5-10%

---

## Animations & Transitions

### Required Keyframes

Add these to `src/app/globals.css`:

```css
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes subtle-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 oklch(0.681 0.178 145.758 / 0);
  }
  50% {
    box-shadow: 0 0 0 4px oklch(0.681 0.178 145.758 / 0.1);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

### Animation Patterns

#### Staggered Fade-In (Initial Load)

Rows fade in sequentially for a polished entrance:

```tsx
<TableRow
  style={{
    animation: "fade-in 0.4s ease-out forwards",
    animationDelay: `${index * 50}ms`,
  }}
>
```

**Parameters:**

- Duration: `0.4s`
- Timing: `ease-out`
- Fill Mode: `forwards` (maintains final state)
- Delay: `index * 50ms` (stagger by 50ms per row)

#### Subtle Pulse (Selected State)

Selected rows pulse gently to maintain attention:

```tsx
<TableRow
  style={{
    animation: isSelected
      ? "subtle-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      : "fade-in 0.4s ease-out forwards",
  }}
>
```

**Parameters:**

- Duration: `2s`
- Timing: `cubic-bezier(0.4, 0, 0.6, 1)`
- Repeat: `infinite`

#### Shimmer (Loading State)

Loading skeletons use a shimmer effect:

```tsx
<div className="relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent shimmer" />
  {/* Skeleton content */}
</div>
```

```css
.shimmer {
  animation: shimmer 2s infinite;
}
```

### Transition Properties

- General: `transition-all duration-300`
- Colors: `transition-colors duration-300`
- Shadows: Included in `transition-all`
- Transforms: Included in `transition-all`

---

## Component Patterns

### Loading State

```tsx
if (isLoading) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent shimmer" />
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-border/50 bg-gradient-to-r from-muted/40 to-muted/20">
                {/* Header cells */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow
                  key={index}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fade-in 0.6s ease-out forwards",
                    opacity: 0,
                  }}
                >
                  {/* Skeleton cells */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
```

### Empty State

```tsx
if (data.length === 0) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-border/50 bg-gradient-to-br from-muted/30 via-background to-muted/20 py-24 text-center shadow-lg backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-xl">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl transition-all duration-1000 group-hover:scale-150" />
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-secondary/5 blur-3xl transition-all duration-1000 group-hover:scale-150" />
      <div className="relative">
        <div className="mb-8 inline-flex rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 shadow-inner ring-1 ring-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
          <Icon className="h-20 w-20 text-primary/60 transition-all duration-500 group-hover:text-primary" />
        </div>
        <h3 className="mb-3 text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
          Empty State Title
        </h3>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
          Empty state description
        </p>
      </div>
    </div>
  );
}
```

### Selection Bar

When rows are selected, show a sticky bottom bar:

```tsx
{
  selectedCount > 0 && (
    <div className="sticky bottom-4 z-10 overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background p-5 shadow-2xl backdrop-blur-md transition-all duration-500 animate-slide-up">
      <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-secondary/10 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
            <Sparkles className="h-5 w-5 animate-pulse text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">
              {selectedCount} selected
            </div>
            <div className="text-xs text-muted-foreground">
              Bulk actions available
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={clearSelection}>
          Clear Selection
        </Button>
      </div>
    </div>
  );
}
```

---

## Code Examples

### Basic Enhanced Table

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function DataTable({ data }) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-border/50 bg-gradient-to-r from-muted/40 to-muted/20 backdrop-blur-sm">
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Name
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="table-row-optimized group relative transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/80 hover:to-transparent border-l-4 border-l-transparent"
                  style={{
                    animation: "fade-in 0.4s ease-out forwards",
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
```

### Table with Selection

```tsx
function SelectableTable({ data }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected);
    if (selected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
        <Table>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={item.id}
                className={`table-row-optimized group relative transition-all duration-300 ${
                  selected.has(item.id)
                    ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/15 hover:via-primary/8 border-l-4 border-l-primary"
                    : "hover:bg-gradient-to-r hover:from-muted/80 hover:to-transparent border-l-4 border-l-transparent"
                }`}
                style={{
                  animation: selected.has(item.id)
                    ? "subtle-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                    : "fade-in 0.4s ease-out forwards",
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <TableCell>
                  <Checkbox
                    checked={selected.has(item.id)}
                    onCheckedChange={() => toggleSelect(item.id)}
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

---

## Migration Guide

### From Basic Table to Enhanced Table

#### Before (Basic)

```tsx
<div className="rounded-md border">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((item) => (
        <TableRow key={item.id}>
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.email}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

#### After (Enhanced)

```tsx
<div className="space-y-6">
  <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-border/50 bg-gradient-to-r from-muted/40 to-muted/20 backdrop-blur-sm">
            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Name
            </TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Email
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={item.id}
              className="table-row-optimized group relative transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/80 hover:to-transparent border-l-4 border-l-transparent"
              style={{
                animation: "fade-in 0.4s ease-out forwards",
                animationDelay: `${index * 50}ms`,
              }}
            >
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
</div>
```

### Key Changes Checklist

- [ ] Replace `rounded-md border` with `rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm`
- [ ] Add `overflow-hidden` to container
- [ ] Add `space-y-6` wrapper for consistent spacing
- [ ] Update table header with gradient background and bold uppercase text
- [ ] Add `table-row-optimized` class to rows
- [ ] Add hover gradients to rows
- [ ] Add fade-in animation with staggered delays
- [ ] Add `transition-all duration-300` for smooth interactions

### Migration Strategy

1. **Start Small:** Migrate one table as a proof of concept
2. **Test Thoroughly:** Verify animations, interactions, and accessibility
3. **Document Issues:** Note any design system adjustments needed
4. **Iterate:** Refine the system based on real-world usage
5. **Roll Out:** Gradually migrate remaining tables

---

## Accessibility

### ARIA Labels

All interactive elements must have proper labels:

```tsx
<Checkbox
  checked={isSelected}
  onCheckedChange={toggleSelect}
  aria-label={`Select ${item.name}`}
/>

<Button
  onClick={handleView}
  aria-label={`View details for ${item.name}`}
>
  <Eye className="h-4 w-4" />
</Button>
```

### Keyboard Navigation

- Tables support standard keyboard navigation (Tab, Shift+Tab)
- Action buttons are focusable and operable via Enter/Space
- Checkboxes follow standard checkbox keyboard behavior

### Focus States

All interactive elements have visible focus indicators:

```css
*:focus-visible {
  @apply outline-2 outline-ring outline-offset-2;
}
```

### Color Contrast

- All text meets WCAG 2.1 AA contrast requirements
- Action button colors tested in both light and dark modes
- Hover states maintain sufficient contrast

### Screen Reader Support

- Use semantic HTML (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`)
- Provide `aria-label` for icon-only buttons
- Use `aria-describedby` for additional context when needed

---

## Performance Optimization

### Content Visibility

The `table-row-optimized` class uses CSS `content-visibility` for better scroll performance:

```css
.table-row-optimized {
  content-visibility: auto;
  contain-intrinsic-size: auto 57px; /* approximate table row height */
}
```

### Animation Best Practices

- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, or `margin`
- Use `will-change` sparingly and only when necessary
- Leverage `forwards` fill mode to avoid layout recalculations

### Dynamic Imports

Load heavy components lazily:

```tsx
const HeavyModal = dynamic(() => import("./HeavyModal"), { ssr: false });
```

---

## Reference Implementation

The complete reference implementation can be found in:

- `src/app/(dashboard)/admin/packages/components/PackagesTable.tsx`

---

## Questions & Support

For questions or suggestions about this design system:

1. Review the reference implementation
2. Check existing table implementations for patterns
3. Consult with the frontend team
4. Document new patterns as they emerge

---

**Happy Building! 🚀**
