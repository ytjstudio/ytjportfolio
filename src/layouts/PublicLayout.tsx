import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import BackToTop from '@/components/BackToTop'
import AnimatedBackground from '@/components/AnimatedBackground'
import PageTransition from '@/components/PageTransition'
import { useEffect, type ReactNode } from 'react'

export default function PublicLayout({ children }: { children?: ReactNode }) {
  const location = useLocation()
  const content = children ?? <Outlet />
  useEffect(() => {
    if (location.hash) { const el = document.querySelector(location.hash); if (el) { setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100); return } }
    window.scrollTo({ top: 0 })
  }, [location.pathname, location.hash])
  return (<><AnimatedBackground /><ScrollProgress /><Navbar /><AnimatePresence mode="wait"><PageTransition key={location.pathname}>{content}</PageTransition></AnimatePresence><Footer /><BackToTop /></>)
}
