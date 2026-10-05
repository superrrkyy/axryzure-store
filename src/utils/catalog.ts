import type { Product } from '@/types'
import { PRODUCTS } from '@/data/products'
import { CATEGORIES } from '@/data/categories'

/* ------------------------------------------------------------------ */
/*  Catalog filtering & sorting — shared by the shop page, search     */
/*  modal and collection links. All state is URL-driven.              */
/* ------------------------------------------------------------------ */

export type SortKey = 'featured' | 'newest' | 'popular' | 'price-asc' | 'price-desc' | 'rating'

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'newest', label: 'Newest' },
  { key: 'popular', label: 'Most popular' },
  { key: 'rating', label: 'Top rated' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
]

export type PriceBand = 'all' | 'under-30' | '30-50' | '50-plus'

export interface CatalogParams {
  q: string
  categories: string[]
  types: string[]
  price: PriceBand
  minRating: number
  availability: ('instant' | 'early-access')[]
  onSaleOnly: boolean
  badge: string | null
  collection: string | null
  sort: SortKey
}

export const DEFAULT_PARAMS: CatalogParams = {
  q: '',
  categories: [],
  types: [],
  price: 'all',
  minRating: 0,
  availability: [],
  onSaleOnly: false,
  badge: null,
  collection: null,
  sort: 'featured',
}

export const PRICE_BANDS: { key: PriceBand; label: string; test: (n: number) => boolean }[] = [
  { key: 'all', label: 'Any price', test: () => true },
  { key: 'under-30', label: 'Under $30', test: (n) => n < 30 },
  { key: '30-50', label: '$30 – $50', test: (n) => n >= 30 && n <= 50 },
  { key: '50-plus', label: '$50 & above', test: (n) => n > 50 },
]

export const PRODUCT_TYPES = Array.from(new Set(PRODUCTS.map((p) => p.type)))

export const categoryCount = (slug: string): number =>
  PRODUCTS.filter((p) => p.category === slug).length

export const typeCount = (type: string): number =>
  PRODUCTS.filter((p) => p.type === type).length

export const countActiveFilters = (params: CatalogParams): number => {
  let n = 0
  n += params.categories.length
  n += params.types.length
  if (params.price !== 'all') n++
  if (params.minRating > 0) n++
  n += params.availability.length
  if (params.onSaleOnly) n++
  if (params.badge) n++
  if (params.collection) n++
  if (params.q.trim()) n++
  return n
}

export const filterProducts = (products: Product[], params: CatalogParams): Product[] => {
  const q = params.q.trim().toLowerCase()
  return products.filter((p) => {
    if (q) {
      const haystack = [p.name, p.category, p.type, p.shortDescription, ...p.tags]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(q)) return false
    }
    if (params.categories.length && !params.categories.includes(p.category)) return false
    if (params.types.length && !params.types.includes(p.type)) return false
    if (!PRICE_BANDS.find((b) => b.key === params.price)!.test(p.price)) return false
    if (params.minRating > 0 && p.rating < params.minRating) return false
    if (params.availability.length && !params.availability.includes(p.availability)) return false
    if (params.onSaleOnly && !p.originalPrice) return false
    if (params.badge === 'new' && p.badge !== 'new') return false
    if (params.badge === 'bestseller' && p.badge !== 'bestseller') return false
    if (params.badge === 'limited' && p.badge !== 'limited') return false
    if (params.collection && !p.collections.includes(params.collection)) return false
    return true
  })
}

export const sortProducts = (products: Product[], sort: SortKey): Product[] => {
  const arr = [...products]
  switch (sort) {
    case 'newest':
      return arr.sort((a, b) => +new Date(b.releasedAt) - +new Date(a.releasedAt))
    case 'popular':
      return arr.sort((a, b) => b.sales - a.sales)
    case 'rating':
      return arr.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price)
    case 'featured':
    default:
      return arr.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || b.sales - a.sales)
  }
}

export const searchProducts = (q: string, limit = 8): Product[] => {
  const query = q.trim().toLowerCase()
  if (!query) return []
  const scored = PRODUCTS.map((p) => {
    const name = p.name.toLowerCase()
    let score = 0
    if (name.includes(query)) score += 10
    if (name.startsWith(query)) score += 6
    if (p.category.replace(/-/g, ' ').includes(query)) score += 4
    if (p.type.toLowerCase().includes(query)) score += 3
    if (p.tags.some((t) => t.includes(query))) score += 3
    if (p.shortDescription.toLowerCase().includes(query)) score += 1
    return { p, score }
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || b.p.sales - a.p.sales)
  return scored.slice(0, limit).map((s) => s.p)
}

/** Category display helpers used across cards and filters. */
export const categoryName = (slug: string): string =>
  CATEGORIES.find((c) => c.slug === slug)?.name ?? slug

/** Plausible star distribution derived from an average rating. */
export const ratingDistribution = (avg: number, total: number): { stars: number; count: number; pct: number }[] => {
  const five = Math.min(0.86, Math.max(0.3, (avg - 3.0) / 2))
  const rest = 1 - five
  const dist = [
    { stars: 5, share: five },
    { stars: 4, share: rest * 0.72 },
    { stars: 3, share: rest * 0.18 },
    { stars: 2, share: rest * 0.06 },
    { stars: 1, share: rest * 0.04 },
  ]
  return dist.map((d) => ({
    stars: d.stars,
    count: Math.max(0, Math.round(d.share * total)),
    pct: Math.round(d.share * 100),
  }))
}
