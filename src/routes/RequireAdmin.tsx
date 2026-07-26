import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Client-side UX guard only — actual write/read protection for admin data lives in
 * firestore.rules via the `admins/{uid}` allowlist.
 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        Cargando…
      </div>
    )
  }

  if (!user || user.isAnonymous || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
