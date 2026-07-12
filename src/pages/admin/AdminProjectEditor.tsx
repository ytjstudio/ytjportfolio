import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, Send, Loader as Loader2, Eye } from 'lucide-react'
import type { ProjectInput, ProjectStatus } from '@/types'
import { createProject, updateProject, fetchAllProjectsAdmin } from '@/lib/api'
import { slugify } from '@/lib/utils'
import { ImageUpload, GalleryUpload } from '@/components/admin/ImageUpload'
import ArrayInput from '@/components/admin/ArrayInput'

interface FormValues {
  name: string; slug: string; client_name: string; category: string; short_description: string;
  full_description: string; challenge: string; solution: string; completion_date: string;
  live_url: string; github_url: string; seo_title: string; seo_description: string;
  featured: boolean; status: ProjectStatus;
}

export default function AdminProjectEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: { name: '', slug: '', client_name: '', category: '', short_description: '', full_description: '', challenge: '', solution: '', completion_date: '', live_url: '', github_url: '', seo_title: '', seo_description: '', featured: false, status: 'draft' },
  })
  const [technologies, setTechnologies] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [gallery, setGallery] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(!isNew)
  const [error, setError] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    if (isNew) return
    let active = true
    setLoading(true)
    fetchAllProjectsAdmin().then((all) => {
      if (!active) return
      const p = all.find((x) => x.id === id)
      if (!p) { navigate('/admin/projects'); return }
      setValue('name', p.name); setValue('slug', p.slug); setValue('client_name', p.client_name ?? '')
      setValue('category', p.category ?? ''); setValue('short_description', p.short_description ?? '')
      setValue('full_description', p.full_description ?? ''); setValue('challenge', p.challenge ?? '')
      setValue('solution', p.solution ?? ''); setValue('completion_date', p.completion_date ?? '')
      setValue('live_url', p.live_url ?? ''); setValue('github_url', p.github_url ?? '')
      setValue('seo_title', p.seo_title ?? ''); setValue('seo_description', p.seo_description ?? '')
      setValue('featured', p.featured); setValue('status', p.status)
      setTechnologies(p.technologies ?? []); setFeatures(p.features ?? [])
      setCoverImage(p.cover_image); setGallery(p.gallery_images ?? [])
    }).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [id, isNew, navigate, setValue])

  const nameValue = watch('name')
  useEffect(() => { if (!slugTouched && isNew) setValue('slug', slugify(nameValue)) }, [nameValue, slugTouched, isNew, setValue])

  const buildInput = (data: FormValues, statusOverride?: ProjectStatus): ProjectInput => ({
    ...data, client_name: data.client_name || null, category: data.category || null,
    short_description: data.short_description || null, full_description: data.full_description || null,
    challenge: data.challenge || null, solution: data.solution || null, completion_date: data.completion_date || null,
    live_url: data.live_url || null, github_url: data.github_url || null, seo_title: data.seo_title || null,
    seo_description: data.seo_description || null, technologies, features, cover_image: coverImage,
    gallery_images: gallery, status: statusOverride ?? data.status,
  })

  const save = async (data: FormValues, statusOverride?: ProjectStatus) => {
    setError(null)
    if (!data.slug.trim()) { setError('Slug is required.'); return }
    setBusy(true)
    try {
      const input = buildInput(data, statusOverride)
      if (isNew) await createProject(input); else await updateProject(id!, input)
      navigate('/admin/projects')
    } catch (err) { setError(err instanceof Error ? err.message : 'Save failed') }
    finally { setBusy(false) }
  }

  if (loading) return <div className="glass p-12 text-center text-white">Loading project...</div>

  return (
    <div className="max-w-4xl">
      <Link to="/admin/projects" className="inline-flex items-center gap-2 text-sm text-white hover:text-white transition-colors mb-6"><ArrowLeft className="h-4 w-4" /> Back to projects</Link>
      <h1 className="font-display text-3xl font-bold text-white">{isNew ? 'New Project' : 'Edit Project'}</h1>
      <form onSubmit={handleSubmit((d) => save(d))} className="mt-8 space-y-8">
        <section className="glass p-6 rounded-2xl space-y-5">
          <h2 className="font-display font-semibold text-white">Basics</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Project Name" error={errors.name?.message}><input {...register('name', { required: 'Required' })} className="form-input" /></Field>
            <Field label="Slug" error={errors.slug?.message}><input {...register('slug', { required: 'Required' })} onChange={(e) => { setSlugTouched(true); setValue('slug', slugify(e.target.value)) }} className="form-input" placeholder="my-project" /></Field>
            <Field label="Client Name"><input {...register('client_name')} className="form-input" /></Field>
            <Field label="Category"><input {...register('category')} className="form-input" placeholder="Web Application" /></Field>
          </div>
          <Field label="Short Description"><textarea {...register('short_description')} rows={2} className="form-input resize-none" /></Field>
        </section>
        <section className="glass p-6 rounded-2xl space-y-5">
          <h2 className="font-display font-semibold text-white">Images</h2>
          <ImageUpload value={coverImage} onChange={setCoverImage} label="Cover Image" aspect="aspect-[16/10]" />
          <GalleryUpload value={gallery} onChange={setGallery} />
        </section>
        <section className="glass p-6 rounded-2xl space-y-5">
          <h2 className="font-display font-semibold text-white">Story</h2>
          <Field label="Full Description"><textarea {...register('full_description')} rows={5} className="form-input resize-y" /></Field>
          <Field label="Challenge"><textarea {...register('challenge')} rows={3} className="form-input resize-y" /></Field>
          <Field label="Solution"><textarea {...register('solution')} rows={3} className="form-input resize-y" /></Field>
        </section>
        <section className="glass p-6 rounded-2xl space-y-5">
          <h2 className="font-display font-semibold text-white">Technologies & Features</h2>
          <ArrayInput value={technologies} onChange={setTechnologies} label="Technologies" placeholder="React, TypeScript..." />
          <ArrayInput value={features} onChange={setFeatures} label="Features" placeholder="Real-time sync..." />
        </section>
        <section className="glass p-6 rounded-2xl space-y-5">
          <h2 className="font-display font-semibold text-white">Links & Meta</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Completion Date"><input type="date" {...register('completion_date')} className="form-input" /></Field>
            <Field label="Live Website URL"><input {...register('live_url')} className="form-input" placeholder="https://..." /></Field>
            <Field label="GitHub URL"><input {...register('github_url')} className="form-input" placeholder="https://github.com/..." /></Field>
          </div>
          <Field label="SEO Title"><input {...register('seo_title')} className="form-input" /></Field>
          <Field label="SEO Description"><textarea {...register('seo_description')} rows={2} className="form-input resize-none" /></Field>
        </section>
        <section className="glass p-6 rounded-2xl space-y-5">
          <h2 className="font-display font-semibold text-white">Visibility</h2>
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" {...register('featured')} className="accent-brand-purple h-4 w-4" /><span className="text-sm text-white">Featured project (shown on homepage)</span></label>
          <Field label="Status">
            <div className="flex gap-3">
              {(['draft', 'published'] as ProjectStatus[]).map((s) => (
                <label key={s} className="flex-1"><input type="radio" value={s} {...register('status')} className="peer sr-only" /><div className="glass p-3 rounded-xl text-center text-sm text-white peer-checked:bg-brand-gradient peer-checked:text-white peer-checked:shadow-glow transition-all cursor-pointer capitalize">{s}</div></label>
              ))}
            </div>
          </Field>
        </section>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex flex-wrap gap-3 sticky bottom-4">
          <button type="button" onClick={handleSubmit((d) => save(d, 'draft'))} disabled={busy} className="btn-ghost">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Draft</button>
          <button type="submit" disabled={busy} className="btn-primary">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Publish</button>
          {!isNew && <Link to={`/projects/${watch('slug')}`} target="_blank" className="btn-outline"><Eye className="h-4 w-4" /> Preview</Link>}
        </div>
      </form>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-sm text-white mb-2">{label}</span>{children}{error && <span className="block mt-1 text-xs text-red-400">{error}</span>}</label>
}
