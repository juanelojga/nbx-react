# Logo Assets

## Required Files

Place the following logo files in this directory:

### Main Logo

- **narbox-logo.png** - Primary logo image (PNG format)
  - Recommended size: 400x160px or similar aspect ratio
  - Transparent background preferred
  - Used in: Header, login pages, marketing materials

### Alternative Formats (Optional)

- **narbox-logo.svg** - Vector version for scalability
- **narbox-logo-white.png** - White version for dark backgrounds
- **narbox-logo-icon.png** - Icon-only version (square)

## Favicon

The favicon should be created from the logo and placed at:

- `/public/favicon.ico` - 32x32px or 16x16px ICO format

## Current Status

✅ Directory structure created
⏳ Awaiting logo file upload

## Usage

The logo is used in the following components:

- `/src/components/ui/logo.tsx` - Main logo component
- `/src/app/layout.tsx` - Favicon reference

### Example Usage

```tsx
import { Logo } from "@/components/ui/logo";

// Image logo
<Logo size="md" />

// Text fallback (used until image is provided)
<LogoText size="lg" />
```

## Notes

- Fallback `LogoText` component is active until logo image is provided
- Logo should maintain NarBox brand colors (Red #E53935, Blue #1976D2)
- Ensure logo is optimized for web (compressed PNG or SVG)
