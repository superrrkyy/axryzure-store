import { AnimatePresence } from 'framer-motion'
import type { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'

/* Staggered product grid with animated filter transitions. */

export function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  onQuickPreview,
  className = 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
}: {
  products: Product[]
  loading?: boolean
  skeletonCount?: number
  onQuickPreview?: (product: Product) => void
  className?: string
}) {
  if (loading) return <ProductGridSkeleton count={skeletonCount} />
  return (
    <div className={className} aria-label={`${products.length} products`}>
      <AnimatePresence mode="popLayout">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} onQuickPreview={onQuickPreview} />
        ))}
      </AnimatePresence>
    </div>
  )
}
