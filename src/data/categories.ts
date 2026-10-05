import type { Category, CategorySlug } from '@/types'

export const CATEGORIES: Category[] = [
  {
    slug: 'ui-kits',
    name: 'UI Kits',
    tagline: 'Component systems & screens',
    description:
      'Complete interface systems built on tokens and variables — screens, components and documentation that survive contact with real products.',
  },
  {
    slug: 'website-templates',
    name: 'Website Templates',
    tagline: 'Production-ready sites',
    description:
      'Portfolio, landing and editorial sites engineered on modern stacks. Ship a fast, distinctive website without starting from a blank canvas.',
  },
  {
    slug: 'design-assets',
    name: 'Design Assets',
    tagline: 'Type, texture & dimension',
    description:
      'Type systems, 3D shapes and dimensional assets that add craft to your work — designed to pair, not to decorate.',
  },
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    tagline: 'Ship with confidence',
    description:
      'Starters, admin systems and dashboards with senior-level code. TypeScript, tests and sane architecture included.',
  },
  {
    slug: 'icons',
    name: 'Icons',
    tagline: 'Precision pictograms',
    description:
      'Icon families drawn on strict grids — consistent strokes, real optical balance, and exports for every tool you use.',
  },
  {
    slug: 'graphics',
    name: 'Graphics',
    tagline: 'Motion & illustration',
    description:
      'Animation packs and illustration libraries with a consistent point of view. Recolorable, editable, render-ready.',
  },
  {
    slug: 'creative-resources',
    name: 'Creative Resources',
    tagline: 'Systems for working creatives',
    description:
      'Branding kits, freelance toolkits and business systems — the unglamorous scaffolding that makes creative work sustainable.',
  },
  {
    slug: 'digital-bundles',
    name: 'Digital Bundles',
    tagline: 'Complete toolkits, one price',
    description:
      'Curated everything-packs for people who’d rather buy once. Full libraries at a fraction of the individual price.',
  },
]

export const getCategory = (slug: CategorySlug): Category =>
  CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[0]
