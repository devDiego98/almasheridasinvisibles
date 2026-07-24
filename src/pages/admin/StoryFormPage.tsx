import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { CharCounter } from '../../components/ui/CharCounter'
import { CoverUploader } from '../../components/story/CoverUploader'
import { StoryTypeSelector } from '../../components/story/StoryTypeSelector'
import { GenreChipSelect } from '../../components/story/GenreChipSelect'
import { TagInput } from '../../components/story/TagInput'
import { MAX_GENRES, MAX_TAGS, type StoryStatus } from '../../types/story'
import { useAuth } from '../../contexts/AuthContext'
import { getProfile } from '../../firebase/profile.service'
import { createStory, getStory, setStoryCover, updateStory } from '../../firebase/stories.service'
import { uploadStoryCover } from '../../services/cloudinary.service'

const schema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(200),
  synopsis: z.string().max(2000),
  storyType: z.enum(['original', 'fanfic']),
  genres: z.array(z.string()).max(MAX_GENRES),
  tags: z.array(z.string()).max(MAX_TAGS),
  isAdultContent: z.boolean(),
  commentsEnabled: z.boolean(),
  status: z.enum(['in_progress', 'completed', 'hiatus']),
  published: z.boolean(),
})

type FormValues = z.infer<typeof schema>

const STATUS_OPTIONS: { value: StoryStatus; label: string }[] = [
  { value: 'in_progress', label: 'En progreso' },
  { value: 'completed', label: 'Completa' },
  { value: 'hiatus', label: 'En pausa' },
]

export function StoryFormPage() {
  const { storyId } = useParams()
  const isEdit = !!storyId
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [coverURL, setCoverURL] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      synopsis: '',
      storyType: 'original',
      genres: [],
      tags: [],
      isAdultContent: false,
      commentsEnabled: true,
      status: 'in_progress',
      published: false,
    },
  })

  useEffect(() => {
    if (isEdit) {
      getStory(storyId!).then((story) => {
        if (!story) return
        setValue('title', story.title)
        setValue('synopsis', story.synopsis)
        setValue('storyType', story.storyType)
        setValue('genres', story.genres)
        setValue('tags', story.tags)
        setValue('isAdultContent', story.isAdultContent)
        setValue('commentsEnabled', story.commentsEnabled)
        setValue('status', story.status)
        setValue('published', story.published)
        setCoverURL(story.coverURL)
        setLoading(false)
      })
    } else {
      getProfile().then((profile) => setValue('commentsEnabled', profile.defaultCommentsEnabled))
    }
  }, [isEdit, storyId, setValue])

  async function handleCoverSelected(file: File) {
    const url = await uploadStoryCover(file)
    setCoverURL(url)
    if (isEdit) {
      await setStoryCover(storyId!, url)
    }
  }

  async function onSubmit(values: FormValues) {
    if (!user) return
    setSaving(true)
    try {
      if (isEdit) {
        await updateStory(storyId!, values)
      } else {
        await createStory(values, user.uid, coverURL)
      }
      navigate('/admin')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-sm text-slate-400">Cargando…</p>

  const synopsisValue = watch('synopsis')
  const titleValue = watch('title')

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-bold text-slate-900 dark:text-white">
        {isEdit ? 'Editar historia' : 'Nueva historia'}
      </h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Título *</label>
            <input
              {...register('title')}
              maxLength={200}
              placeholder="El título de tu historia"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 dark:border-slate-700 dark:bg-slate-900"
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
              <CharCounter value={titleValue} max={200} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Sinopsis</label>
            <textarea
              {...register('synopsis')}
              maxLength={2000}
              rows={4}
              placeholder="De qué trata tu historia…"
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 dark:border-slate-700 dark:bg-slate-900"
            />
            <div className="mt-1 flex justify-end">
              <CharCounter value={synopsisValue} max={2000} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Portada <span className="font-normal text-slate-400">(opcional)</span>
            </label>
            <CoverUploader previewURL={coverURL} onFileSelected={handleCoverSelected} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de historia *</label>
            <Controller
              control={control}
              name="storyType"
              render={({ field }) => <StoryTypeSelector value={field.value} onChange={field.onChange} />}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Géneros <span className="font-normal text-slate-400">({watch('genres').length}/{MAX_GENRES})</span>
            </label>
            <Controller
              control={control}
              name="genres"
              render={({ field }) => <GenreChipSelect value={field.value} onChange={field.onChange} />}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Tags <span className="font-normal text-slate-400">({watch('tags').length}/{MAX_TAGS})</span>
            </label>
            <Controller control={control} name="tags" render={({ field }) => <TagInput value={field.value} onChange={field.onChange} />} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Estado</label>
            <select
              {...register('status')}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-400 dark:border-slate-700 dark:bg-slate-900"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input type="checkbox" {...register('isAdultContent')} className="h-4 w-4 rounded accent-accent-500" />
            Contenido +18 <span className="text-slate-400">(solo visible para usuarios adultos)</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input type="checkbox" {...register('commentsEnabled')} className="h-4 w-4 rounded accent-accent-500" />
            Permitir comentarios de lectores
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input type="checkbox" {...register('published')} className="h-4 w-4 rounded accent-accent-500" />
            Publicada <span className="text-slate-400">(visible en la página principal)</span>
          </label>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {isEdit ? 'Guardar cambios' : 'Crear historia'}
            </Button>
            <Link to="/admin">
              <Button type="button" variant="secondary">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
