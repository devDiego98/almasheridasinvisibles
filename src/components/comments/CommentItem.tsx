import { User, Trash2 } from 'lucide-react'
import { formatDate } from '../../utils/dateFormat'
import type { Comment } from '../../types/comment'

interface CommentItemProps {
  comment: Comment
  canDelete: boolean
  onDelete: () => void
}

export function CommentItem({ comment, canDelete, onDelete }: CommentItemProps) {
  return (
    <div className="flex gap-3 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        {comment.authorPhotoURL ? (
          <img src={comment.authorPhotoURL} alt={comment.authorDisplayName} className="h-full w-full object-cover" />
        ) : (
          <User size={14} className="text-slate-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{comment.authorDisplayName}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
            {canDelete && (
              <button
                onClick={onDelete}
                aria-label="Eliminar comentario"
                className="text-slate-300 hover:text-red-500 dark:text-slate-600"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
        <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{comment.text}</p>
      </div>
    </div>
  )
}
