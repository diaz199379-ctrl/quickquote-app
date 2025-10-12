import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  subtitle?: string
  className?: string
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  subtitle,
  className 
}: StatsCardProps) {
  return (
    <Card className={cn(
      'p-4 hover:shadow-card-hover hover:border-border transition-all duration-200 cursor-pointer active:scale-[0.99]',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <p className="text-2xl font-bold text-text-primary mb-1">{value}</p>
          
          {trend && (
            <div className="flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-status-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-status-error" />
              )}
              <span className={cn(
                'text-xs font-semibold',
                trend.isPositive ? 'text-status-success' : 'text-status-error'
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              {subtitle && (
                <span className="text-xs text-text-tertiary ml-1">{subtitle}</span>
              )}
            </div>
          )}
          
          {!trend && subtitle && (
            <p className="text-xs text-text-tertiary">{subtitle}</p>
          )}
        </div>
        
        <div className="w-12 h-12 bg-dewalt-yellow/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-dewalt-yellow" />
        </div>
      </div>
    </Card>
  )
}

