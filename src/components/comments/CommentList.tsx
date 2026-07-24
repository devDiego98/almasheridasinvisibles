import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { listComments, addComment, deleteComment } from '../../firebase/comments.service'
import { CommentForm } from './CommentForm'
import { CommentItem } from './CommentItem'
import type { Comment } from '../../types/comment'

interface CommentListProps {
  storyId: string
  chapterId: string
  commentsEnabled: boolean
}

export function CommentList({ storyId, chapterId, commentsEnabled }: CommentListProps) {
  const { user, isAdmin } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listComments(storyId, chapterId)
      .then(setComments)
      .finally(() => setLoading(false))
  }, [storyId, chapterId])

  if (!commentsEnabled) return null

  async function handleAdd(text: string) {
    if (!user) return
    await addComment(
      storyId,
      chapterId,
      {
        uid: user.uid,
        displayName: user.isAnonymous ? 'Lector anónimo' : user.displayName || 'Lector',
        photoURL: user.isAnonymous ? null : user.photoURL,
      },
      text,
    )
    setComments(await listComments(storyId, chapterId))
  }

  async function handleDelete(commentId: string) {
    await deleteComment(storyId, chapterId, commentId)
    setComments((prev) => prev.filter((c) => c.id !== commentId))
  }

  return (
    <section className="mt-10">
      <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-slate-900 dark:text-white">
        <MessageCircle size={18} /> Comentarios ({comments.length})
      </h3>
      <CommentForm onSubmit={handleAdd} />
      {loading ? (
        <p className="mt-4 text-sm text-slate-400">Cargando comentarios…</p>
      ) : (
        <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              canDelete={isAdmin || comment.authorUid === user?.uid}
              onDelete={() => handleDelete(comment.id)}
            />
          ))}
          {comments.length === 0 && <p className="py-4 text-sm text-slate-400">Sé el primero en comentar.</p>}
        </div>
      )}
    </section>
  )
}
