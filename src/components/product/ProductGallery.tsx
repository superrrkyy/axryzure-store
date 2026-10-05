import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import type { Product } from '@/types'
import { EASE, cx } from '@/utils/format'
import { ProductArt } from './ProductArt'
import { Modal } from '@/components/ui/Modal'

const VARIANTS = [0, 1, 2, 3] as const
const THUMB_LABELS = ['Overview', 'Poster', 'Pattern', 'Detail']

/* Product gallery: main view with crossfade, thumbnails, lightbox. */

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState<(typeof VARIANTS)[number]>(0)
  const [lightbox, setLightbox] = useState(false)

  const step = (dir: 1 | -1) =>
    setActive((v) => ((v + dir + VARIANTS.length) % VARIANTS.length) as (typeof VARIANTS)[number])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') step(-1)
    if (e.key === 'ArrowRight') step(1)
  }

  return (
    <div>
      {/* main image */}
      <div
        className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-850 focus-visible:outline-none"
        tabIndex={0}
        role="figure"
        aria-label={`${product.name} preview — ${THUMB_LABELS[active]}`}
        onKeyDown={onKey}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <ProductArt product={product} variant={active} className="h-full w-full" />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-ink-950/60 text-white/75 backdrop-blur-md transition-all hover:border-white/[0.25] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          aria-label="Open full preview"
        >
          <Expand size={15} aria-hidden />
        </button>

        <GalleryArrow side="left" onClick={() => step(-1)} />
        <GalleryArrow side="right" onClick={() => step(1)} />

        <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {VARIANTS.map((v) => (
            <span
              key={v}
              className={cx(
                'h-1 rounded-full transition-all duration-300',
                v === active ? 'w-6 bg-white/80' : 'w-2 bg-white/25',
              )}
            />
          ))}
        </div>
      </div>

      {/* thumbnails */}
      <div className="mt-3 grid grid-cols-4 gap-3" role="tablist" aria-label="Product previews">
        {VARIANTS.map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={v === active}
            onClick={() => setActive(v)}
            className={cx(
              'relative aspect-[4/3] overflow-hidden rounded-lg border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400',
              v === active
                ? 'border-accent-500/80 shadow-glow-sm'
                : 'border-white/[0.07] opacity-60 hover:opacity-100 hover:border-white/[0.18]',
            )}
            aria-label={`Show ${THUMB_LABELS[v]} preview`}
          >
            <ProductArt product={product} variant={v} className="h-full w-full" />
          </button>
        ))}
      </div>

      {/* lightbox */}
      <Modal open={lightbox} onClose={() => setLightbox(false)} title={product.name} size="xl">
        <div className="relative aspect-[4/3] max-h-[70vh] w-full bg-ink-950">
          <ProductArt product={product} variant={active} className="h-full w-full" />
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/50">
            {THUMB_LABELS[active]} — {product.name}
          </p>
          <div className="flex gap-2">
            {VARIANTS.map((v) => (
              <button
                key={v}
                onClick={() => setActive(v)}
                aria-label={`Switch to ${THUMB_LABELS[v]}`}
                className={cx(
                  'h-8 w-8 rounded-md border text-[11px] font-mono transition-colors',
                  v === active
                    ? 'border-accent-500/70 bg-accent-500/15 text-accent-300'
                    : 'border-white/[0.1] text-white/50 hover:text-white',
                )}
              >
                {v + 1}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}

function GalleryArrow({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.12] bg-ink-950/55 text-white/75 opacity-0 backdrop-blur-md transition-all duration-200 hover:border-white/[0.28] hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 group-hover:opacity-100',
        side === 'left' ? 'left-3' : 'right-3',
      )}
      aria-label={side === 'left' ? 'Previous preview' : 'Next preview'}
    >
      <Icon size={16} aria-hidden />
    </button>
  )
}
