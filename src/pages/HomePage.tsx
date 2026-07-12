import Hero from '@/components/public/Hero'
import Services from '@/components/public/Services'
import FeaturedProjects from '@/components/public/FeaturedProjects'
import Testimonials from '@/components/public/Testimonials'
import About from '@/components/public/About'
import TechStack from '@/components/public/TechStack'
import Contact from '@/components/public/Contact'
import AnimatedCounter from '@/components/AnimatedCounter'
import { Reveal } from '@/components/Reveal'

const stats = [
  { value: 48, suffix: '+', label: 'Projects Completed' },
  { value: 32, suffix: '+', label: 'Happy Clients' },
  { value: 24, suffix: '+', label: 'Technologies' },
  { value: 6, suffix: '+', label: 'Years Learning' },
]

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <section className="py-20"><div className="section"><div className="glass-strong rounded-3xl p-10 md:p-16 grid grid-cols-2 lg:grid-cols-4 gap-8">{stats.map((s, i) => (<Reveal key={s.label} delay={i * 0.08}><div className="text-center"><div className="font-display text-4xl md:text-5xl font-bold text-white"><AnimatedCounter to={s.value} suffix={s.suffix} /></div><div className="mt-2 text-sm text-white">{s.label}</div></div></Reveal>))}</div></div></section>
      <FeaturedProjects />
      <About />
      <TechStack />
      <Testimonials />
      <Contact />
    </>
  )
}
