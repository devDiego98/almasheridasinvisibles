import { useRef, useState, type ChangeEvent } from 'react'
import { Plus, Loader2 } from 'lucide-react'

const MAX_SIZE_BYTES = 2 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface CoverUploaderProps {
  previewURL: string | null
  onFileSelected: (file: File) => Promise<void>
}

export function CoverUploader({ previewURL, onFileSelected }: CoverUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Formato no soportado. Usá JPG, PNG o WebP.')
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('La imagen supera los 2MB.')
      return
    }

    setError(null)
    setUploading(true)
    try {
      await onFileSelected(file)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(',')} onChange={handleChange} className="hidden" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex h-44 w-32 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-accent-400 hover:text-accent-500 dark:border-slate-700 dark:text-slate-400"
      >
        {uploading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : previewURL ? (
          <img src={previewURL} alt="Portada" className="h-full w-full object-cover" />
        ) : (
          <>
            <Plus size={20} />
            <span className="text-xs">Subir portada</span>
          </>
        )}
      </button>
      <p className="mt-2 max-w-xs text-xs text-slate-400 dark:text-slate-500">
        JPG, PNG o WebP. Máximo 2MB. Se redimensiona a 800×1200 automáticamente.
      </p>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
