import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Eye, BookOpen } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { formatDate } from '../../utils/dateFormat'
import type { Story } from '../../types/story'

const STATUS_LABEL: Record<Story['status'], string> = {
  in_progress: 'En progreso',
  completed: 'Completa',
  hiatus: 'En pausa',
}

interface StoryCardProps {
  story: Story
  linkTo: string
  footerActions?: ReactNode
}

export function StoryCard({ story, linkTo, footerActions }: StoryCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex gap-4 p-4">
        <Link to={linkTo} className="shrink-0">
          <div className="flex h-28 w-20 items-center justify-center overflow-hidden rounded-lg bg-accent-100 dark:bg-accent-900">
            {story.coverURL ? (
              <img src={story.coverURL} alt={story.title} className="h-full w-full object-cover" />
            ) : (
              <BookOpen className="text-accent-400" size={28} />
            )}
          </div>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link to={linkTo} className="min-w-0">
              <h3 className="truncate font-serif text-lg font-semibold text-slate-900 hover:text-accent-600 dark:text-white">
                {story.title}
              </h3>
            </Link>
            <Badge tone="accent">{STATUS_LABEL[story.status]}</Badge>
          </div>

          <div className="mt-1 flex flex-wrap gap-1.5">
            {story.genres.slice(0, 1).map((genre) => (
              <Badge key={genre}>{genre}</Badge>
            ))}
            {story.isAdultContent && <Badge tone="warning">+18</Badge>}
          </div>

          <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Heart size={12} /> {story.likeCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye size={12} /> {story.viewCount}
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {story.publishedChapterCount} capítulo{story.publishedChapterCount === 1 ? '' : 's'} · Actualizado{' '}
            {formatDate(story.updatedAt)}
          </p>
        </div>
      </div>

      {footerActions && (
        <div className="flex flex-wrap gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
          {footerActions}
        </div>
      )}
    </Card>
  )
}
