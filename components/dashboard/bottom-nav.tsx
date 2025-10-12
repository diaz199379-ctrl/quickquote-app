'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Plus, FileText, Settings } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useI18n } from '@/lib/i18n/context'
import EstimatorSelector from './EstimatorSelector'

const getNavItems = () => [
  { nameKey: 'navigation.home', href: '/dashboard', icon: Home },
  { nameKey: 'navigation.new', href: '#', icon: Plus, isNew: true },
  { nameKey: 'navigation.estimates', href: '/estimates', icon: FileText },
  { nameKey: 'navigation.settings', href: '/settings', icon: Settings },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { t } = useI18n()
  const navItems = getNavItems()
  const [showEstimatorSelector, setShowEstimatorSelector] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            if (item.isNew) {
              return (
                <button
                  key={item.nameKey}
                  onClick={() => setShowEstimatorSelector(true)}
                  className={cn(
                    'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200',
                    'text-text-tertiary hover:text-dewalt-yellow'
                  )}
                >
                  <div className="w-12 h-12 rounded-full bg-dewalt-yellow flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 -mt-6">
                    <Icon className="w-6 h-6 text-dewalt-black" />
                  </div>
                  <span className="text-xs font-medium">
                    {t(item.nameKey)}
                  </span>
                </button>
              )
            }
            
            return (
              <Link
                key={item.nameKey}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200',
                  isActive
                    ? 'text-dewalt-yellow'
                    : 'text-text-tertiary hover:text-text-secondary'
                )}
              >
                <Icon 
                  className={cn(
                    'w-6 h-6 transition-all duration-200',
                    isActive && 'scale-110'
                  )} 
                />
                <span 
                  className={cn(
                    'text-xs font-medium',
                    isActive && 'font-semibold'
                  )}
                >
                  {t(item.nameKey)}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      <EstimatorSelector 
        isOpen={showEstimatorSelector}
        onClose={() => setShowEstimatorSelector(false)}
      />
    </>
  )
}

