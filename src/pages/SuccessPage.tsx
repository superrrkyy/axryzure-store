import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Download, ArrowRight, Mail, Copy, Check, ReceiptText, PackageOpen } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { getProductById } from '@/data/products'
import { formatPrice, formatDate, EASE } from '@/utils/format'
import { licenseKey, downloadLicense, downloadReceipt } from '@/utils/licenses'
import { ProductArt } from '@/components/product/ProductArt'
import { Button, buttonClasses } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'

/* /success — premium order confirmation with animated check, order
   details and working (mock) downloads. */

export default function SuccessPage() {
  usePageTitle('Order confirmed')
  const { orders, findOrder, pushToast } = useStore()
  const [params] = useSearchParams()
  const [copied, setCopied] = useState(false)

  const order = (params.get('order') ? findOrder(params.get('order')!) : undefined) ?? orders[0]

  if (!order) {
    return (
      <div className="container-x flex min-h-[70vh] flex-col items-center justify-center pb-24 pt-[140px] text-center">
        <PackageOpen size={36} className="text-white/50" aria-hidden />
        <h1 className="mt-6 font-display text-display-sm font-medium text-white">No recent order found</h1>
        <p className="mt-3 max-w-sm text-[15px] text-white/55">
          This page shows your most recent confirmation. Place an order and it will live here — and in
          Account → Orders — forever.
        </p>
        <Link to="/shop" className={buttonClasses('primary', 'md', 'mt-7')}>
          Explore the shop <ArrowRight size={15} aria-hidden />
        </Link>
      </div>
    )
  }

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.number)
      setCopied(true)
      pushToast({ title: 'Order number copied', variant: 'success' })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      pushToast({ title: order.number, variant: 'info' })
    }
  }

  return (
    <div className="container-x pb-24 pt-16 lg:pt-24">
      <div className="mx-auto max-w-3xl">
        {/* animated confirmation */}
        <div className="flex flex-col items-center text-center">
          <SuccessMark />
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: EASE }}
            className="mt-8 font-display text-display-md font-medium text-white"
          >
            Thank you, {order.name.split(' ')[0]}.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease: EASE }}
            className="mt-4 max-w-md text-[15px] leading-relaxed text-white/55"
          >
            Your order is confirmed and your files are ready below. A receipt and backup download links
            are on their way to <span className="text-white/85">{order.email}</span>.
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            onClick={copyNumber}
            className="group mt-6 inline-flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-ink-900/70 px-5 py-2.5 font-mono text-sm text-white/80 transition-colors hover:border-white/[0.2]"
            aria-label={`Copy order number ${order.number}`}
          >
            Order {order.number}
            {copied ? (
              <Check size={13} className="text-emerald-400" aria-hidden />
            ) : (
              <Copy size={13} className="text-white/50 transition-colors group-hover:text-white/70" aria-hidden />
            )}
          </motion.button>
        </div>

        {/* downloads */}
        <motion.section
          aria-label="Your downloads"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7, ease: EASE }}
          className="mt-14 overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900/50"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-6 py-5">
            <h2 className="font-display text-xl text-white/95">Your downloads</h2>
            <button
              onClick={() => downloadReceipt(order)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] px-3.5 py-2 text-xs font-medium text-white/70 transition-colors hover:border-accent-500/50 hover:text-accent-300"
            >
              <ReceiptText size={13} aria-hidden /> Download receipt
            </button>
          </div>
          <ul className="divide-y divide-white/[0.06]">
            {order.items.map((item) => {
              const product = getProductById(item.productId)
              return (
                <li key={item.productId} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                  <span className="h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-white/[0.08]">
                    {product && <ProductArt product={product} className="h-full w-full" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-medium text-white/95">{item.name}</h3>
                    <p className="mt-1 font-mono text-[11px] text-white/50">
                      v{product?.version} · {product?.fileSize} · {product?.formats.slice(0, 3).join(' / ')}
                    </p>
                    <p className="mt-1.5 font-mono text-[11px] text-accent-300/80">
                      License key: AXZ-{licenseKey(item.slug, order.number)}
                    </p>
                  </div>
                  <Button
                    onClick={() => product && downloadLicense(product, order)}
                    className="sm:ml-4"
                  >
                    <Download size={15} aria-hidden /> Download
                  </Button>
                </li>
              )
            })}
          </ul>
        </motion.section>

        {/* summary */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7, ease: EASE }}
          className="mt-6 grid gap-6 rounded-2xl border border-white/[0.08] bg-ink-900/50 p-6 sm:grid-cols-3"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Date</p>
            <p className="mt-2 text-[14px] text-white/80">{formatDate(order.date)}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Payment</p>
            <p className="mt-2 text-[14px] text-white/80">{order.paymentMethod}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Total paid</p>
            <p className="mt-2 font-mono text-[14px] text-white/90">
              {order.discount > 0 && (
                <span className="mr-2 text-white/50 line-through">{formatPrice(order.subtotal)}</span>
              )}
              {formatPrice(order.total)}
              {order.promoCode && <span className="ml-2 text-accent-300">{order.promoCode}</span>}
            </p>
          </div>
        </motion.div>

        {/* next steps */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7, ease: EASE }}
          className="mt-10 flex flex-col items-center gap-4 text-center"
        >
          <div className="flex flex-wrap justify-center gap-3.5">
            <Link to="/account/downloads" className={buttonClasses('primary', 'md')}>
              <Download size={15} aria-hidden /> Access in your account
            </Link>
            <Link to="/shop" className={buttonClasses('secondary', 'md')}>
              Continue shopping <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
          <p className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/50">
            <Mail size={11} aria-hidden /> Receipt sent to {order.email}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

/* --- animated check with particle burst ------------------------------ */

function SuccessMark() {
  const reduce = useReducedMotion()
  return (
    <div className="relative flex h-24 w-24 items-center justify-center" aria-hidden>
      <motion.span
        className="absolute inset-0 rounded-full bg-accent-500/[0.12]"
        initial={reduce ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: [0.4, 1.25, 1], opacity: [0, 0.9, 1] }}
        transition={{ duration: 0.8, ease: EASE }}
      />
      <motion.svg viewBox="0 0 64 64" className="relative h-16 w-16">
        <motion.circle
          cx="32"
          cy="32"
          r="29"
          fill="none"
          stroke="#6F87F8"
          strokeWidth="2.5"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
        />
        <motion.path
          d="M20 33.5 28.5 42 44 25"
          fill="none"
          stroke="#8CA0FA"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
        />
      </motion.svg>
      {!reduce &&
        Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{
                background: i % 2 === 0 ? '#8CA0FA' : '#E4CB86',
                left: '50%',
                top: '50%',
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(angle) * 64,
                y: Math.sin(angle) * 64,
                opacity: 0,
                scale: 0.4,
              }}
              transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            />
          )
        })}
    </div>
  )
}
