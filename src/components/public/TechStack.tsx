import { motion } from 'framer-motion'
const stack = [
  { name: 'React', color: '#61DAFB' }, { name: 'TypeScript', color: '#3178C6' },
  { name: 'Tailwind', color: '#38BDF8' }, { name: 'Framer', color: '#FF0080' },
  { name: 'Vite', color: '#A371F7' }, { name: 'Node.js', color: '#5FA04E' },
  { name: 'Supabase', color: '#3FCF8E' }, { name: 'PostgreSQL', color: '#4169E1' },
  { name: 'Git', color: '#F05032' }, { name: 'Figma', color: '#F24E1E' },
  { name: 'Next.js', color: '#FFFFFF' }, { name: 'Docker', color: '#2496ED' },
]
export default function TechStack() {
  return (
    <section className="py-28">
      <div className="section">
        <p className="eyebrow text-center">Our toolbox</p>
        <h2 className="heading-lg mt-3 text-center mx-auto max-w-2xl">The <span className="text-white">technologies</span> we build with</h2>
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {stack.map((tech, i) => (<motion.div key={tech.name} initial={{ opacity: 0, y: 20, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }} whileHover={{ y: -6, scale: 1.04 }} className="glass aspect-square flex flex-col items-center justify-center gap-3 group"><span className="h-3 w-3 rounded-full transition-transform group-hover:scale-150" style={{ background: tech.color, boxShadow: `0 0 20px ${tech.color}` }} /><span className="text-sm font-medium text-white">{tech.name}</span></motion.div>))}
        </div>
      </div>
    </section>
  )
}
