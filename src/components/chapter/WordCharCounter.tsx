interface WordCharCounterProps {
  words: number
  characters: number
}

export function WordCharCounter({ words, characters }: WordCharCounterProps) {
  return (
    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
      {words} palabra{words === 1 ? '' : 's'} · {characters} caracter{characters === 1 ? '' : 'es'}
    </p>
  )
}
