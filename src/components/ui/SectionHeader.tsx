import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Reveal } from './Reveal'

/* Editorial section header: mono eyebrow + serif title + optional link. */

export function SectionHeader({
  eyebrow,
  title,
  description,
  linkTo,
  linkLabel,
  className,
}: {
  eyebrow: string
  title: ReactNode
  description?: string
  linkTo?: string
  linkLabel?: string
  className?: string
}) {
  return (
    <Reveal className={className}>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div className="max-w-2xl">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-3 font-display text-display-sm font-medium text-white/95">{title}</h2>
          {description && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/55">{description}</p>}
        </div>
        {linkTo && linkLabel && (
          <Link
            to={linkTo}
            className="group inline-flex items-center gap-2 border-b border-transparent pb-1 font-mono text-xs uppercase tracking-[0.16em] text-white/60 transition-colors hover:border-accent-400/60 hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 rounded-sm"
          >
            {linkLabel}
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Link>
        )}
      </div>
    </Reveal>
  )
}
