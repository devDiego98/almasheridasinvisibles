import { Link } from 'react-router-dom'
import { BookHeart, UserCog } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useAuth } from '../../contexts/AuthContext'

interface NavbarProps {
  siteName?: string
}

export function Navbar({ siteName = 'Almas Heridas Invisibles' }: NavbarProps) {
  const { isAdmin } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-serif text-lg font-semibold text-slate-900 dark:text-white">
          <BookHeart size={20} className="text-accent-500" />
          {siteName}
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Inicio
          </Link>
          <ThemeToggle />
          <Link
            to={isAdmin ? '/admin' : '/admin/login'}
            aria-label={isAdmin ? 'Panel de administración' : 'Iniciar sesión'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <UserCog size={16} />
          </Link>
        </nav>
      </div>
    </header>
  )
}
