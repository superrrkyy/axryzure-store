import { Minus, Plus } from 'lucide-react'

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  label,
}: {
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
  label: string
}) {
  return (
    <div
      className="inline-flex items-center rounded-lg border border-white/[0.1] bg-ink-850"
      role="group"
      aria-label={`Quantity for ${label}`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="flex h-8 w-8 items-center justify-center rounded-l-lg text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-400"
      >
        <Minus size={13} />
      </button>
      <span className="w-8 text-center font-mono text-[13px] text-white/90" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-8 w-8 items-center justify-center rounded-r-lg text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-400"
      >
        <Plus size={13} />
      </button>
    </div>
  )
}
