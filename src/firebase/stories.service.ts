import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  increment,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from './config'
import { slugify } from '../utils/slugify'
import type { Story, StoryInput } from '../types/story'

const storiesCol = collection(db, 'stories')

function fromDoc(snap: QueryDocumentSnapshot<DocumentData>): Story {
  const data = snap.data()
  return {
    id: snap.id,
    title: data.title,
    slug: data.slug,
    synopsis: data.synopsis,
    coverURL: data.coverURL ?? null,
    storyType: data.storyType,
    genres: data.genres ?? [],
    tags: data.tags ?? [],
    isAdultContent: !!data.isAdultContent,
    commentsEnabled: data.commentsEnabled ?? true,
    status: data.status,
    published: !!data.published,
    chapterCount: data.chapterCount ?? 0,
    publishedChapterCount: data.publishedChapterCount ?? 0,
    viewCount: data.viewCount ?? 0,
    likeCount: data.likeCount ?? 0,
    authorUid: data.authorUid,
    createdAt: data.createdAt ?? 0,
    updatedAt: data.updatedAt ?? 0,
  }
}

export async function createStory(
  input: StoryInput,
  authorUid: string,
  coverURL: string | null = null,
): Promise<Story> {
  const ref = doc(storiesCol)
  const now = Date.now()
  const slug = `${slugify(input.title)}-${ref.id.slice(0, 6)}`

  const data = {
    ...input,
    slug,
    coverURL,
    chapterCount: 0,
    publishedChapterCount: 0,
    viewCount: 0,
    likeCount: 0,
    authorUid,
    createdAt: now,
    updatedAt: now,
  }

  await setDoc(ref, data)
  return { id: ref.id, ...data }
}

export async function updateStory(storyId: string, input: Partial<StoryInput>): Promise<void> {
  await updateDoc(doc(storiesCol, storyId), { ...input, updatedAt: Date.now() })
}

export async function setStoryCover(storyId: string, coverURL: string): Promise<void> {
  await updateDoc(doc(storiesCol, storyId), { coverURL, updatedAt: Date.now() })
}

export async function deleteStory(storyId: string): Promise<void> {
  await deleteDoc(doc(storiesCol, storyId))
}

export async function getStory(storyId: string): Promise<Story | null> {
  const snap = await getDoc(doc(storiesCol, storyId))
  return snap.exists() ? fromDoc(snap as QueryDocumentSnapshot<DocumentData>) : null
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const q = query(storiesCol, where('slug', '==', slug))
  const snap = await getDocs(q)
  if (snap.empty) return null
  return fromDoc(snap.docs[0])
}

/** All stories owned by the single admin, for the "Mis historias" dashboard. */
export async function listAllStories(): Promise<Story[]> {
  const q = query(storiesCol, orderBy('updatedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(fromDoc)
}

/** Public, published stories for the home page grid. */
export async function listPublishedStories(): Promise<Story[]> {
  const q = query(storiesCol, where('published', '==', true), orderBy('updatedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(fromDoc)
}

export async function incrementStoryViewCount(storyId: string): Promise<void> {
  await updateDoc(doc(storiesCol, storyId), { viewCount: increment(1) })
}

export function hasViewedStoryThisSession(storyId: string): boolean {
  return sessionStorage.getItem(`viewed-story-${storyId}`) === '1'
}

export function markStoryViewedThisSession(storyId: string): void {
  sessionStorage.setItem(`viewed-story-${storyId}`, '1')
}
