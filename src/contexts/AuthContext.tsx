import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '../firebase/config'
import { ensureReaderSession, checkIsAdmin } from '../firebase/auth'

interface AuthContextValue {
  user: User | null
  isAdmin: boolean
  loading: boolean
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextValue>({ user: null, isAdmin: false, loading: true, refreshUser: () => {} })

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
      setLoading(true)
      setUser(firebaseUser)
      try {
        setIsAdmin(await checkIsAdmin(firebaseUser))
      } finally {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [])

  // Linking a Google credential onto an existing anonymous user (see
  // signInReaderWithGoogle) mutates the same Firebase User object in place rather than
  // producing a new one, so onAuthStateChanged never re-fires for it. Call this right
  // after linking so the fresh photoURL/displayName make it into React state.
  const refreshUser = useCallback(() => {
    if (auth.currentUser) {
      setUser(Object.assign(Object.create(Object.getPrototypeOf(auth.currentUser)), auth.currentUser))
    }
  }, [])

  return <AuthContext.Provider value={{ user, isAdmin, loading, refreshUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
