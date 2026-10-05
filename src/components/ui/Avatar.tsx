import { hashString } from '@/utils/format'

/* Initials avatar with deterministic color per name. */

const PALETTES = [
  ['#6F87F8', '#0D1220'],
  ['#A78BFA', '#161022'],
  ['#34D399', '#08130E'],
  ['#E4CB86', '#161209'],
  ['#FB7185', '#190D11'],
  ['#22D3EE', '#081317'],
  ['#C98F5A', '#171108'],
]

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const palette = PALETTES[hashString(name) % PALETTES.length]
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full font-mono font-medium"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: `linear-gradient(135deg, ${palette[0]}26, ${palette[0]}12)`,
        color: palette[0],
        border: `1px solid ${palette[0]}3d`,
      }}
    >
      {initials}
    </span>
  )
}
