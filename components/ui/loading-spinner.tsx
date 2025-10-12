import { cn } from '@/lib/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
  fullScreen?: boolean
}

export function LoadingSpinner({ size = 'md', className, text, fullScreen }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  }

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', fullScreen && 'min-h-[400px]')}>
      <div
        className={cn('loading-spinner', sizeClasses[size], className)}
        style={{
          border: '3px solid rgba(255, 205, 0, 0.2)',
          borderTopColor: '#FFCD00',
        }}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="text-sm text-text-secondary font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    )
  }

  return spinner
}

