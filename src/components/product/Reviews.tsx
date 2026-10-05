import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck, ThumbsUp, PenLine } from 'lucide-react'
import type { Product, Review } from '@/types'
import { REVIEWS } from '@/data/reviews'
import { ratingDistribution } from '@/utils/catalog'
import { formatDate, cx, s as plural } from '@/utils/format'
import { Stars } from '@/components/ui/Rating'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Field'
import { useStore } from '@/context/StoreContext'

/* ------------------------------------------------------------------ */
/*  Reviews — summary distribution, list, helpful votes, and a        */
/*  write-a-review modal. Customer-written reviews persist locally.   */
/* ------------------------------------------------------------------ */

const MY_REVIEWS_KEY = 'axryzure:v1:myReviews'

const loadMyReviews = (): Record<string, Review[]> => {
  try {
    return JSON.parse(localStorage.getItem(MY_REVIEWS_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function Reviews({ product }: { product: Product }) {
  const { profile, pushToast } = useStore()
  const [myReviews, setMyReviews] = useState<Record<string, Review[]>>(loadMyReviews)
  const [helpfulToggled, setHelpfulToggled] = useState<Set<string>>(new Set())
  const [writing, setWriting] = useState(false)

  const reviews = useMemo(() => {
    const seeded = REVIEWS[product.slug] ?? []
    return [...(myReviews[product.slug] ?? []), ...seeded]
  }, [myReviews, product.slug])

  const distribution = useMemo(
    () => ratingDistribution(product.rating, product.reviewCount),
    [product.rating, product.reviewCount],
  )

  const toggleHelpful = (id: string) => {
    setHelpfulToggled((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const submitReview = (review: Review) => {
    setMyReviews((prev) => {
      const next = {
        ...prev,
        [product.slug]: [review, ...(prev[product.slug] ?? [])],
      }
      try {
        localStorage.setItem(MY_REVIEWS_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
    pushToast({ title: 'Review published', description: 'Thanks for the feedback', variant: 'success' })
  }

  return (
    <section aria-labelledby="reviews-heading" className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Community</p>
          <h2 id="reviews-heading" className="mt-3 font-display text-display-sm font-medium text-white/95">
            Reviews
          </h2>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setWriting(true)}>
          <PenLine size={13} aria-hidden /> Write a review
        </Button>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-14">
        {/* summary */}
        <div className="h-fit rounded-2xl border border-white/[0.07] bg-ink-900/60 p-6 lg:sticky lg:top-24">
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl font-medium text-white">{product.rating.toFixed(1)}</span>
            <div className="pb-1.5">
              <Stars rating={product.rating} size={15} />
              <p className="mt-1 font-mono text-[11px] text-white/55">
                {product.reviewCount} review{plural(product.reviewCount)}
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-2.5">
            {distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-3">
                <span className="w-7 font-mono text-[11px] text-white/50">{d.stars}★</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    className="h-full rounded-full bg-gold-400/80"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${d.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-[11px] text-white/50">{d.pct}%</span>
              </div>
            ))}
          </div>
          <p className="mt-6 border-t border-white/[0.07] pt-5 text-[12px] leading-relaxed text-white/55">
            Reviews are from verified customers. Ratings inform our seasonal curation — products below 4.3
            get rebuilt or retired.
          </p>
        </div>

        {/* list */}
        <div className="space-y-4">
          {reviews.map((review) => {
            const toggled = helpfulToggled.has(review.id)
            return (
              <article
                key={review.id}
                className="rounded-2xl border border-white/[0.07] bg-ink-900/40 p-6 transition-colors hover:border-white/[0.12]"
              >
                <div className="flex items-start gap-4">
                  <Avatar name={review.author} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-[15px] font-medium text-white/90">{review.author}</span>
                      {review.verified && (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-300/90">
                          <BadgeCheck size={12} aria-hidden /> Verified purchase
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-white/50">
                      {review.role} · {formatDate(review.date)}
                    </p>
                  </div>
                  <Stars rating={review.rating} size={13} />
                </div>
                <h3 className="mt-4 text-[15px] font-medium text-white/90">{review.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{review.body}</p>
                <div className="mt-4">
                  <button
                    onClick={() => toggleHelpful(review.id)}
                    aria-pressed={toggled}
                    className={cx(
                      'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400',
                      toggled
                        ? 'border-accent-500/50 bg-accent-500/10 text-accent-300'
                        : 'border-white/[0.1] text-white/50 hover:border-white/[0.2] hover:text-white/80',
                    )}
                  >
                    <ThumbsUp size={12} aria-hidden /> Helpful ({review.helpful + (toggled ? 1 : 0)})
                  </button>
                </div>
              </article>
            )
          })}
          <p className="pt-2 text-center font-mono text-[11px] text-white/50">
            Showing {reviews.length} of {product.reviewCount} reviews — the full history ships with each
            product page.
          </p>
        </div>
      </div>

      <WriteReviewModal
        open={writing}
        onClose={() => setWriting(false)}
        product={product}
        defaultName={profile.name}
        onSubmit={submitReview}
      />
    </section>
  )
}

/* --- write a review modal ------------------------------------------- */

function WriteReviewModal({
  open,
  onClose,
  product,
  defaultName,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  product: Product
  defaultName: string
  onSubmit: (review: Review) => void
}) {
  const [rating, setRating] = useState(5)
  const [hovered, setHovered] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [name, setName] = useState(defaultName)
  const [errors, setErrors] = useState<{ title?: string; body?: string; name?: string }>({})

  useEffect(() => {
    if (open) {
      setRating(5)
      setTitle('')
      setBody('')
      setName(defaultName)
      setErrors({})
    }
  }, [open, defaultName])

  const submit = () => {
    const errs: typeof errors = {}
    if (title.trim().length < 4) errs.title = 'Give your review a short title'
    if (body.trim().length < 20) errs.body = 'Tell us a little more — at least 20 characters'
    if (name.trim().length < 2) errs.name = 'Add your name'
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSubmit({
      id: `my-${product.slug}-${Date.now()}`,
      author: name.trim(),
      role: 'Customer',
      rating,
      date: new Date().toISOString().slice(0, 10),
      title: title.trim(),
      body: body.trim(),
      verified: true,
      helpful: 0,
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={`Review ${product.name}`} size="md">
      <div className="space-y-5 p-6">
        <fieldset>
          <legend className="mb-2 text-[13px] font-medium text-white/80">Your rating</legend>
          <div className="flex gap-1.5" role="radiogroup" aria-label="Rating out of 5 stars" onMouseLeave={() => setHovered(0)}>
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = (hovered || rating) >= star
              return (
                <button
                  key={star}
                  type="button"
                  role="radio"
                  aria-checked={rating === star}
                  aria-label={`${star} star${plural(star)}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                >
                  <svg
                    width={26}
                    height={26}
                    viewBox="0 0 24 24"
                    className={filled ? 'fill-gold-400' : 'fill-white/15'}
                    aria-hidden
                  >
                    <path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9 2.9-6z" />
                  </svg>
                </button>
              )
            })}
          </div>
        </fieldset>
        <Input
          label="Title"
          placeholder="Sum up your experience"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
        />
        <Textarea
          label="Your review"
          placeholder="What did you build with it? What stood out? Be specific — future buyers read these."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          error={errors.body}
        />
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <div className="flex justify-end gap-3 border-t border-white/[0.07] pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit}>Publish review</Button>
        </div>
      </div>
    </Modal>
  )
}
