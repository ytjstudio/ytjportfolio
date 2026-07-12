import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ExternalLink, Github, Star } from 'lucide-react'
import type { Project } from '@/types'
import { fetchPublishedProjects } from '@/lib/api'
import { SkeletonGrid } from '@/components/Skeletons'
import { formatDate } from '@/lib/utils'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  useEffect(() => { let active = true; fetchPublishedProjects().then((data) => active && setProjects(data)).catch(() => {}).finally(() => active && setLoading(false)); return () => { active = false } }, [])
  const categories = useMemo(() => { const set = new Set<string>(); projects.forEach((p) => p.category && set.add(p.category)); return ['All', ...Array.from(set)] }, [projects])
  const filtered = useMemo(() => projects.filter((p) => { const matchesCat = category === 'All' || p.category === category; const q = query.toLowerCase(); const matchesQuery = !q || p.name.toLowerCase().includes(q) || (p.short_description ?? '').toLowerCase().includes(q) || p.technologies.some((t) => t.toLowerCase().includes(q)); return matchesCat && matchesQuery }), [projects, query, category])
  return (
    <div className="pt-32 pb-20">
      <div className="section">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="eyebrow">Portfolio</p>
          <h1 className="heading-xl mt-3">All <span className="text-white">Projects</span></h1>
          <p className="mt-5 text-white max-w-xl">A selection of websites and web applications we've designed and built.</p>
        </motion.div>
        <div className="mt-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md"><Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects, tech..." className="w-full glass pl-11 pr-4 py-3 rounded-xl text-sm outline-none focus:border-brand-purple/50 transition-colors" /></div>
          <div className="flex flex-wrap gap-2 no-scrollbar overflow-x-auto">{categories.map((c) => <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap ${category === c ? 'bg-brand-gradient shadow-glow text-white' : 'glass text-white hover:text-white'}`}>{c}</button>)}</div>
        </div>
        {loading ? <div className="mt-10"><SkeletonGrid count={6} /></div>
        : filtered.length === 0 ? <div className="mt-10 glass p-16 text-center text-white">No projects match your search.</div>
        : (<motion.div layout initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }} className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <motion.article key={p.id} layout variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="group glass rounded-2xl overflow-hidden hover:bg-white/[0.06] transition-colors flex flex-col">
                <Link to={`/projects/${p.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                  {p.cover_image ? <img src={p.cover_image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="h-full w-full bg-gradient-to-br from-brand-purple/30 to-brand-blue/30" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent opacity-80" />
                  {p.featured && <span className="absolute top-4 left-4 inline-flex items-center gap-1 glass px-3 py-1 rounded-full text-xs text-white"><Star className="h-3 w-3 text-brand-glow" /> Featured</span>}
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between"><h3 className="font-display text-xl font-semibold text-white">{p.name}</h3>{p.category && <span className="text-xs px-2.5 py-1 rounded-full glass text-white">{p.category}</span>}</div>
                  {p.short_description && <p className="mt-2 text-sm text-white leading-relaxed line-clamp-2">{p.short_description}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">{p.technologies.slice(0, 4).map((t) => <span key={t} className="text-xs px-2.5 py-1 rounded-full glass text-white">{t}</span>)}</div>
                  <div className="mt-4 flex items-center justify-between text-xs text-white"><span>{p.client_name ?? '—'}</span><span>{formatDate(p.completion_date)}</span></div>
                  <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
                    <Link to={`/projects/${p.slug}`} className="btn-primary !py-2 !px-4 text-sm">View Details</Link>
                    {p.live_url && <a href={p.live_url} target="_blank" rel="noreferrer" className="btn-ghost !py-2 !px-4 text-sm"><ExternalLink className="h-4 w-4" /> Live</a>}
                    {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="btn-outline !py-2 !px-4 text-sm" aria-label="GitHub"><Github className="h-4 w-4" /></a>}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>)}
      </div>
    </div>
  )
}
