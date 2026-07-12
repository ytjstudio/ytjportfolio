import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Copy, Trash2, Pencil, Eye, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '@/types'
import { fetchAllProjectsAdmin, deleteProject, duplicateProject } from '@/lib/api'
import { formatDate, classNames } from '@/lib/utils'

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const load = () => { setLoading(true); fetchAllProjectsAdmin().then(setProjects).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(load, [])
  const filtered = projects.filter((p) => { const q = query.toLowerCase(); return !q || p.name.toLowerCase().includes(q) || (p.category ?? '').toLowerCase().includes(q) || p.slug.includes(q) })
  const handleDelete = async (id: string) => { try { await deleteProject(id); setProjects((prev) => prev.filter((p) => p.id !== id)); setConfirmId(null) } catch (err) { alert(err instanceof Error ? err.message : 'Failed') } }
  const handleDuplicate = async (p: Project) => { try { const copy = await duplicateProject(p); setProjects((prev) => [copy, ...prev]) } catch (err) { alert(err instanceof Error ? err.message : 'Failed') } }
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8"><div><h1 className="font-display text-3xl font-bold text-white">Projects</h1><p className="mt-2 text-white">{projects.length} total • manage your portfolio</p></div><Link to="/admin/projects/new" className="btn-primary"><Plus className="h-4 w-4" /> Add Project</Link></div>
      <div className="relative max-w-md mb-6"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects..." className="w-full glass pl-11 pr-4 py-3 rounded-xl outline-none focus:border-brand-purple/50 transition-colors text-white" /></div>
      {loading ? <div className="glass p-12 text-center text-white">Loading projects...</div>
      : filtered.length === 0 ? <div className="glass p-16 text-center"><p className="text-white">No projects found.</p><Link to="/admin/projects/new" className="btn-primary mt-6 inline-flex"><Plus className="h-4 w-4" /> Create your first project</Link></div>
      : (<div className="space-y-3">{filtered.map((p) => (
          <div key={p.id} className="glass p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="h-16 w-24 rounded-lg overflow-hidden bg-white/[0.06] shrink-0">{p.cover_image && <img src={p.cover_image} alt="" className="h-full w-full object-cover" />}</div>
            <div className="min-w-0 flex-1"><div className="flex items-center gap-2 flex-wrap"><h3 className="font-semibold truncate text-white">{p.name}</h3>{p.featured && <Star className="h-3.5 w-3.5 text-brand-glow fill-brand-glow" />}<span className={classNames('text-[10px] px-2 py-0.5 rounded-full', p.status === 'published' ? 'bg-brand-glow/20 text-brand-glow' : 'bg-white/10 text-white')}>{p.status}</span></div><div className="mt-1 text-xs text-white truncate">/{p.slug} • {p.category ?? '—'} • {p.views} views • {formatDate(p.completion_date)}</div></div>
            <div className="flex items-center gap-1 shrink-0">
              <Link to={`/projects/${p.slug}`} target="_blank" className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:bg-white/[0.08] transition-colors" aria-label="View"><Eye className="h-4 w-4" /></Link>
              <button onClick={() => handleDuplicate(p)} className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:bg-white/[0.08] transition-colors" aria-label="Duplicate"><Copy className="h-4 w-4" /></button>
              <Link to={`/admin/projects/${p.id}`} className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:bg-white/[0.08] transition-colors" aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
              <button onClick={() => setConfirmId(p.id)} className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:bg-red-500/10 hover:text-red-400 transition-colors" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
            <AnimatePresence>{confirmId === p.id && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink-900/70 backdrop-blur-sm" onClick={() => setConfirmId(null)}><motion.div initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 10 }} className="glass-strong p-6 rounded-2xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}><h3 className="font-display font-semibold text-lg text-white">Delete project?</h3><p className="mt-2 text-sm text-white">This will permanently remove "{p.name}" and its data. This cannot be undone.</p><div className="mt-6 flex gap-3"><button onClick={() => setConfirmId(null)} className="btn-ghost flex-1">Cancel</button><button onClick={() => handleDelete(p.id)} className="btn-primary flex-1 !bg-gradient-to-br !from-red-500 !to-red-600">Delete</button></div></motion.div></motion.div>)}</AnimatePresence>
          </div>
        ))}</div>)}
    </div>
  )
}
