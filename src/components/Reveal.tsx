import { motion, type Variants } from 'framer-motion'
import { type ReactNode } from 'react'
interface RevealProps { children: ReactNode; delay?: number; y?: number; className?: string; once?: boolean }
export function Reveal({ children, delay = 0, y = 24, className, once = true }: RevealProps) {
  return (<motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once, margin: '-80px' }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>)
}
export const staggerContainer: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }
export const fadeUpItem: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }
