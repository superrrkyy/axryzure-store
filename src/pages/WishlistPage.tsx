import { Link } from 'react-router-dom'
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { getProductById } from '@/data/products'
import { ProductCard } from '@/components/product/ProductCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button, buttonClasses } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'

/* /wishlist — saved products with bulk add-to-cart. */

export default function WishlistPage() {
  usePageTitle('Wishlist')
  const { wishlist, addToCart, pushToast } = useStore()
  const products = wishlist.map(getProductById).filter((p) => p !== undefined)

  const addAll = () => {
    products.forEach((p) => addToCart(p.id, 1, { silent: true }))
    pushToast({
      title: `${products.length} item${products.length === 1 ? '' : 's'} added to cart`,
      variant: 'success',
    })
  }

  return (
    <div className="container-x pb-24 pt-10 lg:pt-14">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <p className="eyebrow">Saved for later</p>
          <h1 className="mt-3 font-display text-display-md font-medium text-white">Wishlist</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-white/55">
            {products.length > 0
              ? `${products.length} product${products.length === 1 ? '' : 's'} waiting. Wishlist prices are locked to whatever the store says — we don’t do surge pricing.`
              : 'Nothing saved yet. Tap the heart on any product and it will wait for you here.'}
          </p>
        </div>
        {products.length > 0 && (
          <Button onClick={addAll}>
            <ShoppingBag size={15} aria-hidden /> Add all to cart
          </Button>
        )}
      </header>

      <div className="mt-10">
        {products.length === 0 ? (
          <EmptyState
            icon={<Heart size={22} aria-hidden />}
            title="Your wishlist is empty"
            description="Save the kits you’re considering, compare them side by side, then pull the trigger with confidence."
            action={
              <Link to="/shop" className={buttonClasses('primary', 'md')}>
                Browse the shop <ArrowRight size={15} aria-hidden />
              </Link>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
