import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { getStory } from '../../firebase/stories.service'
import { listAllChapters, createDraftChapter, deleteChapter } from '../../firebase/chapters.service'
import { formatDate } from '../../utils/dateFormat'
import type { Story } from '../../types/story'
import type { Chapter } from '../../types/chapter'

export function ChapterListPage() {
  const { storyId = '' } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState<Story | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    Promise.all([getStory(storyId), listAllChapters(storyId)]).then(([s, chs]) => {
      setStory(s)
      setChapters(chs)
      setLoading(false)
    })
  }, [storyId])

  async function handleCreate() {
    setCreating(true)
    try {
      const chapter = await createDraftChapter(storyId)
      navigate(`/admin/historias/${storyId}/capitulos/${chapter.id}/editar`)
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(chapter: Chapter) {
    if (!confirm(`¿Eliminar el capítulo "${chapter.title || 'sin título'}"? Esta acción no se puede deshacer.`)) return
    await deleteChapter(storyId, chapter.id, chapter.status)
    setChapters((prev) => prev.filter((c) => c.id !== chapter.id))
  }

  if (loading) return <p className="text-sm text-slate-400">Cargando…</p>
  if (!story) return <p className="text-sm text-slate-400">Historia no encontrada.</p>

  return (
    <div>
      <Link to="/admin" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent-600 dark:text-slate-400">
        <ArrowLeft size={14} /> {story.title}
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Capítulos</h1>
        <Button icon={<Plus size={16} />} disabled={creating} onClick={handleCreate}>
          Nuevo capítulo
        </Button>
      </div>

      {chapters.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16 text-slate-400 dark:border-slate-800">
          <p className="text-sm">Todavía no hay capítulos.</p>
        </div>
      ) : (
        <Card className="divide-y divide-slate-100 dark:divide-slate-800">
          {chapters.map((chapter, index) => (
            <div key={chapter.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                  {index + 1}. {chapter.title || <span className="italic text-slate-400">Sin título</span>}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {chapter.wordCount} palabras · Actualizado {formatDate(chapter.updatedAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge tone={chapter.status === 'published' ? 'accent' : 'neutral'}>
                  {chapter.status === 'published' ? 'Publicado' : 'Borrador'}
                </Badge>
                <Link
                  to={`/admin/historias/${storyId}/capitulos/${chapter.id}/editar`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  aria-label="Editar capítulo"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(chapter)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 dark:text-slate-400 dark:hover:bg-red-950"
                  aria-label="Eliminar capítulo"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
