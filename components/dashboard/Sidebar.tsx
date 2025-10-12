'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Plus, 
  FolderKanban, 
  FileText, 
  Settings,
  ChevronLeft,
  LogOut,
  User,
  X,
  Calculator,
  Hammer,
  Wrench,
  PaintBucket,
  History,
  TrendingUp,
  DollarSign,
  Users,
  HelpCircle,
  BookOpen,
  Bell,
  Download
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/context'

interface NavItem {
  nameKey: string
  href: string
  icon: React.ElementType
  badge?: string
  comingSoon?: boolean
}

interface NavSection {
  titleKey: string
  items: NavItem[]
}

// Navigation structure using translation keys
const getNavSections = (): NavSection[] => [
  {
    titleKey: 'navigation.sections.main',
    items: [
      { nameKey: 'navigation.dashboard', href: '/dashboard', icon: LayoutDashboard },
      { nameKey: 'navigation.myProjects', href: '/projects', icon: FolderKanban },
      { nameKey: 'navigation.allEstimates', href: '/estimates', icon: FileText },
    ]
  },
  {
    titleKey: 'navigation.sections.quickCreate',
    items: [
      { nameKey: 'navigation.deckEstimator', href: '/estimator/deck', icon: Hammer },
      { nameKey: 'navigation.kitchenRemodel', href: '/estimator/kitchen', icon: Wrench },
      { nameKey: 'navigation.bathroomRemodel', href: '/estimator/bathroom', icon: PaintBucket },
      { nameKey: 'navigation.customEstimate', href: '/estimates/new', icon: Calculator },
    ]
  },
  {
    titleKey: 'navigation.sections.tools',
    items: [
      { nameKey: 'navigation.recentActivity', href: '/activity', icon: History, comingSoon: true },
      { nameKey: 'navigation.priceTrends', href: '/trends', icon: TrendingUp, comingSoon: true },
      { nameKey: 'navigation.clientManagement', href: '/clients', icon: Users, comingSoon: true },
      { nameKey: 'navigation.revenueReports', href: '/reports', icon: DollarSign, comingSoon: true },
    ]
  },
  {
    titleKey: 'navigation.sections.resources',
    items: [
      { nameKey: 'navigation.helpCenter', href: '/help', icon: HelpCircle, comingSoon: true },
      { nameKey: 'navigation.documentation', href: '/docs', icon: BookOpen, comingSoon: true },
      { nameKey: 'navigation.exportData', href: '/export', icon: Download, comingSoon: true },
    ]
  }
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { t } = useI18n()
  const navSections = getNavSections()

  const handleLogout = async () => {
    // In a real app, handle Supabase logout
    console.log('Logging out...')
    window.location.href = '/login'
  }

  return (
    <>
      {/* Sidebar - Mobile slide-in, Desktop fixed */}
      <aside
        className={cn(
          'flex flex-col h-screen bg-white transition-all duration-300',
          // Mobile: Full width with border and shadow
          'w-full border-r-2 border-border shadow-xl',
          // Desktop: Fixed positioning
          'md:fixed md:left-0 md:top-0 md:z-40 md:w-64 md:border-r md:shadow-none',
          collapsed && 'md:w-20'
        )}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-4 border-b-2 border-dewalt-yellow/20 md:border-b md:border-border">
          {!collapsed && (
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 group" 
              onClick={() => onClose?.()}
            >
              <div className="w-9 h-9 bg-dewalt-yellow rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <span className="text-xl font-bold">⚡</span>
              </div>
              <span className="text-lg font-bold text-text-primary">QuickQuote AI</span>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-dewalt-yellow rounded-lg flex items-center justify-center mx-auto">
              <span className="text-lg font-bold">⚡</span>
            </div>
          )}
          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden hover:bg-status-error/10 hover:text-status-error transition-colors"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Collapse Button - Desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-border rounded-full items-center justify-center hover:bg-dewalt-yellow/10 transition-colors',
            collapsed && 'rotate-180'
          )}
        >
          <ChevronLeft className="w-4 h-4 text-text-secondary" />
        </button>

        {/* Quick Stats - Mobile Only */}
        {!collapsed && (
          <div className="p-3 bg-gradient-to-r from-dewalt-yellow/10 to-transparent border-b border-border md:hidden">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-dewalt-yellow">3</div>
                <div className="text-[10px] text-text-tertiary">{t('common.projects')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-dewalt-yellow">12</div>
                <div className="text-[10px] text-text-tertiary">{t('common.estimates')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-dewalt-yellow">$690K</div>
                <div className="text-[10px] text-text-tertiary">{t('common.totalValue')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation with Sections */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {navSections.map((section, sectionIndex) => (
            <div key={section.titleKey} className="mb-6">
              {/* Section Title */}
              {!collapsed && (
                <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider px-3 mb-2">
                  {t(section.titleKey)}
                </h3>
              )}
              
              {/* Section Items */}
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  const globalIndex = sectionIndex * 10 + itemIndex
                  const itemName = t(item.nameKey)
                  
                  return (
                    <Link
                      key={item.nameKey}
                      href={item.comingSoon ? '#' : item.href}
                      onClick={(e) => {
                        if (item.comingSoon) {
                          e.preventDefault()
                          alert(t('common.comingSoon'))
                        } else {
                          onClose?.()
                        }
                      }}
                      data-tour={
                        item.href === '/estimator/deck' ? 'new-estimate' :
                        item.href === '/projects' ? 'projects' :
                        undefined
                      }
                      className={cn(
                        'flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                        'animate-in slide-in-from-left fade-in',
                        isActive
                          ? 'bg-dewalt-yellow text-dewalt-black font-semibold shadow-sm hover:shadow-md'
                          : item.comingSoon
                            ? 'text-text-tertiary hover:bg-background-tertiary cursor-not-allowed opacity-60'
                            : 'text-text-secondary hover:bg-background-secondary hover:text-text-primary',
                        collapsed && 'justify-center'
                      )}
                      style={{
                        animationDelay: `${globalIndex * 50}ms`,
                        animationDuration: '300ms',
                        animationFillMode: 'both'
                      }}
                      title={collapsed ? itemName : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn(
                          'w-5 h-5 flex-shrink-0 transition-transform',
                          isActive && 'scale-110'
                        )} />
                        {!collapsed && (
                          <span className="text-sm">{itemName}</span>
                        )}
                      </div>
                      
                      {/* Coming Soon Badge */}
                      {!collapsed && item.comingSoon && (
                        <span className="text-[10px] px-2 py-0.5 bg-dewalt-yellow/20 text-dewalt-yellow rounded-full font-semibold">
                          {t('common.soon')}
                        </span>
                      )}
                      
                      {/* Badge */}
                      {!collapsed && item.badge && (
                        <span className="text-xs px-2 py-0.5 bg-status-error text-white rounded-full font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
          
          {/* Settings at Bottom of Nav */}
          <div className="pt-3 border-t border-border">
            <Link
              href="/settings"
              onClick={() => onClose?.()}
              data-tour="settings"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                pathname === '/settings'
                  ? 'bg-dewalt-yellow text-dewalt-black font-semibold shadow-sm'
                  : 'text-text-secondary hover:bg-background-secondary hover:text-text-primary',
                collapsed && 'justify-center'
              )}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{t('navigation.settings')}</span>}
            </Link>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-3 border-t border-border">
          <div
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg bg-background-secondary mb-2',
              collapsed && 'justify-center'
            )}
          >
            <div className="w-8 h-8 bg-dewalt-yellow rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-dewalt-black" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">John Contractor</p>
                <p className="text-xs text-text-tertiary truncate">john@example.com</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={cn(
              'w-full justify-start text-status-error hover:text-status-error hover:bg-status-error/10',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="ml-2">{t('common.logout')}</span>}
          </Button>
        </div>
      </aside>

      {/* Spacer for fixed sidebar */}
      <div className={cn('hidden md:block transition-all duration-300', collapsed ? 'w-20' : 'w-64')} />
    </>
  )
}

