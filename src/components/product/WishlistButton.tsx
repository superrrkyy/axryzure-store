import { motion, useReducedMotion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { cx } from '@/utils/format'

/* Heart toggle with a little pop when saving. */

export function WishlistButton({
  productId,
  variant = 'floating',
  className,
}: {
  productId: string
  variant?: 'floating' | 'solid'
  className?: string
}) {
  const { isWishlisted, toggleWishlist } = useStore()
  const active = isWishlisted(productId)
  const reduce = useReducedMotion()

  const floating = variant === 'floating'
  return (
    <motion.button
      type="button"
      whileTap={reduce ? undefined : { scale: 0.82 }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(productId)
      }}
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Save to wishlist'}
      className={cx(
        'group/wish relative flex items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400',
        floating
          ? 'h-9 w-9 rounded-full border border-white/[0.1] bg-ink-950/60 backdrop-blur-md hover:border-white/[0.24]'
          : 'rounded-lg border border-white/[0.12] px-4 h-11 gap-2 text-sm text-white/80 hover:border-rose-400/40 hover:text-rose-300',
        className,
      )}
    >
      <motion.span
        key={String(active)}
        initial={reduce ? false : { scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        className="flex"
      >
        <Heart
          size={floating ? 15 : 16}
          className={cx(
            'transition-colors duration-200',
            active ? 'fill-rose-400 text-rose-400' : floating ? 'text-white/70 group-hover/wish:text-white' : '',
          )}
          aria-hidden
        />
      </motion.span>
      {!floating && <span>{active ? 'Saved' : 'Wishlist'}</span>}
      {active && !reduce && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full border border-rose-400/60"
          initial={{ scale: 0.8, opacity: 0.9 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
          aria-hidden
        />
      )}
    </motion.button>
  )
}
