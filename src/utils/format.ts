/* Formatting + shared animation constants. */

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const formatPrice = (n: number): string =>
  n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`

export const formatCompact = (n: number): string =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

export const formatNumber = (n: number): string => new Intl.NumberFormat('en').format(n)

export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(iso),
  )

export const formatMonthYear = (iso: string): string =>
  new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(new Date(iso))

/** Simple deterministic string hash (used for license keys, avatar colors). */
export const hashString = (input: string): number => {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

export const round2 = (n: number): number => Math.round(n * 100) / 100

/** Pluralize helper: `${count} review${s(count)}` */
export const s = (n: number): string => (n === 1 ? '' : 's')

export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ')
