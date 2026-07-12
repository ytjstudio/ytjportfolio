import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CircleCheck as CheckCircle2, Loader as Loader2, Mail, Phone, MessageCircle, MapPin } from 'lucide-react'
import { submitMessage } from '@/lib/api'
import { useSettings } from '@/hooks/useSettings'

const schema = z.object({ name: z.string().min(2, 'Please enter your name'), email: z.string().email('Enter a valid email'), phone: z.string().optional(), message: z.string().min(10, 'Tell us a bit more (10+ characters)') })
type FormData = z.infer<typeof schema>

export default function Contact() {
  const { settings } = useSettings()
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const onSubmit = async (data: FormData) => { setServerError(null); try { await submitMessage({ name: data.name, email: data.email, phone: data.phone ?? null, message: data.message }); setSubmitted(true); reset(); setTimeout(() => setSubmitted(false), 6000) } catch (err) { setServerError(err instanceof Error ? err.message : 'Something went wrong.') } }
  const info = [
    settings.contact_info.email && { Icon: Mail, label: 'Email', value: settings.contact_info.email, href: `mailto:${settings.contact_info.email}` },
    settings.contact_info.phone && { Icon: Phone, label: 'Phone', value: settings.contact_info.phone, href: `tel:${settings.contact_info.phone}` },
    settings.contact_info.whatsapp && { Icon: MessageCircle, label: 'WhatsApp', value: settings.contact_info.whatsapp, href: `https://wa.me/${settings.contact_info.whatsapp.replace(/[^\d]/g, '')}` },
    settings.contact_info.address && { Icon: MapPin, label: 'Location', value: settings.contact_info.address, href: null },
  ].filter(Boolean) as Array<{ Icon: typeof Mail; label: string; value: string; href: string | null }>

  return (
    <section id="contact" className="py-28">
      <div className="section">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Let's talk</p>
            <h2 className="heading-lg mt-3">Have a project in <span className="text-white">mind?</span></h2>
            <p className="mt-5 text-white leading-relaxed max-w-md">Tell us what you're building. We'll get back to you within 24 hours with next steps.</p>
            <div className="mt-10 space-y-4">{info.map(({ Icon, label, value, href }) => (<div key={label} className="flex items-center gap-4"><div className="h-11 w-11 rounded-xl glass flex items-center justify-center"><Icon className="h-5 w-5 text-brand-purple" /></div><div><div className="text-xs uppercase tracking-wider text-white">{label}</div>{href ? <a href={href} className="text-white hover:text-white transition-colors">{value}</a> : <div className="text-white">{value}</div>}</div></div>))}</div>
          </div>
          <div className="glass-strong p-8 rounded-2xl">
            <AnimatePresence>{submitted && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 flex items-center gap-3 glass px-4 py-3 rounded-xl border border-brand-glow/40"><CheckCircle2 className="h-5 w-5 text-brand-glow" /><span className="text-sm text-white">Thanks! Your message has been sent.</span></motion.div>)}</AnimatePresence>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5"><Field label="Name" error={errors.name?.message}><input {...register('name')} type="text" className="form-input" placeholder="Jane Doe" /></Field><Field label="Email" error={errors.email?.message}><input {...register('email')} type="email" className="form-input" placeholder="jane@company.com" /></Field></div>
              <Field label="Phone" error={errors.phone?.message}><input {...register('phone')} type="tel" className="form-input" placeholder="+1 (555) 000-0000" /></Field>
              <Field label="Message" error={errors.message?.message}><textarea {...register('message')} rows={5} className="form-input resize-none" placeholder="Tell us about your project..." /></Field>
              {serverError && <p className="text-sm text-red-400">{serverError}</p>}
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <>Send Message <Send className="h-4 w-4" /></>}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-sm text-white mb-2">{label}</span>{children}{error && <span className="block mt-1 text-xs text-red-400">{error}</span>}</label>
}
