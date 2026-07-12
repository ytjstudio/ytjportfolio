import { Link } from 'react-router-dom'
import { Mail, Phone, MessageCircle, Github, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'

export default function Footer() {
  const { settings } = useSettings()
  const year = new Date().getFullYear()
  const socials = [
    { key: 'twitter', Icon: Twitter, url: settings.social_links.twitter },
    { key: 'instagram', Icon: Instagram, url: settings.social_links.instagram },
    { key: 'github', Icon: Github, url: settings.social_links.github },
    { key: 'linkedin', Icon: Linkedin, url: settings.social_links.linkedin },
  ].filter((s) => s.url)
  return (
    <footer className="relative mt-32 border-t border-white/[0.06]">
      <div className="section py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient font-display font-bold text-white">Y</span><span className="font-display font-semibold text-lg">{settings.agency_name}</span></Link>
            <p className="mt-4 text-white max-w-md leading-relaxed">{settings.footer_text ?? `© ${year} ${settings.agency_name}. All rights reserved.`}</p>
            <div className="mt-6 flex gap-3">{socials.map(({ key, Icon, url }) => (<a key={key} href={url} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/[0.08] transition-all hover:-translate-y-0.5" aria-label={key}><Icon className="h-4 w-4" /></a>))}</div>
          </div>
          <div><h4 className="text-sm font-semibold mb-4 text-white">Navigate</h4><ul className="space-y-2 text-white"><li><Link to="/" className="hover:text-white transition-colors">Home</Link></li><li><Link to="/projects" className="hover:text-white transition-colors">Projects</Link></li><li><Link to="/#about" className="hover:text-white transition-colors">About</Link></li><li><Link to="/#contact" className="hover:text-white transition-colors">Contact</Link></li></ul></div>
          <div><h4 className="text-sm font-semibold mb-4 text-white">Get in touch</h4><ul className="space-y-3 text-white">{settings.contact_info.email && (<li><a href={`mailto:${settings.contact_info.email}`} className="flex items-center gap-2 hover:text-white transition-colors"><Mail className="h-4 w-4 text-brand-purple" /> {settings.contact_info.email}</a></li>)}{settings.contact_info.phone && (<li><a href={`tel:${settings.contact_info.phone}`} className="flex items-center gap-2 hover:text-white transition-colors"><Phone className="h-4 w-4 text-brand-blue" /> {settings.contact_info.phone}</a></li>)}{settings.contact_info.whatsapp && (<li><a href={`https://wa.me/${settings.contact_info.whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors"><MessageCircle className="h-4 w-4 text-brand-glow" /> WhatsApp</a></li>)}</ul></div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4"><p className="text-sm text-white">© {year} {settings.agency_name}. Crafted with care.</p><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-2 text-sm text-white hover:text-white transition-colors">Back to top <ArrowUp className="h-4 w-4" /></button></div>
      </div>
    </footer>
  )
}
