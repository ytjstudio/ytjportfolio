import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FolderKanban, MessageSquareQuote, Mail, Eye, ArrowRight, TrendingUp, Inbox } from 'lucide-react'
import { fetchDashboardStats, fetchAllMessagesAdmin, fetchAllProjectsAdmin } from '@/lib/api'
import type { Message, Project } from '@/types'
import { formatDate } from '@/lib/utils'
import AnimatedCounter from '@/components/AnimatedCounter'

export default function AdminDashboard() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof fetchDashboardStats>> | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { let active = true; Promise.all([fetchDashboardStats(), fetchAllMessagesAdmin(), fetchAllProjectsAdmin()]).then(([s, m, p]) => { if (!active) return; setStats(s); setMessages(m.slice(0, 5)); setProjects(p.slice(0, 5)) }).catch(() => {}).finally(() => active && setLoading(false)); return () => { active = false } }, [])
  const cards = [
    { label: 'Total Projects', value: stats?.totalProjects ?? 0, Icon: FolderKanban, href: '/admin/projects', color: 'from-brand-purple to-brand-glow' },
    { label: 'Testimonials', value: stats?.totalTestimonials ?? 0, Icon: MessageSquareQuote, href: '/admin/testimonials', color: 'from-brand-blue to-brand-purple' },
    { label: 'Messages', value: stats?.totalMessages ?? 0, Icon: Mail, href: '/admin/messages', color: 'from-brand-glow to-brand-blue', badge: stats?.unreadMessages },
    { label: 'Total Views', value: stats?.totalViews ?? 0, Icon: Eye, href: '/admin/projects', color: 'from-brand-purple to-brand-blue' },
  ]
  return (
    <div>
      <div className="mb-8"><h1 className="font-display text-3xl font-bold text-white">Dashboard</h1><p className="mt-2 text-white">An overview of your portfolio activity.</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, Icon, href, color, badge }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={href} className="block glass p-6 rounded-2xl group hover:bg-white/[0.06] transition-colors h-full">
              <div className="flex items-center justify-between"><div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-glow`}><Icon className="h-5 w-5 text-white" /></div>{badge ? <span className="text-xs px-2 py-1 rounded-full bg-brand-glow/20 text-brand-glow">{badge} new</span> : null}</div>
              <div className="mt-5 font-display text-3xl font-bold text-white">{loading ? '—' : <AnimatedCounter to={value} />}</div>
              <div className="mt-1 text-sm text-white flex items-center justify-between">{label}<ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-5"><h2 className="font-display font-semibold text-white flex items-center gap-2"><Inbox className="h-4 w-4 text-brand-purple" /> Recent messages</h2><Link to="/admin/messages" className="text-sm text-white hover:text-white transition-colors">View all</Link></div>
          {messages.length === 0 ? <p className="text-sm text-white py-8 text-center">No messages yet.</p> : (<ul className="space-y-3">{messages.map((m) => (<li key={m.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors"><div className="h-9 w-9 rounded-full bg-brand-gradient flex items-center justify-center text-sm font-semibold shrink-0 text-white">{m.name.charAt(0).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="font-medium text-sm truncate text-white">{m.name}</span>{!m.is_read && <span className="h-2 w-2 rounded-full bg-brand-glow shrink-0" />}</div><p className="text-xs text-white truncate">{m.message}</p><span className="text-[10px] text-white">{formatDate(m.created_at)}</span></div></li>))}</ul>)}
        </div>
        <div className="glass p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-5"><h2 className="font-display font-semibold text-white flex items-center gap-2"><TrendingUp className="h-4 w-4 text-brand-blue" /> Recent projects</h2><Link to="/admin/projects" className="text-sm text-white hover:text-white transition-colors">View all</Link></div>
          {projects.length === 0 ? <p className="text-sm text-white py-8 text-center">No projects yet.</p> : (<ul className="space-y-3">{projects.map((p) => (<li key={p.id}><Link to={`/admin/projects/${p.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors"><div className="h-10 w-14 rounded-lg overflow-hidden bg-white/[0.06] shrink-0">{p.cover_image && <img src={p.cover_image} alt="" className="h-full w-full object-cover" />}</div><div className="min-w-0 flex-1"><div className="font-medium text-sm truncate text-white">{p.name}</div><div className="text-xs text-white">{p.category ?? '—'} • {p.views} views</div></div><span className={`text-[10px] px-2 py-0.5 rounded-full ${p.status === 'published' ? 'bg-brand-glow/20 text-brand-glow' : 'bg-white/10 text-white'}`}>{p.status}</span></Link></li>))}</ul>)}
        </div>
      </div>
    </div>
  )
}
