import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '../firebase/config'
import { ensureReaderSession, checkIsAdmin } from '../firebase/auth'

interface AuthContextValue {
  user: User | null
  isAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({ user: null, isAdmin: false, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        try {
          await ensureReaderSession()
        } catch {
          setLoading(false)
        }
        return
      }
      setUser(firebaseUser)
      try {
        setIsAdmin(await checkIsAdmin(firebaseUser))
      } finally {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [])

  return <AuthContext.Provider value={{ user, isAdmin, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
