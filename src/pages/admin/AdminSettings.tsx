import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Save } from 'lucide-react'
import type { Settings } from '@/types'
import { fetchSettings, updateSettings } from '@/lib/api'
import { ImageUpload } from '@/components/admin/ImageUpload'
const socialKeys = ['twitter', 'instagram', 'github', 'linkedin', 'facebook', 'youtube']
const contactFields = [
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'address', label: 'Address' },
]

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
      .then((s) => {
        if (s) setSettings(s)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading || !settings) {
    return <div className="glass p-12 text-center text-white">Loading settings...</div>
  }

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev))

  const setSocial = (key: string, value: string) =>
    setSettings((prev) => (prev ? { ...prev, social_links: { ...prev.social_links, [key]: value } } : prev))

  const setContact = (key: string, value: string) =>
    setSettings((prev) => (prev ? { ...prev, contact_info: { ...prev.contact_info, [key]: value } } : prev))

  const save = async () => {
    setBusy(true)
    setError(null)
    try {
      const updated = await updateSettings({
        agency_name: settings.agency_name,
        logo_url: settings.logo_url,
        favicon_url: settings.favicon_url,
        about_text: settings.about_text,
        social_links: settings.social_links,
        contact_info: settings.contact_info,
        footer_text: settings.footer_text,
      })
      setSettings(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-white">Manage your agency information and branding.</p>
      </div>
      <div className="space-y-6">
        <section className="glass p-6 rounded-2xl space-y-5">
          <h2 className="font-display font-semibold text-white">Branding</h2>
          <label className="block">
            <span className="block text-sm text-white mb-2">Agency Name</span>
            <input value={settings.agency_name} onChange={(e) => set('agency_name', e.target.value)} className="form-input" />
          </label>
          <div className="grid sm:grid-cols-2 gap-5">
            <ImageUpload value={settings.logo_url} onChange={(url) => set('logo_url', url)} label="Logo" folder="brand" aspect="aspect-[3/1]" />
            <ImageUpload value={settings.favicon_url} onChange={(url) => set('favicon_url', url)} label="Favicon" folder="brand" aspect="aspect-square" />
          </div>
        </section>

        <section className="glass p-6 rounded-2xl space-y-5">
          <h2 className="font-display font-semibold text-white">About</h2>
          <label className="block">
            <span className="block text-sm text-white mb-2">About Text</span>
            <textarea value={settings.about_text ?? ''} onChange={(e) => set('about_text', e.target.value)} rows={5} className="form-input resize-y" />
          </label>
          <label className="block">
            <span className="block text-sm text-white mb-2">Footer Text</span>
            <input value={settings.footer_text ?? ''} onChange={(e) => set('footer_text', e.target.value)} className="form-input" />
          </label>
        </section>

        <section className="glass p-6 rounded-2xl space-y-5">
          <h2 className="font-display font-semibold text-white">Social Links</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {socialKeys.map((key) => (
              <label key={key} className="block">
                <span className="block text-sm text-white mb-2 capitalize">{key}</span>
                <input value={settings.social_links[key] ?? ''} onChange={(e) => setSocial(key, e.target.value)} className="form-input" placeholder={`https://${key}.com/...`} />
              </label>
            ))}
          </div>
        </section>

        <section className="glass p-6 rounded-2xl space-y-5">
          <h2 className="font-display font-semibold text-white">Contact Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {contactFields.map(({ key, label }) => (
              <label key={key} className="block">
                <span className="block text-sm text-white mb-2">{label}</span>
                <input value={settings.contact_info[key as keyof typeof settings.contact_info] ?? ''} onChange={(e) => setContact(key, e.target.value)} className="form-input" />
              </label>
            ))}
          </div>
        </section>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center gap-3 sticky bottom-4">
          <button onClick={save} disabled={busy} className="btn-primary">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes
          </button>
          {saved && <span className="inline-flex items-center gap-2 text-sm text-brand-glow"><CheckCircle2 className="h-4 w-4" /> Saved</span>}
        </div>
      </div>
    </div>
  )
}
