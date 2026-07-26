import { collection, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore'
import { db } from './config'
import type { ReadHistoryEntry } from '../types/history'

function historyCol(uid: string) {
  return collection(db, 'users', uid, 'readChapters')
}

/** Records (or bumps) a chapter as read for this reader — merge keeps one entry per chapter. */
export async function recordChapterRead(uid: string, entry: Omit<ReadHistoryEntry, 'readAt'>): Promise<void> {
  await setDoc(doc(historyCol(uid), entry.chapterId), { ...entry, readAt: Date.now() }, { merge: true })
}

export async function listReadingHistory(uid: string, max = 50): Promise<ReadHistoryEntry[]> {
  const q = query(historyCol(uid), orderBy('readAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.slice(0, max).map((d) => d.data() as ReadHistoryEntry)
}
