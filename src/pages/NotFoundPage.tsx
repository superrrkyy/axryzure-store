import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import { buttonClasses } from '@/components/ui/Button'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function NotFoundPage() {
  usePageTitle('Page not found')
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center pb-24 pt-24 text-center">
      <p className="font-display text-[120px] font-light leading-none text-white/[0.08] sm:text-[180px]" aria-hidden>
        404
      </p>
      <div className="-mt-10 sm:-mt-16">
        <p className="eyebrow justify-center">Lost in the void</p>
        <h1 className="mt-3 font-display text-display-sm font-medium text-white">
          This page shipped without us.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/55">
          The link is broken, retired, or never existed. The catalog, however, is very real — and full of
          things worth building with.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link to="/" className={buttonClasses('secondary', 'md')}>
            <ArrowLeft size={15} aria-hidden /> Back home
          </Link>
          <Link to="/shop" className={buttonClasses('primary', 'md')}>
            <Compass size={15} aria-hidden /> Explore the shop
          </Link>
        </div>
      </div>
    </div>
  )
}
