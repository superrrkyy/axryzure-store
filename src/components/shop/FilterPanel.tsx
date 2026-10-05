import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import type { CatalogParams, PriceBand } from '@/utils/catalog'
import { CATEGORIES } from '@/data/categories'
import { PRODUCT_TYPES, PRICE_BANDS, categoryCount, typeCount } from '@/utils/catalog'
import { Checkbox } from '@/components/ui/Field'
import { cx } from '@/utils/format'

/* ------------------------------------------------------------------ */
/*  Filter sidebar / sheet: categories, types, price, rating,         */
/*  availability, sale.                                               */
/* ------------------------------------------------------------------ */

const RATINGS = [
  { value: 0, label: 'Any rating' },
  { value: 4.5, label: '4.5 & up' },
  { value: 4.7, label: '4.7 & up' },
  { value: 4.9, label: '4.9 only' },
]

const AVAILABILITY = [
  { value: 'instant', label: 'Instant download' },
  { value: 'early-access', label: 'Early access' },
] as const

export function FilterPanel({
  params,
  onChange,
}: {
  params: CatalogParams
  onChange: (patch: Partial<CatalogParams> & { keepSort?: boolean }) => void
}) {
  const toggle = (list: string[], value: string): string[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

  return (
    <div className="space-y-8">
      {/* categories */}
      <fieldset>
        <legend className="filter-legend">Category</legend>
        <div className="mt-3 space-y-1">
          {CATEGORIES.map((c) => (
            <Checkbox
              key={c.slug}
              checked={params.categories.includes(c.slug)}
              onChange={() => onChange({ categories: toggle(params.categories, c.slug) })}
              label={
                <span className="flex w-full items-center justify-between gap-2">
                  <span className="text-[13.5px]">{c.name}</span>
                  <span className="font-mono text-[10.5px] text-white/50">{categoryCount(c.slug)}</span>
                </span>
              }
            />
          ))}
        </div>
      </fieldset>

      {/* product type */}
      <fieldset>
        <legend className="filter-legend">Product type</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRODUCT_TYPES.map((type) => {
            const active = params.types.includes(type)
            return (
              <button
                key={type}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ types: toggle(params.types, type) })}
                className={cx(
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400',
                  active
                    ? 'border-accent-500/70 bg-accent-500/15 text-accent-200'
                    : 'border-white/[0.1] text-white/55 hover:border-white/[0.22] hover:text-white/85',
                )}
              >
                {type}
                <span className="ml-1.5 font-mono text-[10px] text-white/50">{typeCount(type)}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* price */}
      <fieldset>
        <legend className="filter-legend">Price</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {PRICE_BANDS.map((band) => (
            <button
              key={band.key}
              type="button"
              aria-pressed={params.price === band.key}
              onClick={() => onChange({ price: band.key as PriceBand })}
              className={cx(
                'rounded-lg border px-3 py-2 text-[13px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400',
                params.price === band.key
                  ? 'border-accent-500/70 bg-accent-500/15 text-accent-200'
                  : 'border-white/[0.1] text-white/55 hover:border-white/[0.22] hover:text-white/85',
              )}
            >
              {band.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* rating */}
      <fieldset>
        <legend className="filter-legend">Rating</legend>
        <div className="mt-3 space-y-1.5">
          {RATINGS.map((r) => (
            <label key={r.value} className="flex cursor-pointer items-center gap-2.5 text-[13.5px] text-white/65 transition-colors hover:text-white/90">
              <input
                type="radio"
                name="min-rating"
                checked={params.minRating === r.value}
                onChange={() => onChange({ minRating: r.value })}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className="h-[16px] w-[16px] shrink-0 rounded-full border border-white/[0.2] transition-all duration-150 peer-checked:border-accent-500 peer-focus-visible:ring-2 peer-focus-visible:ring-accent-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink-950"
              >
                <span className="flex h-full w-full items-center justify-center">
                  <span className={cx('h-2 w-2 rounded-full bg-accent-500 transition-transform duration-150', params.minRating === r.value ? 'scale-100' : 'scale-0')} />
                </span>
              </span>
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>

      {/* availability */}
      <fieldset>
        <legend className="filter-legend">Availability</legend>
        <div className="mt-3 space-y-1">
          {AVAILABILITY.map((a) => (
            <Checkbox
              key={a.value}
              checked={params.availability.includes(a.value)}
              onChange={() =>
                onChange({
                  availability: params.availability.includes(a.value)
                    ? params.availability.filter((v) => v !== a.value)
                    : [...params.availability, a.value],
                })
              }
              label={<span className="text-[13.5px]">{a.label}</span>}
            />
          ))}
        </div>
      </fieldset>

      {/* sale */}
      <div className="rounded-xl border border-gold-400/15 bg-gold-400/[0.05] p-4">
        <Checkbox
          checked={params.onSaleOnly}
          onChange={() => onChange({ onSaleOnly: !params.onSaleOnly })}
          label={
            <span className="flex items-center gap-1.5 text-[13.5px] text-gold-300">
              <Sparkles size={13} aria-hidden /> Discounted items only
            </span>
          }
        />
        <Link
          to="/product/axryzure-ultimate-bundle"
          className="mt-3 block text-[11.5px] leading-relaxed text-white/55 transition-colors hover:text-gold-300"
        >
          Season 04: the Ultimate Bundle is 38% off →
        </Link>
      </div>
    </div>
  )
}
