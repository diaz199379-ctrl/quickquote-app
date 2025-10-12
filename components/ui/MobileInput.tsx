'use client'

import { forwardRef, InputHTMLAttributes } from 'react'
import { Input } from './input'
import { Label } from './label'
import { cn } from '@/lib/utils/cn'

interface MobileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
  fullWidth?: boolean
}

/**
 * Mobile-optimized input with proper keyboard types and touch targets
 */
export const MobileInput = forwardRef<HTMLInputElement, MobileInputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      className,
      inputMode,
      type,
      fullWidth = true,
      ...props
    },
    ref
  ) => {
    // Automatically set input mode based on type
    const autoInputMode = inputMode || (
      type === 'number' ? 'decimal' :
      type === 'tel' ? 'tel' :
      type === 'email' ? 'email' :
      type === 'url' ? 'url' :
      'text'
    )

    return (
      <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
        {label && (
          <Label 
            htmlFor={props.id} 
            className="text-base font-medium touch-none"
          >
            {label}
          </Label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
              {icon}
            </div>
          )}
          
          <Input
            ref={ref}
            type={type}
            inputMode={autoInputMode}
            className={cn(
              // Larger touch target
              'h-12 text-base',
              // Padding for icon
              icon && 'pl-10',
              // Error state
              error && 'border-status-error focus:border-status-error focus:ring-status-error/20',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            {...props}
          />
        </div>

        {error && (
          <p 
            id={`${props.id}-error`}
            className="text-sm text-status-error font-medium"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p 
            id={`${props.id}-helper`}
            className="text-sm text-text-tertiary"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

MobileInput.displayName = 'MobileInput'

