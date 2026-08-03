import { motion, type HTMLMotionProps } from 'motion/react'
import { type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Spinner } from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type ButtonProps = HTMLMotionProps<'button'> & {
  children?: ReactNode
  isLoading?: boolean
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-accent-foreground shadow-sm shadow-primary/20 hover:bg-primary/90',
  secondary: 'bg-elevated text-text ring-1 ring-border hover:bg-hover',
  ghost: 'text-muted hover:bg-elevated hover:text-text',
  danger: 'bg-danger text-accent-foreground shadow-sm shadow-danger/20 hover:bg-danger/90',
}

export function Button({
  children,
  className,
  disabled,
  isLoading = false,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={cn(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        className,
      )}
      disabled={disabled || isLoading}
      transition={{ duration: 0.12 }}
      type={type}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {isLoading && <Spinner className="size-4" label="Loading" />}
      {children}
    </motion.button>
  )
}
