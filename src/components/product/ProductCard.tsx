import { memo, forwardRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Eye, ShoppingBag, Check } from 'lucide-react'
import type { Product } from '@/types'
import { useStore } from '@/context/StoreContext'
import { categoryName } from '@/utils/catalog'
import { formatCompact, EASE } from '@/utils/format'
import { ProductArt } from './ProductArt'
import { WishlistButton } from './WishlistButton'
import { ProductBadges } from '@/components/ui/Badge'
import { Stars } from '@/components/ui/Rating'
import { Price } from '@/components/ui/Price'

/* ------------------------------------------------------------------ */
/*  ProductCard — art, meta, price and actions. Art zooms on hover,    */
/*  quick preview slides up, wishlist pops. Forwards its ref so it     */
/*  can be measured by AnimatePresence popLayout.                      */
/* ------------------------------------------------------------------ */

interface ProductCardProps {
  product: Product
  index?: number
  onQuickPreview?: (product: Product) => void
}

function ProductCardImpl(
  { product, index = 0, onQuickPreview }: ProductCardProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const { addToCart, inCart } = useStore()
  const [added, setAdded] = useState(false)
  const reduce = useReducedMotion()
  const inCartNow = inCart(product.id)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product.id)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <motion.article
      ref={ref}
      layout="position"
      initial={reduce ? false : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.3), ease: EASE }}
      className="product-card group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-ink-850 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:shadow-card focus-within:border-white/[0.14]"
    >
      {/* art */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link
          to={`/product/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="block h-full w-full focus-visible:outline-none"
          tabIndex={-1}
        >
          <div className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]">
            <ProductArt product={product} className="h-full w-full" />
          </div>
        </Link>
        <div className="pointer-events-none absolute left-3 top-3">
          <ProductBadges product={product} />
        </div>
        <div className="absolute right-3 top-3">
          <WishlistButton productId={product.id} />
        </div>

        {/* quick preview — slides up on hover, always visible on touch */}
        {onQuickPreview && (
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                onQuickPreview(product)
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.14] bg-ink-950/75 py-2.5 text-[13px] font-medium text-white/85 backdrop-blur-md transition-colors hover:bg-ink-950/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              aria-label={`Quick preview of ${product.name}`}
            >
              <Eye size={14} aria-hidden /> Quick preview
            </button>
          </div>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-accent-300/80">
            {categoryName(product.category)}
          </p>
          <span className="font-mono text-[10.5px] text-white/50">{formatCompact(product.sales)} sold</span>
        </div>

        <h3 className="font-display text-[19px] font-medium leading-snug text-white/95">
          <Link
            to={`/product/${product.slug}`}
            className="transition-colors hover:text-accent-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 rounded-sm"
          >
            {product.name}
          </Link>
        </h3>

        <p className="line-clamp-2 text-[13px] leading-relaxed text-white/50">{product.shortDescription}</p>

        <div className="flex items-center gap-2.5">
          <Stars rating={product.rating} size={13} />
          <span className="font-mono text-xs text-white/60">
            {product.rating.toFixed(1)}
            <span className="text-white/50"> ({product.reviewCount})</span>
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
          <Price product={product} />
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className={
              'inline-flex h-10 items-center gap-2 rounded-lg px-4 text-[13px] font-medium transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 ' +
              (added || inCartNow
                ? 'bg-emerald-400/15 text-emerald-300'
                : 'bg-white/[0.06] text-white/85 hover:bg-accent-500 hover:text-ink-950')
            }
          >
            {added || inCartNow ? (
              <>
                <Check size={14} aria-hidden /> {added ? 'Added' : 'In cart'}
              </>
            ) : (
              <>
                <ShoppingBag size={14} aria-hidden /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export const ProductCard = memo(forwardRef(ProductCardImpl))
