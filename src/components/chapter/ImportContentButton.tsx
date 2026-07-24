import { useRef, useState, type ChangeEvent } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { importContentFile } from '../../utils/docxImport'
import { Button } from '../ui/Button'

interface ImportContentButtonProps {
  onImported: (html: string) => void
}

export function ImportContentButton({ onImported }: ImportContentButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setImporting(true)
    try {
      const html = await importContentFile(file)
      onImported(html)
    } catch {
      setError('No se pudo importar el archivo. Probá con otro .docx o .txt.')
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept=".docx,.txt" onChange={handleChange} className="hidden" />
      <Button type="button" variant="secondary" icon={importing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} onClick={() => inputRef.current?.click()} disabled={importing}>
        Importar .docx o .txt
      </Button>
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">El contenido importado reemplaza lo que tengas escrito.</p>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
