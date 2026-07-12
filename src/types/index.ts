export type ProjectStatus = 'draft' | 'published'

export interface Project {
  id: string; slug: string; name: string; client_name: string | null; category: string | null;
  short_description: string | null; full_description: string | null; challenge: string | null;
  solution: string | null; technologies: string[]; features: string[]; completion_date: string | null;
  live_url: string | null; github_url: string | null; cover_image: string | null;
  gallery_images: string[]; featured: boolean; status: ProjectStatus; seo_title: string | null;
  seo_description: string | null; views: number; created_at: string; updated_at: string;
}

export interface ProjectInput {
  slug: string; name: string; client_name: string | null; category: string | null;
  short_description: string | null; full_description: string | null; challenge: string | null;
  solution: string | null; technologies: string[]; features: string[]; completion_date: string | null;
  live_url: string | null; github_url: string | null; cover_image: string | null;
  gallery_images: string[]; featured: boolean; status: ProjectStatus; seo_title: string | null;
  seo_description: string | null;
}

export interface Testimonial {
  id: string; client_name: string; company: string | null; rating: number;
  review: string | null; photo: string | null; created_at: string; updated_at: string;
}
export interface TestimonialInput { client_name: string; company: string | null; rating: number; review: string | null; photo: string | null }

export interface Message {
  id: string; name: string; email: string | null; phone: string | null;
  message: string | null; is_read: boolean; replied: boolean; created_at: string;
}
export interface MessageInput { name: string; email: string | null; phone: string | null; message: string | null }

export interface Settings {
  id: number; agency_name: string; logo_url: string | null; favicon_url: string | null;
  about_text: string | null; social_links: Record<string, string>;
  contact_info: { email?: string; phone?: string; whatsapp?: string; address?: string };
  footer_text: string | null; updated_at: string;
}
