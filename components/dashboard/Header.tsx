'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Search, Bell, Menu, User, Settings, LogOut, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useI18n } from '@/lib/i18n/context'

interface HeaderProps {
  onMobileMenuToggle?: () => void
}

interface Notification {
  id: number
  titleKey: string
  timeKey: string
  unread: boolean
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const pathname = usePathname()
  const { t } = useI18n()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, titleKey: 'header.notifications.estimateApproved', timeKey: 'common.time.fiveMinAgo', unread: true },
    { id: 2, titleKey: 'header.notifications.deadlineApproaching', timeKey: 'common.time.twoHoursAgo', unread: true },
    { id: 3, titleKey: 'header.notifications.pricesUpdated', timeKey: 'common.time.oneDayAgo', unread: false },
  ])

  const unreadCount = notifications.filter(n => n.unread).length
  const isSettingsPage = pathname === '/settings'

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    )
  }

  const handleLogout = async () => {
    // In a real app, handle Supabase logout
    console.log('Logging out...')
    window.location.href = '/login'
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left: Mobile Menu + Search */}
        <div className="flex items-center gap-3 flex-1">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMobileMenuToggle}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Mobile Logo */}
          <Link href="/dashboard" className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-dewalt-yellow rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold">⚡</span>
            </div>
          </Link>

          {/* Search Bar - Hidden on Settings page */}
          {!isSettingsPage && (
            <div className="hidden sm:flex flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <Input
                type="search"
                placeholder={t('header.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          )}
        </div>

        {/* Right: Language + AI + Notifications + User Menu */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* AI Assistant */}
          <Button
            variant="ghost"
            size="sm"
            data-tour="ai-assistant"
            onClick={() => alert(t('ai.assistant') + ' ' + t('common.comingSoon'))}
            className="relative hover:bg-dewalt-yellow/10"
            title={t('ai.assistant')}
          >
            <Sparkles className="w-5 h-5 text-dewalt-yellow" />
          </Button>
          
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowUserMenu(false)
              }}
              className="relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-status-error text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-border z-50">
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-text-primary">{t('header.notifications.title')}</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs text-text-tertiary">{t('header.notifications.unread', { count: unreadCount })}</span>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-text-tertiary text-sm">
                        {t('header.notifications.none')}
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            'relative p-4 border-b border-border-light hover:bg-background-secondary cursor-pointer transition-colors group',
                            notification.unread && 'bg-dewalt-yellow/5'
                          )}
                          onClick={() => {
                            markAsRead(notification.id)
                            // Auto-dismiss after marking as read
                            setTimeout(() => dismissNotification(notification.id), 2000)
                          }}
                          onMouseEnter={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3 pr-6">
                            {notification.unread && (
                              <span className="w-2 h-2 bg-dewalt-yellow rounded-full mt-1.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-text-primary">{t(notification.titleKey)}</p>
                              <p className="text-xs text-text-tertiary mt-1">{t(notification.timeKey)}</p>
                            </div>
                          </div>
                          {/* Dismiss X button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              dismissNotification(notification.id)
                            }}
                            className="absolute top-4 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-text-tertiary hover:text-status-error"
                            title={t('header.notifications.dismiss')}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-border">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => setNotifications([])}
                    >
                      {t('header.notifications.clearAll')}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu)
                setShowNotifications(false)
              }}
              className="flex items-center gap-2 hover:bg-background-secondary rounded-lg px-2 py-1.5 transition-colors"
            >
              <div className="w-8 h-8 bg-dewalt-yellow rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-dewalt-black" />
              </div>
              <span className="hidden md:block text-sm font-medium text-text-primary">John C.</span>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-border z-50">
                  <div className="p-4 border-b border-border">
                    <p className="font-semibold text-text-primary">John Contractor</p>
                    <p className="text-xs text-text-tertiary mt-1">john@example.com</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background-secondary text-text-secondary hover:text-text-primary transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">{t('navigation.settings')}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-status-error/10 text-status-error transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">{t('common.logout')}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search - Hidden on Settings page */}
      {!isSettingsPage && (
        <div className="sm:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <Input
              type="search"
              placeholder={t('header.searchShort')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
      )}
    </header>
  )
}

