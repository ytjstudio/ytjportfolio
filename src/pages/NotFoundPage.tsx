import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Chrome as Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center section text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="font-display text-[120px] md:text-[200px] font-bold text-white leading-none">404</div>
        <h1 className="heading-md">Page not found</h1>
        <p className="mt-4 text-white max-w-md mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary mt-8 inline-flex"><Home className="h-4 w-4" /> Back home</Link>
        <div><Link to="/projects" className="inline-flex items-center gap-2 mt-6 text-sm text-white hover:text-white transition-colors"><ArrowLeft className="h-4 w-4" /> View projects</Link></div>
      </motion.div>
    </div>
  )
}
