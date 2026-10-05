# AXRYZURE STORE

A premium, production-quality storefront for curated digital products — UI kits, website templates, icons, developer tools and creative resources — built as a complete frontend experience with a mock checkout flow that's ready to wire into Stripe or another payment provider.

![Stack](https://img.shields.io/badge/React_18-TypeScript-6F87F8) ![Vite](https://img.shields.io/badge/Vite_6-Tailwind_3.4-E4CB86) ![Motion](https://img.shields.io/badge/Framer_Motion-Lucide-8CA0FA)

## Quick start

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build → dist/
npm run preview    # serve the production build
npm run typecheck  # strict TypeScript check only
```

## What's inside

### Pages & routing (React Router v6)

| Route | Description |
| --- | --- |
| `/` | Hero, featured, trending, new arrivals, best sellers, collections, limited releases (with live countdown), testimonials, trust band, newsletter, final CTA |
| `/shop` | Full catalog — URL-driven search, category/type/price/rating/availability/sale filters, 6 sort modes, active filter chips, clear-filters, skeletons, empty state |
| `/collections` | Four curated collections with editorial layouts and value summaries |
| `/product/:slug` | Gallery (4 generated views + lightbox), buy box, features, what's included, specs, changelog, license, FAQ accordion, reviews, related products |
| `/wishlist` | Saved products with "add all to cart" |
| `/cart` | Full-page cart, saved-for-later, promo codes |
| `/checkout` | 4-step flow: customer → billing → payment (card/PayPal/Apple Pay UI) → review. Accessible validation, terms acceptance, mock processing |
| `/success` | Animated confirmation, order number, per-product license keys + working file downloads |
| `/account` (+ `/orders`, `/downloads`, `/wishlist`, `/settings`) | Dashboard with seeded order history, owned-product library, license keys, update badges, preferences, demo-data reset |
| `*` | Styled 404 |

### Commerce features

- **Cart drawer + cart page** — quantity steppers, remove with undo, save-for-later round-trip, promo codes (`WELCOME10`, `CREATE20`, `SEASON04`), live totals
- **Wishlist** — animated heart toggles, header/mobile-tab counters, dedicated pages
- **⌘K search** — command-palette with keyboard navigation, live results, recent searches (persisted)
- **Reviews** — average + distribution bars, verified badges, helpful votes, and a write-a-review modal that persists locally
- **Persistence** — cart, wishlist, saved items, orders, promo and profile all survive refresh via `localStorage` (key prefix `axryzure:v1:`)
- **Mock fulfillment** — deterministic license keys, real client-side `.txt` license/receipt downloads via Blob

### Design system

- Dark editorial aesthetic: near-black neutrals, one restrained azure accent + gold highlights
- Typography: **Fraunces** (variable serif, optical sizing + italics), **Inter** (UI), **JetBrains Mono** (prices/labels) — self-hosted via Fontsource, zero external requests
- Generated **SVG product artwork** — every product renders a deterministic, unique composition (dashboards, terminals, icon grids, 3D, type specimens, posters) from its palette: instant loading, crisp at any size, no image files
- Subtle glassmorphism (header, drawers, chips), thin borders, film-grain overlay, soft glows — deliberately restrained
- Motion: hero entrance, staggered card reveals, image zoom, drawer/modal transitions, wishlist pop, filter layout animations, scroll reveals, parallax, skeletons — all `prefers-reduced-motion` aware

### Engineering

- Strict TypeScript throughout, reusable component architecture (`ui/`, `product/`, `layout/`, `cart/`, `shop/`, `home/`)
- Route-level code splitting (`React.lazy`), `content-visibility` on cards, debounced search, memoized cards/grid
- Accessibility: semantic landmarks, skip link, focus traps + return focus in overlays, `aria-live` toasts, labeled controls, `aria-invalid` + `role="alert"` form errors, keyboard-navigable gallery/search
- State: one `StoreContext` (cart, wishlist, saved, promo, orders, profile, toasts) with per-key persistence and seeded demo orders

## Project structure

```
src/
├── components/
│   ├── cart/        CartDrawer
│   ├── home/        Hero, section compositions
│   ├── layout/      Header, Footer, SearchModal, MobileTabBar, Logo
│   ├── product/     ProductArt (SVG generator), ProductCard, ProductGrid,
│   │                ProductGallery, QuickPreview, Reviews, WishlistButton
│   ├── shop/        FilterPanel
│   └── ui/          Button, Badge, Rating, Price, Modal, Toasts, Skeleton,
│                    Reveal, SectionHeader, Avatar, Field (form kit), etc.
├── context/         StoreContext (persistence + toasts)
├── data/            products, content, categories, collections, reviews
├── hooks/           usePageTitle
├── pages/           Home, Shop, Collections, Product, Wishlist, Cart,
│                    Checkout, Success, NotFound, account/*
├── types/           domain models
└── utils/           format, catalog filtering/sorting, licenses
```

## Demo notes

- Checkout is **simulated** — no payment provider is called. `placeOrder()` in `CheckoutPage.tsx` is the single integration point for wiring up Stripe/Paddle/Lemon Squeezy.
- Two products are flagged *early access*; two are *limited seasonal releases* with a live countdown.
- Account comes pre-seeded with two past orders so orders/downloads feel lived-in.
