import type { ReactNode } from 'react'

interface ChipProps {
  children: ReactNode
  selected?: boolean
  onClick?: () => void
  removable?: boolean
  onRemove?: () => void
  className?: string
}

export function Chip({ children, selected, onClick, removable, onRemove, className = '' }: ChipProps) {
  const interactive = !!onClick
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        selected
          ? 'bg-accent-500 text-white'
          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
      } ${interactive ? 'cursor-pointer select-none' : ''} ${className}`}
    >
      {children}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className="ml-1 leading-none opacity-70 hover:opacity-100"
          aria-label="Quitar"
        >
          ×
        </button>
      )}
    </span>
  )
}
