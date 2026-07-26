import { collection, doc, getDoc, getDocs, writeBatch, increment } from 'firebase/firestore'
import { db } from './config'

function storyLikeRef(storyId: string, uid: string) {
  return doc(db, 'stories', storyId, 'likes', uid)
}

function chapterLikeRef(storyId: string, chapterId: string, uid: string) {
  return doc(db, 'stories', storyId, 'chapters', chapterId, 'likes', uid)
}

function favoriteStoryRef(uid: string, storyId: string) {
  return doc(db, 'users', uid, 'favoriteStories', storyId)
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
    batch.delete(favoriteStoryRef(uid, storyId))
    batch.update(storyRef, { likeCount: increment(-1) })
  } else {
    const now = Date.now()
    batch.set(storyLikeRef(storyId, uid), { createdAt: now })
    batch.set(favoriteStoryRef(uid, storyId), { createdAt: now })
    batch.update(storyRef, { likeCount: increment(1) })
  }
  await batch.commit()
}

/** Story IDs the reader has favorited (liked), most recent first. */
export async function listFavoriteStoryIds(uid: string): Promise<string[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'favoriteStories'))
  return snap.docs
    .sort((a, b) => (b.data().createdAt ?? 0) - (a.data().createdAt ?? 0))
    .map((d) => d.id)
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
