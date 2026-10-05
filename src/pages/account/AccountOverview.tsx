import { Link } from 'react-router-dom'
import { ArrowRight, Download, Package, Sparkles } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { getProductById } from '@/data/products'
import { formatDate, formatPrice } from '@/utils/format'
import { ProductArt } from '@/components/product/ProductArt'
import { buttonClasses } from '@/components/ui/Button'
import { downloadLicense } from '@/utils/licenses'

/* /account — profile overview with recent orders + quick downloads. */

export default function AccountOverview() {
  const { profile, orders, wishlist } = useStore()
  const recent = orders.slice(0, 2)
  const ownedProducts = Array.from(new Set(orders.flatMap((o) => o.items.map((i) => i.productId))))
    .map(getProductById)
    .filter((p) => p !== undefined)
  const savedTotal = wishlist.reduce((n, id) => n + (getProductById(id)?.price ?? 0), 0)

  return (
    <div className="space-y-10">
      {/* welcome */}
      <section aria-label="Profile" className="rounded-2xl border border-white/[0.08] bg-ink-900/50 p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-medium text-white/95">
              Welcome back, {profile.name.split(' ')[0]}.
            </h2>
            <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/55">
              {ownedProducts.length > 0
                ? `You own ${ownedProducts.length} product${ownedProducts.length === 1 ? '' : 's'} across ${orders.length} order${orders.length === 1 ? '' : 's'} — all with lifetime updates.`
                : 'Your library is waiting. Every purchase lands here with downloads and license keys.'}
            </p>
          </div>
          <Link to="/shop" className={buttonClasses('secondary', 'sm')}>
            <Sparkles size={14} aria-hidden /> New this season
          </Link>
        </div>
        <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-white/[0.07] pt-6 sm:grid-cols-4">
          {[
            ['Member since', 'Mar 2026'],
            ['Products owned', String(ownedProducts.length)],
            ['Wishlist value', formatPrice(savedTotal)],
            ['Update policy', 'Lifetime'],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">{label}</dt>
              <dd className="mt-1.5 text-[15px] font-medium text-white/85">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* recent orders */}
      <section aria-label="Recent orders">
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2.5 font-display text-xl text-white/95">
            <Package size={17} className="text-accent-300" aria-hidden /> Recent orders
          </h2>
          <Link to="/account/orders" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-300 transition-colors hover:text-accent-200">
            View all <ArrowRight size={13} aria-hidden />
          </Link>
        </div>
        <ul className="mt-5 space-y-3">
          {recent.map((order) => (
            <li key={order.id} className="rounded-2xl border border-white/[0.07] bg-ink-900/40 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[13px] text-white/85">{order.number}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-white/50">
                    {formatDate(order.date)} · {order.items.length} item{order.items.length === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300">
                    Completed
                  </span>
                  <span className="font-mono text-[14px] text-white/85">{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {order.items.map((item) => {
                  const product = getProductById(item.productId)
                  return product ? (
                    <Link
                      key={item.productId}
                      to={`/product/${product.slug}`}
                      className="h-12 w-16 overflow-hidden rounded-lg border border-white/[0.08] transition-transform hover:-translate-y-0.5"
                      aria-label={product.name}
                    >
                      <ProductArt product={product} className="h-full w-full" />
                    </Link>
                  ) : null
                })}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* quick downloads */}
      <section aria-label="Latest downloads">
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2.5 font-display text-xl text-white/95">
            <Download size={17} className="text-accent-300" aria-hidden /> Your library
          </h2>
          <Link to="/account/downloads" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-300 transition-colors hover:text-accent-200">
            All downloads <ArrowRight size={13} aria-hidden />
          </Link>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {ownedProducts.slice(0, 4).map((product) => {
            const order = orders.find((o) => o.items.some((i) => i.productId === product.id))
            return (
              <li
                key={product.id}
                className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-ink-900/40 p-4"
              >
                <span className="h-14 w-[72px] shrink-0 overflow-hidden rounded-lg border border-white/[0.07]">
                  <ProductArt product={product} className="h-full w-full" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium text-white/90">{product.name}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-white/50">v{product.version} · {product.fileSize}</p>
                </div>
                {order && (
                  <button
                    onClick={() => downloadLicense(product, order)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-accent-500 hover:text-ink-950"
                    aria-label={`Download ${product.name}`}
                  >
                    <Download size={12} aria-hidden /> Files
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
