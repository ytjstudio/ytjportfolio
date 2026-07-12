import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Star, X, Loader as Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Testimonial, TestimonialInput } from '@/types'
import { fetchPublishedTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/api'
import { ImageUpload } from '@/components/admin/ImageUpload'

const empty: TestimonialInput = { client_name: '', company: '', rating: 5, review: '', photo: null }

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<TestimonialInput>(empty)
  const [busy, setBusy] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const load = () => { setLoading(true); fetchPublishedTestimonials().then(setItems).finally(() => setLoading(false)) }
  useEffect(load, [])
  const openNew = () => { setEditing(null); setForm(empty); setShowForm(true) }
  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ client_name: t.client_name, company: t.company ?? '', rating: t.rating, review: t.review ?? '', photo: t.photo }); setShowForm(true) }
  const save = async () => { if (!form.client_name.trim()) return; setBusy(true); try { if (editing) { const updated = await updateTestimonial(editing.id, form); setItems((prev) => prev.map((t) => (t.id === updated.id ? updated : t))) } else { const created = await createTestimonial(form); setItems((prev) => [created, ...prev]) }; setShowForm(false) } catch (err) { alert(err instanceof Error ? err.message : 'Save failed') } finally { setBusy(false) } }
  const remove = async (id: string) => { try { await deleteTestimonial(id); setItems((prev) => prev.filter((t) => t.id !== id)); setConfirmId(null) } catch (err) { alert(err instanceof Error ? err.message : 'Delete failed') } }
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8"><div><h1 className="font-display text-3xl font-bold text-white">Testimonials</h1><p className="mt-2 text-white">{items.length} reviews</p></div><button onClick={openNew} className="btn-primary"><Plus className="h-4 w-4" /> Add Testimonial</button></div>
      {loading ? <div className="glass p-12 text-center text-white">Loading...</div>
      : items.length === 0 ? <div className="glass p-16 text-center"><p className="text-white">No testimonials yet.</p><button onClick={openNew} className="btn-primary mt-6 inline-flex"><Plus className="h-4 w-4" /> Add the first one</button></div>
      : (<div className="grid gap-4 md:grid-cols-2">{items.map((t) => (
          <div key={t.id} className="glass p-5 rounded-2xl">
            <div className="flex items-start gap-4">
              {t.photo ? <img src={t.photo} alt={t.client_name} className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-brand-gradient flex items-center justify-center font-semibold text-white">{t.client_name.charAt(0)}</div>}
              <div className="min-w-0 flex-1"><div className="font-semibold truncate text-white">{t.client_name}</div><div className="text-xs text-white">{t.company}</div><div className="flex gap-0.5 mt-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={i < t.rating ? 'h-3 w-3 fill-brand-glow text-brand-glow' : 'h-3 w-3 text-white/20'} />)}</div></div>
              <div className="flex gap-1"><button onClick={() => openEdit(t)} className="h-8 w-8 rounded-lg glass flex items-center justify-center hover:bg-white/[0.08] transition-colors" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => setConfirmId(t.id)} className="h-8 w-8 rounded-lg glass flex items-center justify-center hover:bg-red-500/10 hover:text-red-400 transition-colors" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button></div>
            </div>
            {t.review && <p className="mt-4 text-sm text-white leading-relaxed line-clamp-3">"{t.review}"</p>}
          </div>
        ))}</div>)}
      <AnimatePresence>{showForm && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink-900/70 backdrop-blur-sm" onClick={() => setShowForm(false)}><motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="glass-strong p-6 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between mb-5"><h2 className="font-display font-semibold text-lg text-white">{editing ? 'Edit' : 'New'} Testimonial</h2><button onClick={() => setShowForm(false)} className="h-8 w-8 rounded-lg glass flex items-center justify-center text-white"><X className="h-4 w-4" /></button></div><div className="space-y-4"><label className="block"><span className="block text-sm text-white mb-2">Client Name</span><input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className="form-input" /></label><label className="block"><span className="block text-sm text-white mb-2">Company</span><input value={form.company ?? ''} onChange={(e) => setForm({ ...form, company: e.target.value || null })} className="form-input" /></label><label className="block"><span className="block text-sm text-white mb-2">Rating</span><div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} className="p-1"><Star className={n <= form.rating ? 'h-6 w-6 fill-brand-glow text-brand-glow' : 'h-6 w-6 text-white/20'} /></button>)}</div></label><label className="block"><span className="block text-sm text-white mb-2">Review</span><textarea value={form.review ?? ''} onChange={(e) => setForm({ ...form, review: e.target.value || null })} rows={4} className="form-input resize-y" /></label><ImageUpload value={form.photo} onChange={(url) => setForm({ ...form, photo: url })} label="Client Photo" folder="testimonials" aspect="aspect-square" /></div><div className="mt-6 flex gap-3"><button onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button><button onClick={save} disabled={busy} className="btn-primary flex-1">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} {editing ? 'Save' : 'Create'}</button></div></motion.div></motion.div>)}</AnimatePresence>
      <AnimatePresence>{confirmId && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink-900/70 backdrop-blur-sm" onClick={() => setConfirmId(null)}><motion.div initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 10 }} className="glass-strong p-6 rounded-2xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}><h3 className="font-display font-semibold text-lg text-white">Delete testimonial?</h3><p className="mt-2 text-sm text-white">This cannot be undone.</p><div className="mt-6 flex gap-3"><button onClick={() => setConfirmId(null)} className="btn-ghost flex-1">Cancel</button><button onClick={() => remove(confirmId)} className="btn-primary flex-1 !bg-gradient-to-br !from-red-500 !to-red-600">Delete</button></div></motion.div></motion.div>)}</AnimatePresence>
    </div>
  )
}
