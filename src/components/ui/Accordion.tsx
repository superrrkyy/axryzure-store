import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { FaqItem } from '@/types'
import { EASE, cx } from '@/utils/format'

/* Smooth accordion used for FAQs. */

export function Accordion({ items, defaultOpen = -1 }: { items: FaqItem[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.07] bg-ink-900/60">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q}>
            <h3>
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-button-${i}`}
                className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left transition-colors hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-400"
              >
                <span className={cx('text-[15px] font-medium transition-colors', isOpen ? 'text-white' : 'text-white/80')}>
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={cx(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                    isOpen
                      ? 'rotate-45 border-accent-500/50 bg-accent-500/10 text-accent-300'
                      : 'border-white/[0.12] text-white/50',
                  )}
                >
                  <Plus size={14} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 pr-14 text-sm leading-relaxed text-white/60">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
