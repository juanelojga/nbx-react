# Code Review Checklist

Use this checklist when reviewing PRs or your own code changes.

---

## Typography Compliance (MANDATORY)

### Font Loading ✅

- [ ] Fonts imported from `next/font/google` (Work_Sans, Inter)
- [ ] Font configuration includes all required weights
- [ ] `display: "swap"` set for both fonts
- [ ] CSS variables defined (`--font-work-sans`, `--font-inter`)
- [ ] Variables applied to root element via className

### Heading Typography ✅

- [ ] **h1 elements**: Use `text-2xl` + `font-extrabold` (800) + Work Sans
- [ ] **h2 elements**: Use `text-lg` + `font-bold` (700) + Work Sans
- [ ] **h3 elements**: Use `text-base` + `font-bold` (700) + Work Sans
- [ ] **h4 elements**: Use `text-sm` + `font-bold` (700) + Work Sans
- [ ] All headings include `font-[family-name:var(--font-work-sans)]`
- [ ] Main page title includes `tracking-tight`

### Body & Data Typography ✅

- [ ] Data fields use `font-[family-name:var(--font-inter)]`
- [ ] Data fields use appropriate size (`text-base` or `text-sm`)
- [ ] Data fields use appropriate weight (`font-medium` or `font-normal`)
- [ ] Body text uses default (Inter inherited) or explicit Inter
- [ ] Descriptions use `text-lg` or `text-base`

### Labels & Small Text ✅

- [ ] Labels use `text-xs`
- [ ] Uppercase labels include `uppercase` + `tracking-wider`
- [ ] Labels use `font-bold` or `font-medium`
- [ ] Metadata/captions use `text-xs` with Inter

### Prohibited Patterns ❌

- [ ] **NO** `text-3xl`, `text-4xl`, `text-5xl`, `text-6xl` used
- [ ] **NO** `text-xl` used (reserved)
- [ ] **NO** headings without Work Sans font family
- [ ] **NO** headings without bold (700) or extrabold (800) weight
- [ ] **NO** main title (h1) without `font-extrabold` (800)
- [ ] **NO** generic font classes without CSS variables

---

## General Code Quality ✅

### TypeScript

- [ ] All components properly typed
- [ ] No `any` types (unless absolutely necessary with justification)
- [ ] Props interfaces defined
- [ ] Return types specified for functions

### React Patterns

- [ ] Server components by default
- [ ] `"use client"` only when necessary (state, effects, browser APIs)
- [ ] Props destructured in function signature
- [ ] Hooks follow Rules of Hooks
- [ ] Event handlers use `useCallback` where appropriate

### Imports

- [ ] Path alias `@/*` used for src imports
- [ ] Relative imports only for closely related files
- [ ] No unused imports
- [ ] Imports organized (external → internal → relative)

### Styling

- [ ] Tailwind utility classes used (no custom CSS unless necessary)
- [ ] Semantic color classes used (`text-foreground`, `bg-card`)
- [ ] Responsive classes where needed (`md:`, `lg:`)
- [ ] `cn()` utility used for conditional classes

### Internationalization

- [ ] Spanish translations added first (`messages/es.json`)
- [ ] English translations added second (`messages/en.json`)
- [ ] `useTranslations()` hook used in client components
- [ ] `getTranslations()` used in server components
- [ ] No hardcoded user-facing text

### Accessibility

- [ ] Semantic HTML elements used
- [ ] ARIA labels where needed
- [ ] Keyboard navigation supported
- [ ] Sufficient color contrast
- [ ] Text size never below `text-xs` (12px)

### Performance

- [ ] Large components code-split with `dynamic()`
- [ ] Images optimized with Next.js `<Image>`
- [ ] GraphQL queries optimized (no over-fetching)
- [ ] Loading states implemented
- [ ] Error boundaries where appropriate

---

## Testing ✅

### Unit Tests

- [ ] Component tests exist (if applicable)
- [ ] Tests follow React Testing Library patterns
- [ ] Tests cover main use cases
- [ ] Tests pass locally

### E2E Tests

- [ ] E2E tests added for new user flows (if applicable)
- [ ] Tests pass locally

---

## Documentation ✅

### Code Documentation

- [ ] Complex logic has explanatory comments
- [ ] JSDoc comments for exported functions (if needed)
- [ ] Props interface documented (if complex)

### Project Documentation

- [ ] README updated (if public-facing changes)
- [ ] Design system updated (if new patterns added)
- [ ] Changelog updated (if applicable)

---

## Build & Deploy ✅

### Local Verification

- [ ] `npm run format` - Code formatted
- [ ] `npm run lint:fix` - Auto-fixable issues resolved
- [ ] `npm run lint` - No lint errors
- [ ] `npm run type-check` - No TypeScript errors
- [ ] `npm test` - All tests pass
- [ ] `npm run build` - Production build succeeds

### Git

- [ ] Commit messages are descriptive
- [ ] Pre-commit hooks passed
- [ ] Branch up to date with main/develop
- [ ] No merge conflicts

---

## Typography-Specific Review Guide

### Quick Visual Check

**Look for these patterns (CORRECT):**

```tsx
✅ <h1 className="font-[family-name:var(--font-work-sans)] text-2xl font-extrabold
✅ <h2 className="font-[family-name:var(--font-work-sans)] text-lg font-bold
✅ <h3 className="font-[family-name:var(--font-work-sans)] text-base font-bold
✅ <div className="font-[family-name:var(--font-inter)] text-base font-medium
✅ <label className="text-xs font-bold uppercase tracking-wider
```

**Flag these patterns (INCORRECT):**

```tsx
❌ <h1 className="text-5xl
❌ <h2 className="text-3xl
❌ <h1 className="text-2xl"> (missing font family)
❌ <h2 className="font-[family-name:var(--font-work-sans)] text-lg"> (missing font-bold)
❌ <div className="text-4xl
```

### Common Issues to Watch For

1. **Missing Font Family**
   - Issue: `<h2 className="text-lg font-bold">`
   - Fix: Add `font-[family-name:var(--font-work-sans)]`

2. **Wrong Size**
   - Issue: `<h1 className="text-5xl font-extrabold">`
   - Fix: Change to `text-2xl`

3. **Missing Weight**
   - Issue: `<h2 className="font-[family-name:var(--font-work-sans)] text-lg">`
   - Fix: Add `font-bold`

4. **Data Without Inter**
   - Issue: `<div className="text-base">{clientName}</div>`
   - Fix: Add `font-[family-name:var(--font-inter)]` for data fields

5. **Fonts Not Imported**
   - Issue: Using typography without importing fonts
   - Fix: Add imports and configuration at page/layout level

---

## Automated Checks (Future)

### ESLint Rules (To Be Implemented)

- [ ] Warn on `text-3xl` through `text-6xl` usage
- [ ] Warn on h1-h4 without appropriate font class
- [ ] Warn on headings without bold weight

### Pre-commit Hooks

- [ ] Typography validation script
- [ ] Font import verification

---

## References

- **Typography Guidelines**: `documents/TYPOGRAPHY_GUIDELINES.md`
- **Design System**: `documents/DESIGN_SYSTEM.md`
- **Component Templates**: `documents/COMPONENT_TYPOGRAPHY_TEMPLATE.md`
- **Project Guidelines**: `PROJECT.md`

---

## Review Approval Criteria

**A PR should NOT be approved if:**

- Typography rules are violated
- Fonts are not properly imported/configured
- Headings use prohibited large sizes (3xl+)
- Headings lack Work Sans font family
- Code doesn't pass lint/type-check
- Tests fail

**Before clicking "Approve":**

1. Verify typography compliance using this checklist
2. Confirm fonts load correctly (if possible)
3. Check that hierarchy is visually clear
4. Ensure all automated checks pass
