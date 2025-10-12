import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-dewalt-yellow/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-dewalt-yellow text-dewalt-black hover:bg-dewalt-yellow-dark shadow-sm hover:shadow-md',
        secondary: 'bg-white text-text-primary border border-border hover:border-border-medium hover:bg-background-secondary shadow-sm',
        ghost: 'text-text-secondary hover:bg-background-secondary hover:text-text-primary',
        link: 'text-dewalt-yellow hover:text-dewalt-yellow-dark underline-offset-4 hover:underline p-0',
        destructive: 'bg-status-error text-white hover:bg-status-error/90 shadow-sm',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

