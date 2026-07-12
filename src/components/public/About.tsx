import { motion } from 'framer-motion'
import { Reveal, staggerContainer, fadeUpItem } from '@/components/Reveal'
import { useSettings } from '@/hooks/useSettings'

const timeline = [
  { year: '2019', title: 'Started the journey', text: 'Began learning web development with HTML, CSS, and JavaScript.' },
  { year: '2021', title: 'First client projects', text: 'Delivered websites for small businesses and local brands.' },
  { year: '2023', title: 'YTJ Studio founded', text: 'Launched the agency, focusing on modern web apps and design.' },
  { year: '2025', title: 'Award-quality work', text: 'Building Awwwards-level experiences for clients worldwide.' },
]
const skills = [
  { name: 'Frontend Development', level: 95 }, { name: 'UI/UX Design', level: 88 },
  { name: 'Backend & Databases', level: 84 }, { name: 'Animations & Motion', level: 90 },
]

export default function About() {
  const { settings } = useSettings()
  return (
    <section id="about" className="py-28">
      <div className="section">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <Reveal><p className="eyebrow">About us</p><h2 className="heading-lg mt-3">Designing and building <span className="text-white">digital experiences</span></h2></Reveal>
            <Reveal delay={0.1}><p className="mt-6 text-white leading-relaxed text-lg">{settings.about_text}</p></Reveal>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="mt-10 space-y-5">
              {skills.map((s) => (<motion.div key={s.name} variants={fadeUpItem}><div className="flex justify-between text-sm mb-2"><span className="text-white">{s.name}</span><span className="text-white">{s.level}%</span></div><div className="h-2 rounded-full bg-white/[0.06] overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: `${s.level}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="h-full bg-brand-gradient" /></div></motion.div>))}
            </motion.div>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-brand-purple via-brand-glow to-brand-blue" />
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="space-y-8">
              {timeline.map((t) => (<motion.div key={t.year} variants={fadeUpItem} className="relative pl-14"><div className="absolute left-0 top-1 h-8 w-8 rounded-full glass-strong flex items-center justify-center"><span className="h-2.5 w-2.5 rounded-full bg-brand-gradient shadow-glow" /></div><div className="text-brand-purple font-display font-semibold">{t.year}</div><div className="mt-1 font-semibold text-white">{t.title}</div><p className="mt-1 text-sm text-white leading-relaxed">{t.text}</p></motion.div>))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
