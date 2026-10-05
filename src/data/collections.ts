import type { Collection } from '@/types'

export const COLLECTIONS: Collection[] = [
  {
    slug: 'the-minimalist-studio',
    name: 'The Minimalist Studio',
    tagline: 'Less, but better',
    description:
      'The essentials for a calm, focused design practice — one UI kit, one icon family, one type system and a portfolio that lets the work speak. Everything in this collection shares the same restraint: neutral palettes, strict grids, zero decoration without purpose.',
    curatorNote:
      'Assembled for designers who believe the best interface is the one you stop noticing. Start here if you trim more than you add.',
    productSlugs: ['axryzure-minimal-ui-kit', 'noir-portfolio-template', 'monolith-icons', 'editorial-type-system'],
    art: { bg: '#0B0D14', a: '#8CA0FA', b: '#E4CB86' },
  },
  {
    slug: 'ship-faster',
    name: 'Ship Faster',
    tagline: 'Zero to launched',
    description:
      'Developer-grade foundations for your next product — a production starter, an admin system, a UI kit that speaks fluent Tailwind, and landing sections that convert. Auth, billing, SEO and CI are solved problems; spend your evenings on the actual product.',
    curatorNote:
      'Built by developers who have shipped under deadline. Every stack decision in here is the boring, proven kind.',
    productSlugs: ['premium-web-starter-kit', 'developer-dashboard-system', 'axryzure-minimal-ui-kit', 'aurora-landing-page-kit'],
    art: { bg: '#081210', a: '#34D399', b: '#22D3EE' },
  },
  {
    slug: 'the-editorial-eye',
    name: 'The Editorial Eye',
    tagline: 'Print discipline, web speed',
    description:
      'Typography, portfolios and visual storytelling for people who squint at kerning. A serif-first type system, two editorial portfolios, and an illustration library with a strong point of view — for sites that read like magazines and load like apps.',
    curatorNote:
      'For photographers, art directors and studios whose work deserves better than a template with three fonts fighting.',
    productSlugs: ['editorial-portfolio-kit', 'editorial-type-system', 'noir-portfolio-template', 'vectra-illustration-library'],
    art: { bg: '#14110D', a: '#E4CB86', b: '#F2EFE7' },
  },
  {
    slug: 'creator-economy-stack',
    name: 'Creator Economy Stack',
    tagline: 'Monetize, publish, grow',
    description:
      'The complete toolkit for independent creators — a dashboard that unifies your revenue, a bundle that covers your brand, and the business systems that turn a content habit into a company. Track, plan, publish and invoice from one stack.',
    curatorNote:
      'For the creator juggling six platforms and a spreadsheet. This is the stack we wish existed when we went independent.',
    productSlugs: ['creator-dashboard-pro', 'digital-creator-bundle', 'pocket-freelance-toolkit', 'studio-branding-pack'],
    art: { bg: '#150E1A', a: '#A78BFA', b: '#FB7185' },
  },
]

export const getCollection = (slug: string): Collection | undefined =>
  COLLECTIONS.find((c) => c.slug === slug)
