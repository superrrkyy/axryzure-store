import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronDown, PackageSearch } from 'lucide-react'
import type { Product } from '@/types'
import type { CatalogParams, SortKey } from '@/utils/catalog'
import {
  SORT_OPTIONS,
  countActiveFilters,
  filterProducts,
  sortProducts,
} from '@/utils/catalog'
import { CATEGORIES } from '@/data/categories'
import { COLLECTIONS } from '@/data/collections'
import { PRODUCTS } from '@/data/products'
import { ProductGrid } from '@/components/product/ProductGrid'
import { QuickPreview } from '@/components/product/QuickPreview'
import { FilterPanel } from '@/components/shop/FilterPanel'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { usePageTitle } from '@/hooks/usePageTitle'
import { cx } from '@/utils/format'

/* ------------------------------------------------------------------ */
/*  /shop — full catalog with URL-driven filters, search & sorting.   */
/* ------------------------------------------------------------------ */

function parseParams(sp: URLSearchParams): CatalogParams {
  const list = (key: string) => sp.get(key)?.split(',').filter(Boolean) ?? []
  return {
    q: sp.get('q') ?? '',
    categories: list('category'),
    types: list('type'),
    price: (sp.get('price') as CatalogParams['price']) || 'all',
    minRating: Number(sp.get('rating') ?? 0) || 0,
    availability: list('availability') as CatalogParams['availability'],
    onSaleOnly: sp.get('sale') === 'true',
    badge: sp.get('badge'),
    collection: sp.get('collection'),
    sort: (sp.get('sort') as SortKey) || (sp.get('badge') === 'new' ? 'newest' : sp.get('badge') === 'bestseller' ? 'popular' : 'featured'),
  }
}

export default function ShopPage() {
  usePageTitle('Shop All')
  const [searchParams, setSearchParams] = useSearchParams()
  const [preview, setPreview] = useState<Product | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState(() => searchParams.get('q') ?? '')

  const params = useMemo(() => parseParams(searchParams), [searchParams])

  // keep local search field in sync when the URL changes elsewhere (modal, footer links)
  const urlQ = searchParams.get('q') ?? ''
  useEffect(() => {
    setSearchText(urlQ)
  }, [urlQ])

  // debounce keystrokes before they hit the URL (and reload the grid)
  useEffect(() => {
    if (searchText === urlQ) return
    const t = window.setTimeout(() => {
      setParams({ q: searchText, keepSort: true })
    }, 320)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])

  // serialize patch into the URL (single source of truth)
  const setParams = (patch: Partial<CatalogParams> & { keepSort?: boolean }) => {
    const next = new URLSearchParams(searchParams)
    const { keepSort, ...rest } = patch
    const merged = { ...params, ...rest }
    const put = (key: string, value: string | null | undefined) => {
      if (!value || value === 'all' || value === '0' || value === 'false') next.delete(key)
      else next.set(key, value)
    }
    put('q', merged.q.trim() || null)
    put('category', merged.categories.join(',') || null)
    put('type', merged.types.join(',') || null)
    put('price', merged.price === 'all' ? null : merged.price)
    put('rating', merged.minRating ? String(merged.minRating) : null)
    put('availability', merged.availability.join(',') || null)
    put('sale', merged.onSaleOnly ? 'true' : null)
    put('badge', merged.badge)
    put('collection', merged.collection)
    if (!keepSort) put('sort', merged.sort)
    setSearchParams(next, { replace: true })
  }

  const clearAll = () => setSearchParams({}, { replace: true })

  // brief skeleton on filter changes so transitions feel intentional
  const filterKey = searchParams.toString()
  useEffect(() => {
    setLoading(true)
    const t = window.setTimeout(() => setLoading(false), filterKey === '' ? 550 : 300)
    return () => window.clearTimeout(t)
  }, [filterKey])

  const results = useMemo(
    () => sortProducts(filterProducts(PRODUCTS, params), params.sort),
    [params],
  )

  const activeCount = countActiveFilters(params)
  const activeCollection = params.collection ? COLLECTIONS.find((c) => c.slug === params.collection) : undefined

  return (
    <div className="container-x pb-24 pt-10 lg:pt-14">
      {/* header */}
      <header className="max-w-2xl">
        <p className="eyebrow">The catalog</p>
        <h1 className="mt-3 font-display text-display-md font-medium text-white">
          {activeCollection ? activeCollection.name : params.badge === 'new' ? 'New arrivals' : params.badge === 'bestseller' ? 'Best sellers' : 'Every product, one standard'}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-white/55">
          {activeCollection
            ? activeCollection.description
            : 'Sixteen products across eight categories — designed, engineered and maintained like we plan to keep them forever. Because we do.'}
        </p>
      </header>

      {/* toolbar */}
      <div className="sticky top-16 z-30 -mx-5 mt-10 border-y border-white/[0.07] bg-ink-950/90 px-5 py-3.5 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:top-[72px] lg:mx-0 lg:rounded-xl lg:border lg:px-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* search */}
          <div className="relative min-w-0 flex-1">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" aria-hidden />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search the catalog…"
              aria-label="Search products"
              className="w-full rounded-lg border border-white/[0.09] bg-ink-900/80 py-2.5 pl-10 pr-9 text-sm text-white/90 placeholder:text-white/50 transition-colors focus:border-accent-500/60 focus:outline-none focus:ring-2 focus:ring-accent-400/50"
            />
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-white/50 hover:text-white/85"
              >
                <X size={13} aria-hidden />
              </button>
            )}
          </div>

          {/* sort */}
          <div className="relative">
            <label htmlFor="sort" className="sr-only">Sort products</label>
            <select
              id="sort"
              value={params.sort}
              onChange={(e) => setParams({ sort: e.target.value as SortKey })}
              className="appearance-none rounded-lg border border-white/[0.09] bg-ink-900/80 py-2.5 pl-3.5 pr-9 text-[13px] text-white/80 transition-colors hover:border-white/[0.18] focus:border-accent-500/60 focus:outline-none focus:ring-2 focus:ring-accent-400/50"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key} className="bg-ink-900">
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50" aria-hidden />
          </div>

          {/* mobile filter button */}
          <button
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-white/[0.09] bg-ink-900/80 px-3.5 py-2.5 text-[13px] font-medium text-white/75 transition-colors hover:border-white/[0.18] hover:text-white lg:hidden"
            aria-label={`Open filters${activeCount ? `, ${activeCount} active` : ''}`}
          >
            <SlidersHorizontal size={14} aria-hidden /> Filters
            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 font-mono text-[10px] text-ink-950">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* active chips */}
        {activeCount > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Active filters">
            <ActiveChips params={params} setParams={setParams} />
            <button
              onClick={clearAll}
              className="rounded-full border border-rose-400/25 px-3 py-1.5 text-xs font-medium text-rose-300/90 transition-colors hover:border-rose-400/50 hover:text-rose-300"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[250px_1fr] lg:gap-12">
        {/* desktop sidebar */}
        <aside className="hidden lg:block" aria-label="Product filters">
          <div className="sticky top-44 max-h-[calc(100vh-13rem)] overflow-y-auto pr-2 pt-1">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/50">Filters</h2>
              {activeCount > 0 && (
                <button onClick={clearAll} className="text-xs text-rose-300/80 transition-colors hover:text-rose-300">
                  Clear ({activeCount})
                </button>
              )}
            </div>
            <FilterPanel params={params} onChange={setParams} />
          </div>
        </aside>

        {/* results */}
        <div>
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/50" aria-live="polite">
            {loading ? 'Loading…' : `${results.length} product${results.length === 1 ? '' : 's'}`}
          </p>
          {results.length === 0 && !loading ? (
            <EmptyState
              icon={<PackageSearch size={22} aria-hidden />}
              title="Nothing matches those filters"
              description="Try loosening the price band or clearing a category — the catalog is small but mighty."
              action={<Button variant="secondary" onClick={clearAll}>Clear all filters</Button>}
            />
          ) : (
            <ProductGrid
              products={results}
              loading={loading}
              skeletonCount={6}
              onQuickPreview={setPreview}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            />
          )}
        </div>
      </div>

      {/* mobile filter sheet */}
      <Modal open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filters" size="sm">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-ink-900 px-6 py-3.5">
          <span className="font-mono text-[11px] text-white/50">{activeCount} active</span>
          <button onClick={clearAll} className="text-xs font-medium text-rose-300/85 hover:text-rose-300">
            Clear all
          </button>
        </div>
        <div className="px-6 py-6">
          <FilterPanel params={params} onChange={setParams} />
        </div>
        <div className="sticky bottom-0 border-t border-white/[0.07] bg-ink-900 px-6 py-4">
          <Button className="w-full" size="lg" onClick={() => setSheetOpen(false)}>
            Show {results.length} result{results.length === 1 ? '' : 's'}
          </Button>
        </div>
      </Modal>

      <QuickPreview product={preview} onClose={() => setPreview(null)} />
    </div>
  )
}

/* --- active filter chips -------------------------------------------- */

function ActiveChips({
  params,
  setParams,
}: {
  params: CatalogParams
  setParams: (patch: Partial<CatalogParams> & { keepSort?: boolean }) => void
}) {
  const chips: Array<{ label: string; clear: () => void }> = []
  if (params.q.trim()) chips.push({ label: `“${params.q.trim()}”`, clear: () => setParams({ q: '', keepSort: true }) })
  params.categories.forEach((slug) =>
    chips.push({
      label: CATEGORIES.find((c) => c.slug === slug)?.name ?? slug,
      clear: () => setParams({ categories: params.categories.filter((c) => c !== slug) }),
    }),
  )
  params.types.forEach((type) =>
    chips.push({
      label: type,
      clear: () => setParams({ types: params.types.filter((t) => t !== type) }),
    }),
  )
  if (params.price !== 'all') {
    const label = params.price === 'under-30' ? 'Under $30' : params.price === '30-50' ? '$30–$50' : '$50+'
    chips.push({ label, clear: () => setParams({ price: 'all' }) })
  }
  if (params.minRating > 0) chips.push({ label: `${params.minRating}+ ★`, clear: () => setParams({ minRating: 0 }) })
  params.availability.forEach((a) =>
    chips.push({
      label: a === 'instant' ? 'Instant download' : 'Early access',
      clear: () => setParams({ availability: params.availability.filter((v) => v !== a) }),
    }),
  )
  if (params.onSaleOnly) chips.push({ label: 'On sale', clear: () => setParams({ onSaleOnly: false }) })
  if (params.badge) chips.push({ label: params.badge === 'new' ? 'New' : params.badge === 'bestseller' ? 'Bestsellers' : 'Limited', clear: () => setParams({ badge: null }) })
  if (params.collection) {
    const c = COLLECTIONS.find((x) => x.slug === params.collection)
    chips.push({ label: c?.name ?? params.collection, clear: () => setParams({ collection: null }) })
  }

  return (
    <>
      {chips.map((chip, i) => (
        <button
          key={`${chip.label}-${i}`}
          onClick={chip.clear}
          className={cx(
            'group inline-flex items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1.5 text-xs text-accent-200 transition-colors hover:border-accent-500/60',
          )}
          aria-label={`Remove filter ${chip.label}`}
        >
          {chip.label}
          <X size={11} className="opacity-60 transition-opacity group-hover:opacity-100" aria-hidden />
        </button>
      ))}
    </>
  )
}
