import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react'
import { useStore } from '@/context/StoreContext'

/* Toast viewport — rendered once in the app shell. aria-live polite. */

const ICONS = {
  success: CheckCircle2,
  info: Info,
  error: AlertCircle,
}

const TONES = {
  success: 'text-accent-400',
  info: 'text-white/70',
  error: 'text-rose-400',
}

export function Toasts() {
  const { toasts, dismissToast } = useStore()
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-4 bottom-20 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-20 sm:items-end"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.variant]
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-white/[0.09] bg-ink-800/95 px-4 py-3 shadow-pop backdrop-blur-md"
            >
              <Icon size={17} className={`mt-0.5 shrink-0 ${TONES[toast.variant]}`} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white/95">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 truncate text-[13px] text-white/55">{toast.description}</p>
                )}
                {toast.action && (
                  <button
                    onClick={() => {
                      toast.action?.onClick()
                      dismissToast(toast.id)
                    }}
                    className="mt-1.5 text-[13px] font-medium text-accent-300 underline-offset-4 transition-colors hover:text-accent-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 rounded"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded-md p-1 text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                <X size={13} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
