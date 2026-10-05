import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Trash2, BookmarkPlus, ShoppingBag, Lock, ArrowRight, Zap, Tag } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { getProductById } from '@/data/products'
import { formatPrice, EASE } from '@/utils/format'
import { ProductArt } from '@/components/product/ProductArt'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Button, buttonClasses } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { usePageTitle } from '@/hooks/usePageTitle'

/* /cart — full-page cart with saved items and order summary. */

export default function CartPage() {
  usePageTitle('Cart')
  const {
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
    applyPromo,
    removePromo,
  } = useStore()
  const navigate = useNavigate()
  const [code, setCode] = useState('')

  return (
    <div className="container-x pb-24 pt-10 lg:pt-14">
      <header className="max-w-xl">
        <p className="eyebrow">Almost there</p>
        <h1 className="mt-3 font-display text-display-md font-medium text-white">Your cart</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-white/55">
          Digital goods — no shipping, no waiting. Everything below is delivered instantly after checkout.
        </p>
      </header>

      {cartLines.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            icon={<ShoppingBag size={22} aria-hidden />}
            title="Your cart is empty"
            description="Browse the catalog and add something worth building with."
            action={
              <Link to="/shop" className={buttonClasses('primary', 'md')}>
                Explore products <ArrowRight size={15} aria-hidden />
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* lines */}
          <div>
            <ul className="divide-y divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-ink-900/40">
              <AnimatePresence initial={false}>
                {cartLines.map(({ product, qty }) => (
                  <motion.li
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 48 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="flex flex-col gap-5 p-6 sm:flex-row"
                  >
                    <Link
                      to={`/product/${product.slug}`}
                      className="h-32 w-full shrink-0 overflow-hidden rounded-xl border border-white/[0.08] sm:h-28 sm:w-40"
                      aria-label={product.name}
                    >
                      <ProductArt product={product} className="h-full w-full transition-transform duration-700 hover:scale-105" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h2 className="font-display text-lg font-medium text-white/95">
                            <Link to={`/product/${product.slug}`} className="transition-colors hover:text-accent-200">
                              {product.name}
                            </Link>
                          </h2>
                          <p className="mt-1 font-mono text-[11px] text-white/50">
                            {product.type} · v{product.version} · {product.fileSize}
                          </p>
                          <p className="mt-1 font-mono text-[11px] text-white/50">
                            {product.availability === 'early-access' ? 'Early access — weekly builds' : 'Instant download'}
                          </p>
                        </div>
                        <p className="shrink-0 font-mono text-base text-white/90">{formatPrice(product.price * qty)}</p>
                      </div>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4">
                        <QuantityStepper value={qty} onChange={(n) => updateQty(product.id, n)} label={product.name} />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => saveForLater(product.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:border-accent-500/40 hover:text-accent-300"
                          >
                            <BookmarkPlus size={13} aria-hidden /> Save for later
                          </button>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:border-rose-400/40 hover:text-rose-300"
                          >
                            <Trash2 size={13} aria-hidden /> Remove
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
              <section aria-label="Saved for later" className="mt-10">
                <h2 className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/50">
                  Saved for later ({saved.length})
                </h2>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                  {saved.map((id) => {
                    const product = getProductById(id)
                    if (!product) return null
                    return (
                      <li key={id} className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-ink-900/40 p-4">
                        <span className="h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-white/[0.07]">
                          <ProductArt product={product} className="h-full w-full" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white/90">{product.name}</p>
                          <p className="mt-0.5 font-mono text-xs text-white/55">{formatPrice(product.price)}</p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => moveToCart(id)}
                            className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-accent-500 hover:text-ink-950"
                          >
                            Move to cart
                          </button>
                          <button
                            onClick={() => removeSaved(id)}
                            className="rounded-lg px-3 py-1.5 text-xs text-white/50 transition-colors hover:text-rose-300"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )}
          </div>

          {/* summary */}
          <aside className="h-fit rounded-2xl border border-white/[0.08] bg-ink-900/60 p-6 lg:sticky lg:top-32" aria-label="Order summary">
            <h2 className="font-display text-xl text-white/95">Summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-white/60">
                <dt>Subtotal</dt>
                <dd className="font-mono">{formatPrice(subtotal)}</dd>
              </div>
              {promo && discount > 0 ? (
                <div className="flex items-center justify-between text-accent-300">
                  <dt className="flex items-center gap-1.5">
                    <Tag size={12} aria-hidden /> {promo.code} ({promo.percent}%)
                    <button onClick={removePromo} aria-label="Remove promo code" className="text-white/50 hover:text-rose-300">
                      ×
                    </button>
                  </dt>
                  <dd className="font-mono">−{formatPrice(discount)}</dd>
                </div>
              ) : (
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    const result = applyPromo(code)
                    if (result.ok) setCode('')
                  }}
                >
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Promo code (try WELCOME10)"
                    aria-label="Promo code"
                    className="w-full rounded-lg border border-white/[0.1] bg-ink-850 px-3 py-2 text-[13px] uppercase tracking-wider text-white/85 placeholder:normal-case placeholder:tracking-normal placeholder:text-white/50 focus:border-accent-500/60 focus:outline-none"
                  />
                  <Button variant="secondary" size="sm" type="submit">Apply</Button>
                </form>
              )}
              <div className="flex justify-between border-t border-white/[0.08] pt-3.5 text-lg text-white">
                <dt className="font-medium">Total</dt>
                <dd className="font-mono font-medium">{formatPrice(total)}</dd>
              </div>
            </dl>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
              VAT included where applicable
            </p>
            <Button size="lg" className="mt-6 w-full" onClick={() => navigate('/checkout')}>
              <Lock size={15} aria-hidden /> Secure checkout
            </Button>
            <Link to="/shop" className="mt-3 block text-center text-[13px] font-medium text-white/55 transition-colors hover:text-white">
              Continue shopping
            </Link>
            <p className="mt-5 flex items-center justify-center gap-1.5 border-t border-white/[0.07] pt-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
              <Zap size={11} aria-hidden /> Instant delivery · Lifetime updates
            </p>
          </aside>
        </div>
      )}
    </div>
  )
}
