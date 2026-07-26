import { useEffect, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BookOpen, Lock } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { LikeButton } from '../../components/likes/LikeButton'
import { getStoryBySlug } from '../../firebase/stories.service'
import { listPublishedChapters } from '../../firebase/chapters.service'
import { hasLikedStory, toggleStoryLike } from '../../firebase/likes.service'
import { useAuth } from '../../contexts/AuthContext'
import { formatDate } from '../../utils/dateFormat'
import type { Story } from '../../types/story'
import type { Chapter } from '../../types/chapter'

const STATUS_LABEL: Record<Story['status'], string> = {
  in_progress: 'En progreso',
  completed: 'Completa',
  hiatus: 'En pausa',
}

export function StoryDetailPage() {
  const { storySlug = '' } = useParams()
  const { user } = useAuth()
  const [story, setStory] = useState<Story | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    getStoryBySlug(storySlug).then(async (s) => {
      if (!active || !s) {
        setLoading(false)
        return
      }
      setStory(s)
      const [chs, likedByUser] = await Promise.all([
        listPublishedChapters(s.id),
        user ? hasLikedStory(s.id, user.uid) : Promise.resolve(false),
      ])
      if (!active) return
      setChapters(chs)
      setLiked(likedByUser)
      setLoading(false)
    }).catch(() => {
      if (active) setLoading(false)
    })
    return () => {
      active = false
    }
  }, [storySlug, user])

  const handleToggleLike = useCallback(async () => {
    if (!story || !user) return
    await toggleStoryLike(story.id, user.uid, liked)
    setLiked(!liked)
    setStory((s) => (s ? { ...s, likeCount: s.likeCount + (liked ? -1 : 1) } : s))
  }, [story, user, liked])

  if (loading) return <p className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-400">Cargando…</p>
  if (!story) return <p className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-400">Historia no encontrada.</p>

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="mx-auto flex h-56 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent-100 dark:bg-accent-900 sm:mx-0">
          {story.coverURL ? (
            <img src={story.coverURL} alt={story.title} className="h-full w-full object-cover" />
          ) : (
            <BookOpen size={36} className="text-accent-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">{STATUS_LABEL[story.status]}</Badge>
            {story.isAdultContent && <Badge tone="warning">+18</Badge>}
            {story.storyType === 'fanfic' && <Badge>Fanfic</Badge>}
          </div>
          <h1 className="mt-2 font-serif text-3xl font-bold text-slate-900 dark:text-white">{story.title}</h1>
          <p className="mt-3 whitespace-pre-wrap text-slate-600 dark:text-slate-300">{story.synopsis}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {story.genres.map((genre) => (
              <Badge key={genre}>{genre}</Badge>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <LikeButton liked={liked} count={story.likeCount} onToggle={handleToggleLike} disabled={!user} />
            <span className="text-xs text-slate-400">Actualizado {formatDate(story.updatedAt)}</span>
          </div>
        </div>
      </div>

      <h2 className="mt-10 mb-4 font-serif text-xl font-bold text-slate-900 dark:text-white">Capítulos</h2>
      {chapters.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 py-14 text-slate-400 dark:border-slate-800">
          <Lock size={24} />
          <p className="text-sm">Todavía no hay capítulos publicados.</p>
        </div>
      ) : (
        <ol className="divide-y divide-slate-100 rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <Link
                to={`/historia/${story.slug}/capitulo/${chapter.order}`}
                className="flex items-center justify-between gap-2 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {index + 1}. {chapter.title}
                </span>
                <span className="text-xs text-slate-400">{formatDate(chapter.publishedAt ?? chapter.updatedAt)}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
