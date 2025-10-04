# Next.js Internationalization Guide with next-intl

**File Name:** `i18n-implementation-guide.md`

---

## Claude Code Prompts (Step by Step)

Use these prompts in Claude Code to set up internationalization:

### Prompt 1: Install Package

```
Install next-intl package using npm
```

### Prompt 2: Create Middleware

```
Create middleware.ts in the root directory. Configure next-intl middleware with locales ['es', 'en'], defaultLocale 'es', and localePrefix 'as-needed'. Add proper matcher configuration.
```

### Prompt 3: Create i18n Configuration

```
Create i18n.ts in the root directory that uses getRequestConfig from next-intl/server to load translation messages dynamically based on locale.
```

### Prompt 4: Update Next Config

```
Update next.config.js to use createNextIntlPlugin from next-intl/plugin, pointing to ./i18n.ts file.
```

### Prompt 5: Create Translation Files

```
Create two files: messages/es.json and messages/en.json. Include namespaces for common, navigation, buttons, and forms with appropriate translations in Spanish and English.
```

### Prompt 6: Restructure App Directory

```
Move all contents from app/ directory into app/[locale]/ directory. Update app/[locale]/layout.tsx to wrap children with NextIntlClientProvider, load locale messages, and implement generateStaticParams for both locales.
```

### Prompt 7: Create Language Selector

```
Create components/LanguageSelector.tsx as a client component. It should display buttons for Spanish and English, highlight the active language, use cookies to persist selection, and handle locale switching with proper routing using useRouter and usePathname.
```

### Prompt 8: Update Home Page

```
Update app/[locale]/page.tsx to use useTranslations hook from next-intl and include the LanguageSelector component at the top of the page.
```

### Prompt 9: Add Translations to Existing Component

```
Add internationalization to [component-name]. Import useTranslations from next-intl, get translations for the [namespace] namespace, and replace all hardcoded text with translation keys.
```

### Prompt 10: Create Navigation Component

```
Create components/Navigation.tsx that uses Link from next-intl and useTranslations to display a translated navigation menu with links to home, about, and contact pages.
```

---

## Quick Reference

### Using Translations in Server Components

```tsx
import { useTranslations } from "next-intl";

export default function MyServerComponent() {
  const t = useTranslations("namespace");

  return <h1>{t("key")}</h1>;
}
```

### Using Translations in Client Components

```tsx
"use client";

import { useTranslations } from "next-intl";

export default function MyClientComponent() {
  const t = useTranslations("namespace");

  return <button>{t("key")}</button>;
}
```

### Getting Current Locale

```tsx
import { useLocale } from "next-intl";

export default function MyComponent() {
  const locale = useLocale(); // 'es' or 'en'

  return <div>Current locale: {locale}</div>;
}
```

---

## Translation File Structure

### messages/es.json

```json
{
  "common": {
    "language": "Idioma",
    "spanish": "Español",
    "english": "Inglés",
    "welcome": "Bienvenido",
    "loading": "Cargando...",
    "error": "Error",
    "success": "Éxito"
  },
  "navigation": {
    "home": "Inicio",
    "about": "Acerca de",
    "contact": "Contacto",
    "profile": "Perfil"
  },
  "buttons": {
    "submit": "Enviar",
    "cancel": "Cancelar",
    "save": "Guardar",
    "delete": "Eliminar",
    "edit": "Editar"
  },
  "forms": {
    "email": "Correo electrónico",
    "password": "Contraseña",
    "name": "Nombre",
    "required": "Este campo es requerido"
  }
}
```

### messages/en.json

```json
{
  "common": {
    "language": "Language",
    "spanish": "Spanish",
    "english": "English",
    "welcome": "Welcome",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "navigation": {
    "home": "Home",
    "about": "About",
    "contact": "Contact",
    "profile": "Profile"
  },
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit"
  },
  "forms": {
    "email": "Email",
    "password": "Password",
    "name": "Name",
    "required": "This field is required"
  }
}
```

---

## Common Patterns

### 1. Translation with Variables

```tsx
// In messages/es.json
{
    "greeting"
:
    "Hola {name}, tienes {count} mensajes"
}

// In component
const t = useTranslations('namespace');
<p>{t('greeting', {name: 'Juan', count: 5})}</p>
// Output: "Hola Juan, tienes 5 mensajes"
```

### 2. Plural Forms

```tsx
// In messages/es.json
{
    "items"
:
    "{count, plural, =0 {Sin items} =1 {1 item} other {# items}}"
}

// In component
const t = useTranslations('namespace');
<p>{t('items', {count: 0})}</p> // "Sin items"
<p>{t('items', {count: 1})}</p> // "1 item"
<p>{t('items', {count: 5})}</p> // "5 items"
```

### 3. Rich Text (with HTML)

```tsx
// In messages/es.json
{
    "terms"
:
    "Acepto los <link>términos y condiciones</link>"
}

// In component
const t = useTranslations('namespace');
<p>{t.rich('terms', {
    link: (chunks) => <a href="/terms">{chunks}</a>
})}</p>
```

### 4. Dates and Numbers

```tsx
import { useFormatter } from "next-intl";

export default function MyComponent() {
  const format = useFormatter();
  const date = new Date();
  const number = 1234.56;

  return (
    <div>
      <p>{format.dateTime(date, { dateStyle: "full" })}</p>
      <p>{format.number(number, { style: "currency", currency: "USD" })}</p>
    </div>
  );
}
```

---

## Navigation with Locale

### Using Link Component

```tsx
import { Link } from "next-intl";

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
```

### Programmatic Navigation

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function MyComponent() {
  const router = useRouter();
  const locale = useLocale();

  const handleClick = () => {
    const path = locale === "es" ? "/about" : "/en/about";
    router.push(path);
  };

  return <button onClick={handleClick}>Go to About</button>;
}
```

---

## Best Practices

### 1. Organize Translations by Feature

```json
{
  "home": {
    ...
  },
  "about": {
    ...
  },
  "profile": {
    ...
  },
  "common": {
    ...
  }
}
```

### 2. Use Namespaces in Components

```tsx
// For home page
const t = useTranslations("home");

// For common elements
const tCommon = useTranslations("common");
```

### 3. Create Reusable Translation Components

```tsx
// components/TranslatedButton.tsx
"use client";

import { useTranslations } from "next-intl";

export default function TranslatedButton({
  translationKey,
  onClick,
}: {
  translationKey: string;
  onClick: () => void;
}) {
  const t = useTranslations("buttons");

  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {t(translationKey)}
    </button>
  );
}

// Usage
<TranslatedButton translationKey="submit" onClick={handleSubmit} />;
```

### 4. Type-Safe Translations (Optional)

```typescript
// types/translations.ts
type Messages = typeof import("../messages/es.json");
declare global {
  interface IntlMessages extends Messages {}
}
```

---

## Server vs Client Components

### Server Components (Default)

- Can use `useTranslations` directly
- Better performance
- Translations loaded on server
- Use for static content

```tsx
import { useTranslations } from "next-intl";

export default function ServerComponent() {
  const t = useTranslations("home");
  return <h1>{t("title")}</h1>;
}
```

### Client Components

- Need `'use client'` directive
- Use for interactive elements
- Translations sent to client bundle

```tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export default function ClientComponent() {
  const t = useTranslations("common");
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {t("count")}: {count}
    </button>
  );
}
```

---

## Testing Translations

### Check Missing Translations

If a translation key doesn't exist, next-intl will show the key itself in development mode.

### Switch Languages Easily

Use the LanguageSelector component to test both languages quickly.

---

## Common Issues & Solutions

### Issue: "Cannot use import statement outside a module"

**Solution:** Make sure `next.config.js` uses the next-intl plugin

### Issue: Translations not updating

**Solution:**

1. Restart dev server
2. Clear `.next` folder
3. Check JSON syntax in message files

### Issue: 404 on locale routes

**Solution:** Check middleware matcher pattern includes your routes

### Issue: Cookie not persisting

**Solution:** Ensure cookie path is `/` and SameSite is set to `Lax`

---

## File Structure Summary

```
your-project/
├── app/
│   └── [locale]/
│       ├── layout.tsx          # Wraps with NextIntlClientProvider
│       ├── page.tsx            # Home page with translations
│       └── about/
│           └── page.tsx        # Other pages
├── components/
│   ├── LanguageSelector.tsx    # Language switcher
│   └── Navigation.tsx          # Nav with Link components
├── messages/
│   ├── es.json                 # Spanish translations
│   └── en.json                 # English translations
├── i18n.ts                     # i18n configuration
├── middleware.ts               # Locale routing
└── next.config.js              # Next.js config with plugin
```

---

## Quick Checklist

- [ ] Install next-intl
- [ ] Create middleware.ts
- [ ] Create i18n.ts
- [ ] Update next.config.js
- [ ] Create messages/es.json and messages/en.json
- [ ] Move app to app/[locale]
- [ ] Update layout.tsx with NextIntlClientProvider
- [ ] Create LanguageSelector component
- [ ] Add translations to all pages/components
- [ ] Test both languages thoroughly
- [ ] Verify cookie persistence works
