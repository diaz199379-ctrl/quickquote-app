# 🌍 Internationalization (i18n) Guide

This guide explains how to use the bilingual (English/Spanish) support in QuickQuote AI.

## Overview

We use a custom React Context-based i18n solution, supporting:
- **English (en)** - Default locale
- **Spanish (es)**

The system automatically saves user language preference to localStorage and persists across sessions.

---

## 🚀 Quick Start

### 1. Using Translations in Components

```tsx
'use client'

import { useI18n } from '@/lib/i18n/context'

export default function MyComponent() {
  const { t, locale, setLocale } = useI18n()
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button>{t('common.save')}</button>
      <p>Current language: {locale}</p>
    </div>
  )
}
```

### 2. Translation Keys

Use dot notation to access nested translations:

```tsx
// For "common.buttons.save" in messages/en.json
t('common.buttons.save')

// For "dashboard.stats.totalProjects" in messages/en.json
t('dashboard.stats.totalProjects')
```

### 3. Translations with Parameters

```tsx
// In messages/en.json:
// "greeting": "Hello, {name}!"

const name = 'John'
t('common.greeting', { name })
// Output: "Hello, John!"
```

---

## 📁 File Structure

```
messages/
  ├── en.json    # English translations
  └── es.json    # Spanish translations

lib/
  └── i18n/
      └── context.tsx    # i18n context provider
```

---

## 🔧 How It Works

### I18n Context Provider

The `I18nProvider` wraps your entire app in `app/layout.tsx`:

```tsx
import { I18nProvider } from '@/lib/i18n/context'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
```

### useI18n Hook

The hook provides:
- `locale` - Current locale ('en' or 'es')
- `setLocale(newLocale)` - Change language
- `t(key, params?)` - Translation function
- `messages` - Raw translation object

---

## 📝 Adding New Translations

### 1. Add to English (`messages/en.json`)

```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is a description"
  }
}
```

### 2. Add Spanish Translation (`messages/es.json`)

```json
{
  "myFeature": {
    "title": "Mi Función",
    "description": "Esta es una descripción"
  }
}
```

### 3. Use in Component

```tsx
const { t } = useI18n()

<h1>{t('myFeature.title')}</h1>
<p>{t('myFeature.description')}</p>
```

---

## 🌐 Language Switcher

The `LanguageSwitcher` component is already integrated in the header:

```tsx
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

// In your component
<LanguageSwitcher />
```

Users can switch languages using the flag dropdown in the header. The preference is automatically saved to localStorage.

---

## 🔢 Localization

### Dates

```tsx
const { locale } = useI18n()

const date = new Date()
const formatted = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}).format(date)

// en: "January 15, 2024"
// es: "15 de enero de 2024"
```

### Numbers

```tsx
const { locale } = useI18n()

const number = 1234.56
const formatted = new Intl.NumberFormat(locale).format(number)

// en: "1,234.56"
// es: "1.234,56"
```

### Currency

```tsx
const { locale } = useI18n()

const amount = 1234.56
const formatted = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: 'USD'
}).format(amount)

// en: "$1,234.56"
// es: "US$ 1.234,56"
```

---

## 📄 Translation Namespaces

Translations are organized by namespace:

- `common` - Global UI elements (buttons, navigation, etc.)
- `navigation` - Menu items, links
- `dashboard` - Dashboard-specific content
- `projects` - Project management
- `estimates` - Estimate pages
- `estimator` - Estimator tool
- `settings` - Settings page
- `auth` - Authentication pages
- `ai` - AI assistant messages
- `pdf` - PDF template content
- `validation` - Form validation messages
- `toasts` - Toast notifications

---

## ✅ Best Practices

### 1. **Use Descriptive Keys**
```tsx
// ✅ Good
t('projects.list.emptyState.title')

// ❌ Bad
t('text1')
```

### 2. **Keep Translations Organized**
Group related translations in the same namespace:
```json
{
  "estimates": {
    "create": {
      "title": "Create Estimate",
      "button": "Save Estimate"
    },
    "edit": {
      "title": "Edit Estimate",
      "button": "Update Estimate"
    }
  }
}
```

### 3. **Use Parameters for Dynamic Content**
```tsx
// ✅ Good
t('projects.itemCount', { count: 5 })

// ❌ Bad
`${t('projects.you have')} ${count} ${t('projects.items')}`
```

### 4. **Handle Plurals Properly**
```json
{
  "itemCount": "{count} item",
  "itemCountPlural": "{count} items"
}
```

```tsx
const key = count === 1 ? 'itemCount' : 'itemCountPlural'
t(key, { count })
```

---

## 🐛 Troubleshooting

### Translation Key Not Found

If you see the raw key instead of the translation:
1. Check if the key exists in both `en.json` and `es.json`
2. Verify the key path is correct (use dot notation)
3. Check for typos in the key name
4. Ensure the JSON files are valid (no trailing commas)

### Language Not Switching

1. Check if `LanguageSwitcher` is included in your layout
2. Verify `I18nProvider` wraps your app in `layout.tsx`
3. Clear localStorage and refresh: `localStorage.removeItem('locale')`
4. Check browser console for errors

### Missing Translations

If a translation is missing in one language, the key will be displayed. To debug:
```tsx
const { messages, locale } = useI18n()
console.log('Current locale:', locale)
console.log('Available messages:', messages)
```

---

## 🎯 Example: Complete Component

```tsx
'use client'

import { useI18n } from '@/lib/i18n/context'
import { Button } from '@/components/ui/button'

export default function ProjectCard({ project }) {
  const { t, locale } = useI18n()
  
  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(project.createdAt))
  
  const formattedTotal = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD'
  }).format(project.total)
  
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-bold">{project.name}</h3>
      <p className="text-sm text-gray-500">
        {t('projects.createdOn', { date: formattedDate })}
      </p>
      <p className="text-xl font-bold mt-2">{formattedTotal}</p>
      <Button className="mt-4">
        {t('common.buttons.view')}
      </Button>
    </div>
  )
}
```

---

## 🌟 Next Steps

1. Start translating your components by importing `useI18n`
2. Replace hardcoded strings with translation keys
3. Test both English and Spanish versions
4. Add new translations as you build features
5. Consider adding more locales in the future

**Happy translating! 🌍✨**
