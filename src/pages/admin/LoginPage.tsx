import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { BookHeart } from 'lucide-react'
import { signInAdmin, signOutUser } from '../../firebase/auth'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PasswordInput } from '../../components/ui/PasswordInput'

export function LoginPage() {
  const navigate = useNavigate()
  const { user, isAdmin, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [awaitingAdmin, setAwaitingAdmin] = useState(false)

  // Once signInAdmin() resolves, AuthContext still needs a moment to confirm admin
  // status via Firestore — react to that instead of navigating blindly right away,
  // which used to race the check and bounce back to /admin/login.
  useEffect(() => {
    if (!awaitingAdmin || loading) return
    setAwaitingAdmin(false)
    setSubmitting(false)
    if (isAdmin) {
      navigate('/', { replace: true })
    } else {
      setError('Esta cuenta no tiene permisos de administrador.')
      signOutUser()
    }
  }, [awaitingAdmin, loading, isAdmin, navigate])

  // This route is only for signing in — anyone already signed in (admin or not) gets
  // bounced immediately, before the form ever renders (a render-time <Navigate>
  // instead of a post-render effect+navigate() avoids an extra visible tick).
  if (!awaitingAdmin) {
    if (loading) {
      return <div className="flex min-h-screen items-center justify-center text-slate-400">Cargando…</div>
    }
    if (user && !user.isAnonymous) {
      return <Navigate to="/" replace />
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signInAdmin(email, password)
      setAwaitingAdmin(true)
    } catch {
      setError('Email o contraseña incorrectos.')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <Card className="w-full max-w-sm p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <BookHeart size={28} className="text-accent-500" />
          <h1 className="font-serif text-xl font-bold text-slate-900 dark:text-white">Panel de administración</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Contraseña</label>
            <PasswordInput
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full">
            Ingresar
          </Button>
        </form>
      </Card>
    </div>
  )
}
