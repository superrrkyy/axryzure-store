/* ------------------------------------------------------------------ */
/*  AXRYZURE STORE — shared domain types                               */
/* ------------------------------------------------------------------ */

export type CategorySlug =
  | 'ui-kits'
  | 'website-templates'
  | 'design-assets'
  | 'developer-tools'
  | 'icons'
  | 'graphics'
  | 'creative-resources'
  | 'digital-bundles'

export interface Category {
  slug: CategorySlug
  name: string
  tagline: string
  description: string
}

export type ProductTypeName =
  | 'UI Kit'
  | 'Template'
  | 'Icon Pack'
  | 'Graphic Pack'
  | '3D Assets'
  | 'Dev Tool'
  | 'Bundle'
  | 'Resource'

export type ArtStyle =
  | 'dashboard'
  | 'browser'
  | 'icons'
  | 'bundle'
  | 'terminal'
  | 'type'
  | 'illustration'
  | '3d'
  | 'brand'
  | 'document'
  | 'motion'

/** Color + composition spec used by the ProductArt generator. */
export interface ProductArtSpec {
  bg: string
  a: string
  b: string
  c: string
  style: ArtStyle
}

export interface ChangelogEntry {
  version: string
  date: string
  note: string
}

export interface IncludedGroup {
  group: string
  items: string[]
}

export interface FaqItem {
  q: string
  a: string
}

export interface CoreProduct {
  id: string
  slug: string
  name: string
  category: CategorySlug
  type: ProductTypeName
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  sales: number
  releasedAt: string
  updatedAt: string
  version: string
  fileSize: string
  badge?: 'bestseller' | 'new' | 'limited'
  availability: 'instant' | 'early-access'
  featured?: boolean
  trending?: boolean
  tags: string[]
  collections: string[]
  shortDescription: string
  art: ProductArtSpec
}

export interface ProductContent {
  description: string[]
  features: string[]
  included: IncludedGroup[]
  compatibility: string[]
  formats: string[]
  license: string
  changelog: ChangelogEntry[]
  /** Product-specific FAQs, merged with store-wide defaults on the product page. */
  faq: FaqItem[]
}

export type Product = CoreProduct & ProductContent

export interface Collection {
  slug: string
  name: string
  tagline: string
  description: string
  curatorNote: string
  productSlugs: string[]
  art: { bg: string; a: string; b: string }
}

export interface Review {
  id: string
  author: string
  role: string
  rating: number
  date: string
  title: string
  body: string
  verified: boolean
  helpful: number
}

export interface Testimonial {
  quote: string
  author: string
  role: string
  product: string
}

/* ------------------------------ cart / orders --------------------- */

export interface CartItem {
  productId: string
  qty: number
  addedAt: number
}

export interface OrderItem {
  productId: string
  slug: string
  name: string
  price: number
  qty: number
}

export interface Order {
  id: string
  number: string
  date: string
  email: string
  name: string
  country: string
  items: OrderItem[]
  subtotal: number
  discount: number
  total: number
  promoCode?: string
  paymentMethod: string
  status: 'completed' | 'early-access'
}

export interface Profile {
  name: string
  email: string
  newsletter: boolean
  productUpdates: boolean
}

export interface ToastData {
  id: number
  title: string
  description?: string
  variant: 'success' | 'info' | 'error'
  action?: { label: string; onClick: () => void }
}
