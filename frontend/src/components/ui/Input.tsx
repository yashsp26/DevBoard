import { type ComponentPropsWithoutRef, useId } from 'react'
import { cn } from '../../utils/cn'

type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'id'> & {
  error?: string
  helperText?: string
  id?: string
  label: string
}

export function Input({ className, error, helperText, id, label, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <label className="grid gap-2 text-sm font-medium text-text" htmlFor={inputId}>
      {label}
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={cn(
          'neu-inset min-h-10 rounded-xl border border-transparent bg-[var(--color-surface-input)] px-3 text-sm text-text outline-none transition-[box-shadow,background-color] placeholder:text-muted/65 focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-55',
          error ? 'border-danger focus:ring-danger/20' : '',
          className,
        )}
        id={inputId}
        {...props}
      />
      {error && (
        <span className="text-sm font-normal text-danger" id={errorId}>
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="text-xs font-normal text-muted">{helperText}</span>
      )}
    </label>
  )
}
