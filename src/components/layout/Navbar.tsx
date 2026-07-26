import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookHeart, LogIn, LogOut, User, Settings, UserCircle, LayoutList } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '../../contexts/AuthContext'
import { signInReaderWithGoogle, signOutUser } from '../../firebase/auth'
import { siteName as defaultSiteName } from '../../constants'

interface NavbarProps {
  siteName?: string
}

export function Navbar({ siteName = defaultSiteName }: NavbarProps) {
  const { user, isAdmin, refreshUser } = useAuth()
  const navigate = useNavigate()
  const isReaderSignedIn = user?.isAnonymous === false
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-serif text-lg font-semibold text-slate-900 dark:text-white">
          <BookHeart size={20} className="text-accent-500" />
          {siteName}
        </Link>
        <nav className="flex items-center gap-3">
          <ThemeToggle />
          {isReaderSignedIn ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Cuenta"
                aria-expanded={menuOpen}
                className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={16} />
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-11 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  <Link
                    to="/mi-cuenta"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <UserCircle size={15} /> Mi cuenta
                  </Link>
                  {isAdmin && (
                    <>
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <LayoutList size={15} /> Mis historias
                      </Link>
                      <Link
                        to="/admin/perfil"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <Settings size={15} /> Ajustes
                      </Link>
                    </>
                  )}
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      signOutUser()
                      navigate('/')
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <LogOut size={15} /> Salir
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signInReaderWithGoogle().then(refreshUser)}
              aria-label="Iniciar sesión"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <LogIn size={16} />
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
