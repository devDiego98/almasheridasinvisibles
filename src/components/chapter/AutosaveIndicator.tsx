import { Check, Loader2, AlertCircle } from 'lucide-react'
import { formatTime } from '../../utils/dateFormat'
import type { SaveStatus } from '../../hooks/useAutosave'

interface AutosaveIndicatorProps {
  status: SaveStatus
  savedAt: number | null
}

export function AutosaveIndicator({ status, savedAt }: AutosaveIndicatorProps) {
  if (status === 'idle') return null

  if (status === 'saving') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
        <Loader2 size={12} className="animate-spin" /> Guardando…
      </span>
    )
  }

  if (status === 'error') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-red-500">
        <AlertCircle size={12} /> Error al guardar
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
      <Check size={12} /> Guardado {savedAt ? `· ${formatTime(savedAt)}` : ''}
    </span>
  )
}
