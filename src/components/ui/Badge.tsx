import type { ReactNode } from 'react'
import { Sparkles, Flame, Award } from 'lucide-react'
import type { CoreProduct } from '@/types'
import { cx } from '@/utils/format'

/* Product/status badges used on cards, product pages and filters. */

export function Badge({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode
  tone?: 'default' | 'accent' | 'gold' | 'sale' | 'new' | 'outline'
  className?: string
}) {
  const tones = {
    default: 'bg-white/[0.07] text-white/75 border-white/[0.08]',
    accent: 'bg-accent-500/15 text-accent-300 border-accent-500/25',
    gold: 'bg-gold-400/15 text-gold-300 border-gold-400/25',
    sale: 'bg-rose-400/15 text-rose-300 border-rose-400/25',
    new: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/25',
    outline: 'bg-transparent text-white/60 border-white/[0.14]',
  }
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function ProductBadges({ product, className }: { product: CoreProduct; className?: string }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null
  return (
    <div className={cx('flex flex-wrap items-center gap-1.5', className)}>
      {discount !== null && (
        <Badge tone="sale">
          <Sparkles size={10} aria-hidden /> −{discount}%
        </Badge>
      )}
      {product.badge === 'bestseller' && (
        <Badge tone="gold">
          <Award size={10} aria-hidden /> Bestseller
        </Badge>
      )}
      {product.badge === 'new' && <Badge tone="new">New</Badge>}
      {product.badge === 'limited' && (
        <Badge tone="accent">
          <Flame size={10} aria-hidden /> Limited
        </Badge>
      )}
    </div>
  )
}
