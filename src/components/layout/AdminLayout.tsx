import { Link, Outlet } from 'react-router-dom'
import { BookHeart, LogOut, Settings, LayoutList } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { signOutUser } from '../../firebase/auth'

export function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/admin" className="flex items-center gap-2 font-serif text-lg font-semibold text-slate-900 dark:text-white">
            <BookHeart size={20} className="text-accent-500" />
            Panel admin
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <LayoutList size={16} /> Mis historias
            </Link>
            <Link
              to="/admin/perfil"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Settings size={16} /> Perfil
            </Link>
            <ThemeToggle />
            <button
              onClick={() => signOutUser()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Salir"
            >
              <LogOut size={16} />
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
