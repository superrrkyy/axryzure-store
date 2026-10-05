import type { ProductContent } from '@/types'

/* ------------------------------------------------------------------ */
/*  Long-form content per product. Keyed by slug, merged into the     */
/*  catalog in products.ts.                                            */
/* ------------------------------------------------------------------ */

const STANDARD_LICENSE =
  'Standard commercial license. Use in unlimited personal and commercial projects — including paid client work. Lifetime updates included. The only thing you may not do is resell, sublicense or redistribute the source files themselves. Need an extended license (products for resale, OEM)? Contact hello@axryzure.store.'

export const CONTENT: Record<string, ProductContent> = {
  'axryzure-minimal-ui-kit': {
    description: [
      'Most UI kits are demos. This one is a system. AXRYZURE Minimal started as our internal component library in 2022 and has been rebuilt three times since — always with one rule: every component must survive being taken apart by a real product team.',
      'Everything runs on 238 Figma variables, so re-theming is a four-minute job: swap the token values once and watch 1,240 components and 38 screens follow. The React export is generated from the same token file, which means the Figma file and the codebase never disagree about what “surface” or “accent-500” means.',
      'The result is a kit that feels quiet on purpose. Neutral surfaces, one accent, strict 4px spacing rhythm, and typography that leans editorial without shouting. It is the shortest distance between “new Figma file” and “credible product UI”.',
    ],
    features: [
      '1,240+ components built on 238 Figma variables — re-theme the entire kit in minutes',
      '38 production screens: dashboards, settings, auth flows, empty states, pricing',
      'Light and dark themes with a token structure that maps 1:1 to Tailwind config',
      'React + Tailwind export generated from the same token source as the Figma file',
      'Auto-layout everywhere — every component stretches, wraps and reflows correctly',
      'Documentation file covering naming conventions, states and do/don’t examples',
      'Accessibility pass on interactive components: focus states, hit areas, contrast pairs',
    ],
    included: [
      {
        group: 'Design files',
        items: [
          'Figma library with 1,240+ components (light + dark)',
          '38 ready-to-adapt screens',
          'Variable-driven token sheet',
          'Documentation & usage guide',
        ],
      },
      {
        group: 'Code',
        items: [
          'React component library (TypeScript)',
          'Tailwind theme config with matching tokens',
          'Storybook setup with live examples',
          'Icon bridge for Monolith Icons',
        ],
      },
    ],
    compatibility: ['Figma', 'React 18+', 'Tailwind CSS 3.4+', 'Storybook 7/8', 'TypeScript'],
    formats: ['FIG', 'TSX', 'CSS', 'JSON tokens'],
    license: STANDARD_LICENSE,
    changelog: [
      { version: '3.2.0', date: 'Sep 2026', note: 'Figma variables v2 migration, 64 new components, redesigned data table suite.' },
      { version: '3.1.0', date: 'May 2026', note: 'React export regenerated from tokens; Storybook 8 support.' },
      { version: '3.0.0', date: 'Jan 2026', note: 'Full rebuild: variable-driven theming, dark mode parity, new type ramp.' },
    ],
    faq: [
      {
        q: 'How does this compare to free UI kits?',
        a: 'Free kits optimize for screenshots; this one optimizes for the third week of a project, when you have torn the demo apart and need the pieces to still make sense. Naming is consistent, every state exists, and the token structure is documented so engineers can map it without meetings.',
      },
      {
        q: 'Can I use the React and Figma parts separately?',
        a: 'Absolutely. They share a token source but work independently. Plenty of customers use only the Figma library; engineers on your team can pull just the Tailwind theme and components.',
      },
    ],
  },

  'noir-portfolio-template': {
    description: [
      'Noir is what happens when a portfolio takes itself as seriously as the work inside it. Built for designers, studios and photographers who want a dark, editorial presence — the kind of site that gets screenshotted into moodboards.',
      'Under the surface it is a modern Next.js 15 app: MDX-powered case studies, view transitions that feel like turning pages, image pipelines that ship AVIF/WebP, and near-perfect Lighthouse scores out of the box. The content model is CMS-ready — point it at your markdown folder or wire up your provider of choice.',
      'Three portfolio layouts ship in the box: Studio (grid), Journal (list) and Case (project-first). Typography is set in a serif/sans pairing tuned for long-form reading, with a print-inspired attention to margins, folios and captions.',
    ],
    features: [
      'Three complete portfolio layouts — Studio, Journal and Case',
      'MDX case studies with rich embeds, footnotes and image carousels',
      'Next.js 15, App Router, view transitions, streaming SSR',
      'Automatic AVIF/WebP image pipeline with art-directed crops',
      'CMS-ready content model (markdown folder or your provider)',
      '99+ Lighthouse performance and accessibility scores on the demo',
      'Typography, spacing and color controlled from one theme file',
    ],
    included: [
      {
        group: 'Site',
        items: [
          'Full Next.js 15 source (App Router, TypeScript)',
          '3 portfolio layouts + 9 supporting pages',
          'MDX case study system',
          'Contact + newsletter integration stubs',
        ],
      },
      {
        group: 'Assets',
        items: [
          'Figma design source',
          'Optimized demo imagery (licensed for your use)',
          'Theme file with type and color tokens',
          'Deployment guide (Vercel-first, works anywhere)',
        ],
      },
    ],
    compatibility: ['Next.js 15+', 'React 18+', 'Node 18+', 'Vercel / Netlify / any Node host'],
    formats: ['ZIP (TSX, MDX, CSS)', 'FIG', 'MD'],
    license: STANDARD_LICENSE,
    changelog: [
      { version: '2.4.1', date: 'Aug 2026', note: 'Next.js 15.4, fixed MDX carousel focus order, Dutch translation strings.' },
      { version: '2.4.0', date: 'Jun 2026', note: 'View transitions, AVIF pipeline v2, new Case layout cover options.' },
      { version: '2.3.0', date: 'Feb 2026', note: 'CMS adapters for Sanity and Contentful.' },
    ],
    faq: [
      {
        q: 'How technical do I need to be?',
        a: 'Basic comfort with a terminal and a code editor. Content is markdown/MDX files — writing a case study is as hard as writing a README. We also include a one-command local setup and a deployment guide written for humans.',
      },
      {
        q: 'Can clients update the site themselves?',
        a: 'Yes. Point the content layer at a headless CMS (Sanity and Contentful adapters are included) and non-technical editors can publish without touching code.',
      },
    ],
  },

  'creator-dashboard-pro': {
    description: [
      'Creators run their business across six platforms and one anxious spreadsheet. Creator Dashboard Pro is the interface for fixing that — a complete analytics and planning system covering revenue, audience, content and launches.',
      'Ninety-six screens cover the whole journey: earnings across platforms, sponsorship pipeline, audience growth, content calendar, idea backlog, and quarterly goal tracking. Fourteen chart patterns are included as reusable Figma components with real data-visualization logic — axis behavior, empty states, comparison modes.',
      'This is an early-access product shipping on a weekly cadence. Buy once and the releases appear in your account automatically — the roadmap (community features, a Notion mirror, mobile comps) is public and driven by buyer feedback.',
    ],
    features: [
      '96 screens: revenue, audience, content, launches, goals, settings',
      '14 chart patterns as smart components with empty and loading states',
      'Light and dark themes, both driven by one token sheet',
      'Sponsorship CRM flow: pipeline, deal stages, deliverable tracking',
      'Content calendar with planning, backlog and published views',
      'Desktop and mobile comps for every core screen',
    ],
    included: [
      {
        group: 'Design files',
        items: ['Figma file (96 screens, light + dark)', 'Chart component library', 'Token sheet', 'Flow map PDF'],
      },
      {
        group: 'Extras',
        items: ['Notion template mirror of the content planner', 'Roadmap access', 'Weekly build notes'],
      },
    ],
    compatibility: ['Figma', 'Notion'],
    formats: ['FIG', 'PDF', 'ZIP'],
    license: STANDARD_LICENSE,
    changelog: [
      { version: '1.4.0', date: 'Sep 2026', note: 'Sponsorship CRM flow, 11 new screens, chart comparison mode.' },
      { version: '1.3.0', date: 'Aug 2026', note: 'Notion content planner mirror, mobile comps for core screens.' },
      { version: '1.2.0', date: 'Jul 2026', note: 'Goal tracking suite, empty-state pass.' },
    ],
    faq: [
      {
        q: 'What does early access actually mean?',
        a: 'You get everything listed today, immediately, at a price that reflects the work remaining. New screens ship weekly until the roadmap is complete — your downloads update automatically. The kit will move to full price at v2.0.',
      },
      {
        q: 'Is there a coded version?',
        a: 'Not yet — the React export is on the public roadmap for v2.0 and included for all buyers when it lands.',
      },
    ],
  },

  'aurora-landing-page-kit': {
    description: [
      'Aurora is a landing page system for products that deserve better than a generic hero. Twenty-four sections — heroes, feature grids, logos, testimonials, pricing, FAQs, CTAs — each in three gradient moods, each tested against real conversion patterns.',
      'Every section ships as a Framer component and a Next.js/React block. Motion is scroll-driven but restrained: soft parallax, staggered reveals and gradient shifts that respond to scroll position. No bouncing marquee text, no autoplaying cubes.',
      'The gradient system is the point. Instead of arbitrary blobs, Aurora uses a constrained palette engine — pick a mood (Dawn, Tide or Ember), and every section retints consistently. Your page looks art-directed even when you assemble it in an afternoon.',
    ],
    features: [
      '24 sections × 3 gradient moods (Dawn, Tide, Ember)',
      'Framer components + Next.js/React blocks from the same source',
      'Scroll-driven motion with reduced-motion fallbacks baked in',
      'Conversion patterns for SaaS, apps, tools and waitlists',
      'Constrained palette engine — retint the whole page in one click',
      'Copy prompts inside each section (what to write, not just where)',
    ],
    included: [
      {
        group: 'Design & code',
        items: [
          'Figma library (24 sections × 3 moods)',
          'Framer project with remixed starters',
          'Next.js section blocks (TypeScript, Tailwind)',
          'Motion presets as copy-paste tokens',
        ],
      },
      {
        group: 'Guides',
        items: ['Landing page copy checklist', 'Conversion pattern reference PDF', 'Loom walkthroughs'],
      },
    ],
    compatibility: ['Figma', 'Framer', 'Next.js 14+ / React 18+', 'Tailwind CSS'],
    formats: ['FIG', 'TSX', 'CSS', 'PDF'],
    license: STANDARD_LICENSE,
    changelog: [
      { version: '1.2.0', date: 'Sep 2026', note: '6 new sections (comparison, changelog, stats band), Ember mood.' },
      { version: '1.1.0', date: 'Aug 2026', note: 'Framer components, reduced-motion fallbacks, copy prompts.' },
      { version: '1.0.1', date: 'Jul 2026', note: 'Initial public release.' },
    ],
    faq: [
      {
        q: 'Can I mix sections from different moods?',
        a: 'You can — moods are palettes, not cages. The engine keeps contrast and hierarchy intact when you mix; the guide shows which combinations are safe.',
      },
      {
        q: 'Do the Framer and React versions match exactly?',
        a: 'Yes, pixel-level differences are treated as bugs. Both are generated from the same design source and motion tokens.',
      },
    ],
  },

  'monolith-icons': {
    description: [
      'Monolith is 2,400 icons drawn like they matter. Every glyph sits on a strict 24px grid with a 1.5px stroke, optically corrected where geometry needs to cheat to look right. The discipline shows: at 16px or 64px, Monolith stays crisp.',
      'Three styles ship for every single icon — stroke, solid and duotone — drawn, not generated. Duotones use a two-layer system so your accent color does the work. Named consistently, sorted into 24 categories, and searchable by concept (“upload cloud”, “user minus”, “shield check”).',
      'Developers get React components with tree-shakeable imports, plus SVG sprites. Designers get a Figma library with variants for all three styles. Five years of releases in, Monolith is the most battle-tested thing we make.',
    ],
    features: [
      '2,400 icons × 3 styles (stroke, solid, duotone) = 7,200 renders',
      'Strict 24px grid, 1.5px stroke, optical corrections throughout',
      'Figma library with style variants and search-optimized naming',
      'React components (tree-shakeable) + SVG sprite + raw SVGs',
      '24 categories from commerce to crypto to accessibility',
      '5 years of production use and refinement',
    ],
    included: [
      {
        group: 'For designers',
        items: ['Figma library (published, variants included)', 'Naming & usage guide', '24 category pages for browsing'],
      },
      {
        group: 'For developers',
        items: [
          'React package (TypeScript, tree-shakeable)',
          'SVG sprite sheet + 7,200 individual SVGs',
          'Vue and Svelte component exports',
          'NPM-ready package scaffold',
        ],
      },
    ],
    compatibility: ['Figma', 'React / Vue / Svelte', 'Any tool that opens SVG'],
    formats: ['FIG', 'SVG', 'TSX', 'VUE', 'SVELTE'],
    license: STANDARD_LICENSE,
    changelog: [
      { version: '5.0.2', date: 'Sep 2026', note: '180 new icons (AI, privacy, accessibility), refined duotone layering.' },
      { version: '5.0.0', date: 'Apr 2026', note: 'Major: full redraw on the unified 1.5px stroke system, Svelte export.' },
      { version: '4.2.0', date: 'Nov 2025', note: 'Figma variants support, 220 new icons.' },
    ],
    faq: [
      {
        q: 'Why 1.5px strokes instead of the usual 2px?',
        a: 'At 24px, a 2px stroke eats 17% of the grid and glyphs turn chunky. 1.5px keeps counters open and reads better at small sizes — it is also the system Figma, Lucide and Phosphor have converged on for exactly this reason.',
      },
      {
        q: 'Do I get future icon releases?',
        a: 'Yes. Monolith has shipped free updates for five years. v5 buyers get everything up to and including the next major version.',
      },
    ],
  },

  'digital-creator-bundle': {
    description: [
      'The Digital Creator Bundle is eight products working as one system: everything a working creator needs to look like a studio of twelve. Brand identity, social templates, content planners, launch pages, and the business documents that keep the lights on.',
      'Individually these products total $129. As a bundle, $79 — because the people who need all of them are usually the ones funding it themselves. Every product is the full, current version: no “lite” editions, no watermarks, no upsells.',
      'The pieces share a design language, so your YouTube thumbnails, Notion planner, media kit and landing page actually look like they came from the same brand. That coherence is the cheat code most creators never unlock.',
    ],
    features: [
      '8 full products — $129 value, complete editions',
      'Brand kit: logo system, palette, typography, social templates',
      'Content system: planners, idea banks, thumbnail & shorts templates',
      'Launch kit: landing page templates, waitlist emails, press one-pager',
      'Business layer: invoice, contract and media kit templates',
      'Shared design language across every product',
    ],
    included: [
      {
        group: 'Brand & identity',
        items: ['Logo construction kit (Figma)', 'Social template pack (120 posts/stories)', 'Motion lower-thirds (After Effects)'],
      },
      {
        group: 'Content & launch',
        items: ['Content planner (Notion + printable)', 'Thumbnail & Shorts pack (Photoshop + Figma)', 'Landing page templates (Framer)', 'Launch email sequences (Figma + copy)'],
      },
      {
        group: 'Business',
        items: ['Invoice & quote templates', 'Creator media kit (Figma + Slides)', 'Rate card & pricing calculator (Sheets)'],
      },
    ],
    compatibility: ['Figma', 'Notion', 'Framer', 'Photoshop', 'After Effects', 'Google Sheets'],
    formats: ['FIG', 'NOTION', 'FRAMER', 'PSD', 'AEP', 'GSHEET', 'PDF'],
    license: STANDARD_LICENSE,
    changelog: [
      { version: '4.1.0', date: 'Sep 2026', note: 'All 8 products updated to their current versions; 40 new social templates.' },
      { version: '4.0.0', date: 'Mar 2026', note: 'Added the launch email sequence and press one-pager; refreshed brand kit.' },
      { version: '3.2.0', date: 'Oct 2025', note: 'Shorts/TikTok template pack added.' },
    ],
    faq: [
      {
        q: 'Is this everything AXRYZURE makes?',
        a: 'No — this is the creator-focused eight. For all 16 products plus lifetime updates on everything we ever release, look at the Ultimate Bundle.',
      },
      {
        q: 'Do bundle buyers get updates?',
        a: 'Yes. When any product in the bundle updates, your bundle download refreshes with the new version at no cost.',
      },
    ],
  },

  'developer-dashboard-system': {
    description: [
      'Most admin templates are a costume. This one is a skeleton with a spine. Developer Dashboard System is a complete, typed, tested admin application — the 60+ screens a real SaaS needs (users, billing, permissions, audit logs, settings) with the plumbing already done.',
      'Next.js 15, TypeScript strict mode, Tailwind, Prisma and a component layer in the shadcn tradition — you own the code, copy it into your repo, delete what you don’t need. Role-based access control is implemented, not sketched: policies, route guards and UI that respects them.',
      'Charts, tables and forms — the three things admin projects die on — each have a properly engineered pattern library: server-driven tables with URL state, accessible forms with real validation, and charts that stream live data without dropping frames.',
    ],
    features: [
      '60+ app screens: users, teams, billing, audit, settings, onboarding',
      'RBAC implemented end-to-end — policies, guards, permission-aware UI',
      'Server-driven data tables with URL state, filters and CSV export',
      'Accessible form system with schemas (zod) and inline validation',
      'Streaming charts with live-data demo mode',
      'Dark/light theming via CSS variables, no flash on load',
      'Playwright smoke tests + GitHub Actions CI included',
    ],
    included: [
      {
        group: 'Application',
        items: [
          'Full Next.js 15 source (App Router, TypeScript strict)',
          'Prisma schema + seed data',
          'Auth scaffolding (email + OAuth providers)',
          'Playwright tests + CI workflow',
        ],
      },
      {
        group: 'Design',
        items: ['Figma source for all screens', 'Component pattern reference', 'Theme tokens'],
      },
    ],
    compatibility: ['Node 18+', 'Next.js 15+', 'PostgreSQL / SQLite / MySQL', 'Tailwind CSS'],
    formats: ['ZIP (TSX, PRISMA, CSS)', 'FIG'],
    license: STANDARD_LICENSE,
    changelog: [
      { version: '2.2.0', date: 'Aug 2026', note: 'Next.js 15.4, audit log UI, CSV export on all tables.' },
      { version: '2.1.0', date: 'Apr 2026', note: 'RBAC policy engine rewrite, permission-aware navigation.' },
      { version: '2.0.0', date: 'Dec 2025', note: 'App Router migration, streaming charts, Playwright suite.' },
    ],
    faq: [
      {
        q: 'Is this a SaaS starter or an admin template?',
        a: 'An admin system with starter wiring. Billing is stubbed with a clean Stripe integration point rather than half-implemented — the 60+ screens, RBAC and data layer are the product.',
      },
      {
        q: 'Can I use it for multiple client projects?',
        a: 'Yes — the standard license covers unlimited client projects. One purchase per client is appreciated if their team will maintain it, but not required.',
      },
    ],
  },

  'editorial-portfolio-kit': {
    description: [
      'A portfolio for people whose work is the visual. Editorial Portfolio Kit is built for photographers, art directors and studios who want galleries that respect the image: generous white (or black) space, careful captions, and zero UI noise between the viewer and the work.',
      'Three layouts ship: Gallery (masonry-first), Monograph (series-first) and Archive (index-first). Each one treats series as the primary unit — because photographers think in bodies of work, not in a stream of images. Astro keeps it fast: the demo with 200 images ships under 90KB of JS.',
      'Print details make the difference: folios, running heads, plate numbering, and a colophon page. Typography is set with a serif body tuned for caption-heavy reading, available in light and dark paper modes.',
    ],
    features: [
      'Three layouts: Gallery, Monograph, Archive',
      'Series-first content model (bodies of work, not image dumps)',
      'Astro 5 — 90KB of JS on a 200-image demo',
      'Light & dark “paper” modes with print-inspired detail',
      'Galleries with keyboard navigation, lazy loading and lightbox',
      'CMS-ready (markdown content collections)',
    ],
    included: [
      {
        group: 'Site',
        items: ['Astro 5 source (TypeScript)', '3 layouts + 6 supporting pages', 'Gallery & lightbox system', 'Print-style detail components'],
      },
      {
        group: 'Assets',
        items: ['Figma design source', 'Demo photography (licensed for demo use)', 'Content model documentation'],
      },
    ],
    compatibility: ['Node 18+', 'Astro 5+', 'Any static host / Vercel / Netlify'],
    formats: ['ZIP (ASTRO, TS, CSS)', 'FIG', 'MD'],
    license: STANDARD_LICENSE,
    changelog: [
      { version: '1.8.0', date: 'Jul 2026', note: 'Astro 5.10, dark paper mode, plate numbering component.' },
      { version: '1.7.0', date: 'Mar 2026', note: 'Archive layout, colophon page, EXIF caption blocks.' },
      { version: '1.6.0', date: 'Nov 2025', note: 'Monograph layout, series navigation.' },
    ],
    faq: [
      {
        q: 'I’m not a photographer — is this still for me?',
        a: 'If your work is image-led (illustration, typography, film stills, fashion), yes. If you need project case studies with text and video, Noir is the better fit.',
      },
      {
        q: 'How does it handle very large galleries?',
        a: 'Images lazy-load with responsive srcsets, and the Archive layout paginates gracefully at thousands of entries. The demo intentionally ships 200 images so you can feel it.',
      },
    ],
  },

  'motion-graphics-pack': {
    description: [
      'Motion Graphics Pack is 120+ animations for people who ship video weekly: YouTube intros, loaders, transitions, hero loops, lower thirds and end cards — in a consistent visual language that won’t date itself in six months.',
      'Every animation ships as a clean After Effects project (organized, labeled, no mystery precomps) and where it makes sense, as an optimized Lottie file for web and app use. Timings are editable via simple expression controls — no keyframe archaeology required.',
      'This pack is in early access and growing weekly: new drops every Friday, driven by buyer requests. Current buyers have already voted in overlays for podcasts and vertical Shorts formats.',
    ],
    features: [
      '120+ animations: intros, loaders, transitions, loops, lower thirds, end cards',
      'Clean After Effects projects — organized, labeled, expression-controlled',
      'Lottie exports (web + app optimized) where applicable',
      '4K and vertical (9:16) versions of every layout animation',
      'Color system: swap two colors to match your brand',
      'Weekly early-access drops until v2.0',
    ],
    included: [
      {
        group: 'After Effects',
        items: ['120+ project files (4K)', '9:16 vertical variants', 'Expression control rig', 'Render preset guide'],
      },
      {
        group: 'Lottie / web',
        items: ['40+ Lottie JSON files', 'Preview HTML playground', 'Implementation snippets (react-lottie etc.)'],
      },
    ],
    compatibility: ['After Effects 2022+', 'Lottie (web/iOS/Android)', 'Premiere Pro (via AE comps)'],
    formats: ['AEP', 'JSON (Lottie)', 'MOV', 'MP4'],
    license: STANDARD_LICENSE,
    changelog: [
      { version: '1.1.0', date: 'Sep 2026', note: '22 new animations (Shorts intros, podcast lower thirds), Lottie batch 3.' },
      { version: '1.0.0', date: 'May 2026', note: 'Initial release: 98 animations, Lottie batch 1–2.' },
    ],
    faq: [
      {
        q: 'What does early access mean here?',
        a: 'The pack is complete and usable today — early access means it grows weekly until v2.0 at no extra cost. The roadmap is public and buyer-driven.',
      },
      {
        q: 'Do I need After Effects?',
        a: 'For customization, yes (a trial works). For Lottie files and MP4/MOV renders, no — you can use those directly.',
      },
    ],
  },

  'premium-web-starter-kit': {
    description: [
      'The Premium Web Starter Kit is the result of rebuilding the same production foundation eleven times: Next.js 15, TypeScript strict, Tailwind, Prisma — with the auth, billing, SEO and CI wiring already done properly instead of “left as an exercise”.',
      'Auth covers email, OAuth providers and magic links, with sessions you can reason about. Billing ships with a clean Stripe integration — products, webhooks, customer portal — the part everyone underestimates. SEO is structured data, sitemaps, OG images and canonical logic, not a meta tag wish.',
      'CI runs typecheck, lint, unit and Playwright tests on every PR, with preview deployments that seed a demo database. The architecture decisions are documented in a 40-page README that explains why, not just what. It is, genuinely, the foundation we wish we had.',
    ],
    features: [
      'Next.js 15 App Router + TypeScript strict + Tailwind + Prisma',
      'Complete auth: email, OAuth, magic links, session management',
      'Stripe integration: products, checkout, webhooks, customer portal',
      'SEO: structured data, sitemaps, dynamic OG images, canonicals',
      'GitHub Actions CI: typecheck, lint, unit + Playwright tests',
      'Preview deployments with seeded demo database',
      '40-page architecture README explaining every decision',
    ],
    included: [
      {
        group: 'Codebase',
        items: [
          'Full monorepo-ready source (apps/web, packages/*)',
          'Prisma schema + seed scripts',
          'Stripe + auth modules with tests',
          'CI workflows + demo deploy config',
        ],
      },
      {
        group: 'Docs',
        items: ['Architecture README (40 pages)', 'Stripe setup walkthrough', 'Customization recipes'],
      },
    ],
    compatibility: ['Node 20+', 'Next.js 15+', 'PostgreSQL / SQLite', 'Stripe (live or test mode)'],
    formats: ['ZIP (TSX, TS, PRISMA)', 'MD'],
    license: STANDARD_LICENSE,
    changelog: [
      { version: '3.5.0', date: 'Sep 2026', note: 'Next.js 15.4, Stripe webhooks v2, OG image pipeline v2.' },
      { version: '3.4.0', date: 'Jun 2026', note: 'Magic links, session analytics events.' },
      { version: '3.3.0', date: 'Jan 2026', note: 'Monorepo layout, Playwright suite, preview seed database.' },
    ],
    faq: [
      {
        q: 'Isn’t this just create-next-app with extras?',
        a: 'create-next-app gives you a blank canvas in five minutes and eleven decisions you’ll regret in five months. This is those decisions already made, tested and documented — auth, billing, SEO and CI at the standard of a team that has shipped them before.',
      },
      {
        q: 'Can I use it for client projects?',
        a: 'Yes, unlimited client projects under the standard license. Many freelancers price this kit into their project quote and ship in week one.',
      },
    ],
  },

  'studio-branding-pack': {
    description: [
      'Studio Branding Pack is an identity system for studios that are tired of ad-hoc brand files. A 60-page brand guideline template, a logo grid and construction system, and complete stationery suites — built so a two-person studio can present like a twenty-person agency.',
      'The guidelines template covers strategy, voice, logo usage, color, typography, imagery, motion principles and applications — written as editable spreads, not locked PDFs. InDesign, Figma and Illustrator versions ship in sync, so your team works in the tool they already know.',
      'The logo construction system is the quiet hero: 40 grid templates (circle, golden ratio, ovals, modular) with measurement and clearance guides that make logo rationale decks take hours instead of days.',
    ],
    features: [
      '60-page brand guideline template (InDesign + Figma)',
      '40 logo grid & construction templates with measurement guides',
      'Complete stationery: business cards, letterhead, email signatures',
      'Presentation kit: rationale deck + identity reveal deck',
      'Written brand voice framework with worked examples',
      'InDesign, Figma and Illustrator files kept in sync',
    ],
    included: [
      {
        group: 'Guidelines',
        items: ['60-page template (INDD + FIG)', 'Editable spreads for every section', 'Brand voice framework', 'Iconography & illustration direction pages'],
      },
      {
        group: 'Systems',
        items: ['40 logo construction grids (AI + FIG)', 'Stationery suite (print-ready)', 'Social & application mockups', 'Rationale + reveal deck templates'],
      },
    ],
    compatibility: ['Adobe InDesign', 'Adobe Illustrator', 'Figma', 'Adobe Photoshop (mockups)'],
    formats: ['INDD', 'AI', 'FIG', 'PSD', 'PDF'],
    license: STANDARD_LICENSE,
    changelog: [
      { version: '2.0.1', date: 'Jun 2026', note: 'Figma guidelines v2 (variables support), 8 new logo grids.' },
      { version: '2.0.0', date: 'Jan 2026', note: 'Major: full rewrite of the guideline template, added rationale decks.' },
      { version: '1.4.0', date: 'May 2025', note: 'Email signature generator, new mockup scenes.' },
    ],
    faq: [
      {
        q: 'Is this for designing a logo or presenting a brand?',
        a: 'Both. The construction grids support the design work; the guideline template, rationale deck and stationery are the presentation layer that makes it feel like a system.',
      },
      {
        q: 'I only use Figma — do I need Adobe apps?',
        a: 'No. The Figma versions are complete, not exports. The Adobe versions exist for studios with print workflows.',
      },
    ],
  },

  'axryzure-ultimate-bundle': {
    description: [
      'Every AXRYZURE product, every future release, one price. The Ultimate Bundle is the entire catalog — all 16 products at their current versions, plus everything we ship for as long as we ship it. It is the best deal in the store by a factor of roughly “are you sure”.',
      'Individually the catalog is worth $210 and rising. This is a limited seasonal release: 500 licenses per season at $129, because it keeps the bundle special and our accountant calm. When the season ends, it goes back in the vault.',
      'Ultimate buyers also get the private makers community — 3,000+ designers and developers, monthly design critiques, product roadmap voting, and a support channel where the median response time is measured in hours, not days.',
    ],
    features: [
      'All 16 AXRYZURE products — $210+ value, complete editions',
      'Every future release included, for life',
      'Private community: 3,000+ makers, critiques, roadmap voting',
      'Priority support with fast human responses',
      'Early access to everything in development',
      'Seasonal limited release — 500 licenses',
    ],
    included: [
      {
        group: 'Everything',
        items: [
          'UI Kits: Minimal UI Kit, Creator Dashboard Pro',
          'Templates: Noir, Aurora, Editorial Portfolio Kit',
          'Developer: Dashboard System, Web Starter Kit',
          'Design: Type System, NOVA 3D, Monolith Icons',
          'Graphics: Motion Pack, Vectra Illustrations',
          'Resources: Branding Pack, Freelance Toolkit',
          'Bundles: Creator Bundle (and future bundles)',
        ],
      },
      {
        group: 'Community',
        items: ['Private community invite', 'Roadmap voting rights', 'Monthly critique sessions', 'Early access channel'],
      },
    ],
    compatibility: ['Figma', 'Next.js / React / Astro', 'After Effects', 'Blender / Cinema 4D', 'InDesign / Illustrator'],
    formats: ['FIG', 'TSX', 'AEP', 'BLEND', 'INDD', 'SVG', 'ZIP'],
    license:
      'Extended-bundle license. Everything in the store under one standard commercial license, applied across all included products. Plus lifetime updates and community access. Resale or redistribution of source files remains off-limits — everything else, enjoy.',
    changelog: [
      { version: '6.0.0', date: 'Oct 2026', note: 'Season 04 opens: catalog at 16 products, community crosses 3,000 members.' },
      { version: '5.0.0', date: 'Apr 2026', note: 'Season 03: added NOVA 3D, Pocket Freelance Toolkit; 512 licenses sold.' },
      { version: '4.0.0', date: 'Oct 2025', note: 'Season 02: added Motion Graphics Pack, Editorial Type System.' },
    ],
    faq: [
      {
        q: 'What happens when the season ends?',
        a: 'The bundle leaves the store until the next season. If you bought it, nothing changes — your downloads keep updating forever regardless of store availability.',
      },
      {
        q: 'If I already own some products, is there an upgrade path?',
        a: 'Email hello@axryzure.store with your order numbers and we’ll credit previous purchases toward the bundle price.',
      },
    ],
  },

  'editorial-type-system': {
    description: [
      'Editorial Type System solves the part of typography everyone skips: pairing and hierarchy. Two licensed typefaces — a refined serif for voice and a workmanlike grotesque for function — plus the system for using them together without guesswork.',
      'Forty-eight hand-tested pairings are documented with real specimens: headlines, decks, captions, pull quotes and tables, each annotated with size, leading, tracking and why it works. Fourteen ready-made type scales (web and print) cover the journey from poster to footnote.',
      'The included typefaces are licensed for web and desktop use within this system — a retail value of $70 on their own, tuned here with custom kerning pairs for editorial sizes.',
    ],
    features: [
      'Two licensed typefaces (serif + grotesque), web & desktop',
      '48 hand-tested pairings with annotated specimens',
      '14 type scales for web and print',
      'Custom kerning pairs tuned for editorial sizes',
      'Pairing decision flowchart — diagnose any pairing problem',
      'CSS + Figma styles generated from every scale',
    ],
    included: [
      {
        group: 'Typefaces',
        items: ['Kessler Serif (4 weights + italics)', 'Grau Grotesk (5 weights)', 'Web + desktop licenses', 'Variable web fonts (woff2)'],
      },
      {
        group: 'System',
        items: ['48 pairing specimens (PDF + FIG)', '14 type scales (CSS + Figma styles)', 'Decision flowchart poster', 'Usage documentation'],
      },
    ],
    compatibility: ['Figma', 'CSS (any framework)', 'InDesign (print scales)'],
    formats: ['WOFF2', 'OTF', 'TTF', 'CSS', 'FIG', 'PDF'],
    license:
      'Standard license plus typeface license: the two included typefaces are licensed for unlimited web and desktop use on your projects and your clients’. Embedding in apps or resale requires the extended license — email us, it’s painless.',
    changelog: [
      { version: '1.1.0', date: 'Sep 2026', note: '12 new pairings, variable web fonts, Figma text styles v2.' },
      { version: '1.0.0', date: 'Aug 2026', note: 'Initial release with 36 pairings and 14 scales.' },
    ],
    faq: [
      {
        q: 'Can I use the fonts on client websites?',
        a: 'Yes — web embedding on projects you build (including client sites) is covered. What isn’t covered is distributing the font files themselves or embedding them in a product your users install.',
      },
      {
        q: 'Do the pairings work for UI, or only editorial?',
        a: 'They work for UI — six of the 48 pairings are specifically tuned for interface work, with tabular numerals and legibility at 12–14px documented in the specimens.',
      },
    ],
  },

  'vectra-illustration-library': {
    description: [
      'Vectra is 280 illustrations that look like one artist made them — because one artist did, over two years, under a strict brief: geometric construction, two-point perspective honesty, and color that obeys a system instead of a mood.',
      'The library covers the scenes product teams actually need: empty states, onboarding flows, feature explainers, 404s, upgrade moments, plus 60 abstract compositions for heroes and backgrounds. Every scene ships with 2–3 variant crops so it survives real layouts.',
      'Recoloring is the point: swap two brand colors and every illustration retints correctly, with contrast relationships preserved. SVGs are optimized by hand — the full library is under 8MB, and the hero scenes animate gracefully if you choose to add motion.',
    ],
    features: [
      '280 illustrations in one consistent geometric style',
      'Scenes for empty states, onboarding, errors, upgrades and heroes',
      '2–3 crop variants per scene for real layouts',
      'Two-swatch recoloring engine with preserved contrast',
      'Hand-optimized SVGs — full library under 8MB',
      'Figma library + raw SVG + React components',
    ],
    included: [
      {
        group: 'Library',
        items: ['280 scenes (840+ crop variants)', 'Figma library with search-optimized naming', 'Raw optimized SVGs', 'React components (tree-shakeable)'],
      },
      {
        group: 'System',
        items: ['Recoloring guide + playground', 'Style construction guide', 'Do/don’t usage examples'],
      },
    ],
    compatibility: ['Figma', 'React 18+', 'Any tool that opens SVG', 'Framer / Webflow (SVG)'],
    formats: ['FIG', 'SVG', 'TSX'],
    license: STANDARD_LICENSE,
    changelog: [
      { version: '2.3.0', date: 'Aug 2026', note: '40 new scenes (AI/workflow themed), React components regenerated.' },
      { version: '2.2.0', date: 'Apr 2026', note: 'Crop variant system v2, 9:16 and 1:1 crops.' },
      { version: '2.0.0', date: 'Nov 2025', note: 'Major: redraw of the first 120 scenes on the new construction grid.' },
    ],
    faq: [
      {
        q: 'Can I animate these in my product?',
        a: 'Yes — SVGs are cleanly layered and named for animation. Many customers add subtle Lottie motion; we include a guide with three tasteful patterns.',
      },
      {
        q: 'Will they match my brand if it isn’t blue?',
        a: 'That is exactly what the recoloring engine is for. Two swatches in, full library retinted, contrast preserved. Non-blue brands are honestly the best test.',
      },
    ],
  },

  'pocket-freelance-toolkit': {
    description: [
      'The Pocket Freelance Toolkit is the business layer of a solo creative practice, systematized: contracts, pricing, proposals, onboarding and taxes — the documents that decide whether freelancing is a career or a hobby.',
      'The contract pack is the flagship: five lawyer-reviewed agreement templates (services, retainer, NDA, IP transfer, kill-fee) in plain language, written to be fair in both directions. The pricing system includes a rate calculator that accounts for taxes, bench time and vacation — the number it spits out will be higher than yours, and it will be right.',
      'Everything lives in a Notion command center wired to the templates, with a proposal deck, onboarding flow, invoice kit and a quarterly tax checklist. Freelancers who use it report raising rates within a month. That is not marketing; it is arithmetic.',
    ],
    features: [
      '5 lawyer-reviewed contract templates in plain language',
      'Rate calculator that includes taxes, bench time and vacation',
      'Proposal deck with a structure that closes (worked examples)',
      'Client onboarding flow: welcome, kickoff, feedback protocol',
      'Invoice + quote kit (Numbers, Sheets, PDF)',
      'Notion command center wiring it all together',
    ],
    included: [
      {
        group: 'Legal & money',
        items: [
          '5 contract templates (DOCX + PDF)',
          'Rate & project pricing calculator (Sheets + Numbers)',
          'Invoice, quote & receipt kit',
          'Quarterly tax checklist (US/EU/UK notes)',
        ],
      },
      {
        group: 'Client work',
        items: ['Proposal deck (Figma + Slides)', 'Onboarding flow (Notion)', 'Feedback & revision protocol', 'Offboarding & testimonial asks'],
      },
    ],
    compatibility: ['Notion', 'Google Workspace', 'Microsoft Office', 'Figma', 'Apple Numbers'],
    formats: ['NOTION', 'DOCX', 'XLSX', 'FIG', 'PDF'],
    license:
      'Standard license covers use in your own freelance practice, including client-facing documents. The templates themselves may not be resold or republished. This is a toolkit, not legal advice — have counsel review before jurisdiction-critical use.',
    changelog: [
      { version: '1.3.0', date: 'Sep 2026', note: 'Kill-fee clause pack, updated EU VAT notes, v2 rate calculator.' },
      { version: '1.2.0', date: 'Jul 2026', note: 'Onboarding flow v2, testimonial ask scripts.' },
      { version: '1.1.0', date: 'Jun 2026', note: 'UK tax checklist, Numbers invoice kit.' },
    ],
    faq: [
      {
        q: 'Are the contracts valid in my country?',
        a: 'They are plain-language templates reviewed by counsel in the US, EU and UK, with jurisdiction notes included. They are a strong starting point — not a substitute for a lawyer when the stakes are real.',
      },
      {
        q: 'Why is a document toolkit this expensive?',
        a: 'One avoided scope-creep conversation or single rate increase pays for it several times over. Also: five lawyer-reviewed contracts alone would cost more than this to draft.',
      },
    ],
  },

  'nova-3d-shape-collection': {
    description: [
      'NOVA is 120 3D shapes and materials for the age of tasteful glass: spheres, toruses, prisms and organic forms with material presets — glass, chrome, brushed metal, fabric, gradient — rendered and ready, or editable down to the node.',
      'Every shape ships as a Blender file (geometry nodes intact) and a Cinema 4D scene, plus 4K transparent PNG renders for people who just need the image now. The material library is built on physically plausible setups — the glass actually disperses, the chrome actually reflects an HDRI you can swap.',
      'Drop these into heroes, posters, album art or product marketing. The collection is curated rather than exhaustive: 120 shapes that compose well together, in a shared dimensional language — so a NOVA scene looks art-directed even when you improvised it at 11pm.',
    ],
    features: [
      '120 shapes with clean topology and geometry-node variants',
      'Material library: glass, chrome, brushed metal, fabric, gradient',
      'Blender 4.x and Cinema 4D scenes, fully editable',
      '4K transparent PNG render of every shape',
      'Physically plausible materials — swap HDRIs freely',
      'HDRI starter pack (6 environments) included',
    ],
    included: [
      {
        group: '3D',
        items: ['120 Blender files (4.x)', '120 Cinema 4D scenes', 'Material library (one-click apply)', '6 HDRI environments'],
      },
      {
        group: 'Renders',
        items: ['120 × 4K transparent PNGs', 'Pre-lit hero scene setups', 'Composition starter scenes'],
      },
    ],
    compatibility: ['Blender 4.x', 'Cinema 4D R25+', 'Any tool that imports PNG/OBJ'],
    formats: ['BLEND', 'C4D', 'PNG', 'OBJ', 'HDR'],
    license: STANDARD_LICENSE,
    changelog: [
      { version: '1.6.0', date: 'Jul 2026', note: '24 new organic shapes, fabric material v2, 2 HDRIs.' },
      { version: '1.5.0', date: 'Mar 2026', note: 'Geometry-node variants, gradient material engine.' },
      { version: '1.4.0', date: 'Dec 2025', note: 'Cinema 4D scenes, 4K render refresh.' },
    ],
    faq: [
      {
        q: 'Do I need to know 3D to use this?',
        a: 'No — the 4K transparent PNGs drop straight into any design tool. If you want to tweak, the Blender files are organized and documented for beginners.',
      },
      {
        q: 'Blender or Cinema 4D — which files are canonical?',
        a: 'Blender is where the collection is built, so new shapes land there first. C4D scenes are converted and maintained in sync.',
      },
    ],
  },
}
