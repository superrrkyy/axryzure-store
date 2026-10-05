import { Link } from 'react-router-dom'
import { Heart, ArrowRight } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { getProductById } from '@/data/products'
import { ProductCard } from '@/components/product/ProductCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { buttonClasses } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'

/* /account/wishlist — wishlist embedded in the account area. */

export default function AccountWishlist() {
  usePageTitle('Saved products')
  const { wishlist } = useStore()
  const products = wishlist.map(getProductById).filter((p) => p !== undefined)

  return (
    <div>
      <h2 className="font-display text-xl text-white/95">Saved products</h2>
      <p className="mt-2 text-[14px] text-white/50">
        {products.length > 0
          ? `${products.length} product${products.length === 1 ? '' : 's'} you’re considering.`
          : 'Save products with the heart button and they’ll wait for you here.'}
      </p>
      <div className="mt-6">
        {products.length === 0 ? (
          <EmptyState
            icon={<Heart size={22} aria-hidden />}
            title="Nothing saved"
            description="Tap the heart on any product to keep it here for later."
            action={
              <Link to="/shop" className={buttonClasses('primary', 'md')}>
                Browse the shop <ArrowRight size={15} aria-hidden />
              </Link>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
