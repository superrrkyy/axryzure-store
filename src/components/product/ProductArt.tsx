import { useId, type ReactNode } from 'react'
import type { Product } from '@/types'

/* ------------------------------------------------------------------ */
/*  ProductArt — deterministic SVG artwork generator.                  */
/*  Every product gets a unique composition driven by its palette and  */
/*  style. No network images: instant, crisp at any size, zero CLS.    */
/*                                                                     */
/*  variant 0 — primary composition (cards, hero)                      */
/*  variant 1 — typographic poster (gallery)                           */
/*  variant 2 — motif pattern (gallery)                                */
/*  variant 3 — zoomed detail crop (gallery)                           */
/* ------------------------------------------------------------------ */

interface Palette {
  bg: string
  a: string
  b: string
  c: string
  light: boolean
  ov: (alpha: number) => string
  solid: string
}

const isLight = (hex: string): boolean => {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const bl = parseInt(h.slice(4, 6), 16)
  return (0.2126 * r + 0.7152 * g + 0.0722 * bl) / 255 > 0.6
}

const FONT_DISPLAY = '"Fraunces Variable", Georgia, serif'
const FONT_MONO = '"JetBrains Mono Variable", monospace'

/* --- shared bits ------------------------------------------------------ */

const GridLines = ({ p }: { p: Palette }) => (
  <g opacity={p.light ? 0.5 : 1}>
    {Array.from({ length: 8 }).map((_, i) => (
      <line key={`v${i}`} x1={80 * (i + 1)} y1={0} x2={80 * (i + 1)} y2={480} stroke={p.ov(0.045)} />
    ))}
    {Array.from({ length: 6 }).map((_, i) => (
      <line key={`h${i}`} x1={0} y1={80 * (i + 1)} x2={640} y2={80 * (i + 1)} stroke={p.ov(0.045)} />
    ))}
  </g>
)

const Caption = ({ p, left }: { p: Palette; left: string }) => (
  <>
    <line x1={44} y1={434} x2={596} y2={434} stroke={p.ov(0.09)} />
    <text x={44} y={458} fontFamily={FONT_MONO} fontSize={10} letterSpacing={2.4} fill={p.ov(0.5)}>
      {left.toUpperCase()}
    </text>
    <text x={596} y={458} textAnchor="end" fontFamily={FONT_MONO} fontSize={10} letterSpacing={2.4} fill={p.ov(0.5)}>
      AXRYZURE
    </text>
  </>
)

const Window = ({
  p,
  x,
  y,
  w,
  h,
  title,
}: {
  p: Palette
  x: number
  y: number
  w: number
  h: number
  title?: string
}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={16} fill={p.light ? '#FFFFFF' : p.ov(0.05)} stroke={p.ov(0.12)} />
    <line x1={x} y1={y + 34} x2={x + w} y2={y + 34} stroke={p.ov(0.08)} />
    <circle cx={x + 22} cy={y + 17} r={4} fill="#FF5F57" opacity={0.85} />
    <circle cx={x + 38} cy={y + 17} r={4} fill="#FEBC2E" opacity={0.85} />
    <circle cx={x + 54} cy={y + 17} r={4} fill="#28C840" opacity={0.85} />
    {title && (
      <text x={x + w / 2} y={y + 21} textAnchor="middle" fontFamily={FONT_MONO} fontSize={10} fill={p.ov(0.45)}>
        {title}
      </text>
    )}
  </g>
)

/* --- glyph library (24px box) ---------------------------------------- */

const GLYPHS: Array<ReactNode> = [
  <g key="g0">
    <circle cx="12" cy="12" r="7.5" />
  </g>,
  <g key="g1">
    <rect x="6.5" y="6.5" width="11" height="11" rx="2" transform="rotate(45 12 12)" />
  </g>,
  <g key="g2">
    <path d="M12 5v14M5 12h14" />
  </g>,
  <g key="g3">
    <path d="M7 17 17 7M9.5 7H17v7.5" />
  </g>,
  <g key="g4">
    <path d="M12 3.8 19.8 8v8L12 20.2 4.2 16V8L12 3.8Z" />
  </g>,
  <g key="g5">
    <path d="M12 4l2.4 5.6L20 12l-5.6 2.4L12 20l-2.4-5.6L4 12l5.6-2.4L12 4Z" fill="currentColor" stroke="none" />
  </g>,
  <g key="g6">
    <path d="M5 15a7 7 0 0 1 14 0H5Z" fill="currentColor" stroke="none" />
  </g>,
  <g key="g7">
    <path d="M12 5.5 19.5 18h-15L12 5.5Z" />
  </g>,
  <g key="g8">
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
  </g>,
  <g key="g9">
    <path d="M5 12h14" />
  </g>,
  <g key="g10">
    <path d="M12 4l8 4.5-8 4.5-8-4.5L12 4ZM4 12.5l8 4.5 8-4.5M4 16.5l8 4.5 8-4.5" />
  </g>,
  <g key="g11">
    <path d="M13.5 3.5 6 13.5h5.5L10.5 20.5 18 10.5h-5.5l1-7Z" fill="currentColor" stroke="none" />
  </g>,
]

const Glyph = ({
  index,
  x,
  y,
  size,
  color,
  sw = 1.5,
}: {
  index: number
  x: number
  y: number
  size: number
  color: string
  sw?: number
}) => (
  <g transform={`translate(${x} ${y}) scale(${size / 24})`} color={color}>
    <g fill="none" stroke="currentColor" strokeWidth={sw * (24 / size)} strokeLinecap="round" strokeLinejoin="round">
      {GLYPHS[index % GLYPHS.length]}
    </g>
  </g>
)

/* --- compositions ------------------------------------------------------ */

const barHeights = (seed: number, n: number, min: number, max: number): number[] =>
  Array.from({ length: n }, (_, i) => min + ((Math.sin(seed * 7.3 + i * 2.1) + 1) / 2) * (max - min))

function DashboardArt({ p, uid }: { p: Palette; uid: string }) {
  const bars = barHeights(3, 9, 22, 70)
  return (
    <g>
      <Window p={p} x={96} y={52} w={448} h={368} />
      {/* sidebar */}
      <rect x={112} y={100} width={92} height={304} rx={10} fill={p.ov(0.03)} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={124}
          y={122 + i * 32}
          width={i === 0 ? 68 : 56}
          height={i === 0 ? 18 : 9}
          rx={i === 0 ? 9 : 4.5}
          fill={i === 0 ? p.a : p.ov(0.14)}
        />
      ))}
      {/* header */}
      <rect x={220} y={104} width={190} height={13} rx={6.5} fill={p.ov(0.28)} />
      <rect x={452} y={98} width={72} height={24} rx={12} fill={`url(#${uid}-grad)`} />
      {/* stat cards */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={220 + i * 105} y={138} width={97} height={62} rx={10} fill={p.ov(0.04)} stroke={p.ov(0.07)} />
          <rect x={232 + i * 105} y={150} width={38} height={6} rx={3} fill={p.ov(0.2)} />
          <rect x={232 + i * 105} y={160} width={52} height={10} rx={5} fill={[p.a, p.b, p.solid][i]} opacity={0.9} />
          <polyline
            points={`${232 + i * 105},${192} ${248 + i * 105},${184} ${262 + i * 105},${188} ${276 + i * 105},${178} ${292 + i * 105},${182} ${305 + i * 105},${172}`}
            fill="none"
            stroke={p.a}
            strokeWidth={1.6}
            opacity={0.8}
          />
        </g>
      ))}
      {/* chart card */}
      <rect x={220} y={214} width={304} height={118} rx={10} fill={p.ov(0.04)} stroke={p.ov(0.07)} />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={236 + i * 30}
          y={316 - h}
          width={18}
          height={h}
          rx={4}
          fill={i === 5 ? `url(#${uid}-grad)` : i === 7 ? p.b : p.ov(0.12)}
        />
      ))}
      <polyline
        points="236,286 266,272 296,278 326,254 356,262 386,238 416,246 446,228 476,236 506,220"
        fill="none"
        stroke={p.a}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* bottom row */}
      <rect x={220} y={344} width={186} height={60} rx={10} fill={p.ov(0.04)} stroke={p.ov(0.07)} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={234} cy={360 + i * 17} r={3.5} fill={[p.a, p.b, p.ov(0.3)][i]} />
          <rect x={244} y={357 + i * 17} width={90 - i * 18} height={6} rx={3} fill={p.ov(0.16)} />
          <rect x={356} y={357 + i * 17} width={36} height={6} rx={3} fill={p.ov(0.1)} />
        </g>
      ))}
      <rect x={418} y={344} width={106} height={60} rx={10} fill={p.ov(0.04)} stroke={p.ov(0.07)} />
      <circle cx={471} cy={374} r={19} fill="none" stroke={p.ov(0.1)} strokeWidth={7} />
      <circle
        cx={471}
        cy={374}
        r={19}
        fill="none"
        stroke={p.a}
        strokeWidth={7}
        strokeDasharray="86 34"
        strokeLinecap="round"
        transform="rotate(-90 471 374)"
      />
    </g>
  )
}

function BrowserArt({ p, uid }: { p: Palette; uid: string }) {
  return (
    <g>
      <Window p={p} x={80} y={52} w={480} h={368} title="axryzure.studio" />
      {/* hero */}
      <text x={112} y={132} fontFamily={FONT_MONO} fontSize={11} letterSpacing={3.5} fill={p.b}>
        NEW DROP — SEASON 04
      </text>
      <rect x={112} y={148} width={304} height={21} rx={7} fill={p.ov(0.82)} />
      <rect x={112} y={178} width={228} height={21} rx={7} fill={`url(#${uid}-grad)`} />
      <rect x={112} y={216} width={250} height={8} rx={4} fill={p.ov(0.2)} />
      <rect x={112} y={230} width={196} height={8} rx={4} fill={p.ov(0.2)} />
      <rect x={112} y={254} width={98} height={30} rx={15} fill={`url(#${uid}-grad)`} />
      <rect x={218} y={254} width={74} height={30} rx={15} fill="none" stroke={p.ov(0.2)} />
      {/* cards row */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x={112 + i * 148}
            y={308}
            width={140}
            height={86}
            rx={10}
            fill={i === 0 ? `url(#${uid}-grad)` : p.ov(0.05)}
            stroke={p.ov(i === 0 ? 0 : 0.08)}
          />
          {i === 0 && <circle cx={182 + i * 148} cy={351} r={22} fill={p.light ? '#FFFFFF' : '#0B0B0E'} opacity={0.92} />}
          {i === 1 && (
            <>
              <rect x={128 + i * 148} y={326} width={70} height={8} rx={4} fill={p.a} opacity={0.8} />
              <rect x={128 + i * 148} y={342} width={48} height={8} rx={4} fill={p.b} opacity={0.6} />
              <rect x={128 + i * 148} y={358} width={60} height={8} rx={4} fill={p.ov(0.18)} />
            </>
          )}
          {i === 2 && (
            <>
              <path
                d={`M${128 + i * 148} 378 L${156 + i * 148} 330 L${184 + i * 148} 360 L${204 + i * 148} 336 L${232 + i * 148} 378 Z`}
                fill={p.a}
                opacity={0.75}
              />
            </>
          )}
        </g>
      ))}
    </g>
  )
}

function IconsArt({ p }: { p: Palette }) {
  return (
    <g>
      {Array.from({ length: 24 }).map((_, i) => {
        const col = i % 6
        const row = Math.floor(i / 6)
        const x = 88 + col * 78
        const y = 72 + row * 88
        const hot = (i * 7 + 3) % 11 === 0
        const warm = (i * 5 + 1) % 9 === 0
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={58}
              height={58}
              rx={14}
              fill={hot ? p.a : warm ? p.b : p.ov(0.035)}
              opacity={hot || warm ? 0.92 : 1}
            />
            <Glyph
              index={i}
              x={x + 14}
              y={y + 14}
              size={30}
              color={hot ? p.light ? '#FFFFFF' : '#0B0B0E' : warm ? p.light ? '#FFFFFF' : '#0B0B0E' : i % 3 === 0 ? p.a : p.ov(0.55)}
              sw={1.6}
            />
          </g>
        )
      })}
    </g>
  )
}

function BundleArt({ p, uid, count }: { p: Palette; uid: string; count: string }) {
  return (
    <g>
      <ellipse cx={320} cy={408} rx={190} ry={18} fill="#000" opacity={p.light ? 0.08 : 0.35} />
      <g transform="rotate(-6 320 240)">
        <rect x={188} y={86} width={276} height={300} rx={16} fill={p.ov(0.05)} stroke={p.ov(0.1)} />
      </g>
      <g transform="rotate(5 320 240)">
        <rect x={196} y={72} width={262} height={300} rx={16} fill={p.b} opacity={0.14} stroke={p.b} strokeOpacity={0.3} />
      </g>
      <rect x={200} y={92} width={244} height={312} rx={18} fill={`url(#${uid}-grad)`} />
      {/* content on the front card */}
      <rect x={222} y={116} width={86} height={8} rx={4} fill={p.light ? '#FFFFFF' : '#0B0B0E'} opacity={0.75} />
      <rect x={222} y={134} width={130} height={16} rx={8} fill={p.light ? '#FFFFFF' : '#0B0B0E'} opacity={0.9} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={222} y={168 + i * 26} width={200 - i * 52} height={10} rx={5} fill={p.light ? '#FFFFFF' : '#0B0B0E'} opacity={0.4} />
      ))}
      <rect x={222} y={262} width={120} height={34} rx={17} fill={p.light ? '#FFFFFF' : '#0B0B0E'} opacity={0.92} />
      <rect x={234} y={273} width={72} height={12} rx={6} fill={`url(#${uid}-grad)`} />
      {/* seal */}
      <circle cx={400} cy={330} r={40} fill="none" stroke={p.light ? '#FFFFFF' : '#0B0B0E'} strokeWidth={1.4} opacity={0.55} />
      <circle cx={400} cy={330} r={32} fill="none" stroke={p.light ? '#FFFFFF' : '#0B0B0E'} strokeWidth={0.8} strokeDasharray="3 5" opacity={0.5} />
      <text x={400} y={336} textAnchor="middle" fontFamily={FONT_MONO} fontSize={11} letterSpacing={1.5} fill={p.light ? '#FFFFFF' : '#0B0B0E'} opacity={0.85}>
        {count}
      </text>
    </g>
  )
}

function TerminalArt({ p, version }: { p: Palette; version: string }) {
  const line = (y: number, parts: Array<[string, string]>) => (
    <text x={112} y={y} fontFamily={FONT_MONO} fontSize={14}>
      {parts.map(([text, fill], i) => (
        <tspan key={i} fill={fill}>
          {text}
        </tspan>
      ))}
    </text>
  )
  return (
    <g>
      <Window p={p} x={80} y={52} w={480} h={368} title={`axryzure — v${version}`} />
      {line(126, [['$ ', p.a], ['npm create axryzure@latest', p.solid]])}
      {line(156, [['✓ ', p.b], ['214 packages installed in 4.1s', p.ov(0.6)]])}
      {line(182, [['✓ ', p.b], ['auth · billing · seo · ci configured', p.ov(0.6)]])}
      {line(212, [['$ ', p.a], ['npm run dev', p.solid]])}
      {line(242, [['▲ ', p.b], ['ready in 312ms — ', p.ov(0.6)], ['localhost:3000', p.b]])}
      {line(288, [['// ship something worth shipping', p.ov(0.35)]])}
      {line(330, [['$ ', p.a], ['▌', p.a]])}
      <rect x={484} y={316} width={56} height={24} rx={12} fill={p.a} opacity={0.16} />
      <text x={512} y={332} textAnchor="middle" fontFamily={FONT_MONO} fontSize={10} fill={p.a}>
        PASS
      </text>
    </g>
  )
}

function TypeArt({ p }: { p: Palette }) {
  return (
    <g>
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1={64} y1={80 + i * 38} x2={576} y2={80 + i * 38} stroke={p.ov(i === 4 ? 0.14 : 0.05)} strokeDasharray={i === 4 ? '' : '2 6'} />
      ))}
      <text x={96} y={330} fontFamily={FONT_DISPLAY} fontSize={300} fill="none" stroke={p.a} strokeWidth={1.4} opacity={0.9}>
        Aa
      </text>
      <text x={76} y={310} fontFamily={FONT_DISPLAY} fontSize={300} fill={p.solid}>
        Aa
      </text>
      <rect x={96} y={352} width={54} height={7} rx={3.5} fill={p.a} />
      <text x={166} y={359} fontFamily={FONT_MONO} fontSize={11} letterSpacing={2.5} fill={p.ov(0.55)}>
        48 PAIRINGS · 14 SCALES
      </text>
      <text x={96} y={420} fontFamily={FONT_MONO} fontSize={11} letterSpacing={1} fill={p.ov(0.4)}>
        THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG — 0123456789
      </text>
    </g>
  )
}

function IllustrationArt({ p, uid }: { p: Palette; uid: string }) {
  return (
    <g>
      <path
        d="M384 132c78-22 148 34 132 112-14 68-96 96-152 62-58-36-72-146 20-174Z"
        fill={`url(#${uid}-grad)`}
        opacity={0.92}
      />
      <circle cx={214} cy={176} r={56} fill="none" stroke={p.a} strokeWidth={17} opacity={0.9} />
      <circle cx={196} cy={322} r={26} fill={p.b} opacity={0.85} />
      <path d="M438 348l62 0-31-54-31 54Z" fill={p.b} opacity={0.8} />
      <g fill="none" stroke={p.solid} strokeWidth={3} strokeLinecap="round" opacity={0.8}>
        <path d="M476 118v26M463 131h26" />
      </g>
      <path d="M120 356q20-32 40 0t40 0 40 0" fill="none" stroke={p.a} strokeWidth={2.6} strokeLinecap="round" />
      {[p.a, p.b, p.c, p.solid].map((color, i) => (
        <g key={i}>
          <circle cx={100 + i * 34} cy={424} r={10} fill={color} opacity={0.9} />
        </g>
      ))}
      <text x={300} y={428} fontFamily={FONT_MONO} fontSize={10} letterSpacing={2} fill={p.ov(0.45)}>
        2-SWATCH RECOLOR
      </text>
    </g>
  )
}

function ThreeDArt({ p, uid }: { p: Palette; uid: string }) {
  return (
    <g>
      <ellipse cx={300} cy={388} rx={150} ry={20} fill="#000" opacity={0.35} />
      <ellipse cx={150} cy={330} rx={58} ry={9} fill="#000" opacity={0.25} />
      <ellipse cx={472} cy={352} rx={40} ry={7} fill="#000" opacity={0.25} />
      <ellipse cx={320} cy={228} rx={178} ry={66} fill="none" stroke={p.ov(0.16)} strokeWidth={1.2} strokeDasharray="3 7" transform="rotate(-16 320 228)" />
      <circle cx={300} cy={232} r={98} fill={`url(#${uid}-sphere-a)`} />
      <circle cx={300} cy={232} r={98} fill="none" stroke={p.ov(0.14)} />
      <ellipse cx={268} cy={196} rx={34} ry={22} fill="#fff" opacity={0.22} transform="rotate(-24 268 196)" />
      <circle cx={150} cy={296} r={46} fill={`url(#${uid}-sphere-b)`} />
      <ellipse cx={136} cy={282} rx={15} ry={10} fill="#fff" opacity={0.24} transform="rotate(-24 136 282)" />
      <circle cx={472} cy={318} r={32} fill={`url(#${uid}-sphere-c)`} />
      <g transform="rotate(45 496 150)">
        <rect x={482} y={136} width={28} height={28} rx={5} fill={`url(#${uid}-grad)`} />
      </g>
    </g>
  )
}

function BrandArt({ p }: { p: Palette }) {
  return (
    <g>
      {[
        [64, 64, 576, 64],
        [64, 64, 64, 416],
        [576, 64, 576, 416],
        [64, 416, 576, 416],
      ].map(([x1, y1, x2, y2], i) => (
        <path key={i} d={`M${x1} ${y1}h${x2 - x1 > 0 ? 8 : -8}M${x1} ${y1}v${y2 - y1 > 0 ? 8 : -8}`} stroke={p.ov(0.3)} strokeWidth={1.2} fill="none" />
      ))}
      <circle cx={280} cy={224} r={158} fill="none" stroke={p.ov(0.1)} strokeDasharray="2 6" />
      <circle cx={280} cy={224} r={124} fill="none" stroke={p.a} strokeWidth={1.1} opacity={0.65} />
      <circle cx={280} cy={224} r={88} fill="none" stroke={p.ov(0.16)} />
      <line x1={122} y1={224} x2={438} y2={224} stroke={p.ov(0.12)} />
      <line x1={280} y1={66} x2={280} y2={382} stroke={p.ov(0.12)} />
      <line x1={168} y1={112} x2={392} y2={336} stroke={p.ov(0.12)} />
      <line x1={392} y1={112} x2={168} y2={336} stroke={p.ov(0.12)} />
      <path d="M280 140 340 288h-32l-28-74-28 74h-32l60-148Z" fill={p.solid} />
      <path d="M254 250h52l10 24h-72l10-24Z" fill={p.a} />
      {[p.a, p.b, p.c].map((color, i) => (
        <rect key={i} x={470 + i * 30} y={112} width={20} height={20} rx={5} fill={color} />
      ))}
      <line x1={180} y1={396} x2={400} y2={396} stroke={p.a} strokeWidth={1} />
      <line x1={180} y1={390} x2={180} y2={402} stroke={p.a} strokeWidth={1} />
      <line x1={400} y1={390} x2={400} y2={402} stroke={p.a} strokeWidth={1} />
      <text x={290} y={390} textAnchor="middle" fontFamily={FONT_MONO} fontSize={9.5} letterSpacing={1.6} fill={p.ov(0.5)}>
        24 GRID UNITS
      </text>
    </g>
  )
}

function DocumentArt({ p, uid }: { p: Palette; uid: string }) {
  return (
    <g>
      <g transform="rotate(-4 330 240)">
        <rect x={228} y={70} width={248} height={330} rx={12} fill={p.ov(0.04)} stroke={p.ov(0.08)} />
      </g>
      <g transform="rotate(3 330 240)">
        <rect x={216} y={62} width={248} height={330} rx={12} fill={p.ov(0.06)} stroke={p.ov(0.1)} />
      </g>
      <rect x={204} y={56} width={248} height={334} rx={12} fill={p.light ? '#FFFFFF' : p.ov(0.055)} stroke={p.ov(0.14)} />
      <rect x={228} y={84} width={112} height={13} rx={6.5} fill={p.a} />
      <rect x={228} y={112} width={60} height={5} rx={2.5} fill={p.ov(0.3)} />
      {['CLIENT', 'SCOPE', 'TERMS'].map((label, i) => (
        <g key={label}>
          <text x={228} y={146 + i * 56} fontFamily={FONT_MONO} fontSize={9} letterSpacing={2} fill={p.ov(0.4)}>
            {label}
          </text>
          <rect x={228} y={154 + i * 56} width={200} height={28} rx={8} fill={p.ov(0.03)} stroke={p.ov(0.12)} />
          <rect x={238} y={164 + i * 56} width={i === 1 ? 150 : 110} height={8} rx={4} fill={p.ov(0.14)} />
        </g>
      ))}
      <rect x={228} y={322} width={200} height={26} rx={13} fill={p.a} opacity={0.14} />
      <circle cx={414} cy={335} r={9} fill={p.a} />
      <path d="M336 326q8-10 16-2t16-6" fill="none" stroke={p.solid} strokeWidth={1.8} strokeLinecap="round" opacity={0.85} />
      <circle cx={404} cy={132} r={30} fill="none" stroke={p.b} strokeWidth={1.4} strokeDasharray="4 5" opacity={0.8} />
      <text x={404} y={137} textAnchor="middle" fontFamily={FONT_MONO} fontSize={9} letterSpacing={1} fill={p.b}>
        SIGNED
      </text>
      <rect x={228} y={366} width={64} height={6} rx={3} fill={`url(#${uid}-grad)`} />
    </g>
  )
}

function MotionArt({ p, uid }: { p: Palette; uid: string }) {
  const bars = barHeights(9, 22, 10, 54)
  return (
    <g>
      {[64, 96, 128].map((r) => (
        <circle key={r} cx={268} cy={214} r={r} fill="none" stroke={p.ov(0.09)} />
      ))}
      <circle
        cx={268}
        cy={214}
        r={96}
        fill="none"
        stroke={p.a}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="200 403"
        transform="rotate(-40 268 214)"
      />
      <circle cx={268} cy={214} r={52} fill={`url(#${uid}-grad)`} />
      <path d="M256 194l32 20-32 20V194Z" fill={p.light ? '#FFFFFF' : '#0B0B0E'} opacity={0.9} />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={96 + i * 21}
          y={392 - h}
          width={7}
          height={h}
          rx={3.5}
          fill={i === 8 ? p.b : i === 15 ? p.a : p.ov(0.16)}
        />
      ))}
      <line x1={88} y1={392} x2={560} y2={392} stroke={p.ov(0.12)} />
      <text x={88} y={414} fontFamily={FONT_MONO} fontSize={10} fill={p.ov(0.45)}>
        00:00
      </text>
      <text x={560} y={414} textAnchor="end" fontFamily={FONT_MONO} fontSize={10} fill={p.ov(0.45)}>
        00:12 · 60FPS
      </text>
      <g fill="none" stroke={p.b} strokeWidth={1.4} opacity={0.75}>
        <path d="M470 128c22-14 44-6 50 12M470 128c-6 18 4 36 22 42" />
        <circle cx={492} cy={140} r={3} fill={p.b} stroke="none" />
      </g>
    </g>
  )
}

/* --- variant 1: typographic poster ----------------------------------- */

function PosterArt({ p, product }: { p: Palette; product: Product }) {
  const words = product.name.split(' ')
  const maxLen = Math.max(...words.map((w) => w.length))
  const size = Math.min(108, Math.floor(520 / (maxLen * 0.52)))
  const lineH = size * 0.96
  const startY = 250 - ((words.length - 1) * lineH) / 2
  return (
    <g>
      <rect x={26} y={26} width={588} height={428} rx={10} fill="none" stroke={p.ov(0.12)} />
      <text x={52} y={64} fontFamily={FONT_MONO} fontSize={11} letterSpacing={3.2} fill={p.b}>
        {product.category.replace(/-/g, ' ').toUpperCase()}
      </text>
      <text x={588} y={64} textAnchor="end" fontFamily={FONT_MONO} fontSize={11} letterSpacing={3.2} fill={p.ov(0.45)}>
        AXZ—{product.id.replace('p', '').padStart(2, '0')}
      </text>
      <line x1={52} y1={84} x2={588} y2={84} stroke={p.ov(0.12)} />
      {words.map((w, i) => (
        <text
          key={i}
          x={52}
          y={startY + i * lineH}
          fontFamily={FONT_DISPLAY}
          fontSize={size}
          fontStyle={i % 2 === 1 ? 'italic' : 'normal'}
          fill={i % 2 === 1 ? p.a : p.solid}
        >
          {w}
        </text>
      ))}
      <line x1={52} y1={392} x2={588} y2={392} stroke={p.ov(0.12)} />
      <text x={52} y={424} fontFamily={FONT_MONO} fontSize={13} fill={p.solid}>
        ${product.price}
        {product.originalPrice && (
          <tspan fill={p.ov(0.4)} textDecoration="line-through">
            {'  '}${product.originalPrice}
          </tspan>
        )}
      </text>
      <text x={588} y={424} textAnchor="end" fontFamily={FONT_MONO} fontSize={10} letterSpacing={2.4} fill={p.ov(0.5)}>
        {product.availability === 'early-access' ? 'EARLY ACCESS' : 'INSTANT DOWNLOAD'}
      </text>
    </g>
  )
}

/* --- variant 2: motif pattern ----------------------------------------- */

function PatternArt({ p, product }: { p: Palette; product: Product }) {
  const cells = Array.from({ length: 40 })
  return (
    <g>
      {cells.map((_, i) => {
        const col = i % 8
        const row = Math.floor(i / 8)
        const x = 44 + col * 71
        const y = 68 + row * 74
        const seed = (i * 13 + row * 5) % 17
        const hot = seed === 0
        const alt = seed === 5
        const color = hot ? p.a : alt ? p.b : p.ov(0.35)
        const style = product.art.style
        return (
          <g key={i} opacity={hot || alt ? 0.95 : 0.8}>
            {style === 'dashboard' || style === 'motion' ? (
              <>
                <rect x={x} y={y + 12} width={5} height={26} rx={2.5} fill={color} />
                <rect x={x + 9} y={y + 2} width={5} height={36} rx={2.5} fill={hot || alt ? color : p.ov(0.18)} />
                <rect x={x + 18} y={y + 20} width={5} height={18} rx={2.5} fill={p.ov(0.18)} />
                <rect x={x + 27} y={y + 8} width={5} height={30} rx={2.5} fill={hot || alt ? p.ov(0.5) : p.ov(0.14)} />
              </>
            ) : style === 'type' ? (
              <text
                x={x}
                y={y + 38}
                fontFamily={FONT_DISPLAY}
                fontSize={44}
                fontStyle={hot ? 'italic' : 'normal'}
                fill={hot || alt ? color : p.ov(0.16)}
              >
                {i % 2 === 0 ? 'A' : 'a'}
              </text>
            ) : style === '3d' ? (
              <>
                <circle cx={x + 18} cy={y + 18} r={16} fill={hot ? p.a : alt ? p.b : p.ov(0.06)} stroke={p.ov(0.14)} />
                <ellipse cx={x + 13} cy={y + 12} rx={5} ry={3.5} fill="#fff" opacity={hot || alt ? 0.3 : 0.08} />
              </>
            ) : style === 'terminal' ? (
              <text x={x} y={y + 34} fontFamily={FONT_MONO} fontSize={22} fill={hot || alt ? color : p.ov(0.18)}>
                {i % 3 === 0 ? '›_' : '{ }'}
              </text>
            ) : (
              <Glyph index={i + row} x={x} y={y + 4} size={34} color={color} sw={1.7} />
            )}
          </g>
        )
      })}
    </g>
  )
}

/* --- main component ---------------------------------------------------- */

export function ProductArt({
  product,
  variant = 0,
  className,
}: {
  product: Product
  variant?: 0 | 1 | 2 | 3
  className?: string
}) {
  const uid = 'a' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const { bg, a, b, c } = product.art
  const light = isLight(bg)
  const p: Palette = {
    bg,
    a,
    b,
    c,
    light,
    ov: (alpha: number) => (light ? `rgba(22,20,17,${alpha})` : `rgba(255,255,255,${alpha})`),
    solid: light ? '#1A1917' : '#F4F4F6',
  }

  const main = (() => {
    switch (product.art.style) {
      case 'dashboard':
        return <DashboardArt p={p} uid={uid} />
      case 'browser':
        return <BrowserArt p={p} uid={uid} />
      case 'icons':
        return <IconsArt p={p} />
      case 'bundle':
        return <BundleArt p={p} uid={uid} count={`×${product.id === 'p12' ? '16' : '8'}`} />
      case 'terminal':
        return <TerminalArt p={p} version={product.version} />
      case 'type':
        return <TypeArt p={p} />
      case 'illustration':
        return <IllustrationArt p={p} uid={uid} />
      case '3d':
        return <ThreeDArt p={p} uid={uid} />
      case 'brand':
        return <BrandArt p={p} />
      case 'document':
        return <DocumentArt p={p} uid={uid} />
      case 'motion':
        return <MotionArt p={p} uid={uid} />
      default:
        return <DashboardArt p={p} uid={uid} />
    }
  })()

  return (
    <svg
      viewBox="0 0 640 480"
      className={className}
      role="img"
      aria-label={`${product.name} — preview artwork`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${uid}-grad`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={b} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="0.24" cy="0.16" r="0.9">
          <stop offset="0%" stopColor={a} stopOpacity={light ? 0.14 : 0.24} />
          <stop offset="55%" stopColor={a} stopOpacity={light ? 0.03 : 0.06} />
          <stop offset="100%" stopColor={a} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${uid}-vig`} cx="0.5" cy="0.44" r="0.75">
          <stop offset="62%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={light ? 0.07 : 0.3} />
        </radialGradient>
        <radialGradient id={`${uid}-sphere-a`} cx="0.36" cy="0.3" r="0.9">
          <stop offset="0%" stopColor={a} stopOpacity={0.95} />
          <stop offset="60%" stopColor={a} stopOpacity={0.55} />
          <stop offset="100%" stopColor={c} stopOpacity={0.95} />
        </radialGradient>
        <radialGradient id={`${uid}-sphere-b`} cx="0.36" cy="0.3" r="0.9">
          <stop offset="0%" stopColor={b} stopOpacity={0.95} />
          <stop offset="70%" stopColor={b} stopOpacity={0.5} />
          <stop offset="100%" stopColor={a} stopOpacity={0.9} />
        </radialGradient>
        <radialGradient id={`${uid}-sphere-c`} cx="0.36" cy="0.3" r="0.9">
          <stop offset="0%" stopColor={c} stopOpacity={0.95} />
          <stop offset="80%" stopColor={a} stopOpacity={0.85} />
        </radialGradient>
        <clipPath id={`${uid}-clip`}>
          <rect width="640" height="480" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-clip)`}>
        <rect width="640" height="480" fill={bg} />
        <rect width="640" height="480" fill={`url(#${uid}-glow)`} />
        <GridLines p={p} />
        {variant === 1 ? (
          <PosterArt p={p} product={product} />
        ) : variant === 2 ? (
          <PatternArt p={p} product={product} />
        ) : variant === 3 ? (
          <g transform="translate(-166 -124) scale(1.52)">{main}</g>
        ) : (
          main
        )}
        {variant === 0 && <Caption p={p} left={`${product.type} · v${product.version}`} />}
        <rect width="640" height="480" fill={`url(#${uid}-vig)`} />
      </g>
    </svg>
  )
}
