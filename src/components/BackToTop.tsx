import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
export default function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => { const onScroll = () => setShow(window.scrollY > 600); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll) }, [])
  return (<AnimatePresence>{show && (<motion.button initial={{ opacity: 0, scale: 0.6, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.6, y: 20 }} whileHover={{ y: -3 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full glass-strong text-white flex items-center justify-center shadow-glow" aria-label="Back to top"><ArrowUp className="h-5 w-5" /></motion.button>)}</AnimatePresence>)
}
