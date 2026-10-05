import { cx } from '@/utils/format'

/* Loading placeholders with a subtle shimmer. */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cx('skeleton rounded-lg bg-white/[0.045]', className)}
      aria-hidden
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-ink-850" aria-hidden>
      <Skeleton className="aspect-[4/3] w-full rounded-b-none rounded-t-xl" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
