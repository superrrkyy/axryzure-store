import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cx } from '@/utils/format'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'gold'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-medium tracking-[-0.01em] whitespace-nowrap select-none transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-500 text-ink-950 hover:bg-accent-400 shadow-glow-sm hover:shadow-glow',
  secondary:
    'bg-white/[0.06] text-white/90 hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.16] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]',
  ghost: 'text-white/70 hover:text-white hover:bg-white/[0.06]',
  outline:
    'border border-white/[0.14] text-white/85 hover:border-accent-400/60 hover:text-white hover:bg-accent-500/[0.06]',
  gold: 'bg-gold-400 text-ink-950 hover:bg-gold-300 shadow-[0_4px_20px_-6px_rgba(228,203,134,0.35)]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[13px] rounded-lg',
  md: 'h-11 px-5 text-sm rounded-lg',
  lg: 'h-[52px] px-7 text-[15px] rounded-xl',
}

export const buttonClasses = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) =>
  cx(base, variants[variant], sizes[size], className)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={buttonClasses(variant, size, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden />}
      {children}
    </button>
  )
})
