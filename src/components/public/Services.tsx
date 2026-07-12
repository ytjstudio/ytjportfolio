import { motion } from 'framer-motion'
import { Code as Code2, LayoutGrid as Layout, Wrench, PenTool } from 'lucide-react'
import { Reveal, staggerContainer, fadeUpItem } from '@/components/Reveal'

const services = [
  { Icon: Code2, title: 'Website Development', description: 'Fast, responsive, SEO-optimized websites built with modern frameworks and best practices.', points: ['React & TypeScript', 'SEO & performance', 'Responsive layouts'] },
  { Icon: Layout, title: 'Custom Web Applications', description: 'Powerful, data-driven web apps tailored to your business workflows and scale.', points: ['Dashboards & SaaS', 'Real-time data', 'Auth & integrations'] },
  { Icon: PenTool, title: 'UI/UX Design', description: 'Beautiful, intuitive interfaces designed around your users and brand identity.', points: ['Design systems', 'Prototyping', 'Accessibility'] },
  { Icon: Wrench, title: 'Website Maintenance', description: 'Ongoing support, updates, monitoring, and improvements to keep your site healthy.', points: ['Updates & backups', 'Performance audits', 'Bug fixes'] },
]

export default function Services() {
  return (
    <section id="services" className="py-28">
      <div className="section">
        <Reveal><p className="eyebrow">What we do</p><h2 className="heading-lg mt-3 max-w-2xl">Services built to <span className="text-white">move your business forward</span></h2></Reveal>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map(({ Icon, title, description, points }) => (
            <motion.div key={title} variants={fadeUpItem} whileHover={{ y: -6 }} className="group glass p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute -inset-px bg-brand-gradient-soft opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform"><Icon className="h-6 w-6 text-white" /></div>
                <h3 className="mt-6 font-display text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-white leading-relaxed">{description}</p>
                <ul className="mt-5 space-y-2">{points.map((p) => <li key={p} className="flex items-center gap-2 text-sm text-white"><span className="h-1.5 w-1.5 rounded-full bg-brand-purple" />{p}</li>)}</ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
