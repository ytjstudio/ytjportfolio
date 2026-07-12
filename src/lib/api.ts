import { supabase } from './supabase'
import type { Project, ProjectInput, Testimonial, TestimonialInput, Message, MessageInput, Settings } from '@/types'

const PROJECT_FIELDS = `id, slug, name, client_name, category, short_description, full_description, challenge, solution, technologies, features, completion_date, live_url, github_url, cover_image, gallery_images, featured, status, seo_title, seo_description, views, created_at, updated_at`

export async function fetchPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from('projects').select(PROJECT_FIELDS).eq('status', 'published').order('featured', { ascending: false }).order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Project[]
}
export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase.from('projects').select(PROJECT_FIELDS).eq('slug', slug).maybeSingle()
  if (error) throw error
  return (data as Project) ?? null
}
export async function incrementProjectViews(slug: string): Promise<void> {
  const { error } = await supabase.rpc('increment_project_views', { p_slug: slug })
  if (error) throw error
}
export async function fetchAllProjectsAdmin(): Promise<Project[]> {
  const { data, error } = await supabase.from('projects').select(PROJECT_FIELDS).order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Project[]
}
export async function createProject(input: ProjectInput): Promise<Project> {
  const { data, error } = await supabase.from('projects').insert(input).select(PROJECT_FIELDS).single()
  if (error) throw error
  return data as Project
}
export async function updateProject(id: string, input: Partial<ProjectInput>): Promise<Project> {
  const { data, error } = await supabase.from('projects').update({ ...input, updated_at: new Date().toISOString() }).eq('id', id).select(PROJECT_FIELDS).single()
  if (error) throw error
  return data as Project
}
export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}
export async function duplicateProject(project: Project): Promise<Project> {
  const { id, created_at, updated_at, views, ...rest } = project
  const copy: ProjectInput = { ...rest, slug: `${rest.slug}-copy-${Date.now().toString(36)}`, name: `${rest.name} (Copy)`, featured: false }
  return createProject(copy)
}
export async function fetchPublishedTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Testimonial[]
}
export async function createTestimonial(input: TestimonialInput): Promise<Testimonial> {
  const { data, error } = await supabase.from('testimonials').insert(input).select('*').single()
  if (error) throw error
  return data as Testimonial
}
export async function updateTestimonial(id: string, input: Partial<TestimonialInput>): Promise<Testimonial> {
  const { data, error } = await supabase.from('testimonials').update({ ...input, updated_at: new Date().toISOString() }).eq('id', id).select('*').single()
  if (error) throw error
  return data as Testimonial
}
export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw error
}
export async function submitMessage(input: MessageInput): Promise<void> {
  const { error } = await supabase.from('messages').insert(input)
  if (error) throw error
}
export async function fetchAllMessagesAdmin(): Promise<Message[]> {
  const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Message[]
}
export async function markMessageRead(id: string, isRead: boolean): Promise<void> {
  const { error } = await supabase.from('messages').update({ is_read: isRead }).eq('id', id)
  if (error) throw error
}
export async function markMessageReplied(id: string): Promise<void> {
  const { error } = await supabase.from('messages').update({ replied: true }).eq('id', id)
  if (error) throw error
}
export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase.from('messages').delete().eq('id', id)
  if (error) throw error
}
export async function fetchSettings(): Promise<Settings | null> {
  const { data, error } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle()
  if (error) throw error
  return (data as Settings) ?? null
}
export async function updateSettings(input: Partial<Settings>): Promise<Settings> {
  const { data, error } = await supabase.from('settings').update({ ...input, updated_at: new Date().toISOString() }).eq('id', 1).select('*').single()
  if (error) throw error
  return data as Settings
}
export async function fetchDashboardStats(): Promise<{ totalProjects: number; publishedProjects: number; totalTestimonials: number; totalMessages: number; unreadMessages: number; totalViews: number }> {
  const [projects, testimonials, messages] = await Promise.all([
    supabase.from('projects').select('status, views'),
    supabase.from('testimonials').select('id', { count: 'exact', head: true }),
    supabase.from('messages').select('is_read'),
  ])
  if (projects.error) throw projects.error
  if (testimonials.error) throw testimonials.error
  if (messages.error) throw messages.error
  const projectRows = projects.data ?? []
  const messageRows = messages.data ?? []
  return { totalProjects: projectRows.length, publishedProjects: projectRows.filter((p) => p.status === 'published').length, totalTestimonials: testimonials.count ?? 0, totalMessages: messageRows.length, unreadMessages: messageRows.filter((m) => !m.is_read).length, totalViews: projectRows.reduce((sum, p) => sum + (p.views ?? 0), 0) }
}
export async function uploadMedia(file: File, folder = 'projects'): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${folder}/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('media').upload(path, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return data.publicUrl
}
