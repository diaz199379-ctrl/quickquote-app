/**
 * Standard Checkbox Component
 * 
 * Consistent checkbox styling used throughout QuickQuote AI
 * Features:
 * - DEWALT yellow when checked
 * - Hover effects with border color and scale
 * - Focus ring for accessibility
 * - Group hover support for labels
 */

import { cn } from '@/lib/utils/cn'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  containerClassName?: string
}

export function Checkbox({ 
  label, 
  description, 
  className, 
  containerClassName,
  ...props 
}: CheckboxProps) {
  return (
    <label className={cn(
      'flex items-center gap-3 cursor-pointer group select-none',
      props.disabled && 'cursor-not-allowed opacity-60',
      containerClassName
    )}>
      <input
        type="checkbox"
        className={cn(
          'w-5 h-5 rounded border-2 border-border-light bg-background-tertiary',
          'checked:bg-dewalt-yellow checked:border-dewalt-yellow',
          'focus:ring-3 focus:ring-dewalt-yellow/30',
          'transition-all cursor-pointer',
          'hover:border-dewalt-yellow hover:scale-110',
          'disabled:cursor-not-allowed disabled:opacity-40',
          className
        )}
        {...props}
      />
      {(label || description) && (
        <div>
          {label && (
            <span className={cn(
              'text-sm font-medium text-text-primary block group-hover:text-dewalt-yellow transition',
              props.disabled && 'group-hover:text-text-primary'
            )}>
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-text-tertiary block">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  )
}

/**
 * Usage Examples:
 * 
 * Basic checkbox:
 * <Checkbox 
 *   checked={value}
 *   onChange={(e) => setValue(e.target.checked)}
 *   label="Enable feature"
 * />
 * 
 * With description:
 * <Checkbox 
 *   checked={value}
 *   onChange={(e) => setValue(e.target.checked)}
 *   label="Include demolition"
 *   description="Remove existing materials before installation"
 * />
 * 
 * Inline (no label prop):
 * <label className="flex items-center gap-3 cursor-pointer group select-none">
 *   <Checkbox checked={value} onChange={(e) => setValue(e.target.checked)} />
 *   <span>Custom label with <strong>formatting</strong></span>
 * </label>
 * 
 * Standard inline styling (for manual use):
 * className="w-5 h-5 rounded border-2 border-border-light bg-background-tertiary checked:bg-dewalt-yellow checked:border-dewalt-yellow focus:ring-3 focus:ring-dewalt-yellow/30 transition-all cursor-pointer hover:border-dewalt-yellow hover:scale-110"
 */

