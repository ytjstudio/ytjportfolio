import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      <div className="section w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-white"><Sparkles className="h-4 w-4 text-brand-purple" /> Digital agency for ambitious brands</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }} className="heading-xl mt-6 max-w-4xl">Building Modern Websites That <span className="text-white">Help Businesses Grow.</span></motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="mt-6 max-w-2xl text-lg text-white leading-relaxed">YTJ Studio creates beautiful websites, powerful web applications and digital experiences for businesses.</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }} className="mt-8 flex flex-wrap gap-4"><Link to="/projects" className="btn-primary group">View Projects <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link><a href="#contact" className="btn-ghost">Hire Me</a></motion.div>
      </div>
      <motion.div className="absolute top-1/4 right-[10%] h-2 w-2 rounded-full bg-brand-glow shadow-glow" animate={{ y: [0, -30, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="absolute bottom-1/3 left-[5%] h-3 w-3 rounded-full bg-brand-blue shadow-glow-blue" animate={{ y: [0, 40, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 8, repeat: Infinity }} />
    </section>
  )
}
