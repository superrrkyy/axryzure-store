import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { StoreProvider } from '@/context/StoreContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileTabBar } from '@/components/layout/MobileTabBar'
import { SearchModal } from '@/components/layout/SearchModal'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { Toasts } from '@/components/ui/Toasts'
import { EASE } from '@/utils/format'

/* Route-level code splitting keeps the first paint fast. */
const HomePage = lazy(() => import('@/pages/HomePage'))
const ShopPage = lazy(() => import('@/pages/ShopPage'))
const CollectionsPage = lazy(() => import('@/pages/CollectionsPage'))
const ProductPage = lazy(() => import('@/pages/ProductPage'))
const WishlistPage = lazy(() => import('@/pages/WishlistPage'))
const CartPage = lazy(() => import('@/pages/CartPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const SuccessPage = lazy(() => import('@/pages/SuccessPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const AccountLayout = lazy(() => import('@/pages/account/AccountLayout'))
const AccountOverview = lazy(() => import('@/pages/account/AccountOverview'))
const AccountOrders = lazy(() => import('@/pages/account/AccountOrders'))
const AccountDownloads = lazy(() => import('@/pages/account/AccountDownloads'))
const AccountWishlist = lazy(() => import('@/pages/account/AccountWishlist'))
const AccountSettings = lazy(() => import('@/pages/account/AccountSettings'))

/* Scroll restoration + hash handling on navigation. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

/* Subtle page transition wrapper. */
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

function RouteFallback() {
  return (
    <div className="container-x flex min-h-[70vh] items-center justify-center pt-[140px]" aria-label="Loading">
      <div className="flex flex-col items-center gap-4">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-accent-500" aria-hidden />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-white/50">Loading</span>
      </div>
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Suspense fallback={<RouteFallback />}><HomePage /></Suspense></PageTransition>} />
        <Route path="/shop" element={<PageTransition><Suspense fallback={<RouteFallback />}><ShopPage /></Suspense></PageTransition>} />
        <Route path="/collections" element={<PageTransition><Suspense fallback={<RouteFallback />}><CollectionsPage /></Suspense></PageTransition>} />
        <Route path="/product/:slug" element={<PageTransition><Suspense fallback={<RouteFallback />}><ProductPage /></Suspense></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><Suspense fallback={<RouteFallback />}><WishlistPage /></Suspense></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Suspense fallback={<RouteFallback />}><CartPage /></Suspense></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Suspense fallback={<RouteFallback />}><CheckoutPage /></Suspense></PageTransition>} />
        <Route path="/success" element={<PageTransition><Suspense fallback={<RouteFallback />}><SuccessPage /></Suspense></PageTransition>} />
        <Route
          path="/account"
          element={<PageTransition><Suspense fallback={<RouteFallback />}><AccountLayout /></Suspense></PageTransition>}
        >
          <Route index element={<AccountOverview />} />
          <Route path="orders" element={<AccountOrders />} />
          <Route path="downloads" element={<AccountDownloads />} />
          <Route path="wishlist" element={<AccountWishlist />} />
          <Route path="settings" element={<AccountSettings />} />
        </Route>
        <Route path="*" element={<PageTransition><Suspense fallback={<RouteFallback />}><NotFoundPage /></Suspense></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter basename="/axryzure-store/">
        <ScrollToTop />
        <div className="flex min-h-screen flex-col bg-ink-950">
          <Header />
          <main id="main" className="flex-1 pb-20 lg:pb-0">
            <AnimatedRoutes />
          </main>
          <Footer />
          <div className="h-16 lg:hidden" aria-hidden />
        </div>
        <div className="grain-overlay" aria-hidden />
        <MobileTabBar />
        <CartDrawer />
        <SearchModal />
        <Toasts />
      </BrowserRouter>
    </StoreProvider>
  )
}
