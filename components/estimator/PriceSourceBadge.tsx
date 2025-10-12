/**
 * Price Source Badge Component
 * Displays a visual badge indicating the price source
 */

import { Bot, User, Clock, Package } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PriceSourceBadgeProps {
  source: 'user_custom' | 'cached' | 'ai_estimate' | 'supplier_api'
  supplierName?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function PriceSourceBadge({ 
  source, 
  supplierName,
  size = 'md',
  showLabel = true 
}: PriceSourceBadgeProps) {
  const configs = {
    user_custom: {
      label: 'Your Price',
      icon: User,
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-500/30',
      tooltip: 'Your custom saved price'
    },
    ai_estimate: {
      label: 'AI Estimate',
      icon: Bot,
      bgColor: 'bg-dewalt-yellow/10',
      textColor: 'text-dewalt-yellow',
      borderColor: 'border-dewalt-yellow/30',
      tooltip: 'AI-powered market estimate based on current data'
    },
    cached: {
      label: 'Recent Price',
      icon: Clock,
      bgColor: 'bg-gray-500/10',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-500/30',
      tooltip: 'Recently fetched market price'
    },
    supplier_api: {
      label: supplierName || 'Supplier',
      icon: Package,
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-600',
      borderColor: 'border-green-500/30',
      tooltip: `Live price from ${supplierName || 'supplier'}`
    }
  }

  const config = configs[source]
  const Icon = config.icon

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold transition-all',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeClasses[size]
      )}
      title={config.tooltip}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{config.label}</span>}
    </div>
  )
}

/**
 * Usage:
 * <PriceSourceBadge source="ai_estimate" />
 * <PriceSourceBadge source="user_custom" size="lg" />
 * <PriceSourceBadge source="supplier_api" supplierName="Home Depot" />
 */

