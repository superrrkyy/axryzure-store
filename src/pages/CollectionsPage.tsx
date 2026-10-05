import { Link } from 'react-router-dom'
import { ArrowRight, Layers } from 'lucide-react'
import { COLLECTIONS } from '@/data/collections'
import { getProduct } from '@/data/products'
import { formatPrice } from '@/utils/format'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProductArt } from '@/components/product/ProductArt'
import { usePageTitle } from '@/hooks/usePageTitle'

/* /collections — editorial walkthrough of the four collections. */

export default function CollectionsPage() {
  usePageTitle('Collections')
  return (
    <div className="pb-24 pt-10 lg:pt-14">
      <div className="container-x">
        <header className="max-w-2xl">
          <p className="eyebrow">Curated collections</p>
          <h1 className="mt-3 font-display text-display-md font-medium text-white">
            Four starting points, one standard.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-white/55">
            Collections aren’t product dumps — each one is a considered path through the catalog, built
            around how people actually work. Pick the one that sounds like you.
          </p>
        </header>

        <div className="mt-16 space-y-20 lg:space-y-28">
          {COLLECTIONS.map((collection, idx) => {
            const products = collection.productSlugs.map(getProduct).filter((p) => p !== undefined)
            const totalValue = products.reduce((n, p) => n + p.price, 0)
            const fullValue = products.reduce((n, p) => n + (p.originalPrice ?? p.price), 0)
            return (
              <Reveal key={collection.slug}>
                <section
                  aria-labelledby={`collection-${collection.slug}`}
                  className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
                >
                  {/* art side */}
                  <div className={idx % 2 === 1 ? 'lg:order-2' : undefined}>
                    <div className="relative overflow-hidden">
                      <div
                        className="pointer-events-none absolute -inset-8 rounded-[32px] opacity-50 blur-3xl"
                        style={{ background: `${collection.art.a}1f` }}
                        aria-hidden
                      />
                      <div className="relative flex flex-wrap gap-4">
                        {products.slice(0, 3).map((p, i) => (
                          <Link
                            key={p.slug}
                            to={`/product/${p.slug}`}
                            className={
                              'group block overflow-hidden rounded-2xl border border-white/[0.1] bg-ink-850 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-white/[0.2] ' +
                              (i === 0 ? 'w-[58%]' : 'mt-8 w-[34%]')
                            }
                            aria-label={p.name}
                          >
                            <div className={i === 0 ? 'aspect-[4/3]' : 'aspect-[3/4]'}>
                              <div className="h-full w-full transition-transform duration-[900ms] group-hover:scale-[1.06]">
                                <ProductArt product={p} variant={i === 0 ? 0 : i === 1 ? 2 : 1} className="h-full w-full" />
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* copy side */}
                  <div className={idx % 2 === 1 ? 'lg:order-1' : undefined}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent-300/80">
                      № {String(idx + 1).padStart(2, '0')} — {collection.tagline}
                    </p>
                    <h2 id={`collection-${collection.slug}`} className="mt-4 font-display text-display-sm font-medium text-white">
                      {collection.name}
                    </h2>
                    <p className="mt-4 text-[15px] leading-relaxed text-white/60">{collection.description}</p>

                    <blockquote className="mt-6 border-l-2 border-accent-500/50 pl-5 text-[14px] italic leading-relaxed text-white/50">
                      “{collection.curatorNote}”
                    </blockquote>

                    <ul className="mt-7 space-y-2.5">
                      {products.map((p) => (
                        <li key={p.slug}>
                          <Link
                            to={`/product/${p.slug}`}
                            className="group flex items-center justify-between gap-4 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                          >
                            <span className="flex items-center gap-3 text-[14px] text-white/75 transition-colors group-hover:text-white">
                              <Layers size={13} className="text-white/50" aria-hidden />
                              {p.name}
                            </span>
                            <span className="font-mono text-[13px] text-white/55">{formatPrice(p.price)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap items-center gap-5">
                      <Link
                        to={`/shop?collection=${collection.slug}`}
                        className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent-500 px-5 text-sm font-medium text-ink-950 shadow-glow-sm transition-all hover:bg-accent-400 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
                      >
                        Explore the collection <ArrowRight size={15} aria-hidden />
                      </Link>
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                        {products.length} products · {formatPrice(totalValue)}
                        {fullValue > totalValue && (
                          <span className="text-white/50 line-through"> {formatPrice(fullValue)}</span>
                        )}
                      </span>
                    </div>
                  </div>
                </section>
              </Reveal>
            )
          })}
        </div>

        {/* all products CTA */}
        <Reveal className="mt-24">
          <SectionHeader
            eyebrow="Not sure where to start?"
            title="Browse everything instead"
            description="Sixteen products, filterable by category, price, rating and availability."
            linkTo="/shop"
            linkLabel="Shop all products"
          />
        </Reveal>
      </div>
    </div>
  )
}
