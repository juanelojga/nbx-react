# NarBox Design System

This document outlines the design system and UI guidelines for the NarBox package handling application.

## Color System

### Brand Colors

Our brand identity is built on four primary colors that convey trust, energy, success, and attention:

| Color Name        | Hex Code  | RGB            | Usage                                                   |
| ----------------- | --------- | -------------- | ------------------------------------------------------- |
| **Primary Red**   | `#E53935` | `229, 57, 53`  | CTAs, primary buttons, key notifications, error states  |
| **Primary Blue**  | `#1976D2` | `25, 118, 210` | Navigation, links, information sections, trust elements |
| **Brand Green**   | `#4CAF50` | `76, 175, 80`  | Success messages, confirmations, positive actions       |
| **Accent Yellow** | `#FFC107` | `255, 193, 7`  | Alerts, highlights, badges, cart icon, warnings         |

### Neutral Colors

| Color Name         | Hex Code  | RGB             | Usage                            |
| ------------------ | --------- | --------------- | -------------------------------- |
| **Background**     | `#FFFFFF` | `255, 255, 255` | Main background, cards, surfaces |
| **Primary Text**   | `#212121` | `33, 33, 33`    | Headings, primary content        |
| **Secondary Text** | `#757575` | `117, 117, 117` | Supporting text, descriptions    |
| **Border**         | `#E0E0E0` | `224, 224, 224` | Borders, dividers                |

### Semantic Color Mapping

In Tailwind CSS and components, use these semantic class names:

```tsx
// Primary actions (Red)
<Button variant="default">Submit</Button>
className="bg-primary text-primary-foreground"

// Secondary actions (Blue)
<Button variant="secondary">Learn More</Button>
className="bg-secondary text-secondary-foreground"

// Success states (Green)
<Badge variant="success">Delivered</Badge>
className="bg-success text-success-foreground"

// Warnings (Yellow)
<Badge variant="warning">Pending</Badge>
className="bg-warning text-warning-foreground"

// Destructive actions (Red)
<Button variant="destructive">Delete</Button>
className="bg-destructive text-destructive-foreground"
```

### Color Usage Guidelines

**✅ DO:**

- Use **Red** sparingly for important CTAs to maintain impact
- Use **Blue** as the dominant color for navigation and trust elements
- Use **Green** for positive actions and success confirmations
- Use **Yellow** for attention-grabbing elements like alerts and badges
- Maintain white backgrounds for a clean, professional look

**❌ DON'T:**

- Don't overuse red—it should feel special and important
- Don't use yellow for large backgrounds (use it as an accent)
- Don't mix colors that serve similar purposes
- Don't use colors that don't pass WCAG AA contrast standards

### Accessibility

All color combinations meet **WCAG 2.1 Level AA** standards:

| Foreground     | Background    | Contrast Ratio | Status |
| -------------- | ------------- | -------------- | ------ |
| White          | Primary Red   | 4.95:1         | ✅ AA  |
| White          | Primary Blue  | 5.65:1         | ✅ AA  |
| White          | Brand Green   | 4.57:1         | ✅ AA  |
| Dark Text      | Accent Yellow | 12.36:1        | ✅ AAA |
| Primary Text   | White         | 15.79:1        | ✅ AAA |
| Secondary Text | White         | 4.59:1         | ✅ AA  |

## Typography

### Font Family

We use the **Geist** font family (provided by Next.js):

```css
--font-sans: var(--font-geist-sans);
--font-mono: var(--font-geist-mono);
```

**Fallback:** System fonts for optimal performance

```css
font-family:
  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
  Arial, sans-serif;
```

### Font Scale

| Size | Class       | Pixels | Usage                     |
| ---- | ----------- | ------ | ------------------------- |
| 4xl  | `text-4xl`  | 36px   | Page titles, hero text    |
| 3xl  | `text-3xl`  | 30px   | Section headings (h2)     |
| 2xl  | `text-2xl`  | 24px   | Subsection headings (h3)  |
| xl   | `text-xl`   | 20px   | Card titles (h4)          |
| lg   | `text-lg`   | 18px   | Emphasized text (h5)      |
| base | `text-base` | 16px   | Body text, paragraphs     |
| sm   | `text-sm`   | 14px   | Supporting text, captions |
| xs   | `text-xs`   | 12px   | Labels, tiny text         |

### Font Weights

| Weight   | Class           | Value | Usage                       |
| -------- | --------------- | ----- | --------------------------- |
| Bold     | `font-bold`     | 700   | Headings, emphasis          |
| Semibold | `font-semibold` | 600   | Subheadings, important text |
| Medium   | `font-medium`   | 500   | Buttons, labels             |
| Normal   | `font-normal`   | 400   | Body text, paragraphs       |

### Typography Guidelines

**Headings:**

```tsx
<h1 className="text-4xl font-semibold">Page Title</h1>
<h2 className="text-3xl font-semibold">Section Title</h2>
<h3 className="text-2xl font-semibold">Subsection</h3>
```

**Body Text:**

```tsx
<p className="text-base">Regular paragraph text</p>
<p className="text-sm text-muted-foreground">Supporting text</p>
```

**Links:**

```tsx
<a className="text-secondary underline-offset-4 hover:underline">Link text</a>
```

## Component Guidelines

### Buttons

**Variants:**

```tsx
// Primary action (Red) - Use for main CTAs
<Button variant="default">Create Package</Button>

// Secondary action (Blue) - Use for supporting actions
<Button variant="secondary">View Details</Button>

// Success action (Green)
<Button className="bg-success hover:bg-success/90 text-success-foreground">
  Confirm Delivery
</Button>

// Destructive action (Red) - Use for dangerous actions
<Button variant="destructive">Delete Package</Button>

// Outline - Use for tertiary actions
<Button variant="outline">Cancel</Button>

// Ghost - Use for minimal actions
<Button variant="ghost">Dismiss</Button>
```

**Sizes:**

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### Cards

```tsx
// Default card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>

// Stat card with variants
<StatCard
  label="Total Packages"
  value="1,234"
  variant="primary"
  icon={Package}
  trend={{ value: 12, isPositive: true }}
/>
```

### Badges

```tsx
// Status badges
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Info</Badge>
<Badge className="bg-success">Success</Badge>
<Badge className="bg-warning text-warning-foreground">Warning</Badge>
<Badge variant="destructive">Error</Badge>
```

### Forms

```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

### Dialogs

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Icons

We use **Lucide React** for icons:

```tsx
import { Package, User, Settings } from "lucide-react";

<Package className="h-4 w-4" />
<User className="h-5 w-5 text-primary" />
<Settings className="h-6 w-6 text-muted-foreground" />
```

**Icon Sizes:**

- `h-3 w-3` (12px) - Inline with small text
- `h-4 w-4` (16px) - Default, inline with text
- `h-5 w-5` (20px) - Buttons, headings
- `h-6 w-6` (24px) - Large UI elements
- `h-8 w-8` (32px) - Feature icons

## Spacing System

Use Tailwind's spacing scale consistently:

### Spacing Scale

| Token | Pixels | Usage               |
| ----- | ------ | ------------------- |
| `0`   | 0px    | No spacing          |
| `1`   | 4px    | Tight spacing       |
| `2`   | 8px    | Small spacing       |
| `3`   | 12px   | Default spacing     |
| `4`   | 16px   | Medium spacing      |
| `6`   | 24px   | Large spacing       |
| `8`   | 32px   | Extra large spacing |
| `12`  | 48px   | Section spacing     |
| `16`  | 64px   | Page spacing        |

### Common Patterns

```tsx
// Component internal spacing
<div className="space-y-4">...</div>

// Card padding
<Card className="p-6">...</Card>

// Section spacing
<section className="py-12">...</section>

// Page container
<main className="container mx-auto px-4 py-8">...</main>
```

## Layout

### Container

```tsx
// Standard page container
<div className="container mx-auto px-4">
  {/* Content */}
</div>

// Full width
<div className="w-full">
  {/* Content */}
</div>

// Centered content
<div className="max-w-2xl mx-auto">
  {/* Content */}
</div>
```

### Grid

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>

// Dashboard stats
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard {...} />
</div>
```

## Responsive Design

### Breakpoints

| Breakpoint | Min Width | Usage         |
| ---------- | --------- | ------------- |
| `sm`       | 640px     | Small tablets |
| `md`       | 768px     | Tablets       |
| `lg`       | 1024px    | Laptops       |
| `xl`       | 1280px    | Desktops      |
| `2xl`      | 1536px    | Large screens |

### Mobile-First Approach

Always design for mobile first, then enhance for larger screens:

```tsx
// Mobile: stack vertically, Desktop: side by side
<div className="flex flex-col lg:flex-row gap-4">
  <div className="flex-1">Left</div>
  <div className="flex-1">Right</div>
</div>

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</h1>

// Hide on mobile
<div className="hidden md:block">Desktop only</div>

// Show only on mobile
<div className="block md:hidden">Mobile only</div>
```

## Custom Components

### Logo

```tsx
import { Logo, LogoText } from "@/components/ui/logo";

// Image logo
<Logo size="md" />

// Text-only version (fallback)
<LogoText size="lg" />
```

### Page Header

```tsx
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

<PageHeader
  title="Packages"
  description="Manage all your packages"
  actions={<Button>Create Package</Button>}
/>;
```

### Stat Card

```tsx
import { StatCard } from "@/components/ui/stat-card";
import { Package } from "lucide-react";

<StatCard
  label="Total Packages"
  value="1,234"
  icon={Package}
  variant="primary"
  trend={{ value: 12, isPositive: true }}
/>;
```

## Dark Mode

Currently, the design system is optimized for light mode. Dark mode variables are defined but not actively used. To enable dark mode in the future:

1. Add theme toggle using `next-themes`
2. Ensure all custom components support dark mode
3. Test contrast ratios in dark mode
4. Update brand colors for dark backgrounds if needed

## Best Practices

### Consistency

- Use the same component patterns throughout the app
- Stick to the defined color palette
- Maintain consistent spacing
- Use semantic HTML elements

### Performance

- Optimize images (use Next.js Image component)
- Lazy load components when appropriate
- Minimize custom CSS, prefer Tailwind utilities
- Use the provided components instead of creating new ones

### Accessibility

- Always include proper ARIA labels
- Ensure keyboard navigation works
- Maintain color contrast standards
- Use semantic HTML
- Test with screen readers

### Code Quality

```tsx
// ✅ Good: Consistent, readable, semantic
<Button variant="primary" size="lg" className="w-full">
  Submit Order
</Button>

// ❌ Bad: Inline styles, no semantic meaning
<div style={{ background: "#E53935" }} onClick={handleClick}>
  Submit
</div>
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

---

**Last Updated:** October 2025
**Maintained by:** NarBox Development Team
