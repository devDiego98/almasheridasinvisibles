import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { signInReaderWithGoogle } from '../../firebase/auth'
import { Button } from '../ui/Button'
import { CharCounter } from '../ui/CharCounter'

const MAX_LENGTH = 1000

interface CommentFormProps {
  onSubmit: (text: string) => Promise<void>
}

export function CommentForm({ onSubmit }: CommentFormProps) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    const trimmed = text.trim()
    if (!trimmed || trimmed.length > MAX_LENGTH) return
    setSubmitting(true)
    try {
      await onSubmit(trimmed)
      setText('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {user?.isAnonymous && (
        <button
          type="button"
          onClick={() => signInReaderWithGoogle()}
          className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent-600 hover:underline dark:text-accent-400"
        >
          <LogIn size={12} /> Iniciar sesión con Google para comentar con tu nombre
        </button>
      )}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Dejá tu comentario…"
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 dark:border-slate-700 dark:bg-slate-900"
      />
      <div className="mt-1 flex items-center justify-between">
        <CharCounter value={text} max={MAX_LENGTH} />
        <Button onClick={handleSubmit} disabled={submitting || !text.trim()}>
          Comentar
        </Button>
      </div>
    </div>
  )
}
