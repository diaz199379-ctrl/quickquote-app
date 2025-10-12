'use client'

import { Phone } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils/cn'

interface ClickToCallProps {
  phoneNumber: string
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  children?: React.ReactNode
}

/**
 * Click-to-call button for mobile devices
 * Automatically formats phone numbers and opens phone dialer
 */
export function ClickToCall({
  phoneNumber,
  className,
  variant = 'ghost',
  size = 'sm',
  showIcon = true,
  children,
}: ClickToCallProps) {
  // Format phone number for display (e.g., (555) 123-4567)
  const formatPhoneDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone
  }

  // Format phone number for tel: link (e.g., +15551234567)
  const formatPhoneLink = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    return `tel:+1${cleaned}` // Assuming US numbers
  }

  // Check if device is mobile
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  // Don't render if phone number is empty or invalid
  if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
    return null
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn('gap-2', className)}
      asChild
    >
      <a href={formatPhoneLink(phoneNumber)} className="flex items-center gap-2">
        {showIcon && <Phone className="w-4 h-4" />}
        {children || formatPhoneDisplay(phoneNumber)}
      </a>
    </Button>
  )
}

