import { NavLink, useLocation } from 'react-router-dom'
import { Home, LayoutGrid, Search, Heart, ShoppingBag } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { cx } from '@/utils/format'

/* Bottom tab bar — mobile only. Safe-area aware. */

export function MobileTabBar() {
  const { cartCount, wishlist, setCartOpen, setSearchOpen } = useStore()
  const location = useLocation()

  const items = [
    { to: '/', label: 'Home', icon: Home, active: location.pathname === '/' },
    { to: '/shop', label: 'Shop', icon: LayoutGrid, active: location.pathname === '/shop' },
  ]

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-ink-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <div className="grid h-16 grid-cols-5">
        {items.map(({ to, label, icon: Icon, active }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            className={cx(
              'flex flex-col items-center justify-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-400',
              active ? 'text-accent-300' : 'text-white/50 hover:text-white/80',
            )}
          >
            <Icon size={20} aria-hidden strokeWidth={active ? 2.2 : 1.8} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}

        <button
          onClick={() => setSearchOpen(true)}
          aria-label="Search products"
          className="flex flex-col items-center justify-center gap-1 text-white/50 transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-400"
        >
          <Search size={20} aria-hidden strokeWidth={1.8} />
          <span className="text-[10px] font-medium">Search</span>
        </button>

        <NavLink
          to="/wishlist"
          aria-label={`Wishlist${wishlist.length ? `, ${wishlist.length} saved` : ''}`}
          className={cx(
            'flex flex-col items-center justify-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-400',
            location.pathname === '/wishlist' ? 'text-accent-300' : 'text-white/50 hover:text-white/80',
          )}
        >
          <span className="relative">
            <Heart size={20} aria-hidden strokeWidth={1.8} />
            {wishlist.length > 0 && (
              <span className="absolute -right-1.5 -top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-rose-400 px-0.5 font-mono text-[9px] font-semibold text-ink-950">
                {wishlist.length}
              </span>
            )}
          </span>
          <span className="text-[10px] font-medium">Saved</span>
        </NavLink>

        <button
          onClick={() => setCartOpen(true)}
          aria-label={`Cart${cartCount ? `, ${cartCount} items` : ''}`}
          className="flex flex-col items-center justify-center gap-1 text-white/50 transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-400"
        >
          <span className="relative">
            <ShoppingBag size={20} aria-hidden strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-accent-500 px-0.5 font-mono text-[9px] font-semibold text-ink-950">
                {cartCount}
              </span>
            )}
          </span>
          <span className="text-[10px] font-medium">Cart</span>
        </button>
      </div>
    </nav>
  )
}
