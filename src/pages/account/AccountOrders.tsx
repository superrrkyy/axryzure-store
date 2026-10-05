import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Download, ReceiptText } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { getProductById } from '@/data/products'
import { formatDate, formatPrice, EASE, cx } from '@/utils/format'
import { downloadLicense, downloadReceipt } from '@/utils/licenses'
import { ProductArt } from '@/components/product/ProductArt'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button, buttonClasses } from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'

/* /account/orders — full order history with expandable rows. */

export default function AccountOrders() {
  const { orders } = useStore()
  const [expanded, setExpanded] = useState<string | null>(orders[0]?.id ?? null)

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<Package size={22} aria-hidden />}
        title="No orders yet"
        description="When you buy something, the order and its downloads live here forever."
        action={
          <Link to="/shop" className={buttonClasses('primary', 'md')}>
            Explore the shop
          </Link>
        }
      />
    )
  }

  return (
    <div>
      <h2 className="font-display text-xl text-white/95">Order history</h2>
      <ul className="mt-6 space-y-3">
        {orders.map((order) => {
          const open = expanded === order.id
          return (
            <li key={order.id} className="overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900/40">
              <button
                onClick={() => setExpanded(open ? null : order.id)}
                aria-expanded={open}
                aria-controls={`order-${order.id}`}
                className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left transition-colors hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-400"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-mono text-[13.5px] text-white/90">{order.number}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-white/50">
                      {formatDate(order.date)} · {order.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300">
                    Completed
                  </span>
                  <span className="font-mono text-[14px] text-white/85">{formatPrice(order.total)}</span>
                  <ChevronDown
                    size={15}
                    aria-hidden
                    className={cx('text-white/50 transition-transform duration-300', open && 'rotate-180')}
                  />
                </div>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={`order-${order.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/[0.07] p-5">
                      <ul className="divide-y divide-white/[0.06]">
                        {order.items.map((item) => {
                          const product = getProductById(item.productId)
                          return (
                            <li key={item.productId} className="flex items-center gap-4 py-3.5">
                              <Link
                                to={`/product/${item.slug}`}
                                className="h-14 w-[76px] shrink-0 overflow-hidden rounded-lg border border-white/[0.08]"
                                aria-label={item.name}
                              >
                                {product && <ProductArt product={product} className="h-full w-full" />}
                              </Link>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[14px] font-medium text-white/90">{item.name}</p>
                                <p className="mt-0.5 font-mono text-[11px] text-white/50">
                                  {item.qty} × {formatPrice(item.price)}
                                  {product && ` · v${product.version}`}
                                </p>
                              </div>
                              <button
                                onClick={() => product && downloadLicense(product, order)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.12] px-3 py-2 text-xs font-medium text-white/75 transition-colors hover:border-accent-500/50 hover:text-accent-300"
                                aria-label={`Download files for ${item.name}`}
                              >
                                <Download size={12} aria-hidden /> Files
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                        <p className="font-mono text-[12px] text-white/55">
                          Subtotal {formatPrice(order.subtotal)}
                          {order.discount > 0 && (
                            <>
                              {' · '}Discount −{formatPrice(order.discount)}
                              {order.promoCode && ` (${order.promoCode})`}
                            </>
                          )}
                          {' · '}Total <span className="text-white/80">{formatPrice(order.total)}</span>
                        </p>
                        <Button variant="ghost" size="sm" onClick={() => downloadReceipt(order)}>
                          <ReceiptText size={13} aria-hidden /> Receipt
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
