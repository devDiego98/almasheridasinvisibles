import { BookOpen } from 'lucide-react'
import { StoryCard } from '../story/StoryCard'
import type { Story } from '../../types/story'

interface StoryGridProps {
  stories: Story[]
  loading: boolean
}

export function StoryGrid({ stories, loading }: StoryGridProps) {
  return (
    <section id="historias" className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="mb-6 font-serif text-2xl font-bold text-slate-900 dark:text-white">Historias</h2>

      {loading && <p className="text-sm text-slate-400">Cargando historias…</p>}

      {!loading && stories.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 py-16 text-slate-400 dark:border-slate-800">
          <BookOpen size={28} />
          <p className="text-sm">Todavía no hay historias publicadas.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} linkTo={`/historia/${story.slug}`} />
        ))}
      </div>
    </section>
  )
}
