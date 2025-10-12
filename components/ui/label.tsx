import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-semibold text-text-secondary mb-2 block',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-accent-orange ml-1">*</span>}
    </label>
  )
)
Label.displayName = 'Label'

export { Label }

