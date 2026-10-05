import type { CoreProduct } from '@/types'
import { cx, formatPrice } from '@/utils/format'

/* Price display with optional struck-through original. */

export function Price({
  product,
  size = 'md',
  className,
}: {
  product: CoreProduct
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  }
  return (
    <span className={cx('inline-flex items-baseline gap-2 font-mono', sizes[size], className)}>
      <span className="font-medium text-white">{formatPrice(product.price)}</span>
      {product.originalPrice && (
        <span className="text-sm text-white/50 line-through" aria-label={`reduced from ${formatPrice(product.originalPrice)}`}>
          {formatPrice(product.originalPrice)}
        </span>
      )}
    </span>
  )
}
