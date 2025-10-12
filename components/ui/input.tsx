import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary transition-all',
            'placeholder:text-text-tertiary',
            'hover:border-border-medium',
            'focus:border-dewalt-yellow focus:outline-none focus:ring-4 focus:ring-dewalt-yellow/10',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-background-tertiary',
            error && 'border-status-error focus:border-status-error focus:ring-status-error/10',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-status-error">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }

