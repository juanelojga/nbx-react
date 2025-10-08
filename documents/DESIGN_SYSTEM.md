# Design System Documentation

_Last updated: 2025-10-08_

---

## Table of Contents

- [Color Palette](#color-palette)
- [Components](#components)
- [Pages](#pages)
- [Project Status](#project-status)

---

## Color Palette

- **color-background**: `var(--background)`
- **color-foreground**: `var(--foreground)`
- **font-sans**: `var(--font-geist-sans)`
- **font-mono**: `var(--font-geist-mono)`
- **color-sidebar-ring**: `var(--sidebar-ring)`
- **color-sidebar-border**: `var(--sidebar-border)`
- **color-sidebar-accent-foreground**: `var(--sidebar-accent-foreground)`
- **color-sidebar-accent**: `var(--sidebar-accent)`
- **color-sidebar-primary-foreground**: `var(--sidebar-primary-foreground)`
- **color-sidebar-primary**: `var(--sidebar-primary)`
- **color-sidebar-foreground**: `var(--sidebar-foreground)`
- **color-sidebar**: `var(--sidebar)`
- **color-ring**: `var(--ring)`
- **color-input**: `var(--input)`
- **color-border**: `var(--border)`
- **color-destructive**: `var(--destructive)`
- **color-destructive-foreground**: `var(--destructive-foreground)`
- **color-success**: `var(--success)`
- **color-success-foreground**: `var(--success-foreground)`
- **color-warning**: `var(--warning)`
- **color-warning-foreground**: `var(--warning-foreground)`
- **color-accent-foreground**: `var(--accent-foreground)`
- **color-accent**: `var(--accent)`
- **color-muted-foreground**: `var(--muted-foreground)`
- **color-muted**: `var(--muted)`
- **color-secondary-foreground**: `var(--secondary-foreground)`
- **color-secondary**: `var(--secondary)`
- **color-primary-foreground**: `var(--primary-foreground)`
- **color-primary**: `var(--primary)`
- **color-popover-foreground**: `var(--popover-foreground)`
- **color-popover**: `var(--popover)`
- **color-card-foreground**: `var(--card-foreground)`
- **color-card**: `var(--card)`
- **radius-sm**: `calc(var(--radius) - 4px)`
- **radius-md**: `calc(var(--radius) - 2px)`
- **radius-lg**: `var(--radius)`
- **radius-xl**: `calc(var(--radius) + 4px)`
- **brand-green**: `76 175 80`
- **brand-sky-blue**: `3 169 244`
- **brand-soft-orange**: `255 179 0`
- **brand-deep-blue**: `25 118 210`
- **brand-white**: `255 255 255`
- **brand-text-primary**: `51 51 51`
- **brand-text-secondary**: `158 158 158`
- **radius**: `0.625rem`
- **background**: `oklch(0.145 0 0)`
- **foreground**: `oklch(0.985 0 0)`
- **card**: `oklch(0.205 0 0)`
- **card-foreground**: `oklch(0.985 0 0)`
- **popover**: `oklch(0.205 0 0)`
- **popover-foreground**: `oklch(0.985 0 0)`
- **primary**: `oklch(0.922 0 0)`
- **primary-foreground**: `oklch(0.205 0 0)`
- **secondary**: `oklch(0.269 0 0)`
- **secondary-foreground**: `oklch(0.985 0 0)`
- **success**: `oklch(0.681 0.178 145.758)`
- **success-foreground**: `oklch(1 0 0)`
- **warning**: `oklch(0.791 0.139 79.189)`
- **warning-foreground**: `oklch(0.239 0 0)`
- **muted**: `oklch(0.269 0 0)`
- **muted-foreground**: `oklch(0.708 0 0)`
- **accent**: `oklch(0.269 0 0)`
- **accent-foreground**: `oklch(0.985 0 0)`
- **destructive**: `oklch(0.704 0.191 22.216)`
- **destructive-foreground**: `oklch(0.239 0 0)`
- **border**: `oklch(1 0 0 / 10%)`
- **input**: `oklch(1 0 0 / 15%)`
- **ring**: `oklch(0.556 0 0)`
- **sidebar**: `oklch(0.205 0 0)`
- **sidebar-foreground**: `oklch(0.985 0 0)`
- **sidebar-primary**: `oklch(0.488 0.243 264.376)`
- **sidebar-primary-foreground**: `oklch(0.985 0 0)`
- **sidebar-accent**: `oklch(0.269 0 0)`
- **sidebar-accent-foreground**: `oklch(0.985 0 0)`
- **sidebar-border**: `oklch(1 0 0 / 10%)`
- **sidebar-ring**: `oklch(0.556 0 0)`

## Components

Total components: **24**

### alert

- **Location**: `ui/alert.tsx`
- **Props**: 0 props defined
- **Tests**: ✅ Yes

### avatar

- **Location**: `ui/avatar.tsx`
- **Props**: 0 props defined
- **Tests**: ✅ Yes

### badge

- **Location**: `ui/badge.tsx`
- **Props**: 0 props defined
- **Tests**: ✅ Yes

### button

- **Location**: `ui/button.tsx`
- **Props**: 0 props defined
- **Tests**: ✅ Yes

### button.test

- **Location**: `ui/__tests__/button.test.tsx`
- **Props**: 0 props defined
- **Tests**: ❌ No

### card

- **Location**: `ui/card.tsx`
- **Props**: 0 props defined
- **Tests**: ✅ Yes

### checkbox

- **Location**: `ui/checkbox.tsx`
- **Props**: 0 props defined
- **Tests**: ✅ Yes

### dialog

- **Location**: `ui/dialog.tsx`
- **Props**: 0 props defined
- **Tests**: ✅ Yes

### dropdown-menu

- **Location**: `ui/dropdown-menu.tsx`
- **Props**: 0 props defined
- **Tests**: ✅ Yes

### ErrorAlert

- **Location**: `common/ErrorAlert.tsx`
- **Props**: 2 props defined
- **Tests**: ❌ No

### Header

- **Location**: `layout/Header.tsx`
- **Props**: 1 props defined
- **Tests**: ❌ No

### input

- **Location**: `ui/input.tsx`
- **Props**: 0 props defined
- **Tests**: ✅ Yes

### label

- **Location**: `ui/label.tsx`
- **Props**: 0 props defined
- **Tests**: ✅ Yes

### LanguageSelector

- **Location**: `LanguageSelector.tsx`
- **Props**: 0 props defined
- **Tests**: ❌ No

### LoadingSpinner

- **Location**: `common/LoadingSpinner.tsx`
- **Props**: 3 props defined
- **Tests**: ❌ No

### logo

- **Location**: `ui/logo.tsx`
- **Props**: 2 props defined
- **Tests**: ✅ Yes

### MainLayout

- **Location**: `layout/MainLayout.tsx`
- **Props**: 2 props defined
- **Tests**: ❌ No

### page-header

- **Location**: `ui/page-header.tsx`
- **Props**: 4 props defined
- **Tests**: ✅ Yes

### PageLoading

- **Location**: `common/PageLoading.tsx`
- **Props**: 0 props defined
- **Tests**: ❌ No

### ProtectedRoute

- **Location**: `common/ProtectedRoute.tsx`
- **Props**: 2 props defined
- **Tests**: ❌ No

### separator

- **Location**: `ui/separator.tsx`
- **Props**: 0 props defined
- **Tests**: ✅ Yes

### Sidebar

- **Location**: `layout/Sidebar.tsx`
- **Props**: 3 props defined
- **Tests**: ❌ No

### sonner

- **Location**: `ui/sonner.tsx`
- **Props**: 0 props defined
- **Tests**: ✅ Yes

### stat-card

- **Location**: `ui/stat-card.tsx`
- **Props**: 6 props defined
- **Tests**: ❌ No

## Pages

Total pages: **13**

- **/**
  - Path: `src/app/page.tsx`
- **/(auth)/login**
  - Path: `src/app/(auth)/login/page.tsx`
- **/(dashboard)/admin/dashboard**
  - Path: `src/app/(dashboard)/admin/dashboard/page.tsx`
- **/(dashboard)/admin/packages**
  - Path: `src/app/(dashboard)/admin/packages/page.tsx`
- **/(dashboard)/admin/reports**
  - Path: `src/app/(dashboard)/admin/reports/page.tsx`
- **/(dashboard)/admin/settings**
  - Path: `src/app/(dashboard)/admin/settings/page.tsx`
- **/(dashboard)/admin/users**
  - Path: `src/app/(dashboard)/admin/users/page.tsx`
- **/(dashboard)/client/dashboard**
  - Path: `src/app/(dashboard)/client/dashboard/page.tsx`
- **/(dashboard)/client/new-shipment**
  - Path: `src/app/(dashboard)/client/new-shipment/page.tsx`
- **/(dashboard)/client/packages**
  - Path: `src/app/(dashboard)/client/packages/page.tsx`
- **/(dashboard)/client/profile**
  - Path: `src/app/(dashboard)/client/profile/page.tsx`
- **/(dashboard)/client/track**
  - Path: `src/app/(dashboard)/client/track/page.tsx`
- **/design-demo**
  - Path: `src/app/design-demo/page.tsx`

## Project Status

### Completed ✅

- Login page
- Dashboard page (basic styles)
- Demo page (UI components showcase)
- Color palette defined

### In Progress 🚧

- Refining component styles
- Expanding component library

### TODO 📋

- [Add your pending tasks here]
