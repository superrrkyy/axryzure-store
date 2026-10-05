import { useState } from 'react'
import type { Product } from '@/types'
import {
  BEST_SELLERS,
  FEATURED_PRODUCTS,
  LIMITED_PRODUCTS,
  NEW_ARRIVALS,
  TRENDING_PRODUCTS,
} from '@/data/products'
import { Hero } from '@/components/home/Hero'
import {
  TrustBand,
  FeaturedSection,
  CollectionsSection,
  TrendingSection,
  LimitedSection,
  NewArrivalsSection,
  BestSellersSection,
  TestimonialsSection,
  NewsletterSection,
  FinalCTA,
} from '@/components/home/Sections'
import { QuickPreview } from '@/components/product/QuickPreview'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function HomePage() {
  usePageTitle('Premium Digital Goods for Creators')
  const [preview, setPreview] = useState<Product | null>(null)

  return (
    <>
      <Hero />
      <TrustBand />
      <FeaturedSection products={FEATURED_PRODUCTS} onQuickPreview={setPreview} />
      <CollectionsSection />
      <TrendingSection products={TRENDING_PRODUCTS} onQuickPreview={setPreview} />
      <LimitedSection products={LIMITED_PRODUCTS} />
      <NewArrivalsSection products={NEW_ARRIVALS} onQuickPreview={setPreview} />
      <BestSellersSection products={BEST_SELLERS} />
      <TestimonialsSection />
      <NewsletterSection />
      <FinalCTA />
      <QuickPreview product={preview} onClose={() => setPreview(null)} />
    </>
  )
}
