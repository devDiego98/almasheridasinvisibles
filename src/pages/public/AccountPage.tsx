import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, History, LogIn, LogOut, BookOpen } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { signInReaderWithGoogle, signOutUser } from '../../firebase/auth'
import { listFavoriteStoryIds } from '../../firebase/likes.service'
import { getStory } from '../../firebase/stories.service'
import { listReadingHistory } from '../../firebase/history.service'
import { Button } from '../../components/ui/Button'
import { StoryCard } from '../../components/story/StoryCard'
import { formatDate } from '../../utils/dateFormat'
import type { Story } from '../../types/story'
import type { ReadHistoryEntry } from '../../types/history'

export function AccountPage() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState<Story[]>([])
  const [history, setHistory] = useState<ReadHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    Promise.all([
      listFavoriteStoryIds(user.uid).then((ids) =>
        Promise.all(ids.map((id) => getStory(id))).then((stories) => stories.filter((s): s is Story => !!s)),
      ),
      listReadingHistory(user.uid),
    ]).then(([favs, hist]) => {
      setFavorites(favs)
      setHistory(hist)
      setLoading(false)
    })
  }, [user])

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">Mi cuenta</h1>

        {user?.isAnonymous === false ? (
          <Button
            variant="secondary"
            icon={<LogOut size={14} />}
            onClick={() => {
              signOutUser()
              navigate('/')
            }}
          >
            Salir
          </Button>
        ) : (
          <Button icon={<LogIn size={14} />} onClick={() => signInReaderWithGoogle().then(refreshUser)}>
            Iniciar sesión con Google
          </Button>
        )}
      </div>

      {user?.isAnonymous !== false && (
        <p className="mb-8 rounded-xl bg-accent-50 px-4 py-3 text-sm text-slate-600 dark:bg-accent-950 dark:text-slate-300">
          Iniciá sesión con Google para guardar tus favoritos e historial entre dispositivos.
        </p>
      )}

      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-bold text-slate-900 dark:text-white">
          <Heart size={18} /> Favoritos
        </h2>
        {loading ? (
          <p className="text-sm text-slate-400">Cargando…</p>
        ) : favorites.length === 0 ? (
          <p className="text-sm text-slate-400">Todavía no marcaste ninguna historia como favorita.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {favorites.map((story) => (
              <StoryCard key={story.id} story={story} linkTo={`/historia/${story.slug}`} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-bold text-slate-900 dark:text-white">
          <History size={18} /> Historial de lectura
        </h2>
        {loading ? (
          <p className="text-sm text-slate-400">Cargando…</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-slate-400">Todavía no leíste ningún capítulo.</p>
        ) : (
          <ol className="divide-y divide-slate-100 rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {history.map((entry) => (
              <li key={entry.chapterId}>
                <Link
                  to={`/historia/${entry.storySlug}/capitulo/${entry.chapterOrder}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                      {entry.chapterTitle}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-400">
                      <BookOpen size={11} /> {entry.storyTitle}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{formatDate(entry.readAt)}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
