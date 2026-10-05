import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Trash2, BookmarkPlus, ShoppingBag, Lock, ArrowRight, Zap } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { formatPrice, EASE } from '@/utils/format'
import { ProductArt } from '@/components/product/ProductArt'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { getProductById } from '@/data/products'

/* Slide-out cart drawer with saved-for-later and promo summary. */

export function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    cartLines,
    saved,
    updateQty,
    removeFromCart,
    saveForLater,
    moveToCart,
    removeSaved,
    subtotal,
    discount,
    total,
    promo,
    cartCount,
  } = useStore()
  const navigate = useNavigate()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!cartOpen) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => closeRef.current?.focus(), 80)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCartOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
  }, [cartOpen, setCartOpen])

  const goCheckout = () => {
    setCartOpen(false)
    navigate('/checkout')
  }

  return createPortal(
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-[75]" role="dialog" aria-modal="true" aria-label="Shopping cart">
          <motion.div
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setCartOpen(false)}
            aria-hidden
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.42, ease: EASE }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/[0.09] bg-ink-900 shadow-pop"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
              <h2 className="flex items-center gap-2.5 font-display text-xl text-white/95">
                Your cart
                {cartCount > 0 && (
                  <span className="rounded-full bg-accent-500/15 px-2.5 py-0.5 font-mono text-[11px] text-accent-300">
                    {cartCount}
                  </span>
                )}
              </h2>
              <button
                ref={closeRef}
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                <X size={16} aria-hidden />
              </button>
            </div>

            {/* body */}
            {cartLines.length === 0 ? (
              <div className="flex flex-1 items-center justify-center p-6">
                <EmptyState
                  icon={<ShoppingBag size={22} aria-hidden />}
                  title="Your cart is empty"
                  description="Digital goods, zero shipping. Add a kit, a template or an icon family and it’s yours forever."
                  action={
                    <Button onClick={() => { setCartOpen(false); navigate('/shop') }}>
                      Browse the shop <ArrowRight size={15} aria-hidden />
                    </Button>
                  }
                />
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <ul className="divide-y divide-white/[0.06]">
                    <AnimatePresence initial={false}>
                      {cartLines.map(({ product, qty }) => (
                        <motion.li
                          key={product.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          transition={{ duration: 0.28, ease: EASE }}
                          className="flex gap-4 py-4"
                        >
                          <Link
                            to={`/product/${product.slug}`}
                            onClick={() => setCartOpen(false)}
                            className="h-[72px] w-24 shrink-0 overflow-hidden rounded-lg border border-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                            aria-label={product.name}
                          >
                            <ProductArt product={product} className="h-full w-full" />
                          </Link>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-medium text-white/90">{product.name}</h3>
                                <p className="mt-0.5 font-mono text-[11px] text-white/50">
                                  {product.type} · v{product.version}
                                </p>
                              </div>
                              <p className="shrink-0 font-mono text-sm text-white/85">
                                {formatPrice(product.price * qty)}
                              </p>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <QuantityStepper
                                value={qty}
                                onChange={(n) => updateQty(product.id, n)}
                                label={product.name}
                              />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => saveForLater(product.id)}
                                  aria-label={`Save ${product.name} for later`}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/[0.06] hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                                >
                                  <BookmarkPlus size={14} aria-hidden />
                                </button>
                                <button
                                  onClick={() => removeFromCart(product.id)}
                                  aria-label={`Remove ${product.name} from cart`}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/[0.06] hover:text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                                >
                                  <Trash2 size={14} aria-hidden />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  {/* saved for later */}
                  {saved.length > 0 && (
                    <div className="mt-6">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                        Saved for later ({saved.length})
                      </p>
                      <ul className="mt-3 space-y-3">
                        {saved.map((id) => {
                          const product = getProductById(id)
                          if (!product) return null
                          return (
                            <li key={id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-ink-850/60 p-3">
                              <span className="h-11 w-14 shrink-0 overflow-hidden rounded-md border border-white/[0.06]">
                                <ProductArt product={product} className="h-full w-full" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[13px] font-medium text-white/85">{product.name}</p>
                                <p className="font-mono text-xs text-white/55">{formatPrice(product.price)}</p>
                              </div>
                              <button
                                onClick={() => moveToCart(id)}
                                className="rounded-lg border border-white/[0.12] px-3 py-1.5 text-xs font-medium text-white/75 transition-colors hover:border-accent-500/50 hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                              >
                                Move to cart
                              </button>
                              <button
                                onClick={() => removeSaved(id)}
                                aria-label={`Remove ${product.name} from saved items`}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:text-rose-400"
                              >
                                <Trash2 size={13} aria-hidden />
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>

                {/* summary */}
                <div className="border-t border-white/[0.08] bg-ink-850/50 px-6 py-5">
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/60">
                      <dt>Subtotal</dt>
                      <dd className="font-mono">{formatPrice(subtotal)}</dd>
                    </div>
                    {promo && discount > 0 && (
                      <div className="flex justify-between text-accent-300">
                        <dt>Promo · {promo.code}</dt>
                        <dd className="font-mono">−{formatPrice(discount)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-white/[0.07] pt-2.5 text-base text-white">
                      <dt className="font-medium">Total</dt>
                      <dd className="font-mono font-medium">{formatPrice(total)}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 space-y-2.5">
                    <Button className="w-full" size="lg" onClick={goCheckout}>
                      <Lock size={15} aria-hidden /> Secure checkout
                    </Button>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="w-full rounded-lg py-2 text-center text-[13px] font-medium text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 rounded-lg"
                    >
                      Continue shopping
                    </button>
                  </div>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                    <Zap size={11} aria-hidden /> Instant delivery after purchase
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
