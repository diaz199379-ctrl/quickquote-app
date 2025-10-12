'use client'

import AIAssistant from '@/components/estimator/AIAssistant'
import { AIContext } from '@/types/ai'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function GlobalAIAssistant() {
  const pathname = usePathname()
  const [context, setContext] = useState<AIContext>({
    projectType: 'General',
    zipCode: '90210', // In a real app, get from user profile
  })

  // Update context based on current page
  useEffect(() => {
    if (pathname?.includes('/estimator/deck')) {
      setContext(prev => ({ ...prev, projectType: 'Deck' }))
    } else if (pathname?.includes('/projects')) {
      setContext(prev => ({ ...prev, projectType: 'Project Management' }))
    } else if (pathname?.includes('/estimates')) {
      setContext(prev => ({ ...prev, projectType: 'Estimate' }))
    } else {
      setContext(prev => ({ ...prev, projectType: 'General' }))
    }
  }, [pathname])

  return <AIAssistant context={context} />
}

