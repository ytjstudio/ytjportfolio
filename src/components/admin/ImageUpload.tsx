import { useRef, useState } from 'react'
import { X, Loader as Loader2, ImagePlus, Upload } from 'lucide-react'
import { uploadMedia } from '@/lib/api'

interface ImageUploadProps { value: string | null; onChange: (url: string | null) => void; label?: string; folder?: string; aspect?: string }

export function ImageUpload({ value, onChange, label = 'Image', folder = 'projects', aspect = 'aspect-video' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const handleFile = async (file: File) => { setError(null); setUploading(true); try { const url = await uploadMedia(file, folder); onChange(url) } catch (err) { setError(err instanceof Error ? err.message : 'Upload failed') } finally { setUploading(false) } }
  return (
    <div>
      <span className="block text-sm text-white mb-2">{label}</span>
      <div className={`${aspect} relative rounded-xl overflow-hidden glass border border-dashed border-white/15`}>
        {value ? (<><img src={value} alt="" className="h-full w-full object-cover" /><button type="button" onClick={() => onChange(null)} className="absolute top-2 right-2 h-8 w-8 rounded-lg bg-ink-900/70 backdrop-blur flex items-center justify-center hover:bg-red-500/80 transition-colors" aria-label="Remove image"><X className="h-4 w-4" /></button></>)
        : (<button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white hover:text-white hover:bg-white/[0.03] transition-colors">{uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}<span className="text-xs">{uploading ? 'Uploading...' : 'Click to upload'}</span></button>)}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); e.target.value = '' }} />
      </div>
      {value && <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="mt-2 text-xs text-white hover:text-white transition-colors flex items-center gap-1"><Upload className="h-3 w-3" /> Replace</button>}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

interface GalleryUploadProps { value: string[]; onChange: (urls: string[]) => void; label?: string }

export function GalleryUpload({ value, onChange, label = 'Gallery images' }: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const handleFiles = async (files: FileList) => { setUploading(true); try { const urls: string[] = []; for (const file of Array.from(files)) { urls.push(await uploadMedia(file, 'projects')) }; onChange([...value, ...urls]) } catch (err) { alert(err instanceof Error ? err.message : 'Upload failed') } finally { setUploading(false) } }
  return (
    <div>
      <span className="block text-sm text-white mb-2">{label}</span>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {value.map((url, i) => (<div key={i} className="relative aspect-video rounded-xl overflow-hidden glass"><img src={url} alt="" className="h-full w-full object-cover" /><button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 h-7 w-7 rounded-lg bg-ink-900/70 backdrop-blur flex items-center justify-center hover:bg-red-500/80 transition-colors" aria-label="Remove"><X className="h-3.5 w-3.5" /></button></div>))}
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="aspect-video rounded-xl glass border border-dashed border-white/15 flex flex-col items-center justify-center gap-2 text-white hover:text-white hover:bg-white/[0.03] transition-colors">{uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}<span className="text-xs">{uploading ? 'Uploading' : 'Add images'}</span></button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = '' }} />
    </div>
  )
}
