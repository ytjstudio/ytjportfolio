import { useState } from 'react'
import { X, Plus } from 'lucide-react'

interface ArrayInputProps { value: string[]; onChange: (v: string[]) => void; label: string; placeholder?: string }

export default function ArrayInput({ value, onChange, label, placeholder = 'Type and press Enter' }: ArrayInputProps) {
  const [draft, setDraft] = useState('')
  const add = () => { const v = draft.trim(); if (!v) return; if (!value.includes(v)) onChange([...value, v]); setDraft('') }
  return (
    <div>
      <span className="block text-sm text-white mb-2">{label}</span>
      <div className="glass rounded-xl p-3 flex flex-wrap gap-2">
        {value.map((item) => (<span key={item} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gradient-soft text-sm text-white">{item}<button type="button" onClick={() => onChange(value.filter((v) => v !== item))} className="hover:text-white text-white" aria-label={`Remove ${item}`}><X className="h-3 w-3" /></button></span>))}
        <div className="flex items-center gap-1 min-w-[160px]"><input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }} placeholder={placeholder} className="flex-1 bg-transparent outline-none text-sm min-w-0 text-white" /><button type="button" onClick={add} className="h-7 w-7 rounded-lg bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors" aria-label="Add"><Plus className="h-3.5 w-3.5" /></button></div>
      </div>
    </div>
  )
}
