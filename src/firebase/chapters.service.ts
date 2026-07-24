import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  writeBatch,
  query,
  where,
  orderBy,
  increment,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from './config'
import type { Chapter, ChapterInput } from '../types/chapter'

function chaptersCol(storyId: string) {
  return collection(db, 'stories', storyId, 'chapters')
}

function fromDoc(storyId: string, snap: QueryDocumentSnapshot<DocumentData>): Chapter {
  const data = snap.data()
  return {
    id: snap.id,
    storyId,
    title: data.title,
    subtitle: data.subtitle ?? null,
    order: data.order ?? 0,
    contentHTML: data.contentHTML ?? '',
    authorNoteStart: data.authorNoteStart ?? null,
    authorNoteEnd: data.authorNoteEnd ?? null,
    wordCount: data.wordCount ?? 0,
    charCount: data.charCount ?? 0,
    status: data.status,
    viewCount: data.viewCount ?? 0,
    likeCount: data.likeCount ?? 0,
    commentCount: data.commentCount ?? 0,
    publishedAt: data.publishedAt ?? null,
    createdAt: data.createdAt ?? 0,
    updatedAt: data.updatedAt ?? 0,
  }
}

export async function listAllChapters(storyId: string): Promise<Chapter[]> {
  const q = query(chaptersCol(storyId), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => fromDoc(storyId, d))
}

export async function listPublishedChapters(storyId: string): Promise<Chapter[]> {
  const q = query(chaptersCol(storyId), where('status', '==', 'published'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => fromDoc(storyId, d))
}

export async function getChapter(storyId: string, chapterId: string): Promise<Chapter | null> {
  const snap = await getDoc(doc(chaptersCol(storyId), chapterId))
  return snap.exists() ? fromDoc(storyId, snap as QueryDocumentSnapshot<DocumentData>) : null
}

export async function createChapter(storyId: string, input: ChapterInput): Promise<Chapter> {
  const existing = await getDocs(chaptersCol(storyId))
  const nextOrder = existing.size
  const ref = doc(chaptersCol(storyId))
  const now = Date.now()

  const data = {
    ...input,
    order: nextOrder,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    publishedAt: input.status === 'published' ? now : null,
    createdAt: now,
    updatedAt: now,
  }

  const batch = writeBatch(db)
  batch.set(ref, data)
  batch.update(doc(db, 'stories', storyId), {
    chapterCount: increment(1),
    publishedChapterCount: increment(input.status === 'published' ? 1 : 0),
    updatedAt: now,
  })
  await batch.commit()

  return { id: ref.id, storyId, ...data }
}

export async function updateChapter(
  storyId: string,
  chapterId: string,
  input: Partial<ChapterInput>,
  previousStatus: Chapter['status'],
): Promise<void> {
  const now = Date.now()
  const chapterRef = doc(chaptersCol(storyId), chapterId)
  const storyRef = doc(db, 'stories', storyId)

  const becomingPublished = input.status === 'published' && previousStatus !== 'published'
  const becomingDraft = input.status === 'draft' && previousStatus === 'published'

  const batch = writeBatch(db)
  batch.update(chapterRef, {
    ...input,
    ...(becomingPublished ? { publishedAt: now } : {}),
    updatedAt: now,
  })

  if (becomingPublished || becomingDraft) {
    batch.update(storyRef, {
      publishedChapterCount: increment(becomingPublished ? 1 : -1),
      updatedAt: now,
    })
  }

  await batch.commit()
}

export async function deleteChapter(storyId: string, chapterId: string, status: Chapter['status']): Promise<void> {
  const batch = writeBatch(db)
  batch.delete(doc(chaptersCol(storyId), chapterId))
  batch.update(doc(db, 'stories', storyId), {
    chapterCount: increment(-1),
    publishedChapterCount: increment(status === 'published' ? -1 : 0),
    updatedAt: Date.now(),
  })
  await batch.commit()
}

export async function incrementChapterViewCount(storyId: string, chapterId: string): Promise<void> {
  await updateDoc(doc(chaptersCol(storyId), chapterId), { viewCount: increment(1) })
}

export function hasViewedChapterThisSession(chapterId: string): boolean {
  return sessionStorage.getItem(`viewed-chapter-${chapterId}`) === '1'
}

export function markChapterViewedThisSession(chapterId: string): void {
  sessionStorage.setItem(`viewed-chapter-${chapterId}`, '1')
}

/** Creates a fresh, empty draft chapter doc up front so the editor has an id to autosave against. */
export async function createDraftChapter(storyId: string): Promise<Chapter> {
  return createChapter(storyId, {
    title: '',
    subtitle: null,
    contentHTML: '',
    authorNoteStart: null,
    authorNoteEnd: null,
    wordCount: 0,
    charCount: 0,
    status: 'draft',
  })
}
