'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Locale = 'en' | 'es'

interface Messages {
  [key: string]: any
}

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number> & { fallback?: string }) => string
  messages: Messages
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [messages, setMessages] = useState<Messages>({})

  // Load messages when locale changes
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const msgs = await import(`@/messages/${locale}.json`)
        setMessages(msgs.default || msgs)
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error)
      }
    }
    loadMessages()
  }, [locale])

  // Load saved locale from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale
    if (saved && (saved === 'en' || saved === 'es')) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    // Update HTML lang attribute
    document.documentElement.lang = newLocale
  }

  // Translation function
  const t = (key: string, params?: Record<string, string | number> & { fallback?: string }): string => {
    const keys = key.split('.')
    let value: any = messages

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Return fallback if provided, otherwise return key
        return params?.fallback || key
      }
    }

    if (typeof value !== 'string') {
      return params?.fallback || key
    }

    // Replace parameters
    if (params) {
      const { fallback, ...replaceParams } = params
      return Object.entries(replaceParams).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue))
      }, value)
    }

    return value
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, messages }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}

