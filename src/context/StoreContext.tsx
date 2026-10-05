import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, Order, Product, Profile, ToastData } from '@/types'
import { getProductById } from '@/data/products'
import { round2 } from '@/utils/format'

/* ------------------------------------------------------------------ */
/*  Global store: cart, wishlist, saved items, orders, promo,         */
/*  profile and toasts — persisted to localStorage.                   */
/* ------------------------------------------------------------------ */

const KEY = 'axryzure:v1'

const PROMO_CODES: Record<string, number> = {
  WELCOME10: 10,
  CREATE20: 20,
  SEASON04: 25,
}

export const PROMO_HINT = 'WELCOME10'

const DEFAULT_PROFILE: Profile = {
  name: 'Alex Rivera',
  email: 'alex@studiomakes.co',
  newsletter: true,
  productUpdates: true,
}

/* --- storage helpers ------------------------------------------------ */

const load = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(`${KEY}:${key}`)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const save = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(`${KEY}:${key}`, JSON.stringify(value))
  } catch {
    /* storage unavailable — demo keeps working in memory */
  }
}

const SEED_ORDERS: Order[] = [
  {
    id: 'seed-1',
    number: 'AXZ-2026-0842',
    date: '2026-08-18',
    email: 'alex@studiomakes.co',
    name: 'Alex Rivera',
    country: 'United States',
    items: [
      { productId: 'p05', slug: 'monolith-icons', name: 'Monolith Icons', price: 19, qty: 1 },
      { productId: 'p13', slug: 'editorial-type-system', name: 'Editorial Type System', price: 32, qty: 1 },
    ],
    subtotal: 51,
    discount: 0,
    total: 51,
    paymentMethod: 'Card ending 4242',
    status: 'completed',
  },
  {
    id: 'seed-2',
    number: 'AXZ-2026-0316',
    date: '2026-03-03',
    email: 'alex@studiomakes.co',
    name: 'Alex Rivera',
    country: 'United States',
    items: [{ productId: 'p02', slug: 'noir-portfolio-template', name: 'Noir Portfolio Template', price: 39, qty: 1 }],
    subtotal: 39,
    discount: 0,
    total: 39,
    paymentMethod: 'PayPal',
    status: 'completed',
  },
]

/* --- context type ---------------------------------------------------- */

export interface CartLine {
  product: Product
  qty: number
}

interface StoreContextValue {
  // cart
  cart: CartItem[]
  cartLines: CartLine[]
  cartCount: number
  subtotal: number
  addToCart: (productId: string, qty?: number, options?: { silent?: boolean }) => void
  updateQty: (productId: string, qty: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  inCart: (productId: string) => boolean
  // saved for later
  saved: string[]
  saveForLater: (productId: string) => void
  moveToCart: (productId: string) => void
  removeSaved: (productId: string) => void
  // wishlist
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
  // promo
  promo: { code: string; percent: number } | null
  applyPromo: (code: string) => { ok: boolean; message: string }
  removePromo: () => void
  discount: number
  total: number
  // orders
  orders: Order[]
  addOrder: (order: Order) => void
  findOrder: (number: string) => Order | undefined
  // profile
  profile: Profile
  updateProfile: (patch: Partial<Profile>) => void
  // ui state
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  // toasts
  toasts: ToastData[]
  pushToast: (toast: Omit<ToastData, 'id'>) => void
  dismissToast: (id: number) => void
  // danger zone
  clearAllData: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export const useStore = (): StoreContextValue => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

/* --- provider -------------------------------------------------------- */

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => load('cart', []))
  const [saved, setSaved] = useState<string[]>(() => load('saved', []))
  const [wishlist, setWishlist] = useState<string[]>(() => load('wishlist', []))
  const [orders, setOrders] = useState<Order[]>(() => {
    const existing = localStorage.getItem(`${KEY}:orders`)
    if (!existing) {
      save('orders', SEED_ORDERS)
      return SEED_ORDERS
    }
    return load('orders', [])
  })
  const [promo, setPromo] = useState<{ code: string; percent: number } | null>(() =>
    load('promo', null),
  )
  const [profile, setProfile] = useState<Profile>(() => load('profile', DEFAULT_PROFILE))
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [toasts, setToasts] = useState<ToastData[]>([])
  const toastId = useRef(0)

  useEffect(() => save('cart', cart), [cart])
  useEffect(() => save('saved', saved), [saved])
  useEffect(() => save('wishlist', wishlist), [wishlist])
  useEffect(() => save('orders', orders), [orders])
  useEffect(() => save('promo', promo), [promo])
  useEffect(() => save('profile', profile), [profile])

  /* --- toasts -------------------------------------------------------- */

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const pushToast = useCallback(
    (toast: Omit<ToastData, 'id'>) => {
      const id = ++toastId.current
      setToasts((t) => [...t.slice(-2), { ...toast, id }])
      window.setTimeout(() => dismissToast(id), 4200)
    },
    [dismissToast],
  )

  /* --- cart ----------------------------------------------------------- */

  const cartLines = useMemo<CartLine[]>(
    () =>
      cart
        .map((item) => {
          const product = getProductById(item.productId)
          return product ? { product, qty: item.qty } : null
        })
        .filter((x): x is CartLine => x !== null),
    [cart],
  )

  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart])
  const subtotal = useMemo(
    () => round2(cartLines.reduce((n, l) => n + l.product.price * l.qty, 0)),
    [cartLines],
  )
  const discount = useMemo(
    () => (promo ? round2(subtotal * (promo.percent / 100)) : 0),
    [promo, subtotal],
  )
  const total = useMemo(() => round2(Math.max(0, subtotal - discount)), [subtotal, discount])

  const addToCart = useCallback(
    (productId: string, qty = 1, options?: { silent?: boolean }) => {
      const product = getProductById(productId)
      if (!product) return
      setCart((c) => {
        const existing = c.find((i) => i.productId === productId)
        if (existing) {
          return c.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i))
        }
        return [...c, { productId, qty, addedAt: Date.now() }]
      })
      if (!options?.silent) {
        pushToast({
          title: 'Added to cart',
          description: product.name,
          variant: 'success',
          action: { label: 'View cart', onClick: () => setCartOpen(true) },
        })
      }
    },
    [pushToast],
  )

  const updateQty = useCallback((productId: string, qty: number) => {
    setCart((c) =>
      qty <= 0
        ? c.filter((i) => i.productId !== productId)
        : c.map((i) => (i.productId === productId ? { ...i, qty } : i)),
    )
  }, [])

  const removeFromCart = useCallback(
    (productId: string) => {
      const product = getProductById(productId)
      setCart((c) => c.filter((i) => i.productId !== productId))
      pushToast({
        title: 'Removed from cart',
        description: product?.name,
        variant: 'info',
        action: {
          label: 'Undo',
          onClick: () =>
            setCart((c) =>
              c.some((i) => i.productId === productId)
                ? c
                : [...c, { productId, qty: 1, addedAt: Date.now() }],
            ),
        },
      })
    },
    [pushToast],
  )

  const clearCart = useCallback(() => {
    setCart([])
    setPromo(null)
  }, [])

  const inCart = useCallback((productId: string) => cart.some((i) => i.productId === productId), [cart])

  /* --- saved for later ------------------------------------------------- */

  const saveForLater = useCallback(
    (productId: string) => {
      const product = getProductById(productId)
      setCart((c) => c.filter((i) => i.productId !== productId))
      setSaved((s) => (s.includes(productId) ? s : [...s, productId]))
      pushToast({ title: 'Saved for later', description: product?.name, variant: 'info' })
    },
    [pushToast],
  )

  const moveToCart = useCallback(
    (productId: string) => {
      const product = getProductById(productId)
      setSaved((s) => s.filter((id) => id !== productId))
      setCart((c) => {
        if (c.some((i) => i.productId === productId)) return c
        return [...c, { productId, qty: 1, addedAt: Date.now() }]
      })
      pushToast({
        title: 'Moved to cart',
        description: product?.name,
        variant: 'success',
        action: { label: 'View cart', onClick: () => setCartOpen(true) },
      })
    },
    [pushToast],
  )

  const removeSaved = useCallback((productId: string) => {
    setSaved((s) => s.filter((id) => id !== productId))
  }, [])

  /* --- wishlist --------------------------------------------------------- */

  const toggleWishlist = useCallback(
    (productId: string) => {
      const product = getProductById(productId)
      setWishlist((w) => {
        const has = w.includes(productId)
        pushToast({
          title: has ? 'Removed from wishlist' : 'Saved to wishlist',
          description: product?.name,
          variant: has ? 'info' : 'success',
        })
        return has ? w.filter((id) => id !== productId) : [...w, productId]
      })
    },
    [pushToast],
  )

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist])

  /* --- promo -------------------------------------------------------------- */

  const applyPromo = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase()
      if (!normalized) return { ok: false, message: 'Enter a promo code' }
      const percent = PROMO_CODES[normalized]
      if (!percent) {
        return { ok: false, message: '“' + normalized + '” isn’t a valid code — try WELCOME10' }
      }
      setPromo({ code: normalized, percent })
      pushToast({
        title: 'Promo applied',
        description: `${normalized} — ${percent}% off your order`,
        variant: 'success',
      })
      return { ok: true, message: `${percent}% off applied` }
    },
    [pushToast],
  )

  const removePromo = useCallback(() => setPromo(null), [])

  /* --- orders -------------------------------------------------------------- */

  const addOrder = useCallback((order: Order) => {
    setOrders((o) => [order, ...o])
    // keep the demo profile in sync with checkout details
    setProfile((p) => (p.email === DEFAULT_PROFILE.email ? { ...p, email: order.email, name: order.name } : p))
  }, [])

  const findOrder = useCallback(
    (number: string) => orders.find((o) => o.number === number),
    [orders],
  )

  /* --- profile -------------------------------------------------------------- */

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((p) => ({ ...p, ...patch }))
  }, [])

  const clearAllData = useCallback(() => {
    setCart([])
    setSaved([])
    setWishlist([])
    setPromo(null)
    setProfile(DEFAULT_PROFILE)
    setOrders(SEED_ORDERS)
    save('orders', SEED_ORDERS)
  }, [])

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      cartLines,
      cartCount,
      subtotal,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      inCart,
      saved,
      saveForLater,
      moveToCart,
      removeSaved,
      wishlist,
      toggleWishlist,
      isWishlisted,
      promo,
      applyPromo,
      removePromo,
      discount,
      total,
      orders,
      addOrder,
      findOrder,
      profile,
      updateProfile,
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      toasts,
      pushToast,
      dismissToast,
      clearAllData,
    }),
    [
      cart,
      cartLines,
      cartCount,
      subtotal,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      inCart,
      saved,
      saveForLater,
      moveToCart,
      removeSaved,
      wishlist,
      toggleWishlist,
      isWishlisted,
      promo,
      applyPromo,
      removePromo,
      discount,
      total,
      orders,
      addOrder,
      findOrder,
      profile,
      updateProfile,
      cartOpen,
      searchOpen,
      toasts,
      pushToast,
      dismissToast,
      clearAllData,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
