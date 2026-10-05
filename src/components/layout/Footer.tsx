import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Twitter, Instagram, Dribbble, Github, ArrowRight } from 'lucide-react'
import { CATEGORIES } from '@/data/categories'
import { Logo } from './Logo'
import { Modal } from '@/components/ui/Modal'
import { useStore } from '@/context/StoreContext'

/* Footer: brand, shop links, account, legal modals, payment badges. */

const LEGAL: Record<string, { title: string; body: string[] }> = {
  terms: {
    title: 'Terms of Sale',
    body: [
      'AXRYZURE STORE sells digital products under a standard commercial license. When you complete checkout, you receive the right to use the purchased files in unlimited personal and commercial projects, including paid client work, in perpetuity.',
      'You may not resell, sublicense, redistribute or include the source files in products whose primary value is the files themselves (templates marketplaces, theme resale, asset packs). If your use case needs this, contact us for an extended license.',
      'All products are digital goods delivered instantly. Prices are in USD; VAT is included where applicable. This storefront is a demo — checkout is simulated and no payment is processed.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    body: [
      'We collect what a storefront needs to function: your email address (for delivery and receipts), your order history, and anonymous usage analytics. We never sell personal data, and we don’t run third-party ad trackers.',
      'This demo keeps everything on your device: your cart, wishlist and orders are stored in your browser’s localStorage. Clearing your browser data removes them — we hold nothing.',
      'Questions about data? hello@axryzure.store — a human answers.',
    ],
  },
  refunds: {
    title: 'Refund Policy',
    body: [
      'Digital goods can’t be “returned”, but bad purchases can be made right. If a product isn’t what you expected, email us within 14 days of purchase and we’ll refund it in full — no forms, no interrogations.',
      'The one exception: files that were clearly misrepresented by us are refunded instantly and we’d like to hear about it. Products you simply never opened are refunded on request; products you’ve shipped to clients and made money with are refunded on request too — we trust you.',
      'Refunds on bundles credit the full bundle price as long as the request arrives within the same 14-day window.',
    ],
  },
}

const PAYMENTS = ['VISA', 'MASTERCARD', 'AMEX', 'PAYPAL', 'APPLE PAY', 'G PAY']

export function Footer() {
  const { pushToast } = useStore()
  const [legal, setLegal] = useState<string | null>(null)
  const [email, setEmail] = useState('')

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      pushToast({ title: 'That email looks off', description: 'Check the address and try again', variant: 'error' })
      return
    }
    pushToast({ title: 'Subscribed to the Dispatch', description: 'Welcome aboard — first issue lands next month', variant: 'success' })
    setEmail('')
  }

  return (
    <footer className="border-t border-white/[0.07] bg-ink-950">
      <div className="container-x py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
          {/* brand */}
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-[13.5px] leading-relaxed text-white/50">
              An independent digital studio crafting tools for people who make things. Every product is
              built, used and maintained by working designers and engineers — never generated, never
              filler.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { icon: Twitter, label: 'AXRYZURE on X' },
                { icon: Instagram, label: 'AXRYZURE on Instagram' },
                { icon: Dribbble, label: 'AXRYZURE on Dribbble' },
                { icon: Github, label: 'AXRYZURE on GitHub' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] text-white/50 transition-all duration-200 hover:border-white/[0.2] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                >
                  <Icon size={16} aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* shop */}
          <nav aria-label="Shop by category">
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/50">Shop</h2>
            <ul className="mt-5 space-y-2.5">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/shop?category=${c.slug}`}
                    className="text-[13.5px] text-white/60 transition-colors hover:text-accent-300"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* explore */}
          <nav aria-label="Explore">
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/50">Explore</h2>
            <ul className="mt-5 space-y-2.5">
              {[
                { to: '/collections', label: 'Collections' },
                { to: '/shop?badge=new&sort=newest', label: 'New arrivals' },
                { to: '/shop?badge=bestseller&sort=popular', label: 'Best sellers' },
                { to: '/shop?sale=true', label: 'On sale' },
                { to: '/wishlist', label: 'Wishlist' },
                { to: '/cart', label: 'Cart' },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-[13.5px] text-white/60 transition-colors hover:text-accent-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* account + dispatch */}
          <div>
            <nav aria-label="Account">
              <h2 className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/50">Account</h2>
              <ul className="mt-5 space-y-2.5">
                {[
                  { to: '/account', label: 'Profile' },
                  { to: '/account/orders', label: 'Orders' },
                  { to: '/account/downloads', label: 'Downloads' },
                  { to: '/account/settings', label: 'Settings' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[13.5px] text-white/60 transition-colors hover:text-accent-300">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <form onSubmit={subscribe} className="mt-7">
              <label htmlFor="footer-dispatch" className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/50">
                The Dispatch
              </label>
              <div className="mt-3 flex overflow-hidden rounded-lg border border-white/[0.1] bg-ink-900 transition-colors focus-within:border-accent-500/60">
                <input
                  id="footer-dispatch"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio.co"
                  className="w-full bg-transparent px-3.5 py-2.5 text-[13px] text-white/85 placeholder:text-white/50 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to the Dispatch newsletter"
                  className="flex w-11 shrink-0 items-center justify-center border-l border-white/[0.1] text-white/60 transition-colors hover:bg-accent-500 hover:text-ink-950"
                >
                  <ArrowRight size={15} aria-hidden />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col gap-5 border-t border-white/[0.07] pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="font-mono text-[11px] text-white/50">© 2026 AXRYZURE Studio · Est. 2021</p>
            {Object.keys(LEGAL).map((key) => (
              <button
                key={key}
                onClick={() => setLegal(key)}
                className="font-mono text-[11px] text-white/50 transition-colors hover:text-accent-300"
              >
                {LEGAL[key].title}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5" aria-label="Accepted payment methods">
            {PAYMENTS.map((p) => (
              <span
                key={p}
                className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 font-mono text-[9px] tracking-[0.12em] text-white/55"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-6 font-mono text-[10px] leading-relaxed tracking-wide text-white/50">
          Demo storefront — checkout and payments are simulated. No real charges are made. Crafted with
          React, TypeScript and unreasonable attention to detail.
        </p>
      </div>

      <Modal open={!!legal} onClose={() => setLegal(null)} title={legal ? LEGAL[legal].title : ''} size="md">
        {legal && (
          <div className="space-y-4 p-6">
            {LEGAL[legal].body.map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-white/65">
                {para}
              </p>
            ))}
          </div>
        )}
      </Modal>
    </footer>
  )
}
