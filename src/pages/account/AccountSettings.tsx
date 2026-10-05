import { useState } from 'react'
import { useStore } from '@/context/StoreContext'
import { Input, Checkbox } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Trash2, AlertTriangle } from 'lucide-react'

/* /account/settings — profile, preferences, danger zone. */

export default function AccountSettings() {
  const { profile, updateProfile, pushToast, clearAllData } = useStore()
  const [form, setForm] = useState(profile)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.name.trim().length < 2) {
      pushToast({ title: 'Name looks too short', variant: 'error' })
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      pushToast({ title: 'That email looks off', variant: 'error' })
      return
    }
    updateProfile(form)
    pushToast({ title: 'Settings saved', description: 'Your profile is up to date', variant: 'success' })
  }

  return (
    <div className="max-w-2xl space-y-10">
      <section aria-label="Profile">
        <h2 className="font-display text-xl text-white/95">Profile</h2>
        <form onSubmit={save} className="mt-5 space-y-5 rounded-2xl border border-white/[0.07] bg-ink-900/40 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              hint="Receipts and license keys are delivered here."
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </section>

      <section aria-label="Preferences">
        <h2 className="font-display text-xl text-white/95">Preferences</h2>
        <div className="mt-5 space-y-4 rounded-2xl border border-white/[0.07] bg-ink-900/40 p-6">
          <Checkbox
            checked={form.newsletter}
            onChange={() => setForm({ ...form, newsletter: !form.newsletter })}
            label={
              <span>
                <span className="block text-[14px] font-medium text-white/85">The Dispatch — monthly newsletter</span>
                <span className="mt-0.5 block text-[12.5px] text-white/55">
                  New releases, design notes and subscriber-only discounts.
                </span>
              </span>
            }
          />
          <Checkbox
            checked={form.productUpdates}
            onChange={() => setForm({ ...form, productUpdates: !form.productUpdates })}
            label={
              <span>
                <span className="block text-[14px] font-medium text-white/85">Product update emails</span>
                <span className="mt-0.5 block text-[12.5px] text-white/55">
                  Get an email when a product you own ships a new version.
                </span>
              </span>
            }
          />
          <div className="flex justify-end border-t border-white/[0.06] pt-4">
            <Button variant="secondary" onClick={() => { updateProfile(form); pushToast({ title: 'Preferences saved', variant: 'success' }) }}>
              Save preferences
            </Button>
          </div>
        </div>
      </section>

      <section aria-label="Danger zone">
        <h2 className="font-display text-xl text-white/95">Data</h2>
        <div className="mt-5 rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-6">
          <h3 className="text-[14px] font-medium text-rose-200/90">Reset demo data</h3>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-white/50">
            This demo stores your cart, wishlist, orders and profile in your browser’s localStorage. Reset
            to restore the original seeded state — orders included.
          </p>
          <Button variant="secondary" className="mt-4" onClick={() => setConfirmOpen(true)}>
            <Trash2 size={14} aria-hidden /> Clear all local data
          </Button>
        </div>
      </section>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Clear all local data?" size="sm">
        <div className="p-6">
          <div className="flex items-start gap-3.5 rounded-xl border border-rose-500/25 bg-rose-500/[0.06] p-4">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-300" aria-hidden />
            <p className="text-[13.5px] leading-relaxed text-white/70">
              Your cart, wishlist, saved items and order history will be reset to the seeded demo state.
              This can’t be undone.
            </p>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Keep my data
            </Button>
            <Button
              variant="primary"
              className="bg-rose-500 hover:bg-rose-400 shadow-none"
              onClick={() => {
                clearAllData()
                setConfirmOpen(false)
                pushToast({ title: 'Local data cleared', description: 'Everything is back to the seeded demo state', variant: 'info' })
              }}
            >
              Yes, clear everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
