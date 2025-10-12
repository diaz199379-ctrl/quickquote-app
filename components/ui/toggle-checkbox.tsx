/**
 * Toggle Checkbox Component - Deck Estimator Style
 * 
 * Large button-style checkbox with circular checkmark indicator
 * Used for yes/no toggles throughout the app
 */

import { cn } from '@/lib/utils/cn'
import { Check } from 'lucide-react'

interface ToggleCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  className?: string
  disabled?: boolean
}

export function ToggleCheckbox({
  checked,
  onChange,
  label,
  description,
  className,
  disabled = false
}: ToggleCheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-lg border-2 transition-all select-none active:scale-95',
        checked
          ? 'border-dewalt-yellow bg-dewalt-yellow text-dewalt-black shadow-sm'
          : 'border-border bg-white text-text-primary hover:border-border-medium hover:bg-background-secondary',
        disabled && 'opacity-50 cursor-not-allowed hover:border-border hover:bg-white',
        className
      )}
    >
      <div className={cn(
        'w-5 h-5 rounded-full flex items-center justify-center transition-all flex-shrink-0',
        checked ? 'bg-dewalt-black' : 'bg-background-tertiary'
      )}>
        {checked && (
          <Check className="w-4 h-4 text-dewalt-yellow" strokeWidth={3} />
        )}
      </div>
      <div className="text-left">
        <span className="text-sm font-semibold block">{label}</span>
        {description && (
          <span className={cn(
            'text-xs block mt-0.5',
            checked ? 'text-dewalt-black/70' : 'text-text-tertiary'
          )}>
            {description}
          </span>
        )}
      </div>
    </button>
  )
}

/**
 * Usage Example:
 * 
 * <ToggleCheckbox 
 *   checked={hasBacksplash}
 *   onChange={setHasBacksplash}
 *   label="Include Backsplash"
 *   description="Add tile backsplash to kitchen"
 * />
 */

