import type { StoryType } from '../../types/story'

interface StoryTypeOption {
  value: StoryType
  title: string
  description: string
}

const OPTIONS: StoryTypeOption[] = [
  { value: 'original', title: 'Original', description: 'Historia de tu autoría' },
  { value: 'fanfic', title: 'Fanfic', description: 'Basada en obras de terceros' },
]

interface StoryTypeSelectorProps {
  value: StoryType
  onChange: (value: StoryType) => void
}

export function StoryTypeSelector({ value, onChange }: StoryTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-xl border p-3 text-left transition-colors ${
            value === option.value
              ? 'border-accent-500 bg-accent-50 dark:bg-accent-950'
              : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
          }`}
        >
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{option.title}</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{option.description}</p>
        </button>
      ))}
      <div className="rounded-xl border border-dashed border-slate-200 p-3 text-left opacity-50 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Ilustrada original</p>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Próximamente</p>
      </div>
      <div className="rounded-xl border border-dashed border-slate-200 p-3 text-left opacity-50 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Ilustrada fanfic</p>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Próximamente</p>
      </div>
    </div>
  )
}
