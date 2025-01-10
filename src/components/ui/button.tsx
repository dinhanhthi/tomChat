import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-primary/90 bg-primary text-primary-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'group h-8 w-8 shrink-0 hover:text-primary [&_svg]:size-4 [&_svg]:transition-transform [&_svg]:active:scale-90',
        iconBig:
          'group h-9 w-9 shrink-0 text-gray-500 hover:text-gray-600 hover:text-primary [&_svg]:size-5 [&_svg]:transition-transform [&_svg]:active:scale-90'
      },
      inSidebar: {
        true: 'hover:bg-gray-200/70'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, inSidebar, asChild = false, tooltip, tooltipPosition = 'right', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    const button = <Comp className={cn(buttonVariants({ variant, size, inSidebar, className }))} ref={ref} {...props} />

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === 'string') {
      tooltip = {
        children: tooltip
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={tooltipPosition} align="center" {...tooltip} />
      </Tooltip>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
