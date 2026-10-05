import { Star } from 'lucide-react'
import { cx } from '@/utils/format'

/* Star rating display. Filled stars use partial fill via a clipped overlay. */

export function Stars({
  rating,
  size = 14,
  className,
}: {
  rating: number
  size?: number
  className?: string
}) {
  const pct = (rating / 5) * 100
  return (
    <span
      className={cx('relative inline-flex shrink-0', className)}
      role="img"
      aria-label={`Rated ${rating} out of 5 stars`}
    >
      <span className="flex gap-[2px] text-white/20">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={size} fill="currentColor" strokeWidth={0} aria-hidden />
        ))}
      </span>
      <span
        className="absolute inset-0 flex gap-[2px] overflow-hidden text-gold-400"
        style={{ width: `${pct}%` }}
        aria-hidden
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={size} fill="currentColor" strokeWidth={0} className="shrink-0" />
        ))}
      </span>
    </span>
  )
}

export function RatingInline({
  rating,
  count,
  size = 14,
  className,
}: {
  rating: number
  count?: number
  size?: number
  className?: string
}) {
  return (
    <span className={cx('inline-flex items-center gap-2', className)}>
      <Stars rating={rating} size={size} />
      <span className="font-mono text-xs text-white/70">
        {rating.toFixed(1)}
        {count !== undefined && <span className="text-white/50"> ({count})</span>}
      </span>
    </span>
  )
}
