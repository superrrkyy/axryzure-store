import { Link } from 'react-router-dom'
import { Download, Copy, PackageOpen, ArrowUpRight } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { getProductById } from '@/data/products'
import { formatDate } from '@/utils/format'
import { licenseKey, downloadLicense } from '@/utils/licenses'
import { ProductArt } from '@/components/product/ProductArt'
import { Button, buttonClasses } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { usePageTitle } from '@/hooks/usePageTitle'

/* /account/downloads — owned products with license keys + updates. */

export default function AccountDownloads() {
  usePageTitle('Downloads')
  const { orders, pushToast } = useStore()

  const owned = orders
    .flatMap((order) =>
      order.items.map((item) => {
        const product = getProductById(item.productId)
        return product ? { product, order, purchased: order.date } : null
      }),
    )
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .filter((x, i, arr) => arr.findIndex((y) => y.product.id === x.product.id) === i) // newest purchase wins
    .sort((a, b) => +new Date(b.purchased) - +new Date(a.purchased))

  if (owned.length === 0) {
    return (
      <EmptyState
        icon={<PackageOpen size={22} aria-hidden />}
        title="Your library is empty"
        description="Products you purchase appear here with download links, license keys and version history."
        action={
          <Link to="/shop" className={buttonClasses('primary', 'md')}>
            Explore the shop
          </Link>
        }
      />
    )
  }

  const copyKey = (key: string) => {
    navigator.clipboard
      .writeText(`AXZ-${key}`)
      .then(() => pushToast({ title: 'License key copied', variant: 'success' }))
      .catch(() => pushToast({ title: `AXZ-${key}`, variant: 'info' }))
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl text-white/95">Downloads &amp; licenses</h2>
          <p className="mt-2 text-[14px] text-white/50">
            {owned.length} product{owned.length === 1 ? '' : 's'} · lifetime updates included on all of them.
          </p>
        </div>
      </div>

      <ul className="mt-6 grid gap-4 xl:grid-cols-2">
        {owned.map(({ product, order, purchased }) => {
          const key = licenseKey(product.slug, order.number)
          const hasUpdate = product.updatedAt > order.date
          return (
            <li
              key={product.id}
              className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-ink-900/40 p-5 sm:flex-row"
            >
              <Link
                to={`/product/${product.slug}`}
                className="h-28 w-full shrink-0 overflow-hidden rounded-xl border border-white/[0.08] sm:h-32 sm:w-44"
                aria-label={product.name}
              >
                <ProductArt product={product} className="h-full w-full transition-transform duration-700 hover:scale-105" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-lg font-medium text-white/95">{product.name}</h3>
                    <p className="mt-1 font-mono text-[11px] text-white/50">
                      v{product.version} · {product.fileSize} · {product.formats.slice(0, 4).join(' / ')}
                    </p>
                  </div>
                  {hasUpdate && (
                    <span className="shrink-0 rounded-full bg-accent-500/15 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-accent-300">
                      Update available
                    </span>
                  )}
                </div>
                <button
                  onClick={() => copyKey(key)}
                  className="group/copy mt-2.5 inline-flex w-fit items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-1.5 font-mono text-[11.5px] text-white/60 transition-colors hover:border-white/[0.18] hover:text-white/90"
                  aria-label={`Copy license key for ${product.name}`}
                >
                  AXZ-{key}
                  <Copy size={11} className="text-white/50 transition-colors group-hover/copy:text-white/70" aria-hidden />
                </button>
                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                  <p className="font-mono text-[10.5px] text-white/50">
                    Purchased {formatDate(purchased)} · Order {order.number}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to={`/product/${product.slug}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.12] text-white/60 transition-colors hover:border-accent-500/50 hover:text-accent-300"
                      aria-label={`View ${product.name} product page`}
                    >
                      <ArrowUpRight size={14} aria-hidden />
                    </Link>
                    <Button size="sm" onClick={() => downloadLicense(product, order)}>
                      <Download size={13} aria-hidden /> Download
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
