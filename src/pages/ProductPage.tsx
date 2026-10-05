import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Check, ShoppingBag, Zap, Share2, ArrowRight, FileDown,
  MonitorSmartphone, History, Scale, Package, RefreshCw, ShieldCheck,
} from 'lucide-react'
import { getProduct, relatedProducts, discountPct } from '@/data/products'
import { categoryName } from '@/utils/catalog'
import { formatCompact, formatDate, formatMonthYear, EASE } from '@/utils/format'
import { useStore } from '@/context/StoreContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { ProductGallery } from '@/components/product/ProductGallery'
import { Reviews } from '@/components/product/Reviews'
import { WishlistButton } from '@/components/product/WishlistButton'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductBadges, Badge } from '@/components/ui/Badge'
import { Stars } from '@/components/ui/Rating'
import { Price } from '@/components/ui/Price'
import { Button } from '@/components/ui/Button'
import { Accordion } from '@/components/ui/Accordion'
import { Reveal } from '@/components/ui/Reveal'
import NotFoundPage from './NotFoundPage'

/* /product/:slug — gallery, buy box, specs, FAQ, reviews, related. */

export default function ProductPage() {
  const { slug } = useParams()
  const product = slug ? getProduct(slug) : undefined
  const { addToCart, pushToast } = useStore()
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)

  usePageTitle(product?.name)

  if (!product) return <NotFoundPage />

  const related = relatedProducts(product)
  const discount = discountPct(product)

  const handleAdd = () => {
    addToCart(product.id)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  const buyNow = () => {
    addToCart(product.id, 1, { silent: true })
    navigate('/checkout')
  }

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url })
        return
      }
      throw new Error('no native share')
    } catch {
      try {
        await navigator.clipboard.writeText(url)
        pushToast({ title: 'Link copied', description: 'Share it with someone who ships', variant: 'success' })
      } catch {
        pushToast({ title: url, variant: 'info' })
      }
    }
  }

  const faqItems = [
    {
      q: 'How do I receive my files after purchase?',
      a: 'Instantly. After checkout, your download panel appears on the confirmation page — and everything stays available forever in Account → Downloads. We also email a backup link to the address you check out with.',
    },
    {
      q: 'Are future updates included?',
      a: `Yes — every purchase includes lifetime updates. ${product.name} is currently at v${product.version}${product.changelog[0] ? ` (latest: ${product.changelog[0].note.toLowerCase()})` : ''}. New versions appear in your downloads automatically; no repurchase, no upgrade fee.`,
    },
    {
      q: 'Can I use this in commercial and client projects?',
      a: 'Yes. The standard license covers unlimited personal and commercial projects, including paid client work. The only thing you can’t do is resell or redistribute the source files themselves.',
    },
    ...product.faq,
    {
      q: 'What if it’s not for me?',
      a: `If ${product.name} isn’t right for you, email hello@axryzure.store within 14 days and we’ll refund you in full — no forms, no questions.`,
    },
  ]

  const specs: Array<[string, React.ReactNode]> = [
    ['Version', `v${product.version} · updated ${formatMonthYear(product.updatedAt)}`],
    ['Released', formatDate(product.releasedAt)],
    ['File size', product.fileSize],
    ['Formats', product.formats.join(' · ')],
    ['Compatibility', product.compatibility.join(', ')],
    ['License', product.license.split('.')[0] + '.'],
    ['Delivery', product.availability === 'early-access' ? 'Early access — weekly updates' : 'Instant download'],
  ]

  return (
    <div className="pb-24 pt-10 lg:pt-14">
      <div className="container-x">
        {/* breadcrumbs */}
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/" className="transition-colors hover:text-white/80">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link to="/shop" className="transition-colors hover:text-white/80">Shop</Link></li>
            <li aria-hidden>/</li>
            <li>
              <Link to={`/shop?category=${product.category}`} className="transition-colors hover:text-white/80">
                {categoryName(product.category)}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-white/70">{product.name}</li>
          </ol>
        </nav>

        {/* main grid */}
        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <ProductGallery product={product} />
          </div>

          {/* buy box */}
          <div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-300/85">
                  {categoryName(product.category)} · {product.type}
                </span>
                {product.availability === 'early-access' && <Badge tone="accent">Early access</Badge>}
              </div>

              <h1 className="mt-4 font-display text-display-md font-medium text-white">{product.name}</h1>

              <a href="#reviews" className="mt-4 inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400">
                <Stars rating={product.rating} size={15} />
                <span className="font-mono text-[13px] text-white/70">
                  {product.rating.toFixed(1)} · {product.reviewCount} reviews
                </span>
                <span className="font-mono text-[13px] text-white/50">· {formatCompact(product.sales)} sold</span>
              </a>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Price product={product} size="lg" />
                {discount !== null && <Badge tone="sale">Save {discount}%</Badge>}
                <ProductBadges product={product} />
              </div>

              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/60">{product.shortDescription}</p>

              {/* actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="flex-1" onClick={handleAdd}>
                  {added ? <><Check size={16} aria-hidden /> Added to cart</> : <><ShoppingBag size={16} aria-hidden /> Add to cart</>}
                </Button>
                <Button size="lg" variant="gold" className="flex-1" onClick={buyNow}>
                  <Zap size={16} aria-hidden /> Buy now
                </Button>
              </div>
              <div className="mt-3 flex gap-3">
                <WishlistButton productId={product.id} variant="solid" className="flex-1" />
                <button
                  onClick={share}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.12] px-4 text-sm text-white/80 transition-colors hover:border-accent-400/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                  aria-label="Share this product"
                >
                  <Share2 size={15} aria-hidden /> Share
                </button>
              </div>

              {/* assurances */}
              <ul className="mt-8 grid gap-3 rounded-2xl border border-white/[0.07] bg-ink-900/50 p-5 sm:grid-cols-2">
                {[
                  { icon: <Zap size={14} className="text-accent-400" aria-hidden />, title: 'Instant delivery', text: product.availability === 'early-access' ? 'Weekly early-access builds' : 'Available the second you pay' },
                  { icon: <RefreshCw size={14} className="text-accent-400" aria-hidden />, title: 'Lifetime updates', text: `Current: v${product.version}` },
                  { icon: <Scale size={14} className="text-accent-400" aria-hidden />, title: 'Commercial license', text: 'Client projects included' },
                  { icon: <ShieldCheck size={14} className="text-accent-400" aria-hidden />, title: '14-day refund', text: 'Email us, that’s it' },
                ].map(({ icon, title, text }) => (
                  <li key={title} className="flex gap-3">
                    <span className="mt-0.5 shrink-0">{icon}</span>
                    <div>
                      <p className="text-[13px] font-medium text-white/85">{title}</p>
                      <p className="mt-0.5 text-[12px] text-white/55">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* key features */}
              <div className="mt-10">
                <h2 className="flex items-center gap-2.5 font-display text-xl font-medium text-white/95">
                  <Package size={17} className="text-accent-300" aria-hidden /> Key features
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-white/65">
                      <Check size={15} className="mt-1 shrink-0 text-accent-400" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {/* overview + included */}
        <div className="mt-24 grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <Reveal>
            <h2 className="font-display text-display-sm font-medium text-white/95">Overview</h2>
            <div className="mt-6 space-y-5">
              {product.description.map((para, i) => (
                <p key={i} className="text-[15px] leading-[1.8] text-white/60">
                  {para}
                </p>
              ))}
            </div>

            <h2 className="mt-14 flex items-center gap-2.5 font-display text-display-sm font-medium text-white/95">
              <FileDown key="fd" size={18} className="text-accent-300" aria-hidden /> What’s included
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {product.included.map((group) => (
                <div key={group.group} className="rounded-2xl border border-white/[0.07] bg-ink-900/50 p-5">
                  <h3 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-accent-300/85">{group.group}</h3>
                  <ul className="mt-3.5 space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[13.5px] leading-relaxed text-white/65">
                        <Check size={13} className="mt-1 shrink-0 text-white/50" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>

          {/* specs + changelog */}
          <Reveal delay={0.1}>
            <h2 className="flex items-center gap-2.5 font-display text-xl font-medium text-white/95">
              <MonitorSmartphone size={16} className="text-accent-300" aria-hidden /> Specifications
            </h2>
            <dl className="mt-5 divide-y divide-white/[0.06] rounded-2xl border border-white/[0.07] bg-ink-900/50">
              {specs.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 px-5 py-3.5">
                  <dt className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/50">{label}</dt>
                  <dd className="text-right text-[13px] leading-relaxed text-white/75">{value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-10 flex items-center gap-2.5 font-display text-xl font-medium text-white/95">
              <History size={16} className="text-accent-300" aria-hidden /> What’s new
            </h2>
            <ol className="mt-5 space-y-0 rounded-2xl border border-white/[0.07] bg-ink-900/50 p-2">
              {product.changelog.map((entry, i) => (
                <li key={entry.version} className="flex gap-4 rounded-xl px-3 py-3.5 transition-colors hover:bg-white/[0.03]">
                  <span className={'mt-1 h-2 w-2 shrink-0 rounded-full ' + (i === 0 ? 'bg-accent-400' : 'bg-white/20')} aria-hidden />
                  <div>
                    <p className="font-mono text-[11.5px] text-white/70">
                      v{entry.version} <span className="text-white/50">· {entry.date}</span>
                      {i === 0 && <span className="ml-2 rounded-full bg-accent-500/15 px-2 py-0.5 text-[9.5px] uppercase tracking-[0.14em] text-accent-300">Latest</span>}
                    </p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-white/55">{entry.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        {/* license */}
        <Reveal className="mt-16">
          <div className="rounded-2xl border border-white/[0.07] bg-ink-900/50 p-7 lg:p-9">
            <h2 className="flex items-center gap-2.5 font-display text-xl font-medium text-white/95">
              <Scale size={16} className="text-accent-300" aria-hidden /> License
            </h2>
            <p className="mt-4 max-w-3xl text-[14px] leading-[1.8] text-white/60">{product.license}</p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
              Full license text ships in every download · Extended licenses: hello@axryzure.store
            </p>
          </div>
        </Reveal>

        {/* FAQ */}
        <div className="mt-24">
          <Reveal>
            <p className="eyebrow">Questions</p>
            <h2 className="mt-3 font-display text-display-sm font-medium text-white/95">Frequently asked</h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-8">
            <Accordion items={faqItems} />
          </Reveal>
        </div>

        {/* reviews */}
        <div className="mt-24" id="reviews">
          <Reviews product={product} />
        </div>

        {/* related */}
        <div className="mt-24">
          <Reveal>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Keep exploring</p>
                <h2 className="mt-3 font-display text-display-sm font-medium text-white/95">Pairs well with</h2>
              </div>
              <Link
                to="/shop"
                className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50 transition-colors hover:text-accent-300 sm:inline-flex"
              >
                All products <ArrowRight size={12} aria-hidden />
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <ProductCard product={p} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
