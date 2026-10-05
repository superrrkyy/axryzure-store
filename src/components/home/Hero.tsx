import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Star } from 'lucide-react'
import { getProduct } from '@/data/products'
import { buttonClasses } from '@/components/ui/Button'
import { ProductArt } from '@/components/product/ProductArt'
import { EASE, cx } from '@/utils/format'

/* Full-bleed editorial hero with layered product composition. */

export function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const artY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90])
  const glowY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140])

  const main = getProduct('axryzure-minimal-ui-kit')!
  const poster = getProduct('axryzure-ultimate-bundle')!
  const mini = getProduct('monolith-icons')!

  const rise = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 28 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  })

  return (
    <section ref={ref} className="relative overflow-hidden pt-12 lg:pt-20" aria-label="AXRYZURE Store — premium digital goods">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          style={{ y: glowY }}
          className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-accent-600/[0.16] blur-[120px]"
        />
        <div className="absolute bottom-0 right-[-10%] h-[380px] w-[520px] rounded-full bg-accent-500/[0.07] blur-[100px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />
        <svg
          className="absolute right-[-140px] top-16 h-[560px] w-[560px] opacity-[0.35]"
          viewBox="0 0 400 400"
          fill="none"
        >
          <g className={reduce ? undefined : 'origin-center animate-[spin_46s_linear_infinite]'}>
            <circle cx="200" cy="200" r="198" stroke="rgba(140,160,250,0.14)" strokeDasharray="2 10" />
            <circle cx="200" cy="200" r="150" stroke="rgba(140,160,250,0.1)" />
            <circle cx="200" cy="2" r="3" fill="#8CA0FA" />
            <circle cx="350" cy="200" r="2" fill="#E4CB86" />
          </g>
        </svg>
      </div>

      <div className="container-x relative">
        <div className="grid items-center gap-14 pb-20 pt-6 lg:grid-cols-12 lg:gap-8 lg:pb-28">
          {/* copy */}
          <div className="lg:col-span-6 xl:col-span-6">
            <motion.div {...rise(0.05)}>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.03] py-1.5 pl-3 pr-4 font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/60 backdrop-blur">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden />
                Season 04 · Curated digital goods
              </p>
            </motion.div>

            <motion.h1
              {...rise(0.14)}
              className="mt-7 font-display text-display-lg font-medium text-white"
            >
              Assets worth
              <br />
              <em className="font-light italic text-accent-300">building</em> with.
            </motion.h1>

            <motion.p {...rise(0.24)} className="mt-6 max-w-md text-[15.5px] leading-relaxed text-white/60">
              AXRYZURE is an independent studio crafting UI kits, website templates, icons and creative
              resources — used by <span className="text-white/85">12,480 designers, developers and makers</span>{' '}
              who refuse to ship ordinary work.
            </motion.p>

            <motion.div {...rise(0.34)} className="mt-9 flex flex-wrap items-center gap-3.5">
              <Link to="/shop" className={buttonClasses('primary', 'lg')}>
                Explore Products
                <ArrowRight size={16} aria-hidden />
              </Link>
              <Link to="/collections" className={buttonClasses('secondary', 'lg')}>
                View Collections
              </Link>
            </motion.div>

            <motion.dl {...rise(0.44)} className="mt-12 flex flex-wrap gap-x-10 gap-y-5">
              {[
                ['16', 'curated products'],
                ['4.9', 'average rating'],
                ['12.4k', 'creators served'],
                ['0s', 'delivery time'],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl font-medium text-white/95">{value}</dt>
                  <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">{label}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* composition */}
          <motion.div style={{ y: artY }} className="relative lg:col-span-6">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 40, rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
              className="relative mx-auto max-w-[560px]"
            >
              {/* back card — poster */}
              <div className="absolute -left-8 -top-10 w-[46%] -rotate-[7deg] rounded-xl border border-white/[0.1] bg-ink-850 shadow-card sm:-left-12">
                <div className="aspect-[4/3] overflow-hidden rounded-xl">
                  <ProductArt product={poster} variant={1} className="h-full w-full" />
                </div>
              </div>

              {/* main card */}
              <div className="group relative z-10 overflow-hidden rounded-2xl border border-white/[0.12] shadow-pop">
                <div className={cx('aspect-[4/3]', reduce ? '' : 'transition-transform duration-[1200ms] group-hover:scale-[1.03]')}>
                  <ProductArt product={main} className="h-full w-full" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.07] via-transparent to-transparent" aria-hidden />
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 bg-ink-950/70 px-5 py-3.5 backdrop-blur-md">
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-medium text-white/95">{main.name}</p>
                    <p className="font-mono text-[10.5px] text-white/50">1,240 components · Figma + React</p>
                  </div>
                  <span className="shrink-0 font-mono text-sm text-white">$29</span>
                </div>
              </div>

              {/* mini card */}
              <div className="absolute -bottom-10 -right-3 w-[38%] rotate-[5deg] rounded-xl border border-white/[0.1] bg-ink-850 shadow-card sm:-right-8">
                <div className="aspect-[4/3] overflow-hidden rounded-xl">
                  <ProductArt product={mini} className="h-full w-full" />
                </div>
              </div>

              {/* floating chips */}
              <motion.div
                animate={reduce ? undefined : { y: [0, -9, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 right-2 z-20 flex items-center gap-2.5 rounded-xl border border-white/[0.12] bg-ink-900/85 px-4 py-3 shadow-pop backdrop-blur-md sm:right-[-14px]"
              >
                <span className="flex gap-0.5 text-gold-400" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                <span className="font-mono text-[11px] text-white/70">4.9 · 12,480 reviews</span>
              </motion.div>

              <motion.div
                animate={reduce ? undefined : { y: [0, 8, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -left-4 bottom-16 z-20 flex items-center gap-2.5 rounded-xl border border-white/[0.12] bg-ink-900/85 px-4 py-3 shadow-pop backdrop-blur-md sm:-left-10"
              >
                <Zap size={13} className="text-accent-400" aria-hidden />
                <span className="font-mono text-[11px] text-white/70">Instant delivery</span>
                <Sparkles size={12} className="text-gold-400" aria-hidden />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-5 lg:justify-start lg:pl-2"
          aria-hidden
        >
          <div className="flex flex-col items-center gap-2.5">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.3em] text-white/85">Scroll</span>
            <div className="relative h-12 w-px overflow-hidden bg-white/[0.12]">
              <motion.span
                className="absolute left-0 top-0 h-1/2 w-px bg-accent-400"
                animate={reduce ? undefined : { y: [-24, 48] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
