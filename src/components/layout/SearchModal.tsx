import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, ArrowRight, Clock, X } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { searchProducts } from '@/utils/catalog'
import { categoryName } from '@/utils/catalog'
import { formatPrice, cx, EASE } from '@/utils/format'
import { ProductArt } from '@/components/product/ProductArt'
import { Badge } from '@/components/ui/Badge'

/* ⌘K command-palette search with keyboard navigation + recents. */

const RECENTS_KEY = 'axryzure:v1:recentSearches'

export function SearchModal() {
  const { searchOpen, setSearchOpen } = useStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [recents, setRecents] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENTS_KEY) ?? '[]')
    } catch {
      return []
    }
  })
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => searchProducts(query, 7), [query])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(!searchOpen)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [searchOpen, setSearchOpen])

  useEffect(() => {
    if (searchOpen) {
      setQuery('')
      setActive(0)
      const t = window.setTimeout(() => inputRef.current?.focus(), 60)
      const { overflow } = document.body.style
      document.body.style.overflow = 'hidden'
      return () => {
        window.clearTimeout(t)
        document.body.style.overflow = overflow
      }
    }
  }, [searchOpen])

  const rememberSearch = (q: string) => {
    const next = [q, ...recents.filter((r) => r !== q)].slice(0, 5)
    setRecents(next)
    try {
      localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }

  const go = (path: string, q?: string) => {
    if (q) rememberSearch(q)
    setSearchOpen(false)
    navigate(path)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchOpen(false)
      return
    }
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (a + 1) % results.length)
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (a - 1 + results.length) % results.length)
    }
    if (e.key === 'Enter' && results[active]) {
      e.preventDefault()
      go(`/product/${results[active].slug}`, query)
    }
  }

  return createPortal(
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[85] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search products">
          <motion.div
            className="absolute inset-0 bg-ink-950/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSearchOpen(false)}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.985 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.1] bg-ink-900 shadow-pop"
            onKeyDown={onKeyDown}
          >
            {/* input */}
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-4">
              <Search size={17} className="shrink-0 text-white/50" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActive(0)
                }}
                placeholder="Search UI kits, templates, icons…"
                aria-label="Search products"
                className="w-full bg-transparent text-[15px] text-white/90 placeholder:text-white/50 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="rounded p-1 text-white/50 hover:text-white/80"
                >
                  <X size={14} aria-hidden />
                </button>
              )}
              <kbd className="hidden shrink-0 rounded border border-white/[0.12] bg-white/[0.05] px-1.5 py-0.5 font-mono text-[9.5px] text-white/50 sm:block">
                ESC
              </kbd>
            </div>

            {/* results */}
            <div className="max-h-[52vh] overflow-y-auto p-2" role="listbox" aria-label="Search results">
              {query.trim() === '' && (
                <div className="p-3">
                  {recents.length > 0 && (
                    <>
                      <p className="px-3 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                        Recent searches
                      </p>
                      <div className="mb-3 flex flex-wrap gap-2">
                        {recents.map((r) => (
                          <button
                            key={r}
                            onClick={() => setQuery(r)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] px-3 py-1.5 text-[13px] text-white/65 transition-colors hover:border-white/[0.2] hover:text-white"
                          >
                            <Clock size={12} aria-hidden /> {r}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  <p className="px-3 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Popular right now
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['UI kit', 'portfolio', 'icons', 'dashboard', 'bundle'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="rounded-full border border-white/[0.1] px-3 py-1.5 text-[13px] text-white/65 transition-colors hover:border-accent-500/50 hover:text-accent-300"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.trim() !== '' && results.length === 0 && (
                <div className="px-6 py-10 text-center">
                  <p className="text-sm text-white/60">
                    No results for <span className="text-white">“{query}”</span>
                  </p>
                  <button
                    onClick={() => go(`/shop?q=${encodeURIComponent(query)}`, query)}
                    className="mt-3 text-[13px] font-medium text-accent-300 hover:text-accent-200"
                  >
                    Browse the full shop instead →
                  </button>
                </div>
              )}

              {results.map((product, i) => (
                <button
                  key={product.id}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(`/product/${product.slug}`, query)}
                  className={cx(
                    'flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-left transition-colors',
                    i === active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]',
                  )}
                >
                  <span className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-white/[0.08]">
                    <ProductArt product={product} className="h-full w-full" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-white/90">{product.name}</span>
                    <span className="block font-mono text-[11px] text-white/50">
                      {categoryName(product.category)} · {product.type}
                    </span>
                  </span>
                  {product.originalPrice && <Badge tone="sale">−{Math.round((1 - product.price / product.originalPrice) * 100)}%</Badge>}
                  <span className="font-mono text-[13px] text-white/70">{formatPrice(product.price)}</span>
                  <ArrowRight size={14} className="shrink-0 text-white/50" aria-hidden />
                </button>
              ))}

              {query.trim() !== '' && results.length > 0 && (
                <button
                  onClick={() => go(`/shop?q=${encodeURIComponent(query)}`, query)}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border-t border-white/[0.06] px-3 py-3.5 text-[13px] font-medium text-white/60 transition-colors hover:text-accent-300"
                >
                  View all results in the shop <ArrowRight size={13} aria-hidden />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
