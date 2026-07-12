import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ExternalLink, Github, Calendar, User, CircleCheck as CheckCircle2 } from 'lucide-react'
import type { Project } from '@/types'
import { fetchPublishedProjects, fetchProjectBySlug, incrementProjectViews } from '@/lib/api'
import { SkeletonLine } from '@/components/Skeletons'
import { formatDate } from '@/lib/utils'

export default function ProjectDetailsPage() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [all, setAll] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  useEffect(() => {
    if (!slug) return
    let active = true
    setLoading(true); setNotFound(false); setProject(null); setActiveImage(0)
    Promise.all([fetchProjectBySlug(slug), fetchPublishedProjects()])
      .then(([p, list]) => { if (!active) return; if (!p) { setNotFound(true); return }; setProject(p); setAll(list); incrementProjectViews(slug).catch(() => {}) })
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [slug])
  const gallery = project?.gallery_images?.length ? [project.cover_image, ...project.gallery_images].filter(Boolean) as string[] : project?.cover_image ? [project.cover_image] : []
  const currentIndex = all.findIndex((p) => p.slug === slug)
  const prev = currentIndex > 0 ? all[currentIndex - 1] : null
  const next = currentIndex >= 0 && currentIndex < all.length - 1 ? all[currentIndex + 1] : null
  if (loading) return <div className="pt-32 pb-20 section"><SkeletonLine className="h-6 w-32" /><SkeletonLine className="mt-6 h-12 w-2/3" /><SkeletonLine className="mt-8 h-[400px] w-full" /><div className="mt-8 grid md:grid-cols-3 gap-6"><SkeletonLine className="h-40" /><SkeletonLine className="h-40" /><SkeletonLine className="h-40" /></div></div>
  if (notFound || !project) return <div className="pt-40 pb-20 section text-center"><h1 className="heading-lg">Project not found</h1><p className="mt-4 text-white">The project you're looking for doesn't exist or was removed.</p><Link to="/projects" className="btn-primary mt-8 inline-flex">Back to all projects</Link></div>
  return (
    <div className="pt-28 pb-20">
      <div className="section">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-white hover:text-white transition-colors"><ArrowLeft className="h-4 w-4" /> Back to projects</Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-8">
          <div className="flex flex-wrap items-center gap-3">{project.category && <span className="glass px-3 py-1 rounded-full text-xs text-white">{project.category}</span>}{project.featured && <span className="glass px-3 py-1 rounded-full text-xs text-brand-glow">Featured</span>}</div>
          <h1 className="heading-lg mt-4 max-w-3xl">{project.name}</h1>
          {project.short_description && <p className="mt-4 text-lg text-white max-w-2xl">{project.short_description}</p>}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mt-10">
          <div className="relative rounded-3xl overflow-hidden glass">{gallery[activeImage] ? <img src={gallery[activeImage]} alt={project.name} className="w-full aspect-[16/9] object-cover" /> : <div className="w-full aspect-[16/9] bg-gradient-to-br from-brand-purple/30 to-brand-blue/30" />}</div>
          {gallery.length > 1 && (<div className="mt-4 grid grid-cols-4 md:grid-cols-6 gap-3">{gallery.map((img, i) => <button key={i} onClick={() => setActiveImage(i)} className={`relative rounded-xl overflow-hidden aspect-square transition-all ${i === activeImage ? 'ring-2 ring-brand-purple' : 'opacity-60 hover:opacity-100'}`}><img src={img} alt={`${project.name} ${i + 1}`} className="h-full w-full object-cover" loading="lazy" /></button>)}</div>)}
        </motion.div>
        <div className="mt-8 flex flex-wrap gap-3">{project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" className="btn-primary"><ExternalLink className="h-4 w-4" /> Visit Website</a>}{project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-ghost"><Github className="h-4 w-4" /> View Code</a>}</div>
        <div className="mt-16 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            {project.full_description && <section><h2 className="heading-md">Overview</h2><p className="mt-4 text-white leading-relaxed whitespace-pre-line">{project.full_description}</p></section>}
            {project.challenge && <section><h2 className="heading-md">The Challenge</h2><p className="mt-4 text-white leading-relaxed whitespace-pre-line">{project.challenge}</p></section>}
            {project.solution && <section><h2 className="heading-md">The Solution</h2><p className="mt-4 text-white leading-relaxed whitespace-pre-line">{project.solution}</p></section>}
            {project.features.length > 0 && <section><h2 className="heading-md">Features</h2><ul className="mt-4 grid sm:grid-cols-2 gap-3">{project.features.map((f) => <li key={f} className="flex items-start gap-3 glass p-4 rounded-xl"><CheckCircle2 className="h-5 w-5 text-brand-glow mt-0.5 shrink-0" /><span className="text-white text-sm">{f}</span></li>)}</ul></section>}
          </div>
          <aside className="space-y-6">
            <div className="glass p-6 rounded-2xl"><h3 className="font-display font-semibold mb-4 text-white">Project details</h3><dl className="space-y-4 text-sm"><div className="flex items-center gap-3"><User className="h-4 w-4 text-brand-purple" /><div><dt className="text-white text-xs">Client</dt><dd className="text-white">{project.client_name ?? '—'}</dd></div></div><div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-brand-blue" /><div><dt className="text-white text-xs">Completed</dt><dd className="text-white">{formatDate(project.completion_date)}</dd></div></div></dl></div>
            {project.technologies.length > 0 && <div className="glass p-6 rounded-2xl"><h3 className="font-display font-semibold mb-4 text-white">Technologies</h3><div className="flex flex-wrap gap-2">{project.technologies.map((t) => <span key={t} className="text-xs px-3 py-1.5 rounded-full glass text-white">{t}</span>)}</div></div>}
          </aside>
        </div>
        <nav className="mt-20 grid sm:grid-cols-2 gap-4">
          {prev ? <Link to={`/projects/${prev.slug}`} className="glass p-6 rounded-2xl group hover:bg-white/[0.06] transition-colors"><span className="inline-flex items-center gap-2 text-xs text-white"><ArrowLeft className="h-4 w-4" /> Previous</span><div className="mt-2 font-display font-semibold text-white group-hover:text-white transition-all">{prev.name}</div></Link> : <div />}
          {next && <Link to={`/projects/${next.slug}`} className="glass p-6 rounded-2xl group hover:bg-white/[0.06] transition-colors text-right"><span className="inline-flex items-center gap-2 text-xs text-white">Next <ArrowRight className="h-4 w-4" /></span><div className="mt-2 font-display font-semibold text-white group-hover:text-white transition-all">{next.name}</div></Link>}
        </nav>
      </div>
    </div>
  )
}
