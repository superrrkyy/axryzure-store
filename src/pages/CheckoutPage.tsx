import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Lock, Check, ChevronLeft, CreditCard, Wallet, Apple, Tag, ShieldCheck,
  Zap, User, FileText, AlertCircle,
} from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import type { Order, OrderItem } from '@/types'
import { formatPrice, EASE, cx } from '@/utils/format'
import { Input, Select, Checkbox, RadioCard } from '@/components/ui/Field'
import { Button, buttonClasses } from '@/components/ui/Button'
import { ProductArt } from '@/components/product/ProductArt'
import { usePageTitle } from '@/hooks/usePageTitle'

/* ------------------------------------------------------------------ */
/*  /checkout — 4-step mock checkout (customer → billing → payment    */
/*  → review). No real payment processing; structured so Stripe or    */
/*  another provider can be wired into placeOrder().                  */
/* ------------------------------------------------------------------ */

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Netherlands',
  'Spain', 'Italy', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Portugal',
  'Australia', 'New Zealand', 'Japan', 'South Korea', 'Singapore', 'Indonesia',
  'India', 'Brazil', 'Mexico', 'South Africa', 'Other',
]

const STEPS = [
  { n: 1, label: 'Customer', icon: User },
  { n: 2, label: 'Billing', icon: FileText },
  { n: 3, label: 'Payment', icon: CreditCard },
  { n: 4, label: 'Review', icon: Check },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CheckoutPage() {
  usePageTitle('Checkout')
  const { cartLines, subtotal, discount, total, promo, applyPromo, removePromo, addOrder, clearCart, pushToast } = useStore()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [placing, setPlacing] = useState(false)
  const [promoInput, setPromoInput] = useState('')

  const [customer, setCustomer] = useState({ email: '', firstName: '', lastName: '', country: 'United States' })
  const [billingSame, setBillingSame] = useState(true)
  const [billing, setBilling] = useState({ address: '', city: '', postal: '', country: 'United States' })
  const [method, setMethod] = useState<'card' | 'paypal' | 'applepay'>('card')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvc: '' })
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const cardBrand = useMemo(() => {
    const d = card.number.replace(/\s/g, '')
    if (d.startsWith('4')) return 'Visa'
    if (/^5[1-5]/.test(d)) return 'Mastercard'
    if (/^3[47]/.test(d)) return 'Amex'
    return null
  }, [card.number])

  if (cartLines.length === 0) {
    return (
      <div className="container-x flex min-h-[70vh] flex-col items-center justify-center pb-24 pt-[140px] text-center">
        <h1 className="font-display text-display-sm font-medium text-white">Nothing to check out</h1>
        <p className="mt-3 max-w-sm text-[15px] text-white/55">
          Your cart is empty — add a product first and we’ll take it from there.
        </p>
        <Link to="/shop" className={buttonClasses('primary', 'md', 'mt-7')}>
          Browse the shop
        </Link>
      </div>
    )
  }

  const validateStep = (n: number): boolean => {
    const errs: Record<string, string> = {}
    if (n === 1) {
      if (!EMAIL_RE.test(customer.email)) errs.email = 'Enter a valid email — your files and receipt go here'
      if (customer.firstName.trim().length < 2) errs.firstName = 'Required'
      if (customer.lastName.trim().length < 2) errs.lastName = 'Required'
    }
    if (n === 2 && !billingSame) {
      if (billing.address.trim().length < 4) errs.address = 'Enter your street address'
      if (billing.city.trim().length < 2) errs.city = 'Required'
      if (billing.postal.trim().length < 2) errs.postal = 'Required'
    }
    if (n === 3 && method === 'card') {
      const digits = card.number.replace(/\s/g, '')
      if (digits.length < 15) errs.cardNumber = 'Enter the 16-digit card number'
      if (card.name.trim().length < 3) errs.cardName = 'Name as printed on the card'
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) errs.cardExpiry = 'MM/YY'
      if (!/^\d{3,4}$/.test(card.cvc)) errs.cardCvc = '3–4 digits'
    }
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = document.querySelector<HTMLElement>('[aria-invalid="true"]')
      first?.focus()
      return false
    }
    return true
  }

  const next = () => {
    if (!validateStep(step)) return
    setStep((s) => Math.min(4, s + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }

  /* --- place order (mock — connect a payment provider here) -------- */
  const placeOrder = () => {
    if (!terms) {
      setErrors({ terms: 'Please accept the terms to continue' })
      return
    }
    setErrors({})
    setPlacing(true)
    window.setTimeout(() => {
      const number = `AXZ-2026-${Math.floor(10000 + Math.random() * 89999)}`
      const items: OrderItem[] = cartLines.map(({ product, qty }) => ({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        qty,
      }))
      const order: Order = {
        id: `order-${Date.now()}`,
        number,
        date: new Date().toISOString(),
        email: customer.email,
        name: `${customer.firstName} ${customer.lastName}`.trim(),
        country: billingSame ? customer.country : billing.country,
        items,
        subtotal,
        discount,
        total,
        promoCode: promo?.code,
        paymentMethod:
          method === 'card'
            ? `Card ending ${card.number.replace(/\s/g, '').slice(-4)}`
            : method === 'paypal'
              ? 'PayPal'
              : 'Apple Pay',
        status: 'completed',
      }
      addOrder(order)
      clearCart()
      pushToast({ title: 'Order confirmed', description: number, variant: 'success' })
      navigate(`/success?order=${number}`, { replace: true })
    }, 1500)
  }

  return (
    <div className="container-x pb-24 pt-10 lg:pt-14">
      <header className="max-w-xl">
        <p className="eyebrow">Secure checkout</p>
        <h1 className="mt-3 font-display text-display-md font-medium text-white">Checkout</h1>
      </header>

      {/* stepper */}
      <ol className="mt-10 grid grid-cols-4 gap-2" aria-label="Checkout progress">
        {STEPS.map(({ n, label, icon: Icon }) => {
          const state = n === step ? 'current' : n < step ? 'done' : 'todo'
          return (
            <li key={n}>
              <button
                onClick={() => n < step && setStep(n)}
                disabled={n > step}
                aria-current={state === 'current' ? 'step' : undefined}
                className={cx(
                  'group flex w-full flex-col items-center gap-2 rounded-xl border px-2 py-3.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 sm:flex-row sm:justify-center sm:gap-3',
                  state === 'current' && 'border-accent-500/60 bg-accent-500/[0.08]',
                  state === 'done' && 'border-white/[0.1] bg-ink-900 hover:border-white/[0.2]',
                  state === 'todo' && 'border-white/[0.06] bg-ink-900/40 opacity-50',
                )}
              >
                <span
                  className={cx(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10.5px]',
                    state === 'current' && 'bg-accent-500 text-ink-950',
                    state === 'done' && 'bg-emerald-400/20 text-emerald-300',
                    state === 'todo' && 'bg-white/[0.06] text-white/50',
                  )}
                >
                  {state === 'done' ? <Check size={12} aria-hidden /> : <Icon size={12} aria-hidden />}
                </span>
                <span className={cx('text-[11px] font-medium sm:text-[12.5px]', state === 'current' ? 'text-white' : 'text-white/55')}>
                  {label}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
        {/* form column */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {/* STEP 1 — customer */}
              {step === 1 && (
                <section aria-label="Customer information" className="space-y-5 rounded-2xl border border-white/[0.07] bg-ink-900/40 p-6 sm:p-8">
                  <h2 className="font-display text-xl text-white/95">Customer information</h2>
                  <Input
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    placeholder="you@studio.co"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    error={errors.email}
                    hint="Your files, receipt and license keys are delivered here."
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="First name"
                      autoComplete="given-name"
                      value={customer.firstName}
                      onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                      error={errors.firstName}
                    />
                    <Input
                      label="Last name"
                      autoComplete="family-name"
                      value={customer.lastName}
                      onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                      error={errors.lastName}
                    />
                  </div>
                  <Select
                    label="Country"
                    autoComplete="country-name"
                    value={customer.country}
                    onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </Select>
                  <div className="flex justify-end pt-2">
                    <Button size="lg" onClick={next}>Continue to billing</Button>
                  </div>
                </section>
              )}

              {/* STEP 2 — billing */}
              {step === 2 && (
                <section aria-label="Billing information" className="space-y-5 rounded-2xl border border-white/[0.07] bg-ink-900/40 p-6 sm:p-8">
                  <h2 className="font-display text-xl text-white/95">Billing information</h2>
                  <p className="text-[13px] leading-relaxed text-white/50">
                    Digital goods need billing details for your invoice and VAT records — nothing gets shipped anywhere.
                  </p>
                  <Checkbox
                    checked={billingSame}
                    onChange={() => setBillingSame(!billingSame)}
                    label={<span>Billing details match my customer information ({customer.country})</span>}
                  />
                  {!billingSame && (
                    <div className="space-y-5 rounded-xl border border-white/[0.07] bg-ink-850/50 p-5">
                      <Input
                        label="Street address"
                        autoComplete="street-address"
                        placeholder="21 Mercer Street, Apt 4"
                        value={billing.address}
                        onChange={(e) => setBilling({ ...billing, address: e.target.value })}
                        error={errors.address}
                      />
                      <div className="grid gap-5 sm:grid-cols-3">
                        <Input
                          label="City"
                          autoComplete="address-level2"
                          value={billing.city}
                          onChange={(e) => setBilling({ ...billing, city: e.target.value })}
                          error={errors.city}
                        />
                        <Input
                          label="Postal code"
                          autoComplete="postal-code"
                          value={billing.postal}
                          onChange={(e) => setBilling({ ...billing, postal: e.target.value })}
                          error={errors.postal}
                        />
                        <Select
                          label="Country"
                          value={billing.country}
                          onChange={(e) => setBilling({ ...billing, country: e.target.value })}
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                      <ChevronLeft size={15} aria-hidden /> Back
                    </Button>
                    <Button size="lg" onClick={next}>Continue to payment</Button>
                  </div>
                </section>
              )}

              {/* STEP 3 — payment */}
              {step === 3 && (
                <section aria-label="Payment method" className="space-y-5 rounded-2xl border border-white/[0.07] bg-ink-900/40 p-6 sm:p-8">
                  <h2 className="font-display text-xl text-white/95">Payment method</h2>
                  <div className="space-y-3">
                    <RadioCard
                      name="payment"
                      label="Credit or debit card"
                      description="Visa, Mastercard, Amex — processed securely"
                      icon={<CreditCard size={17} aria-hidden />}
                      checked={method === 'card'}
                      onChange={() => setMethod('card')}
                    />
                    {method === 'card' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-5 rounded-xl border border-white/[0.07] bg-ink-850/50 p-5">
                          <Input
                            label="Card number"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            placeholder="4242 4242 4242 4242"
                            value={card.number}
                            onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                            error={errors.cardNumber}
                          />
                          <Input
                            label="Name on card"
                            autoComplete="cc-name"
                            value={card.name}
                            onChange={(e) => setCard({ ...card, name: e.target.value })}
                            error={errors.cardName}
                          />
                          <div className="grid grid-cols-2 gap-5">
                            <Input
                              label="Expiry"
                              inputMode="numeric"
                              autoComplete="cc-exp"
                              placeholder="MM/YY"
                              value={card.expiry}
                              onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                              error={errors.cardExpiry}
                            />
                            <Input
                              label="CVC"
                              inputMode="numeric"
                              autoComplete="cc-csc"
                              placeholder="123"
                              value={card.cvc}
                              onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                              error={errors.cardCvc}
                            />
                          </div>
                          {cardBrand && (
                            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-300/80">
                              {cardBrand} detected
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                    <RadioCard
                      name="payment"
                      label="PayPal"
                      description="You’ll be redirected after review (demo)"
                      icon={<Wallet size={17} aria-hidden />}
                      checked={method === 'paypal'}
                      onChange={() => setMethod('paypal')}
                    />
                    <RadioCard
                      name="payment"
                      label="Apple Pay"
                      description="Pay with Touch ID or Face ID (demo)"
                      icon={<Apple size={17} aria-hidden />}
                      checked={method === 'applepay'}
                      onChange={() => setMethod('applepay')}
                    />
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl border border-gold-400/20 bg-gold-400/[0.05] p-4">
                    <ShieldCheck size={15} className="shrink-0 text-gold-300" aria-hidden />
                    <p className="text-[12.5px] leading-relaxed text-white/60">
                      Demo checkout — <span className="text-white/85">no real payment is processed</span>. This
                      flow is structured to wire directly into Stripe or another provider in production.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Button variant="ghost" onClick={() => setStep(2)}>
                      <ChevronLeft size={15} aria-hidden /> Back
                    </Button>
                    <Button size="lg" onClick={next}>Review order</Button>
                  </div>
                </section>
              )}

              {/* STEP 4 — review */}
              {step === 4 && (
                <section aria-label="Order review" className="space-y-5 rounded-2xl border border-white/[0.07] bg-ink-900/40 p-6 sm:p-8">
                  <h2 className="font-display text-xl text-white/95">Review &amp; place order</h2>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { title: 'Customer', lines: [customer.email, `${customer.firstName} ${customer.lastName}`, customer.country], edit: 1 },
                      { title: 'Billing', lines: billingSame ? ['Same as customer', customer.country] : [billing.address, `${billing.city}, ${billing.postal}`, billing.country], edit: 2 },
                      { title: 'Payment', lines: [method === 'card' ? `Card ending ${card.number.replace(/\s/g, '').slice(-4) || '••••'}` : method === 'paypal' ? 'PayPal' : 'Apple Pay', 'Demo mode — no charge'], edit: 3 },
                    ].map((block) => (
                      <div key={block.title} className="rounded-xl border border-white/[0.07] bg-ink-850/50 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">{block.title}</h3>
                          <button onClick={() => setStep(block.edit)} className="text-[11.5px] text-accent-300 transition-colors hover:text-accent-200">
                            Edit
                          </button>
                        </div>
                        <div className="mt-2.5 space-y-1">
                          {block.lines.map((line) => (
                            <p key={line} className="truncate text-[13px] text-white/70">{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* items */}
                  <div className="rounded-xl border border-white/[0.07] bg-ink-850/50 p-4">
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                      {cartLines.length} item{cartLines.length === 1 ? '' : 's'}
                    </h3>
                    <ul className="mt-3 divide-y divide-white/[0.06]">
                      {cartLines.map(({ product, qty }) => (
                        <li key={product.id} className="flex items-center gap-3.5 py-3">
                          <span className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-white/[0.07]">
                            <ProductArt product={product} className="h-full w-full" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13.5px] font-medium text-white/85">{product.name}</span>
                            <span className="block font-mono text-[11px] text-white/50">
                              {qty} × {formatPrice(product.price)} · v{product.version}
                            </span>
                          </span>
                          <span className="font-mono text-[13px] text-white/80">{formatPrice(product.price * qty)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* terms */}
                  <div>
                    <Checkbox
                      checked={terms}
                      onChange={() => setTerms(!terms)}
                      label={
                        <span className="text-[13px] leading-relaxed">
                          I agree to the <span className="text-accent-300">Terms of Sale</span> and understand
                          that digital products are delivered instantly and covered by the 14-day refund policy.
                        </span>
                      }
                    />
                    {errors.terms && (
                      <p role="alert" className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
                        <AlertCircle size={12} aria-hidden /> {errors.terms}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col-reverse items-stretch justify-between gap-3 pt-2 sm:flex-row sm:items-center">
                    <Button variant="ghost" onClick={() => setStep(3)}>
                      <ChevronLeft size={15} aria-hidden /> Back
                    </Button>
                    <Button size="lg" onClick={placeOrder} loading={placing} className="sm:min-w-[260px]">
                      {placing ? 'Processing payment…' : `Place order — ${formatPrice(total)}`}
                    </Button>
                  </div>
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* summary column */}
        <aside className="h-fit space-y-5 lg:sticky lg:top-32" aria-label="Order summary">
          <div className="rounded-2xl border border-white/[0.08] bg-ink-900/60 p-6">
            <h2 className="font-display text-xl text-white/95">Order summary</h2>
            <ul className="mt-5 space-y-3">
              {cartLines.map(({ product, qty }) => (
                <li key={product.id} className="flex items-center gap-3.5">
                  <span className="h-11 w-14 shrink-0 overflow-hidden rounded-lg border border-white/[0.07]">
                    <ProductArt product={product} className="h-full w-full" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-white/85">{product.name}</span>
                    <span className="block font-mono text-[11px] text-white/50">Qty {qty}</span>
                  </span>
                  <span className="font-mono text-[13px] text-white/80">{formatPrice(product.price * qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2.5 border-t border-white/[0.08] pt-4 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span className="font-mono">{formatPrice(subtotal)}</span>
              </div>
              {promo && discount > 0 ? (
                <div className="flex items-center justify-between text-accent-300">
                  <span className="flex items-center gap-1.5">
                    <Tag size={12} aria-hidden /> {promo.code}
                    <button onClick={removePromo} aria-label="Remove promo" className="text-white/50 hover:text-rose-300">×</button>
                  </span>
                  <span className="font-mono">−{formatPrice(discount)}</span>
                </div>
              ) : (
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (applyPromo(promoInput).ok) setPromoInput('')
                  }}
                >
                  <input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (try WELCOME10)"
                    aria-label="Promo code"
                    className="w-full rounded-lg border border-white/[0.1] bg-ink-850 px-3 py-2 text-[13px] uppercase tracking-wider text-white/85 placeholder:normal-case placeholder:tracking-normal placeholder:text-white/50 focus:border-accent-500/60 focus:outline-none"
                  />
                  <Button variant="secondary" size="sm" type="submit">Apply</Button>
                </form>
              )}
              <div className="flex justify-between border-t border-white/[0.08] pt-3 text-lg text-white">
                <span className="font-medium">Total</span>
                <span className="font-mono font-medium">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-white/[0.07] bg-ink-900/40 p-5">
            {[
              [<Lock key="l" size={13} />, '256-bit encrypted checkout'],
              [<ShieldCheck key="s" size={13} />, 'We never store card details'],
              [<Zap key="z" size={13} />, 'Instant delivery after purchase'],
            ].map(([icon, text], i) => (
              <p key={i} className="flex items-center gap-2.5 text-[12.5px] text-white/55">
                <span className="text-accent-300">{icon}</span>
                {text}
              </p>
            ))}
          </div>

          <Link to="/shop" className="block text-center text-[13px] font-medium text-white/50 transition-colors hover:text-white">
            Keep browsing instead
          </Link>
        </aside>
      </div>
    </div>
  )
}
