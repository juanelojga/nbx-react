# Typography Guidelines

_Last updated: 2026-02-10_

---

## Overview

This document defines the typography system for the NBX React application. Our typography choices prioritize **readability, professionalism, and modern aesthetics** suitable for a logistics/courier business application.

---

## Table of Contents

- [Font Families](#font-families)
- [Typography Scale](#typography-scale)
- [Usage Rules](#usage-rules)
- [Code Examples](#code-examples)
- [Component Patterns](#component-patterns)
- [Migration Guide](#migration-guide)

---

## Font Families

### Primary Fonts

#### Work Sans - Display & Headings

- **Purpose**: Titles, headings, labels (emphasized text)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extrabold)
- **Characteristics**: Versatile, professional, excellent screen readability
- **CSS Variable**: `--font-work-sans`

#### Inter - Body & Data

- **Purpose**: Body text, data fields, descriptions, UI elements
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold)
- **Characteristics**: Designed for UI/screens, exceptional readability, neutral
- **CSS Variable**: `--font-inter`

### Font Loading

```typescript
import { Work_Sans, Inter } from "next/font/google";

const workSansFont = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-work-sans",
  display: "swap",
});

const interFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Apply to root element
<div className={`${workSansFont.variable} ${interFont.variable}`}>
  {/* Your app */}
</div>
```

---

## Typography Scale

We use a **compact, data-focused scale** that prioritizes content over visual dominance.

| Size Class  | Pixels | Rem      | Use Case                                  | Font Family                   |
| ----------- | ------ | -------- | ----------------------------------------- | ----------------------------- |
| `text-2xl`  | 24px   | 1.5rem   | Main page title                           | Work Sans (Extrabold 800)     |
| `text-xl`   | 20px   | 1.25rem  | _(Reserved - not currently used)_         | -                             |
| `text-lg`   | 18px   | 1.125rem | Major section headings, descriptions      | Work Sans (Bold 700) or Inter |
| `text-base` | 16px   | 1rem     | Section headings, body text, data fields  | Work Sans (Bold 700) or Inter |
| `text-sm`   | 14px   | 0.875rem | Minor headings, small body text, labels   | Work Sans (Bold 700) or Inter |
| `text-xs`   | 12px   | 0.75rem  | Smallest headings, field labels, metadata | Work Sans (Bold 700) or Inter |

### Philosophy

Our scale uses **aggressive title reduction** (3 sizes down from standard):

- Main titles are **compact** (24px vs typical 48px)
- Section headings are **close to body text** size (18px, 16px vs 16px body)
- Visual hierarchy relies on **font-weight and letter-spacing** more than size
- Result: **Data-focused**, professional, less overwhelming interface

---

## Usage Rules

### Rule 1: Font Family Selection

**Use Work Sans for:**

- ✅ Page titles (h1)
- ✅ Section headings (h2, h3)
- ✅ Card/panel titles
- ✅ Step indicators
- ✅ Emphasized labels (uppercase, bold)
- ✅ Any text that serves as a visual anchor

**Use Inter for:**

- ✅ Body text and paragraphs
- ✅ Data fields (names, emails, IDs, tracking numbers)
- ✅ Descriptions and helper text
- ✅ Button text
- ✅ Form inputs and placeholders
- ✅ Table data
- ✅ Navigation text

### Rule 2: Size Selection

**For Titles/Headings (Work Sans):**

- Main page title: `text-2xl` + `font-extrabold` (800)
- Major section headings: `text-lg` + `font-bold` (700)
- Subsection headings: `text-base` + `font-bold` (700)
- Minor headings: `text-sm` + `font-bold` (700)
- Inline emphasized: `text-xs` + `font-bold` (700)

**For Body/Data (Inter):**

- Large descriptions: `text-lg` + `font-normal` (400)
- Standard body/data: `text-base` + `font-normal` or `font-medium`
- Small text/labels: `text-sm` + `font-normal`
- Metadata/captions: `text-xs` + `font-normal` or `font-medium`

### Rule 3: Font Weight

- **Extrabold (800)**: Main page title ONLY
- **Bold (700)**: All other headings (h2, h3, h4, labels)
- **Semibold (600)**: Emphasized data fields (optional, use sparingly)
- **Medium (500)**: Important data values that need slight emphasis
- **Regular (400)**: All body text, descriptions, standard data

### Rule 4: Letter Spacing

- Uppercase labels: Add `tracking-wider` for readability
- Main titles: Add `tracking-tight` to compensate for large weight
- Body text: Default tracking (no class needed)

### Rule 5: Combination Patterns

**DON'T:**

- ❌ Use large sizes without appropriate weight (looks weak)
- ❌ Use Work Sans for long body text (designed for emphasis)
- ❌ Mix fonts randomly within same component
- ❌ Use multiple extrabold elements on one page

**DO:**

- ✅ Pair size with appropriate weight (bigger = bolder)
- ✅ Use Inter for paragraphs and data-heavy sections
- ✅ Be consistent within component types
- ✅ Reserve extrabold for single hero element per page

---

## Code Examples

### Page Title

```tsx
<h1 className="font-[family-name:var(--font-work-sans)] text-2xl font-extrabold tracking-tight text-foreground">
  Package Management
</h1>
```

### Major Section Heading

```tsx
<h2 className="font-[family-name:var(--font-work-sans)] text-lg font-bold text-foreground">
  Available Packages
</h2>
```

### Subsection Heading

```tsx
<h3 className="font-[family-name:var(--font-work-sans)] text-base font-bold text-foreground">
  Client Information
</h3>
```

### Minor Heading / Emphasized Label

```tsx
<h4 className="font-[family-name:var(--font-work-sans)] text-sm font-bold text-foreground">
  Selected Client
</h4>
```

### Uppercase Label

```tsx
<label className="text-xs font-bold uppercase tracking-wider text-foreground">
  Client Name
</label>
```

### Body Text / Description (Inter)

```tsx
<p className="text-lg text-muted-foreground">
  Select a client to begin consolidating their packages.
</p>
```

### Data Field Value (Inter)

```tsx
<div className="font-[family-name:var(--font-inter)] text-base font-medium text-foreground">
  John Smith
</div>
```

### Small Body Text (Inter)

```tsx
<p className="text-sm text-muted-foreground">Last updated: 2 hours ago</p>
```

### Field Label with Value Pattern

```tsx
<div>
  <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
    Email Address
  </div>
  <div className="font-[family-name:var(--font-inter)] text-base text-foreground">
    john.smith@example.com
  </div>
</div>
```

### Button Text

```tsx
<Button className="text-base">Continue to Packages</Button>
```

---

## Component Patterns

### Card with Title and Content

```tsx
<div className="rounded-2xl border-2 border-border bg-card shadow-xl">
  {/* Header */}
  <div className="border-b border-border px-6 py-5">
    <h2 className="font-[family-name:var(--font-work-sans)] text-lg font-bold text-foreground">
      Package Details
    </h2>
    <p className="text-sm text-muted-foreground mt-1">
      Review the package information below
    </p>
  </div>

  {/* Content */}
  <div className="p-6">
    <div className="space-y-3">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
          Tracking Number
        </div>
        <div className="font-[family-name:var(--font-inter)] text-base font-medium text-foreground">
          TRK-2024-001234
        </div>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
          Status
        </div>
        <div className="font-[family-name:var(--font-inter)] text-base text-foreground">
          In Transit
        </div>
      </div>
    </div>
  </div>
</div>
```

### Info Bar / Alert

```tsx
<div className="px-6 py-4 rounded-xl border-2 border-secondary/30 bg-secondary/10">
  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
    Processing for
  </div>
  <div className="font-[family-name:var(--font-work-sans)] text-xs font-bold text-foreground mt-1">
    John Smith
    <span className="font-[family-name:var(--font-inter)] text-xs font-normal text-muted-foreground ml-3">
      john.smith@example.com
    </span>
  </div>
</div>
```

### Step Indicator

```tsx
<div className="flex items-center gap-4">
  {/* Step Circle */}
  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-[family-name:var(--font-work-sans)] text-2xl font-bold">
    1
  </div>

  {/* Step Label */}
  <div>
    <div className="font-[family-name:var(--font-work-sans)] text-base font-bold text-foreground">
      Select Client
    </div>
    <div className="text-xs text-muted-foreground">
      Choose the client to consolidate packages for
    </div>
  </div>
</div>
```

---

## Migration Guide

### Converting Existing Components

#### Before (Old Fonts - Syne/JetBrains Mono or default)

```tsx
<h1 className="text-5xl font-bold">Package Management</h1>
<p className="text-base">Client data here</p>
```

#### After (Work Sans + Inter)

```tsx
<h1 className="font-[family-name:var(--font-work-sans)] text-2xl font-extrabold tracking-tight">
  Package Management
</h1>
<p className="font-[family-name:var(--font-inter)] text-base">
  Client data here
</p>
```

### Step-by-Step Migration

1. **Import fonts at page/layout level**

   ```typescript
   import { Work_Sans, Inter } from "next/font/google";
   const workSansFont = Work_Sans({
     /* config */
   });
   const interFont = Inter({
     /* config */
   });
   ```

2. **Apply font variables to root**

   ```tsx
   <div className={`${workSansFont.variable} ${interFont.variable}`}>
   ```

3. **Update all headings**
   - Add `font-[family-name:var(--font-work-sans)]`
   - Reduce size by 3 steps (5xl → 2xl, 3xl → lg, 2xl → base, xl → sm, lg → xs)
   - Ensure bold weight (700 or 800)

4. **Update all data/body text**
   - Add `font-[family-name:var(--font-inter)]` to data fields
   - Keep current size (or use text-base as default)
   - Use appropriate weight (400 regular, 500 medium)

5. **Test visual hierarchy**
   - Verify headings stand out via weight
   - Check that text is readable at all sizes
   - Ensure consistent spacing

### Quick Reference Checklist

- [ ] Fonts imported and configured
- [ ] CSS variables applied to root
- [ ] All h1 elements: text-2xl + font-extrabold + Work Sans
- [ ] All h2/h3 elements: text-lg or text-base + font-bold + Work Sans
- [ ] All body text: text-base or text-lg + Inter
- [ ] All data fields: text-base + font-medium + Inter
- [ ] All labels: text-xs + uppercase + tracking-wider
- [ ] Buttons use text-base (default)

---

## Best Practices

### Performance

1. **Load fonts at layout level** - not per component
2. **Use `display: swap`** - prevents invisible text during load
3. **Limit weight variants** - only load what you use
4. **Use CSS variables** - better caching and consistency

### Accessibility

1. **Minimum size**: Never go below text-xs (12px)
2. **Contrast**: Always use semantic colors (foreground, muted-foreground)
3. **Line height**: Let Tailwind defaults handle it (good for readability)
4. **Letter spacing**: Use tracking classes for small/uppercase text

### Consistency

1. **Use the patterns** - Don't invent new combinations
2. **Follow the scale** - Stick to defined sizes
3. **Document deviations** - If you need something different, note why
4. **Review regularly** - Ensure patterns are working across the app

---

## FAQ

**Q: When should I use Inter vs Work Sans?**  
A: Work Sans for anything that's a "title" or "heading" - visual anchors. Inter for everything else - body text, data, descriptions.

**Q: Why are our titles so small compared to other apps?**  
A: We use an aggressive reduction strategy (3 sizes down) for a compact, data-focused interface suitable for business applications. Hierarchy comes from weight, not just size.

**Q: Can I use font-semibold (600)?**  
A: Sparingly. It's available for emphasized data fields but prefer bold (700) for headings and regular/medium (400/500) for body text.

**Q: What about monospace fonts for tracking numbers?**  
A: Inter works well for all data types. If you need truly monospace, document the use case and propose an addition to this guide.

**Q: Should buttons use Work Sans or Inter?**  
A: Inter (default). Buttons are UI elements, not headings. Use text-base or text-sm depending on button size.

---

## Revision History

| Date       | Author | Changes                                                              |
| ---------- | ------ | -------------------------------------------------------------------- |
| 2026-02-10 | System | Initial typography guidelines based on admin packages implementation |
