import { useState, type KeyboardEvent } from 'react'
import { MAX_TAGS } from '../../types/story'
import { Chip } from '../ui/Chip'
import { Button } from '../ui/Button'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
}

export function TagInput({ value, onChange }: TagInputProps) {
  const [draft, setDraft] = useState('')

  function addTag() {
    const tag = draft.trim()
    if (!tag || value.includes(tag) || value.length >= MAX_TAGS) return
    onChange([...value, tag])
    setDraft('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribí un tag y presioná Enter"
          disabled={value.length >= MAX_TAGS}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900"
        />
        <Button type="button" variant="secondary" onClick={addTag} disabled={!draft.trim() || value.length >= MAX_TAGS}>
          Agregar
        </Button>
      </div>
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((tag) => (
            <Chip key={tag} removable onRemove={() => onChange(value.filter((t) => t !== tag))}>
              {tag}
            </Chip>
          ))}
        </div>
      )}
    </div>
  )
}
