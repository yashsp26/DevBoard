import { type ComponentPropsWithoutRef, useId } from 'react'
import { cn } from '../../utils/cn'

type TextareaProps = Omit<ComponentPropsWithoutRef<'textarea'>, 'id'> & {
  error?: string
  id?: string
  label: string
}

export function Textarea({ className, error, id, label, ...props }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const errorId = `${textareaId}-error`

  return (
    <label className="grid gap-2 text-sm font-medium text-text" htmlFor={textareaId}>
      {label}
      <textarea
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={cn(
          'min-h-28 resize-y rounded-lg border bg-app px-3 py-2 text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20',
          error ? 'border-danger' : 'border-border',
          className,
        )}
        id={textareaId}
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
