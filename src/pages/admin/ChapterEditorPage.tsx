import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { CharCounter } from '../../components/ui/CharCounter'
import { ChapterEditor, type ChapterEditorHandle } from '../../components/chapter/ChapterEditor'
import { ImportContentButton } from '../../components/chapter/ImportContentButton'
import { WordCharCounter } from '../../components/chapter/WordCharCounter'
import { AutosaveIndicator } from '../../components/chapter/AutosaveIndicator'
import { useAutosave } from '../../hooks/useAutosave'
import { getStory } from '../../firebase/stories.service'
import { getChapter, updateChapter } from '../../firebase/chapters.service'
import type { Story } from '../../types/story'
import type { Chapter, ChapterStatus } from '../../types/chapter'

interface DraftState {
  title: string
  subtitle: string
  authorNoteStart: string
  authorNoteEnd: string
  contentHTML: string
  wordCount: number
  charCount: number
}

export function ChapterEditorPage() {
  const { storyId = '', chapterId = '' } = useParams()
  const navigate = useNavigate()
  const editorRef = useRef<ChapterEditorHandle>(null)

  const [story, setStory] = useState<Story | null>(null)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState<DraftState | null>(null)

  useEffect(() => {
    Promise.all([getStory(storyId), getChapter(storyId, chapterId)]).then(([s, c]) => {
      setStory(s)
      setChapter(c)
      if (c) {
        setDraft({
          title: c.title,
          subtitle: c.subtitle ?? '',
          authorNoteStart: c.authorNoteStart ?? '',
          authorNoteEnd: c.authorNoteEnd ?? '',
          contentHTML: c.contentHTML,
          wordCount: c.wordCount,
          charCount: c.charCount,
        })
      }
      setLoading(false)
    })
  }, [storyId, chapterId])

  const persist = useCallback(
    async (data: DraftState | null) => {
      if (!chapter || !data) return
      await updateChapter(
        storyId,
        chapterId,
        {
          title: data.title,
          subtitle: data.subtitle || null,
          authorNoteStart: data.authorNoteStart || null,
          authorNoteEnd: data.authorNoteEnd || null,
          contentHTML: data.contentHTML,
          wordCount: data.wordCount,
          charCount: data.charCount,
        },
        chapter.status,
      )
    },
    [storyId, chapterId, chapter],
  )

  const { status: saveStatus, savedAt } = useAutosave(draft, persist)

  async function saveWithStatus(newStatus: ChapterStatus) {
    if (!draft || !chapter) return
    await updateChapter(
      storyId,
      chapterId,
      {
        title: draft.title,
        subtitle: draft.subtitle || null,
        authorNoteStart: draft.authorNoteStart || null,
        authorNoteEnd: draft.authorNoteEnd || null,
        contentHTML: draft.contentHTML,
        wordCount: draft.wordCount,
        charCount: draft.charCount,
        status: newStatus,
      },
      chapter.status,
    )
    navigate(`/admin/historias/${storyId}/capitulos`)
  }

  if (loading) return <p className="text-sm text-slate-400">Cargando…</p>
  if (!story || !chapter || !draft) return <p className="text-sm text-slate-400">Capítulo no encontrado.</p>

  return (
    <div>
      <Link
        to={`/admin/historias/${storyId}/capitulos`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent-600 dark:text-slate-400"
      >
        <ArrowLeft size={14} /> {story.title}
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
          {chapter.status === 'published' ? 'Editar capítulo' : 'Nuevo capítulo'}
        </h1>
        <AutosaveIndicator status={saveStatus} savedAt={savedAt} />
      </div>

      <Card className="flex flex-col gap-6 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Título del capítulo *</label>
          <input
            value={draft.title}
            maxLength={200}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 dark:border-slate-700 dark:bg-slate-900"
          />
          <div className="mt-1 flex justify-end">
            <CharCounter value={draft.title} max={200} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Subtítulo <span className="font-normal text-slate-400">(opcional)</span>
          </label>
          <input
            value={draft.subtitle}
            onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Importar contenido</label>
          <ImportContentButton
            onImported={(html) => {
              editorRef.current?.setContent(html)
            }}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nota del autor (inicio) <span className="font-normal text-slate-400">(opcional)</span>
          </label>
          <textarea
            value={draft.authorNoteStart}
            maxLength={2000}
            rows={2}
            placeholder="Se muestra antes del capítulo (ej: contexto, agradecimientos)"
            onChange={(e) => setDraft({ ...draft, authorNoteStart: e.target.value })}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Contenido *</label>
          <ChapterEditor
            ref={editorRef}
            initialContent={draft.contentHTML}
            onUpdate={({ html, words, characters }) =>
              setDraft((prev) => (prev ? { ...prev, contentHTML: html, wordCount: words, charCount: characters } : prev))
            }
          />
          <WordCharCounter words={draft.wordCount} characters={draft.charCount} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nota del autor (final) <span className="font-normal text-slate-400">(opcional)</span>
          </label>
          <textarea
            value={draft.authorNoteEnd}
            maxLength={2000}
            rows={2}
            placeholder="Se muestra después del capítulo (ej: adelanto, comentarios)"
            onChange={(e) => setDraft({ ...draft, authorNoteEnd: e.target.value })}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => saveWithStatus('draft')}>
            Guardar borrador
          </Button>
          <Button onClick={() => saveWithStatus('published')} disabled={!draft.title.trim() || !draft.contentHTML.trim()}>
            Publicar
          </Button>
          <Link to={`/admin/historias/${storyId}/capitulos`}>
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
