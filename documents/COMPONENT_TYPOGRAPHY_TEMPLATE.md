# Component Typography Template

This file provides ready-to-use templates for creating components with correct typography.

---

## Basic Page Template

```tsx
"use client";

import { Work_Sans, Inter } from "next/font/google";

// Font configuration
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

export default function MyPage() {
  return (
    <div className={`${workSansFont.variable} ${interFont.variable}`}>
      {/* Main page title - ALWAYS text-2xl font-extrabold */}
      <h1 className="font-[family-name:var(--font-work-sans)] text-2xl font-extrabold tracking-tight mb-3 text-foreground">
        Page Title
      </h1>

      {/* Page description */}
      <p className="text-lg text-muted-foreground max-w-3xl mb-8">
        Page description goes here
      </p>

      {/* Section card */}
      <div className="rounded-2xl border-2 border-border bg-card shadow-xl">
        {/* Section header - text-lg font-bold */}
        <div className="border-b border-border px-6 py-5">
          <h2 className="font-[family-name:var(--font-work-sans)] text-lg font-bold text-foreground">
            Section Title
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Section description
          </p>
        </div>

        {/* Section content */}
        <div className="p-6">
          {/* Subsection heading - text-base font-bold */}
          <h3 className="font-[family-name:var(--font-work-sans)] text-base font-bold text-foreground mb-4">
            Subsection Title
          </h3>

          {/* Data display */}
          <div className="space-y-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                Field Label
              </div>
              <div className="font-[family-name:var(--font-inter)] text-base font-medium text-foreground">
                Field Value
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Card Component Template

```tsx
interface DataCardProps {
  title: string;
  description?: string;
  data: Record<string, string>;
}

export function DataCard({ title, description, data }: DataCardProps) {
  return (
    <div className="rounded-2xl border-2 border-border bg-card shadow-xl">
      {/* Header - text-lg font-bold */}
      <div className="border-b border-border px-6 py-5">
        <h2 className="font-[family-name:var(--font-work-sans)] text-lg font-bold text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data).map(([label, value]) => (
            <div key={label}>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                {label}
              </div>
              <div className="font-[family-name:var(--font-inter)] text-base font-medium text-foreground">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## Info Alert/Banner Template

```tsx
interface InfoBannerProps {
  label: string;
  primaryText: string;
  secondaryText?: string;
}

export function InfoBanner({
  label,
  primaryText,
  secondaryText,
}: InfoBannerProps) {
  return (
    <div className="px-6 py-4 rounded-xl border-2 border-secondary/30 bg-gradient-to-r from-secondary/10 to-transparent">
      <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
        {label}
      </div>
      <div className="font-[family-name:var(--font-work-sans)] text-xs font-bold text-foreground mt-1">
        {primaryText}
        {secondaryText && (
          <span className="font-[family-name:var(--font-inter)] text-xs font-normal text-muted-foreground ml-3">
            {secondaryText}
          </span>
        )}
      </div>
    </div>
  );
}
```

---

## List Item Template

```tsx
interface ListItemProps {
  title: string;
  description?: string;
  metadata?: string;
}

export function ListItem({ title, description, metadata }: ListItemProps) {
  return (
    <div className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
      {/* Item title - text-sm font-bold */}
      <h4 className="font-[family-name:var(--font-work-sans)] text-sm font-bold text-foreground">
        {title}
      </h4>

      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}

      {metadata && (
        <div className="font-[family-name:var(--font-inter)] text-xs text-muted-foreground mt-2">
          {metadata}
        </div>
      )}
    </div>
  );
}
```

---

## Form Field Template

```tsx
interface FormFieldProps {
  label: string;
  value: string;
  required?: boolean;
}

export function FormField({ label, value, required }: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        className="w-full px-4 py-2 text-base border border-input rounded-lg bg-background text-foreground"
        placeholder={label}
      />
    </div>
  );
}
```

---

## Quick Reference

### Heading Sizes

- h1: `text-2xl font-extrabold` (24px)
- h2: `text-lg font-bold` (18px)
- h3: `text-base font-bold` (16px)
- h4: `text-sm font-bold` (14px)

### Body Sizes

- Large description: `text-lg` (18px)
- Standard body/data: `text-base` (16px)
- Small text: `text-sm` (14px)
- Labels/metadata: `text-xs` (12px)

### Font Families

- Headings: `font-[family-name:var(--font-work-sans)]`
- Data fields: `font-[family-name:var(--font-inter)]`
- Body text: Default (Inter inherited)

### Font Weights

- Extrabold (800): Main page title only
- Bold (700): All other headings
- Medium (500): Emphasized data
- Regular (400): Body text

---

## Common Mistakes to Avoid

❌ **WRONG:**

```tsx
<h1 className="text-5xl font-bold">Title</h1>
<div className="text-2xl">Data</div>
<h2 className="text-3xl">Section</h2>
```

✅ **CORRECT:**

```tsx
<h1 className="font-[family-name:var(--font-work-sans)] text-2xl font-extrabold tracking-tight">
  Title
</h1>
<div className="font-[family-name:var(--font-inter)] text-base font-medium">
  Data
</div>
<h2 className="font-[family-name:var(--font-work-sans)] text-lg font-bold">
  Section
</h2>
```

---

## Before Submitting Code

Checklist:

- [ ] Fonts imported at page/layout level
- [ ] CSS variables applied to root
- [ ] All h1 use text-2xl + font-extrabold + Work Sans
- [ ] All h2 use text-lg + font-bold + Work Sans
- [ ] All h3 use text-base + font-bold + Work Sans
- [ ] All h4 use text-sm + font-bold + Work Sans
- [ ] Data fields use Inter with text-base
- [ ] Labels use text-xs + uppercase + tracking-wider
- [ ] No text-3xl, text-4xl, text-5xl used
- [ ] Body text uses default or explicit Inter

**For full guidelines:** See `documents/TYPOGRAPHY_GUIDELINES.md`
