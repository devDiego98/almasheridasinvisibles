import { useEffect, useState, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { LikeButton } from '../../components/likes/LikeButton'
import { CommentList } from '../../components/comments/CommentList'
import { getStoryBySlug } from '../../firebase/stories.service'
import {
  listPublishedChapters,
  incrementChapterViewCount,
  hasViewedChapterThisSession,
  markChapterViewedThisSession,
} from '../../firebase/chapters.service'
import { hasLikedChapter, toggleChapterLike } from '../../firebase/likes.service'
import { recordChapterRead } from '../../firebase/history.service'
import { useAuth } from '../../contexts/AuthContext'
import type { Story } from '../../types/story'
import type { Chapter } from '../../types/chapter'

export function ChapterReaderPage() {
  const { storySlug = '', chapterOrder = '' } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

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
      const chs = await listPublishedChapters(s.id)
      if (!active) return
      setStory(s)
      setChapters(chs)
      setLoading(false)
    }).catch(() => {
      if (active) setLoading(false)
    })
    return () => {
      active = false
    }
  }, [storySlug])

  const currentIndex = chapters.findIndex((c) => String(c.order) === chapterOrder)
  const chapter = currentIndex >= 0 ? chapters[currentIndex] : null

  useEffect(() => {
    if (!story || !chapter) return
    hasLikedChapter(story.id, chapter.id, user?.uid ?? '').then(setLiked)
    if (!hasViewedChapterThisSession(chapter.id)) {
      incrementChapterViewCount(story.id, chapter.id)
      markChapterViewedThisSession(chapter.id)
    }
    if (user) {
      recordChapterRead(user.uid, {
        chapterId: chapter.id,
        storyId: story.id,
        storySlug: story.slug,
        storyTitle: story.title,
        chapterTitle: chapter.title,
        chapterOrder: chapter.order,
      })
    }
  }, [story, chapter, user])

  const handleToggleLike = useCallback(async () => {
    if (!story || !chapter || !user) return
    await toggleChapterLike(story.id, chapter.id, user.uid, liked)
    setLiked(!liked)
    setChapters((prev) =>
      prev.map((c) => (c.id === chapter.id ? { ...c, likeCount: c.likeCount + (liked ? -1 : 1) } : c)),
    )
  }, [story, chapter, user, liked])

  if (loading) return <p className="mx-auto max-w-2xl px-4 py-16 text-center text-slate-400">Cargando…</p>
  if (!story || !chapter) {
    return <p className="mx-auto max-w-2xl px-4 py-16 text-center text-slate-400">Capítulo no encontrado.</p>
  }

  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        to={`/historia/${story.slug}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent-600 dark:text-slate-400"
      >
        <ArrowLeft size={14} /> {story.title}
      </Link>

      <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">{chapter.title}</h1>
      {chapter.subtitle && <p className="mt-1 text-slate-500 dark:text-slate-400">{chapter.subtitle}</p>}

      {chapter.authorNoteStart && (
        <div className="mt-6 rounded-xl bg-accent-50 px-4 py-3 text-sm text-slate-600 dark:bg-accent-950 dark:text-slate-300">
          {chapter.authorNoteStart}
        </div>
      )}

      <div className="chapter-content mt-8" dangerouslySetInnerHTML={{ __html: chapter.contentHTML }} />

      {chapter.authorNoteEnd && (
        <div className="mt-8 rounded-xl bg-accent-50 px-4 py-3 text-sm text-slate-600 dark:bg-accent-950 dark:text-slate-300">
          {chapter.authorNoteEnd}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <LikeButton liked={liked} count={chapter.likeCount} onToggle={handleToggleLike} disabled={!user} />
      </div>

      <div className="mt-10 flex items-center justify-between gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
        <button
          disabled={!prevChapter}
          onClick={() => prevChapter && navigate(`/historia/${story.slug}/capitulo/${prevChapter.order}`)}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ChevronLeft size={16} /> Anterior
        </button>
        <button
          disabled={!nextChapter}
          onClick={() => nextChapter && navigate(`/historia/${story.slug}/capitulo/${nextChapter.order}`)}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Siguiente <ChevronRight size={16} />
        </button>
      </div>

      <CommentList storyId={story.id} chapterId={chapter.id} commentsEnabled={story.commentsEnabled} />
    </div>
  )
}
