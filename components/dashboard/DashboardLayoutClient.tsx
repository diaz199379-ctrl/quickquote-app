'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import BottomNav from '@/components/dashboard/bottom-nav'
import GlobalAIAssistant from '@/components/dashboard/GlobalAIAssistant'
import { cn } from '@/lib/utils/cn'

interface DashboardLayoutClientProps {
  children: React.ReactNode
}

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const closeSidebar = () => {
    setIsMobileSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-background-secondary flex">
      {/* Mobile Sidebar Overlay - Click to close */}
      <div
        className={cn(
          'fixed inset-0 bg-dewalt-black/60 z-[45] md:hidden backdrop-blur-sm transition-opacity duration-300',
          isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeSidebar}
      />
      
      {/* Mobile Sidebar - Higher z-index to be above overlay */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-[50] w-72 md:hidden transform transition-all duration-300 ease-out shadow-2xl',
          isMobileSidebarOpen 
            ? 'translate-x-0 opacity-100' 
            : '-translate-x-full opacity-0'
        )}
      >
        <Sidebar onClose={closeSidebar} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar onClose={closeSidebar} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile only */}
      <BottomNav />

      {/* AI Assistant - Available throughout the app */}
      <GlobalAIAssistant />
    </div>
  )
}

