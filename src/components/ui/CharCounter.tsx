interface CharCounterProps {
  value: string
  max: number
}

export function CharCounter({ value, max }: CharCounterProps) {
  const over = value.length > max
  return (
    <span className={`text-xs ${over ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
      {value.length}/{max}
    </span>
  )
}
