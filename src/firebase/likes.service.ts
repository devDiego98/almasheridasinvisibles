import { doc, getDoc, writeBatch, increment } from 'firebase/firestore'
import { db } from './config'

function storyLikeRef(storyId: string, uid: string) {
  return doc(db, 'stories', storyId, 'likes', uid)
}

function chapterLikeRef(storyId: string, chapterId: string, uid: string) {
  return doc(db, 'stories', storyId, 'chapters', chapterId, 'likes', uid)
}

export async function hasLikedStory(storyId: string, uid: string): Promise<boolean> {
  const snap = await getDoc(storyLikeRef(storyId, uid))
  return snap.exists()
}

export async function toggleStoryLike(storyId: string, uid: string, liked: boolean): Promise<void> {
  const batch = writeBatch(db)
  const storyRef = doc(db, 'stories', storyId)
  if (liked) {
    batch.delete(storyLikeRef(storyId, uid))
    batch.update(storyRef, { likeCount: increment(-1) })
  } else {
    batch.set(storyLikeRef(storyId, uid), { createdAt: Date.now() })
    batch.update(storyRef, { likeCount: increment(1) })
  }
  await batch.commit()
}

export async function hasLikedChapter(storyId: string, chapterId: string, uid: string): Promise<boolean> {
  const snap = await getDoc(chapterLikeRef(storyId, chapterId, uid))
  return snap.exists()
}

export async function toggleChapterLike(
  storyId: string,
  chapterId: string,
  uid: string,
  liked: boolean,
): Promise<void> {
  const batch = writeBatch(db)
  const chapterRef = doc(db, 'stories', storyId, 'chapters', chapterId)
  if (liked) {
    batch.delete(chapterLikeRef(storyId, chapterId, uid))
    batch.update(chapterRef, { likeCount: increment(-1) })
  } else {
    batch.set(chapterLikeRef(storyId, chapterId, uid), { createdAt: Date.now() })
    batch.update(chapterRef, { likeCount: increment(1) })
  }
  await batch.commit()
}
