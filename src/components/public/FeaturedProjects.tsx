import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink, Github, Star } from 'lucide-react'
import type { Project } from '@/types'
import { fetchPublishedProjects } from '@/lib/api'
import { SkeletonGrid } from '@/components/Skeletons'
import { formatDate } from '@/lib/utils'

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { let active = true; fetchPublishedProjects().then((data) => active && setProjects(data)).catch(() => {}).finally(() => active && setLoading(false)); return () => { active = false } }, [])
  const featured = projects.filter((p) => p.featured).slice(0, 2)
  const rest = projects.filter((p) => !p.featured).slice(0, 4)
  const shown = [...featured, ...rest].slice(0, 6)
  return (
    <section id="projects" className="py-28">
      <div className="section">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div><p className="eyebrow">Selected work</p><h2 className="heading-lg mt-3 max-w-2xl">Featured <span className="text-white">Projects</span></h2></div>
          <Link to="/projects" className="btn-outline group">View all <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
        </div>
        {loading ? <div className="mt-14"><SkeletonGrid count={3} /></div>
        : shown.length === 0 ? <div className="mt-14 glass p-12 text-center text-white">No projects yet. Add some from the admin dashboard.</div>
        : (<motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{shown.map((p) => <ProjectCard key={p.id} project={p} />)}</motion.div>)}
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }} className="group glass rounded-2xl overflow-hidden hover:bg-white/[0.06] transition-colors flex flex-col">
      <Link to={`/projects/${project.slug}`} className="block relative aspect-[16/10] overflow-hidden">
        {project.cover_image ? <img src={project.cover_image} alt={project.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="h-full w-full bg-gradient-to-br from-brand-purple/30 to-brand-blue/30" />}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent opacity-80" />
        {project.featured && <span className="absolute top-4 left-4 inline-flex items-center gap-1 glass px-3 py-1 rounded-full text-xs text-white"><Star className="h-3 w-3 text-brand-glow" /> Featured</span>}
        {project.category && <span className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs text-white">{project.category}</span>}
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-xl font-semibold text-white">{project.name}</h3>
        {project.short_description && <p className="mt-2 text-sm text-white leading-relaxed line-clamp-2">{project.short_description}</p>}
        <div className="mt-4 flex flex-wrap gap-2">{project.technologies.slice(0, 3).map((t) => <span key={t} className="text-xs px-2.5 py-1 rounded-full glass text-white">{t}</span>)}{project.technologies.length > 3 && <span className="text-xs px-2.5 py-1 rounded-full glass text-white">+{project.technologies.length - 3}</span>}</div>
        <div className="mt-4 flex items-center justify-between text-xs text-white"><span>{project.client_name ?? '—'}</span><span>{formatDate(project.completion_date)}</span></div>
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
          <Link to={`/projects/${project.slug}`} className="btn-primary !py-2 !px-4 text-sm">View Details</Link>
          {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" className="btn-ghost !py-2 !px-4 text-sm"><ExternalLink className="h-4 w-4" /> Live</a>}
          {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-outline !py-2 !px-4 text-sm" aria-label="GitHub repository"><Github className="h-4 w-4" /></a>}
        </div>
      </div>
    </motion.article>
  )
}
