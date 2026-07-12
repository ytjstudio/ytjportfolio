import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Settings } from '@/types'

const FALLBACK: Settings = {
  id: 1, agency_name: 'YTJ Studio', logo_url: null, favicon_url: null,
  about_text: 'YTJ Studio is a digital agency crafting beautiful websites, powerful web applications, and memorable digital experiences. We blend design, engineering, and strategy to help businesses grow online.',
  social_links: { twitter: 'https://twitter.com', instagram: 'https://instagram.com', github: 'https://github.com', linkedin: 'https://linkedin.com' },
  contact_info: { email: 'hello@ytjstudio.com', phone: '+1 (555) 010-2025', whatsapp: '+15550102025', address: 'Remote • Worldwide' },
  footer_text: '© YTJ Studio. All rights reserved.', updated_at: new Date().toISOString(),
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(FALLBACK)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    supabase.from('settings').select('*').eq('id', 1).maybeSingle().then(({ data }) => { if (active && data) setSettings(data as Settings); if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  return { settings, loading }
}
