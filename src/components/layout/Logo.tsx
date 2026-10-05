import { Link } from 'react-router-dom'
import { cx } from '@/utils/format'

/* AXRYZURE monogram + wordmark. */

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className="shrink-0">
      <rect width="32" height="32" rx="8" fill="#0D0F16" />
      <rect width="32" height="32" rx="8" fill="url(#logo-g)" opacity="0.35" />
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6F87F8" />
          <stop offset="100%" stopColor="#4957C2" />
        </linearGradient>
      </defs>
      <path d="M16 6.4 24.8 25h-4.1L16 14.4 11.3 25H7.2L16 6.4Z" fill="#8CA0FA" />
      <path d="M12.5 19.3h7l1.5 3.4h-10l1.5-3.4Z" fill="#E4CB86" />
    </svg>
  )
}

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link
      to="/"
      aria-label="AXRYZURE Store — home"
      className={cx('group flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400', className)}
    >
      <LogoMark size={compact ? 28 : 32} />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-[0.22em] text-white/95 transition-colors group-hover:text-white">
          AXRYZURE
        </span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.42em] text-accent-300/80">
          Store
        </span>
      </span>
    </Link>
  )
}
