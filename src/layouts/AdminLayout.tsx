import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, MessageSquareQuote, Mail, Settings, LogOut, ArrowUpLeft, Moon, Sun, Menu, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { classNames } from '@/lib/utils'
import AnimatedBackground from '@/components/AnimatedBackground'
import { useState } from 'react'

const nav = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', Icon: FolderKanban },
  { to: '/admin/testimonials', label: 'Testimonials', Icon: MessageSquareQuote },
  { to: '/admin/messages', label: 'Messages', Icon: Mail },
  { to: '/admin/settings', label: 'Settings', Icon: Settings },
]

export default function AdminLayout() {
  const { signOut, session } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const handleSignOut = async () => { await signOut(); navigate('/admin/login') }
  const SidebarContent = (
    <>
      <Link to="/admin" className="flex items-center gap-2 mb-8"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient font-display font-bold text-white shadow-glow">Y</span><div><div className="font-display font-semibold leading-tight text-white">YTJ Studio</div><div className="text-[10px] text-white uppercase tracking-wider">Admin</div></div></Link>
      <nav className="space-y-1 flex-1">{nav.map(({ to, label, Icon, end }) => (<NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={({ isActive }) => classNames('flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all', isActive ? 'bg-brand-gradient text-white shadow-glow' : 'text-white hover:text-white hover:bg-white/[0.05]')}><Icon className="h-4 w-4" />{label}</NavLink>))}</nav>
      <div className="pt-6 mt-6 border-t border-white/[0.06] space-y-2"><Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white hover:text-white hover:bg-white/[0.05] transition-all"><ArrowUpLeft className="h-4 w-4" /> View site</Link><button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white hover:text-red-400 hover:bg-red-500/10 transition-all"><LogOut className="h-4 w-4" /> Sign out</button></div>
    </>
  )
  return (
    <div className="min-h-screen flex">
      <AnimatedBackground />
      <aside className="hidden lg:flex w-64 shrink-0 flex-col p-5 glass-strong border-r border-white/[0.06] sticky top-0 h-screen">{SidebarContent}</aside>
      {open && (<div className="lg:hidden fixed inset-0 z-50 flex"><div className="absolute inset-0 bg-ink-900/70 backdrop-blur-sm" onClick={() => setOpen(false)} /><aside className="relative w-64 h-full p-5 glass-strong flex flex-col"><button onClick={() => setOpen(false)} className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center text-white"><X className="h-5 w-5" /></button>{SidebarContent}</aside></div>)}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 glass border-b border-white/[0.06] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3"><button onClick={() => setOpen(true)} className="lg:hidden h-9 w-9 rounded-lg glass flex items-center justify-center"><Menu className="h-5 w-5" /></button><div className="text-sm text-white hidden sm:block">Signed in as <span className="text-white">{session?.user?.email}</span></div></div>
          <button onClick={toggle} className="h-9 w-9 rounded-lg glass flex items-center justify-center" aria-label="Toggle theme">{theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
        </header>
        <main className="flex-1 p-5 md:p-8"><Outlet /></main>
      </div>
    </div>
  )
}
