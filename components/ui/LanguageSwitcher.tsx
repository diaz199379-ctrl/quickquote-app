'use client'

import { useI18n } from '@/lib/i18n/context'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const [showMenu, setShowMenu] = useState(false)

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
  ]

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0]

  const switchLanguage = (newLocale: 'en' | 'es') => {
    setLocale(newLocale)
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
        className="gap-2"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden md:inline">{currentLanguage.flag} {currentLanguage.name}</span>
        <span className="md:hidden">{currentLanguage.flag}</span>
      </Button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-border z-50 py-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => switchLanguage(language.code)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                  locale === language.code
                    ? 'bg-dewalt-yellow/10 text-dewalt-yellow font-semibold'
                    : 'text-text-primary hover:bg-background-secondary'
                )}
              >
                <span className="text-xl">{language.flag}</span>
                <span>{language.name}</span>
                {locale === language.code && (
                  <svg
                    className="w-4 h-4 ml-auto"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

