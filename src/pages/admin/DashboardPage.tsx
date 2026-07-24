import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, ListOrdered, PlusCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { StoryCard } from '../../components/story/StoryCard'
import { listAllStories } from '../../firebase/stories.service'
import { createDraftChapter } from '../../firebase/chapters.service'
import type { Story } from '../../types/story'

export function DashboardPage() {
  const navigate = useNavigate()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingChapterFor, setCreatingChapterFor] = useState<string | null>(null)

  useEffect(() => {
    listAllStories()
      .then(setStories)
      .finally(() => setLoading(false))
  }, [])

  async function handleAddChapter(storyId: string) {
    setCreatingChapterFor(storyId)
    try {
      const chapter = await createDraftChapter(storyId)
      navigate(`/admin/historias/${storyId}/capitulos/${chapter.id}/editar`)
    } finally {
      setCreatingChapterFor(null)
    }
  }

  const inProgressCount = stories.filter((s) => s.status === 'in_progress').length

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">Mis historias</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {stories.length} historia{stories.length === 1 ? '' : 's'} · {inProgressCount} en progreso
          </p>
        </div>
        <Link to="/admin/historias/nueva">
          <Button icon={<Plus size={16} />}>Nueva historia</Button>
        </Link>
      </div>

      {loading && <p className="text-sm text-slate-400">Cargando…</p>}

      {!loading && stories.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16 text-slate-400 dark:border-slate-800">
          <p className="text-sm">Todavía no creaste ninguna historia.</p>
          <Link to="/admin/historias/nueva">
            <Button icon={<Plus size={16} />}>Crear la primera</Button>
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            linkTo={`/historia/${story.slug}`}
            footerActions={
              <>
                <Link to={`/admin/historias/${story.id}/editar`}>
                  <Button variant="secondary" icon={<Pencil size={14} />}>
                    Editar historia
                  </Button>
                </Link>
                <Link to={`/admin/historias/${story.id}/capitulos`}>
                  <Button variant="secondary" icon={<ListOrdered size={14} />}>
                    Capítulos
                  </Button>
                </Link>
                <Button
                  icon={<PlusCircle size={14} />}
                  disabled={creatingChapterFor === story.id}
                  onClick={() => handleAddChapter(story.id)}
                >
                  Agregar capítulo
                </Button>
              </>
            }
          />
        ))}
      </div>
    </div>
  )
}
