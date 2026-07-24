import { Heart } from 'lucide-react'

interface LikeButtonProps {
  liked: boolean
  count: number
  onToggle: () => void
  disabled?: boolean
}

export function LikeButton({ liked, count, onToggle, disabled }: LikeButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
        liked
          ? 'border-accent-500 bg-accent-50 text-accent-600 dark:bg-accent-950'
          : 'border-slate-200 text-slate-500 hover:border-accent-300 dark:border-slate-700 dark:text-slate-400'
      }`}
    >
      <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
      {count}
    </button>
  )
}
