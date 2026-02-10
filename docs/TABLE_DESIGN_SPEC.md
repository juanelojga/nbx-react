# Table Design Specification

**Version:** 1.0  
**Last Updated:** 2026-02-10  
**Reference Implementation:** `/src/app/(dashboard)/admin/packages/components/PackagesTable.tsx`

## Overview

This document defines the standard visual design and interaction patterns for all data tables in the NBX React application. All tables must follow these specifications to maintain a consistent, polished user experience across the application.

## Design Principles

1. **Consistency**: All tables share the same visual language
2. **Polish**: Subtle animations and transitions create a premium feel
3. **Clarity**: Information hierarchy is clear and scannable
4. **Responsiveness**: Graceful degradation on smaller screens
5. **Accessibility**: Proper ARIA labels and keyboard navigation

---

## Visual Specifications

### Container Styling

```tsx
// Main table container
<div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
```

**Properties:**

- Border radius: `rounded-2xl` (16px)
- Border: `border-border/50` - subtle, semi-transparent
- Background: `bg-card/50` - semi-transparent card background
- Shadow: `shadow-lg` with hover upgrade to `shadow-xl`
- Effect: `backdrop-blur-sm` for glassmorphism
- Transition: `transition-all duration-300` for smooth state changes

### Table Header

```tsx
<TableRow className="border-b-2 border-border/50 bg-gradient-to-r from-muted/40 to-muted/20 backdrop-blur-sm transition-colors hover:from-muted/60 hover:to-muted/30">
```

**Properties:**

- Bottom border: `border-b-2 border-border/50` - thicker than normal rows
- Background: Horizontal gradient `from-muted/40 to-muted/20`
- Hover: Intensifies gradient `hover:from-muted/60 hover:to-muted/30`
- Effect: `backdrop-blur-sm` for depth

**Header Cell Typography:**

```tsx
<TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
```

- Font size: `text-xs` (0.75rem)
- Weight: `font-bold`
- Transform: `uppercase`
- Spacing: `tracking-wider` (increased letter spacing)
- Color: `text-muted-foreground`

### Table Rows

#### Default Row State

```tsx
<TableRow className="group relative transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/80 hover:to-transparent border-l-4 border-l-transparent">
```

**Properties:**

- Group context: `group` for child element interactions
- Position: `relative` for absolute child positioning
- Transition: `transition-all duration-300`
- Hover background: Gradient `from-muted/80 to-transparent`
- Left border: `border-l-4 border-l-transparent` (invisible by default)

#### Selected Row State

```tsx
className =
  "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/15 hover:via-primary/8 border-l-4 border-l-primary";
```

**Properties:**

- Background: Three-stop gradient with primary color
- Border: `border-l-4 border-l-primary` - visible primary color
- Hover: Intensified gradient values
- Animation: `subtle-pulse` (2s infinite)

#### Row Animation

```tsx
style={{
  animationName: "fade-in",
  animationDuration: "0.4s",
  animationTimingFunction: "ease-out",
  animationFillMode: "forwards",
  animationDelay: `${index * 50}ms`
}}
```

**Staggered Entrance:**

- Base delay: 50ms per row
- Duration: 400ms
- Easing: ease-out
- Effect: Creates waterfall effect

### Table Cells

```tsx
<TableCell className="pl-4 pr-6 py-4">
```

**Spacing:**

- Left padding: `pl-4` (first cell) or standard padding
- Right padding: `pr-6`
- Vertical padding: `py-4`

---

## Component Patterns

### Action Buttons

Each action button follows a consistent gradient + ring pattern with color-coded semantics:

#### View Button (Blue)

```tsx
<Button
  variant="ghost"
  size="icon"
  className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-600 shadow-sm ring-1 ring-blue-200/50 transition-all duration-300 hover:scale-110 hover:from-blue-100 hover:to-blue-200/50 hover:text-blue-700 hover:shadow-md hover:ring-blue-300/50 active:scale-95 dark:from-blue-950/30 dark:to-blue-900/20 dark:ring-blue-800/30 dark:hover:from-blue-900/40"
>
  <Eye className="h-4 w-4" />
</Button>
```

#### Edit Button (Amber)

```tsx
<Button
  variant="ghost"
  size="icon"
  className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-600 shadow-sm ring-1 ring-amber-200/50 transition-all duration-300 hover:scale-110 hover:from-amber-100 hover:to-amber-200/50 hover:text-amber-700 hover:shadow-md hover:ring-amber-300/50 active:scale-95 dark:from-amber-950/30 dark:to-amber-900/20 dark:ring-amber-800/30 dark:hover:from-amber-900/40"
>
  <Pencil className="h-4 w-4" />
</Button>
```

#### Delete Button (Red)

```tsx
<Button
  variant="ghost"
  size="icon"
  className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-50 to-red-100/50 text-red-600 shadow-sm ring-1 ring-red-200/50 transition-all duration-300 hover:scale-110 hover:from-red-100 hover:to-red-200/50 hover:text-red-700 hover:shadow-md hover:ring-red-300/50 active:scale-95 dark:from-red-950/30 dark:to-red-900/20 dark:ring-red-800/30 dark:hover:from-red-900/40"
>
  <Trash2 className="h-4 w-4" />
</Button>
```

**Action Button Pattern:**

- Size: `h-9 w-9` (36x36px)
- Shape: `rounded-lg` (8px)
- Background: Gradient from light to lighter with opacity
- Text/Icon: Colored to match action semantic
- Shadow: `shadow-sm` upgrades to `shadow-md` on hover
- Ring: `ring-1` with color-specific opacity
- Hover: `scale-110` (10% larger)
- Active: `scale-95` (pressed effect)
- Dark mode: Adjusted opacity and darker colors

### Tooltips

```tsx
<TooltipContent
  side="top"
  className="rounded-lg bg-blue-950 px-3 py-1.5 text-xs font-medium text-blue-50"
>
  <p>{t("viewDetails")}</p>
</TooltipContent>
```

**Properties:**

- Position: `side="top"`
- Shape: `rounded-lg`
- Background: Dark color matching action (`bg-blue-950`, `bg-amber-950`, `bg-red-950`)
- Text: Light color (`text-blue-50`, etc.)
- Padding: `px-3 py-1.5`
- Typography: `text-xs font-medium`

### Checkboxes (Selection)

```tsx
<Checkbox
  checked={isSelected}
  onCheckedChange={() => onSelect(id)}
  className="transition-all duration-300 hover:scale-110"
/>;
{
  isSelected && (
    <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary animate-pulse" />
  );
}
```

**Features:**

- Hover scale: `hover:scale-110`
- Selected indicator: Sparkle icon with pulse animation
- Smooth transitions: `transition-all duration-300`

---

## State Patterns

### Loading State

```tsx
<div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-lg backdrop-blur-sm">
  <div className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent shimmer" />
    <Table>
      <TableHeader>{/* Headers with actual content */}</TableHeader>
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
            <TableCell>
              <div className="h-4 w-4 animate-pulse rounded bg-muted/60"></div>
            </TableCell>
            {/* More skeleton cells */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</div>
```

**Features:**

- Shimmer overlay effect
- 5 skeleton rows with staggered entrance
- Pulse animation on skeleton elements
- Maintains table structure

### Empty State

```tsx
<div className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-border/50 bg-gradient-to-br from-muted/30 via-background to-muted/20 py-24 text-center shadow-lg backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-xl">
  {/* Decorative background blurs */}
  <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl transition-all duration-1000 group-hover:scale-150" />
  <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-secondary/5 blur-3xl transition-all duration-1000 group-hover:scale-150" />

  <div className="relative">
    {/* Icon container */}
    <div className="mb-8 inline-flex rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 shadow-inner ring-1 ring-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
      <PackageIcon className="h-20 w-20 text-primary/60 transition-all duration-500 group-hover:text-primary" />
    </div>

    {/* Title */}
    <h3 className="mb-3 text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
      {t("emptyTitle")}
    </h3>

    {/* Description */}
    <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
      {t("emptyDescription")}
    </p>

    {/* Decorative divider */}
    <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
      <div className="h-px w-8 bg-gradient-to-r from-transparent to-muted-foreground/30" />
      <span>Ready to start</span>
      <div className="h-px w-8 bg-gradient-to-l from-transparent to-muted-foreground/30" />
    </div>
  </div>
</div>
```

**Features:**

- Dashed border: `border-2 border-dashed`
- Gradient background with multiple stops
- Animated background blurs that scale on hover
- Icon with gradient background and ring
- Hover effects throughout (rotation, scaling, color shifts)
- Decorative text divider at bottom

---

## Keyframe Animations

### Required CSS Animations

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes subtle-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
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

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Animation Usage:**

- `fade-in`: Row entrance animation
- `subtle-pulse`: Selected row breathing effect
- `shimmer`: Loading state sweep effect
- `slide-up`: Selection bar entrance

---

## Typography Standards

### ID/Barcode Fields

```tsx
<div className="font-mono text-sm font-semibold tracking-wide">
```

- Font: `font-mono` (monospace)
- Size: `text-sm`
- Weight: `font-semibold`
- Spacing: `tracking-wide`
- Variant: `font-variant-numeric: tabular-nums` (for alignment)

### Date Fields

```tsx
<time className="text-xs font-medium text-foreground/80">
  {new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}
</time>
```

- Container: Badge style with `bg-muted/50` background
- Size: `text-xs`
- Weight: `font-medium`
- Color: `text-foreground/80`

### Description/Content Fields

```tsx
<p className="text-sm text-muted-foreground group-hover:text-foreground">
```

- Size: `text-sm`
- Color: `text-muted-foreground` with hover upgrade
- Max width constraints for long text

---

## Interactive Patterns

### Hover Effects

**Row Hover:**

- Background: Gradient slides in from left
- Left border: Becomes visible with primary color
- Icon colors: Shift from muted to primary
- Transform: Subtle translateX (optional)

**Button Hover:**

- Scale: 110% enlargement
- Shadow: Upgrades from `sm` to `md`
- Background: Gradient intensifies
- Ring: Border becomes more visible

### Selection Patterns

**Single Row Selection:**

- Background: Primary gradient overlay
- Left border: Solid primary color 4px
- Checkbox: Shows sparkle icon
- Animation: Subtle pulse (infinite)

**Multi-Selection Bar:**

- Appears with slide-up animation
- Sticky positioning at bottom
- Glassmorphism with backdrop blur
- Decorative background blurs
- Shows count and actions

---

## Accessibility Requirements

### ARIA Labels

```tsx
// Action buttons
aria-label={t("viewDetails")}
aria-label={t("editPackage")}
aria-label={t("deletePackage")}

// Checkboxes
aria-label={t("selectPackage", { barcode: pkg.barcode })}

// Pagination
aria-label={t("previousPage")}
aria-label={t("nextPage")}
aria-current={isActive ? "page" : undefined}

// Sortable headers
aria-sort={sortOrder === "asc" ? "ascending" : "descending"}
```

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Use `Button` component (native focus handling)
- Tooltips appear on focus, not just hover
- Logical tab order maintained

### Color Contrast

- All text meets WCAG AA standards (4.5:1 minimum)
- Action buttons have sufficient contrast in both light and dark modes
- Focus indicators are clearly visible

---

## Responsive Behavior

### Mobile Adaptations

```tsx
// Horizontal scroll for wide tables
<div className="relative overflow-x-auto">
  {/* Gradient fade on scroll */}
  <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-card/80 to-transparent" />
  <Table>{/* Table content */}</Table>
</div>
```

**Features:**

- Horizontal scroll preserved
- Visual hint (gradient) when content overflows
- Touch-friendly button sizes maintained

---

## Code Organization

### Component Structure

```tsx
// 1. Memoized row component
const TableRow = memo(function TableRow(
  {
    /* props */
  }
) {
  // Row logic and rendering
});

// 2. Main table component
export function DataTable(
  {
    /* props */
  }
) {
  // State management
  // Event handlers with useCallback
  // Memoized derived values with useMemo

  if (isLoading) return <LoadingSkeleton />;
  if (isEmpty) return <EmptyState />;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Table */}
        {/* Selection bar (conditional) */}
      </div>
    </TooltipProvider>
  );
}
```

### Performance Optimizations

1. **Memoization**: Use `memo()` for row components
2. **Callbacks**: Wrap handlers with `useCallback`
3. **Derived State**: Use `useMemo` for computed values
4. **Dynamic Imports**: Lazy load dialogs/modals
5. **Animation Staggering**: Limit to visible rows only

---

## Implementation Checklist

When creating or updating a table, verify:

- [ ] Container uses `rounded-2xl` border and glassmorphism
- [ ] Header has gradient background and uppercase labels
- [ ] Rows have left border and hover gradient
- [ ] Action buttons use color-coded gradient pattern
- [ ] Tooltips match action button colors
- [ ] Loading state shows 5 skeleton rows with shimmer
- [ ] Empty state has decorative blurs and hover effects
- [ ] Row entrance animations use 50ms stagger
- [ ] Selected rows have pulse animation
- [ ] All ARIA labels are present
- [ ] Typography follows standards (mono for IDs, etc.)
- [ ] Responsive scroll has visual hint gradient
- [ ] Component uses memo/useCallback/useMemo appropriately

---

## Examples

See reference implementation: `/src/app/(dashboard)/admin/packages/components/PackagesTable.tsx`

For questions or clarifications, refer to the actual component code as the source of truth.
