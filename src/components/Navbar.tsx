import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { classNames } from '@/lib/utils'

const links = [
  { label: 'Home', to: '/' }, { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/#about' }, { label: 'Services', to: '/#services' }, { label: 'Contact', to: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const location = useLocation()
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 24); onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll) }, [])
  useEffect(() => { setOpen(false) }, [location.pathname])
  return (
    <header className={classNames('fixed top-0 inset-x-0 z-50 transition-all duration-300', scrolled ? 'py-3' : 'py-5')}>
      <div className="section flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" aria-label="YTJ Studio home">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient font-display font-bold text-white shadow-glow">Y</span>
          <span className="font-display font-semibold text-lg tracking-tight">YTJ<span className="text-white"> Studio</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 glass px-2 py-2 rounded-full">
          {links.map((l) => (<Link key={l.label} to={l.to} className="px-4 py-1.5 rounded-full text-sm text-white hover:bg-white/[0.06] transition-colors">{l.label}</Link>))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="h-10 w-10 rounded-full glass flex items-center justify-center hover:bg-white/[0.08] transition-colors" aria-label="Toggle theme">{theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
          <Link to="/admin" className="hidden sm:inline-flex btn-primary !px-5 !py-2.5 text-sm">Admin</Link>
          <button onClick={() => setOpen((v) => !v)} className="md:hidden h-10 w-10 rounded-full glass flex items-center justify-center" aria-label="Menu">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>
      <AnimatePresence>
        {open && (<motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="md:hidden section mt-3"><div className="glass-strong p-4 rounded-2xl flex flex-col gap-1">{links.map((l) => (<Link key={l.label} to={l.to} className="px-4 py-3 rounded-xl text-white hover:bg-white/[0.06] transition-colors">{l.label}</Link>))}<Link to="/admin" className="btn-primary mt-2 w-full">Admin Dashboard</Link></div></motion.nav>)}
      </AnimatePresence>
    </header>
  )
}
