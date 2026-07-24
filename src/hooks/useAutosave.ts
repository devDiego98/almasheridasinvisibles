import { useEffect, useRef, useState } from 'react'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

/**
 * Debounces calls to `save` while `data` changes, tracking a status suitable for an
 * autosave indicator ("Guardado ✓ · HH:MM"). Skips the first render so opening an
 * editor doesn't immediately trigger a save.
 */
export function useAutosave<T>(data: T, save: (data: T) => Promise<void>, delayMs = 1500) {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const isFirstRun = useRef(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    setStatus('saving')
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      save(data)
        .then(() => {
          setStatus('saved')
          setSavedAt(Date.now())
        })
        .catch(() => setStatus('error'))
    }, delayMs)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return { status, savedAt }
}
