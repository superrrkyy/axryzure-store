import { Link } from 'react-router-dom'
import { ArrowRight, Check, ShoppingBag } from 'lucide-react'
import type { Product } from '@/types'
import { useStore } from '@/context/StoreContext'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { RatingInline } from '@/components/ui/Rating'
import { Price } from '@/components/ui/Price'
import { Badge } from '@/components/ui/Badge'
import { categoryName } from '@/utils/catalog'
import { ProductArt } from './ProductArt'

/* Quick preview modal launched from product cards. */

export function QuickPreview({
  product,
  onClose,
}: {
  product: Product | null
  onClose: () => void
}) {
  const { addToCart } = useStore()
  return (
    <Modal open={!!product} onClose={onClose} title={product ? product.name : ''} size="lg">
      {product && (
        <div className="grid gap-0 md:grid-cols-[1.15fr_1fr]">
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[380px]">
            <ProductArt product={product} className="absolute inset-0 h-full w-full" />
          </div>
          <div className="flex flex-col gap-4 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="outline">{categoryName(product.category)}</Badge>
              <Badge tone="outline">{product.type}</Badge>
              {product.availability === 'early-access' && <Badge tone="accent">Early access</Badge>}
            </div>
            <h3 className="font-display text-2xl font-medium text-white/95">{product.name}</h3>
            <RatingInline rating={product.rating} count={product.reviewCount} />
            <p className="text-sm leading-relaxed text-white/60">{product.shortDescription}</p>
            <ul className="space-y-2">
              {product.features.slice(0, 3).map((f) => (
                <li key={f} className="flex gap-2.5 text-[13px] text-white/65">
                  <Check size={14} className="mt-0.5 shrink-0 text-accent-400" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-auto space-y-4 border-t border-white/[0.07] pt-4">
              <div className="flex items-center justify-between">
                <Price product={product} size="lg" />
                <span className="font-mono text-[11px] text-white/50">v{product.version} · {product.formats[0]}</span>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Button
                  className="flex-1"
                  onClick={() => {
                    addToCart(product.id)
                    onClose()
                  }}
                >
                  <ShoppingBag size={15} aria-hidden /> Add to cart
                </Button>
                <Link to={`/product/${product.slug}`} className="flex-1" onClick={onClose}>
                  <Button variant="secondary" className="w-full">
                    Full details <ArrowRight size={15} aria-hidden />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
