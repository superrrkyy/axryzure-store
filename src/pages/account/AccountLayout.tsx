import { NavLink, Outlet } from 'react-router-dom'
import { User, Package, Download, Settings, Heart } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { Avatar } from '@/components/ui/Avatar'
import { cx } from '@/utils/format'
import { usePageTitle } from '@/hooks/usePageTitle'

/* Account shell: sidebar nav + nested routes. */

const NAV = [
  { to: '/account', label: 'Profile', icon: User, end: true },
  { to: '/account/orders', label: 'Orders', icon: Package, end: false },
  { to: '/account/downloads', label: 'Downloads', icon: Download, end: false },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart, end: false },
  { to: '/account/settings', label: 'Settings', icon: Settings, end: false },
]

export default function AccountLayout() {
  usePageTitle('Account')
  const { profile, orders, wishlist } = useStore()
  const ownedProducts = new Set(orders.flatMap((o) => o.items.map((i) => i.productId)))

  return (
    <div className="container-x pb-24 pt-10 lg:pt-14">
      <header className="flex flex-wrap items-center gap-5">
        <Avatar name={profile.name} size={64} />
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="mt-2 font-display text-display-sm font-medium text-white">{profile.name}</h1>
          <p className="mt-1 font-mono text-[12px] text-white/55">{profile.email}</p>
        </div>
        <dl className="ml-auto hidden gap-8 sm:flex">
          <div className="text-right">
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">Orders</dt>
            <dd className="mt-1 font-display text-2xl text-white/90">{orders.length}</dd>
          </div>
          <div className="text-right">
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">Products</dt>
            <dd className="mt-1 font-display text-2xl text-white/90">{ownedProducts.size}</dd>
          </div>
          <div className="text-right">
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">Saved</dt>
            <dd className="mt-1 font-display text-2xl text-white/90">{wishlist.length}</dd>
          </div>
        </dl>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[230px_1fr] lg:gap-14">
        <nav aria-label="Account navigation" className="min-w-0 lg:sticky lg:top-32 lg:h-fit">
          <ul className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <li key={to} className="shrink-0 lg:shrink">
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cx(
                      'flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13.5px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400',
                      isActive
                        ? 'bg-accent-500/[0.1] text-accent-200'
                        : 'text-white/55 hover:bg-white/[0.04] hover:text-white/85',
                    )
                  }
                >
                  <Icon size={15} aria-hidden />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
