'use client'

import { Button, ButtonProps } from './button'
import { LoadingSpinner } from './loading-spinner'
import { cn } from '@/lib/utils/cn'

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
  loadingText?: string
}

export function LoadingButton({
  loading,
  loadingText,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      className={cn(className, loading && 'cursor-wait')}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" className="!w-4 !h-4" />
          <span>{loadingText || children}</span>
        </div>
      ) : (
        children
      )}
    </Button>
  )
}

