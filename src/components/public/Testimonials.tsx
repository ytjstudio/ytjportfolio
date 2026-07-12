import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Testimonial } from '@/types'
import { fetchPublishedTestimonials } from '@/lib/api'

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  useEffect(() => { let active = true; fetchPublishedTestimonials().then((data) => active && setItems(data)).catch(() => {}).finally(() => active && setLoading(false)); return () => { active = false } }, [])
  const go = useCallback((dir: number) => { setDirection(dir); setIndex((i) => (i + dir + items.length) % items.length) }, [items.length])
  useEffect(() => { if (items.length <= 1) return; const id = setInterval(() => go(1), 6000); return () => clearInterval(id) }, [items.length, go])
  if (!loading && items.length === 0) return null
  return (
    <section className="py-28">
      <div className="section">
        <p className="eyebrow">Kind words</p>
        <h2 className="heading-lg mt-3 max-w-2xl">What clients <span className="text-white">say about us</span></h2>
        {loading ? <div className="mt-12 glass h-64 animate-pulse" />
        : (<div className="mt-12 relative">
          <div className="glass-strong rounded-3xl p-8 md:p-14 relative overflow-hidden">
            <Quote className="absolute top-8 right-8 h-20 w-20 text-brand-purple/10" />
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={index} custom={direction} initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <div className="flex items-center gap-1 mb-4">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={i < (items[index]?.rating ?? 5) ? 'h-4 w-4 fill-brand-glow text-brand-glow' : 'h-4 w-4 text-white/20'} />)}</div>
                <p className="text-lg md:text-2xl font-display leading-relaxed text-white">"{items[index]?.review}"</p>
                <div className="mt-8 flex items-center gap-4">{items[index]?.photo ? <img src={items[index].photo!} alt={items[index].client_name} className="h-14 w-14 rounded-full object-cover border border-white/10" /> : <div className="h-14 w-14 rounded-full bg-brand-gradient" />}<div><div className="font-semibold text-white">{items[index]?.client_name}</div><div className="text-sm text-white">{items[index]?.company}</div></div></div>
              </motion.div>
            </AnimatePresence>
          </div>
          {items.length > 1 && (<div className="mt-6 flex items-center justify-center gap-3"><button onClick={() => go(-1)} className="h-11 w-11 rounded-full glass flex items-center justify-center hover:bg-white/[0.08] transition-colors" aria-label="Previous"><ChevronLeft className="h-5 w-5" /></button><div className="flex gap-2">{items.map((_, i) => <button key={i} onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }} className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-brand-gradient' : 'w-2 bg-white/20'}`} aria-label={`Go to ${i + 1}`} />)}</div><button onClick={() => go(1)} className="h-11 w-11 rounded-full glass flex items-center justify-center hover:bg-white/[0.08] transition-colors" aria-label="Next"><ChevronRight className="h-5 w-5" /></button></div>)}
        </div>)}
      </div>
    </section>
  )
}
