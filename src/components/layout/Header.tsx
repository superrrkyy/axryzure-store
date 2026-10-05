import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Heart, ShoppingBag, User, Menu, X, ArrowRight } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { cx, EASE } from '@/utils/format'
import { Logo } from './Logo'

const NAV = [
  { to: '/shop', label: 'Shop' },
  { to: '/collections', label: 'Collections' },
  { to: '/shop?badge=new&sort=newest', label: 'New Arrivals', match: 'badge=new' },
  { to: '/shop?badge=bestseller&sort=popular', label: 'Best Sellers', match: 'badge=bestseller' },
]

/* Sticky header + announcement bar + mobile drawer. */

export function Header() {
  const { cartCount, wishlist, setCartOpen, setSearchOpen } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname, location.search])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const isActive = (item: (typeof NAV)[number]) => {
    if (item.match) return location.search.includes(item.match) && location.pathname === '/shop'
    return location.pathname === item.to
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-accent-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink-950"
      >
        Skip to content
      </a>

      {/* announcement — scrolls away naturally */}
      <AnimatePresence>
        {showAnnouncement && (
          <motion.div
            role="region"
            aria-label="Announcement"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden border-b border-white/[0.06] bg-ink-900"
          >
            <div className="container-x flex items-center justify-center gap-3 py-2 text-center">
              <span className="pulse-dot m-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" aria-hidden />
              <p className="truncate font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/60">
                Season 04 — the Ultimate Bundle is 38% off · 500 licenses
              </p>
              <Link
                to="/product/axryzure-ultimate-bundle"
                className="hidden shrink-0 items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-accent-300 transition-colors hover:text-accent-200 sm:inline-flex"
              >
                View <ArrowRight size={11} aria-hidden />
              </Link>
              <button
                onClick={() => setShowAnnouncement(false)}
                aria-label="Dismiss announcement"
                className="ml-1 rounded p-1 text-white/50 transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                <X size={12} aria-hidden />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* main bar — sticky, in flow */}
      <header
        className={cx(
          'sticky top-0 z-50 border-b transition-all duration-300',
          scrolled
            ? 'border-white/[0.07] bg-ink-950/85 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.7)] backdrop-blur-xl'
            : 'border-transparent bg-ink-950/40 backdrop-blur-md',
        )}
      >
        <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <Logo compact />

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                aria-current={isActive(item) ? 'page' : undefined}
                className={cx(
                  'relative rounded-lg px-4 py-2 text-[13.5px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400',
                  isActive(item) ? 'text-white' : 'text-white/60 hover:text-white/90',
                )}
              >
                {item.label}
                {isActive(item) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-4 -bottom-[1px] h-[2px] rounded-full bg-accent-500"
                    transition={{ duration: 0.3, ease: EASE }}
                  />
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <HeaderIconButton
              label="Search products (Ctrl K)"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex"
            >
              <Search size={17} aria-hidden />
              <kbd className="ml-2 hidden rounded border border-white/[0.12] bg-white/[0.05] px-1.5 py-0.5 font-mono text-[9.5px] text-white/50 xl:inline">
                ⌘K
              </kbd>
            </HeaderIconButton>
            <HeaderIconButton label="Search" onClick={() => setSearchOpen(true)} className="sm:hidden">
              <Search size={18} aria-hidden />
            </HeaderIconButton>
            <HeaderIconButton
              label="Wishlist"
              to="/wishlist"
              badge={wishlist.length || undefined}
              badgeLabel={wishlist.length ? `${wishlist.length} saved` : undefined}
            >
              <Heart size={17} aria-hidden />
            </HeaderIconButton>
            <HeaderIconButton label="Cart" onClick={() => setCartOpen(true)} badge={cartCount || undefined} badgeLabel={cartCount ? `${cartCount} in cart` : undefined}>
              <ShoppingBag size={17} aria-hidden />
            </HeaderIconButton>
            <HeaderIconButton label="Account" to="/account" className="hidden sm:flex">
              <User size={17} aria-hidden />
            </HeaderIconButton>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 lg:hidden"
            >
              <Menu size={19} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/* mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
            <motion.div
              className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col border-l border-white/[0.08] bg-ink-900"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
                <Logo compact />
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                >
                  <X size={18} aria-hidden />
                </button>
              </div>
              <nav className="flex flex-col gap-1 overflow-y-auto px-4 py-6" aria-label="Mobile">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: EASE }}
                  >
                    <Link
                      to={item.to}
                      className="flex items-center justify-between rounded-xl px-4 py-3.5 font-display text-2xl text-white/85 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                    >
                      {item.label}
                      <ArrowRight size={18} className="text-white/50" aria-hidden />
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.32, duration: 0.4, ease: EASE }}
                  className="h-px bg-white/[0.07] my-4"
                />
                {[
                  { to: '/account', label: 'Account' },
                  { to: '/account/orders', label: 'Orders' },
                  { to: '/account/downloads', label: 'Downloads' },
                  { to: '/wishlist', label: 'Wishlist' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.36 + i * 0.05, duration: 0.4, ease: EASE }}
                  >
                    <Link
                      to={item.to}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-[15px] text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                    >
                      {item.label}
                      <ArrowRight size={15} className="text-white/50" aria-hidden />
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto border-t border-white/[0.07] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Season 04 · Live now
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                  The Ultimate Bundle — every product, lifetime updates. 500 licenses this season.
                </p>
                <Link
                  to="/product/axryzure-ultimate-bundle"
                  className="mt-3 inline-flex items-center gap-2 text-[13px] font-medium text-accent-300 transition-colors hover:text-accent-200"
                >
                  View the bundle <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

function HeaderIconButton({
  children,
  label,
  to,
  onClick,
  badge,
  badgeLabel,
  className,
}: {
  children: React.ReactNode
  label: string
  to?: string
  onClick?: () => void
  badge?: number
  badgeLabel?: string
  className?: string
}) {
  const inner = (
    <>
      {children}
      {badge !== undefined && (
        <motion.span
          key={badge}
          initial={{ scale: 0.4 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-accent-500 px-1 font-mono text-[10px] font-semibold text-ink-950"
        >
          {badge}
        </motion.span>
      )}
    </>
  )
  const cls = cx(
    'relative flex h-10 w-10 items-center justify-center rounded-lg text-white/70 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400',
    className,
  )
  if (to) {
    return (
      <Link to={to} aria-label={badgeLabel ? `${label} — ${badgeLabel}` : label} className={cls}>
        {inner}
      </Link>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={badgeLabel ? `${label} — ${badgeLabel}` : label}
      className={cls}
    >
      {inner}
    </button>
  )
}
