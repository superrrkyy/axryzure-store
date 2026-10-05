import type { ReactNode } from 'react'

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-ink-900/40 px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-ink-800 text-white/50">
        {icon}
      </div>
      <h2 className="mt-5 font-display text-xl text-white/90">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/50">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
