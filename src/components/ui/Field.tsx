import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cx } from '@/utils/format'

/* ------------------------------------------------------------------ */
/*  Accessible form controls: label, error, hint wiring included.     */
/* ------------------------------------------------------------------ */

const controlBase =
  'w-full rounded-lg border bg-ink-850/80 px-3.5 py-2.5 text-sm text-white/90 placeholder:text-white/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-400/70 focus:border-accent-500/60 disabled:opacity-50'

function FieldShell({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium text-white/80">{label}</span>
        {optional && <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Optional</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-white/50">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-rose-400">
          {error}
        </p>
      )}
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  optional?: boolean
}

export function Input({ label, error, hint, optional, className, id: idProp, ...props }: InputProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cx(controlBase, error ? 'border-rose-500/50' : 'border-white/[0.09] hover:border-white/[0.16]', className)}
        {...props}
      />
    </FieldShell>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, className, id: idProp, ...props }: TextareaProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        className={cx(controlBase, 'min-h-28 resize-y', error ? 'border-rose-500/50' : 'border-white/[0.09] hover:border-white/[0.16]', className)}
        {...props}
      />
    </FieldShell>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  children: ReactNode
}

export function Select({ label, error, children, className, id: idProp, ...props }: SelectProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  return (
    <FieldShell id={id} label={label} error={error}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          className={cx(
            controlBase,
            'appearance-none pr-9',
            error ? 'border-rose-500/50' : 'border-white/[0.09] hover:border-white/[0.16]',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/50"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </FieldShell>
  )
}

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  name?: string
}

export function Checkbox({ label, className, id: idProp, ...props }: CheckboxProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  return (
    <div className={cx('flex items-start gap-2.5', className)}>
      <input
        type="checkbox"
        id={id}
        className="peer sr-only"
        {...props}
      />
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-white/70 transition-colors hover:text-white/90"
      >
        <span
          aria-hidden
          className="mt-[2px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border border-white/[0.18] bg-ink-850 transition-all duration-150 peer-checked:border-accent-500 peer-checked:bg-accent-500 peer-focus-visible:ring-2 peer-focus-visible:ring-accent-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink-950"
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-ink-950 opacity-0 transition-opacity peer-checked:opacity-100" fill="none" aria-hidden>
            <path d="m2.5 6 2.4 2.4L9.5 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>{label}</span>
      </label>
    </div>
  )
}

interface RadioCardProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  description?: string
  icon?: ReactNode
}

export function RadioCard({ label, description, icon, className, id: idProp, ...props }: RadioCardProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  return (
    <div className={cx('relative', className)}>
      <input type="radio" id={id} className="peer sr-only" {...props} />
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.09] bg-ink-850/60 p-4 transition-all duration-200 hover:border-white/[0.16] peer-checked:border-accent-500/70 peer-checked:bg-accent-500/[0.07] peer-focus-visible:ring-2 peer-focus-visible:ring-accent-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink-950"
      >
        {icon && <span className="mt-0.5 text-white/70 peer-checked:text-accent-300">{icon}</span>}
        <span className="flex-1">
          <span className="block text-sm font-medium text-white/90">{label}</span>
          {description && <span className="mt-0.5 block text-[13px] leading-snug text-white/50">{description}</span>}
        </span>
        <span
          aria-hidden
          className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-white/[0.2] transition-all duration-150 peer-checked:border-accent-500"
        >
          <span className="h-2.5 w-2.5 scale-0 rounded-full bg-accent-500 transition-transform duration-150 peer-checked:scale-100" />
        </span>
      </label>
    </div>
  )
}
