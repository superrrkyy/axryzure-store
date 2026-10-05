import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Zap, ShieldCheck, RefreshCw, HeartHandshake, ArrowRight, ArrowLeft,
  Award, Flame, Quote, Check, Mail,
} from 'lucide-react'
import type { Product } from '@/types'
import { COLLECTIONS } from '@/data/collections'
import { PRODUCTS } from '@/data/products'
import { formatCompact, formatPrice, EASE, cx } from '@/utils/format'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductArt } from '@/components/product/ProductArt'
import { ProductBadges, Badge } from '@/components/ui/Badge'
import { Price } from '@/components/ui/Price'
import { TESTIMONIALS } from '@/data/reviews'
import { useStore } from '@/context/StoreContext'
import { buttonClasses } from '@/components/ui/Button'

/* ================================================================== */
/*  Home page sections                                                 */
/* ================================================================== */

/* --- trust band under hero ------------------------------------------ */

export function TrustBand() {
  const items = [
    { icon: Zap, title: 'Instant delivery', text: 'Files in your account the second you check out' },
    { icon: ShieldCheck, title: 'Secure checkout', text: '256-bit encrypted payments, zero stored cards' },
    { icon: RefreshCw, title: 'Lifetime updates', text: 'Every future version of your products, free' },
    { icon: HeartHandshake, title: '14-day refunds', text: 'No forms, no questions — just email us' },
  ]
  return (
    <section aria-label="Store guarantees" className="border-y border-white/[0.06] bg-ink-900/40">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4 lg:py-12">
        {items.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.08} className="flex gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-ink-850 text-accent-300">
              <Icon size={17} aria-hidden />
            </span>
            <div>
              <p className="text-[14px] font-medium text-white/90">{title}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-white/55">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* --- featured products ---------------------------------------------- */

export function FeaturedSection({ products, onQuickPreview }: { products: Product[]; onQuickPreview: (p: Product) => void }) {
  const [lead, ...rest] = products
  return (
    <section aria-labelledby="featured-heading" className="container-x py-20 lg:py-28">
      <SectionHeader
        eyebrow="01 — Featured"
        title={<span id="featured-heading">Hand-picked, studio-grade</span>}
        description="A rotating selection of our most complete products — the ones we’d take to a desert island with a laptop."
        linkTo="/shop?sort=featured"
        linkLabel="Shop all"
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {lead && (
          <Reveal className="sm:col-span-2 lg:row-span-2" delay={0.05}>
            <div className="h-full">
              <ProductCard product={lead} onQuickPreview={onQuickPreview} />
            </div>
          </Reveal>
        )}
        {rest.map((p, i) => (
          <Reveal key={p.id} delay={0.1 + i * 0.06}>
            <ProductCard product={p} onQuickPreview={onQuickPreview} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* --- collections ----------------------------------------------------- */

export function CollectionsSection() {
  return (
    <section aria-labelledby="collections-heading" className="border-y border-white/[0.06] bg-ink-900/30 py-20 lg:py-28">
      <div className="container-x">
        <SectionHeader
          eyebrow="02 — Curated collections"
          title={<span id="collections-heading">Four ways to start</span>}
          description="Bundles of taste rather than bundles of stuff — each collection is a considered path through the catalog."
          linkTo="/collections"
          linkLabel="All collections"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {COLLECTIONS.map((collection, i) => (
            <Reveal key={collection.slug} delay={i * 0.07}>
              <Link
                to={`/shop?collection=${collection.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-850 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-90"
                  style={{ background: `${collection.art.a}26` }}
                  aria-hidden
                />
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-accent-300/80">
                    {collection.tagline}
                  </p>
                  <span className="font-mono text-[10.5px] text-white/50">{collection.productSlugs.length} products</span>
                </div>
                <h3 className="mt-4 font-display text-3xl font-medium text-white/95">{collection.name}</h3>
                <p className="mt-3 line-clamp-2 max-w-md text-[14px] leading-relaxed text-white/50">
                  {collection.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-8">
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 transition-colors group-hover:text-accent-300">
                    Explore <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                  </span>
                  <span className="flex -space-x-3" aria-hidden>
                    {collection.productSlugs.slice(0, 3).map((slug) => {
                      const product = PRODUCTS_LOOKUP[slug]
                      return product ? (
                        <span key={slug} className="h-10 w-12 overflow-hidden rounded-lg border border-white/[0.12] bg-ink-900">
                          <ProductArt product={product} className="h-full w-full" />
                        </span>
                      ) : null
                    })}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const PRODUCTS_LOOKUP: Record<string, Product> = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p]))

/* --- trending carousel ----------------------------------------------- */

export function TrendingSection({ products, onQuickPreview }: { products: Product[]; onQuickPreview: (p: Product) => void }) {
  const scroller = useRef<HTMLDivElement>(null)
  const scroll = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * (scroller.current.clientWidth * 0.8), behavior: 'smooth' })
  }
  return (
    <section aria-labelledby="trending-heading" className="py-20 lg:py-28">
      <div className="container-x">
        <SectionHeader
          eyebrow="03 — Trending this week"
          title={<span id="trending-heading">What creators are buying</span>}
          linkTo="/shop?sort=popular"
          linkLabel="See what's popular"
        />
      </div>
      <div className="group/trend relative mt-10">
        <div
          ref={scroller}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:px-8 lg:px-[max(3rem,calc((100vw-1400px)/2+3rem))] xl:px-[max(3.5rem,calc((100vw-1400px)/2+3.5rem))]"
        >
          {products.map((p, i) => (
            <div key={p.id} className="w-[78vw] shrink-0 snap-start sm:w-[380px]">
              <ProductCard product={p} index={i} onQuickPreview={onQuickPreview} />
            </div>
          ))}
          <div className="w-2 shrink-0 sm:w-8" aria-hidden />
        </div>
        <CarouselArrow side="left" onClick={() => scroll(-1)} />
        <CarouselArrow side="right" onClick={() => scroll(1)} />
      </div>
    </section>
  )
}

function CarouselArrow({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ArrowLeft : ArrowRight
  return (
    <button
      onClick={onClick}
      aria-label={side === 'left' ? 'Scroll trending left' : 'Scroll trending right'}
      className={cx(
        'absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.12] bg-ink-900/90 text-white/75 shadow-pop backdrop-blur-md transition-all hover:border-accent-500/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 md:flex',
        'opacity-0 group-hover/trend:opacity-100',
        side === 'left' ? 'left-4' : 'right-4',
      )}
    >
      <Icon size={17} aria-hidden />
    </button>
  )
}

/* --- limited releases with countdown --------------------------------- */

export function LimitedSection({ products }: { products: Product[] }) {
  const { addToCart } = useStore()
  const [remaining, setRemaining] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      const ms = Math.max(0, end.getTime() - now.getTime())
      const d = Math.floor(ms / 86400000)
      const h = Math.floor((ms % 86400000) / 3600000)
      const m = Math.floor((ms % 3600000) / 60000)
      const s = Math.floor((ms % 60000) / 1000)
      setRemaining(`${String(d).padStart(2, '0')}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`)
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section aria-labelledby="limited-heading" className="border-y border-white/[0.06] bg-ink-900/30 py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow="04 — Limited releases"
            title={<span id="limited-heading">Once they’re gone, they’re gone</span>}
            description="Seasonal releases with a fixed number of licenses. When the counter empties, they return to the vault."
            className="w-full"
          />
          <Reveal className="hidden shrink-0 lg:block">
            <div className="flex items-center gap-3 rounded-xl border border-gold-400/20 bg-gold-400/[0.06] px-5 py-3">
              <Flame size={15} className="text-gold-400" aria-hidden />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">Season ends in</span>
              <span className="font-mono text-sm tabular-nums text-gold-300">{remaining}</span>
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <article className="group relative grid overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-850 sm:grid-cols-[200px_1fr]">
                <Link to={`/product/${p.slug}`} className="block h-44 overflow-hidden sm:h-full" aria-label={p.name}>
                  <div className="h-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]">
                    <ProductArt product={p} className="h-full w-full" />
                  </div>
                </Link>
                <div className="flex flex-col gap-2.5 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <Badge tone="gold">
                      <Award size={10} aria-hidden /> Season 04
                    </Badge>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                      {p.slug === 'axryzure-ultimate-bundle' ? '500 licenses' : 'Limited run'}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-medium text-white/95">
                    <Link to={`/product/${p.slug}`} className="transition-colors hover:text-accent-200">
                      {p.name}
                    </Link>
                  </h3>
                  <p className="line-clamp-2 text-[13px] leading-relaxed text-white/50">{p.shortDescription}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-white/[0.07] pt-4">
                    <Price product={p} />
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(p.id)}
                        className="rounded-lg bg-white/[0.06] px-3.5 py-2 text-xs font-medium text-white/85 transition-all hover:bg-accent-500 hover:text-ink-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                      >
                        Add to cart
                      </button>
                      <Link
                        to={`/product/${p.slug}`}
                        className="rounded-lg border border-white/[0.12] px-3.5 py-2 text-xs font-medium text-white/70 transition-colors hover:border-accent-500/50 hover:text-accent-300"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --- new arrivals ----------------------------------------------------- */

export function NewArrivalsSection({ products, onQuickPreview }: { products: Product[]; onQuickPreview: (p: Product) => void }) {
  return (
    <section aria-labelledby="new-heading" className="container-x py-20 lg:py-28">
      <SectionHeader
        eyebrow="05 — Just landed"
        title={<span id="new-heading">New this season</span>}
        description="The freshest releases in the catalog — including two products still in weekly early access."
        linkTo="/shop?badge=new&sort=newest"
        linkLabel="All new arrivals"
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06}>
            <ProductCard product={p} onQuickPreview={onQuickPreview} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* --- best sellers, ranked editorial list ------------------------------ */

export function BestSellersSection({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby="best-heading" className="border-y border-white/[0.06] bg-ink-900/30 py-20 lg:py-28">
      <div className="container-x">
        <SectionHeader
          eyebrow="06 — Best sellers"
          title={<span id="best-heading">Proven on real projects</span>}
          description="Ranked by lifetime sales. These five have shipped more client work than most agencies."
          linkTo="/shop?badge=bestseller&sort=popular"
          linkLabel="Shop best sellers"
        />
        <ol className="mt-10 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {products.map((p, i) => (
            <li key={p.id}>
              <Reveal delay={i * 0.05} y={14}>
                <Link
                  to={`/product/${p.slug}`}
                  className="group grid grid-cols-[auto_96px_1fr_auto] items-center gap-4 py-5 transition-colors hover:bg-white/[0.02] sm:gap-7 sm:px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-400"
                >
                  <span className="w-10 font-display text-3xl font-light text-white/50 transition-colors group-hover:text-accent-300 sm:text-4xl" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="hidden h-16 w-24 overflow-hidden rounded-lg border border-white/[0.08] sm:block" aria-hidden>
                    <ProductArt product={p} className="h-full w-full transition-transform duration-700 group-hover:scale-110" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2.5">
                      <span className="truncate font-display text-lg font-medium text-white/90 transition-colors group-hover:text-accent-200">
                        {p.name}
                      </span>
                      <ProductBadges product={p} />
                    </span>
                    <span className="mt-1 block truncate text-[13px] text-white/55">{p.shortDescription}</span>
                    <span className="mt-1.5 block font-mono text-[11px] text-white/50">
                      {formatCompact(p.sales)} sold · ★ {p.rating.toFixed(1)} ({p.reviewCount} reviews)
                    </span>
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="text-right font-mono">
                      <span className="block text-base text-white">{formatPrice(p.price)}</span>
                      {p.originalPrice && (
                        <span className="block text-xs text-white/50 line-through">{formatPrice(p.originalPrice)}</span>
                      )}
                    </span>
                    <ArrowRight
                      size={16}
                      className="hidden text-white/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent-300 sm:block"
                      aria-hidden
                    />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* --- testimonials marquee --------------------------------------------- */

export function TestimonialsSection() {
  const reduce = useReducedMotion()
  const row = [...TESTIMONIALS, ...TESTIMONIALS]
  return (
    <section aria-labelledby="testimonials-heading" className="overflow-hidden py-20 lg:py-28">
      <div className="container-x">
        <SectionHeader
          eyebrow="07 — From the community"
          title={<span id="testimonials-heading">Word of mouth</span>}
          description="Unedited notes from customers — the good kind of inbox traffic."
        />
      </div>
      <div className="relative mt-12" style={{ maskImage: 'linear-gradient(90deg, transparent, black 6%, black 94%, transparent)' }}>
        <div
          className={cx('flex w-max gap-5', !reduce && 'animate-marquee hover:[animation-play-state:paused]')}
          aria-label="Customer testimonials"
        >
          {row.map((t, i) => (
            <figure
              key={i}
              className="w-[320px] shrink-0 rounded-2xl border border-white/[0.07] bg-ink-850/70 p-6 sm:w-[380px]"
            >
              <Quote size={18} className="text-accent-400/60" aria-hidden />
              <blockquote className="mt-4 text-[14.5px] leading-relaxed text-white/75">“{t.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                <div>
                  <p className="text-[13.5px] font-medium text-white/90">{t.author}</p>
                  <p className="mt-0.5 font-mono text-[10.5px] text-white/50">{t.role}</p>
                </div>
                <span className="rounded-full border border-white/[0.08] px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-white/55">
                  {t.product}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --- newsletter -------------------------------------------------------- */

export function NewsletterSection() {
  const { pushToast } = useStore()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      pushToast({ title: 'That email looks off', description: 'Double-check the address and try again', variant: 'error' })
      return
    }
    setDone(true)
    pushToast({ title: 'Welcome to the Dispatch', description: 'First issue lands in your inbox next month', variant: 'success' })
  }

  return (
    <section aria-labelledby="newsletter-heading" className="container-x pb-20 lg:pb-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900/60 px-7 py-12 sm:px-12 lg:px-16 lg:py-16">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent-600/[0.14] blur-[90px]" aria-hidden />
          <div className="pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-gold-500/[0.08] blur-[90px]" aria-hidden />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow">08 — The Dispatch</p>
              <h2 id="newsletter-heading" className="mt-3 font-display text-display-sm font-medium text-white/95">
                One email a month. Zero noise.
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/55">
                New releases with the reasoning behind them, design notes from the studio, and
                subscriber-only discounts. Read in three minutes, unsubscribable in one click.
              </p>
              <ul className="mt-6 space-y-2.5">
                {['Product drops before they go public', 'Subscriber-only discount codes', 'Deep dives on craft & process'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[13.5px] text-white/65">
                    <Check size={14} className="text-accent-400" aria-hidden /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-ink-850/80 p-6 sm:p-8">
              {done ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex flex-col items-center py-8 text-center"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent-500/40 bg-accent-500/10">
                    <Mail size={22} className="text-accent-300" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-xl text-white/95">You’re on the list</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/50">
                    Watch your inbox — the next Dispatch goes out on the first Tuesday of the month.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <label htmlFor="newsletter-email" className="text-[13px] font-medium text-white/80">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@studio.co"
                    autoComplete="email"
                    className="mt-2 w-full rounded-xl border border-white/[0.1] bg-ink-900 px-4 py-3.5 text-sm text-white/90 placeholder:text-white/50 transition-colors focus:border-accent-500/60 focus:outline-none focus:ring-2 focus:ring-accent-400/60"
                  />
                  <button type="submit" className={buttonClasses('primary', 'lg', 'mt-4 w-full')}>
                    Subscribe to the Dispatch <ArrowRight size={15} aria-hidden />
                  </button>
                  <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                    4,812 subscribers · Unsubscribe anytime
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* --- final CTA ---------------------------------------------------------- */

export function FinalCTA() {
  return (
    <section aria-labelledby="final-cta-heading" className="relative overflow-hidden border-t border-white/[0.06] py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-600/[0.13] blur-[110px]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.5]" viewBox="0 0 1440 400" fill="none" preserveAspectRatio="none">
          <path d="M0 320 C 240 220, 480 380, 720 280 S 1200 140, 1440 220" stroke="rgba(140,160,250,0.1)" />
          <path d="M0 260 C 240 360, 560 180, 820 260 S 1240 340, 1440 260" stroke="rgba(140,160,250,0.07)" />
        </svg>
      </div>
      <div className="container-x relative text-center">
        <Reveal>
          <p className="eyebrow justify-center">Ready when you are</p>
          <h2 id="final-cta-heading" className="mx-auto mt-4 max-w-3xl font-display text-display-md font-medium text-white">
            Build something <em className="font-light italic text-accent-300">worth</em> shipping.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-white/55">
            Sixteen products, one standard. Instant delivery, lifetime updates, and a 14-day refund
            policy in case we’re not your taste.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <Link to="/shop" className={buttonClasses('primary', 'lg')}>
              Explore Products <ArrowRight size={16} aria-hidden />
            </Link>
            <Link to="/collections" className={buttonClasses('outline', 'lg')}>
              View Collections
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
