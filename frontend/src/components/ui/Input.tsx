import { type ComponentPropsWithoutRef, useId } from 'react'
import { cn } from '../../utils/cn'

type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'id'> & {
  error?: string
  id?: string
  label: string
}

export function Input({ className, error, id, label, ...props }: InputProps) {
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
          'min-h-10 rounded-lg border bg-app px-3 text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20',
          error ? 'border-danger' : 'border-border',
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
    </label>
  )
}
