import {
  collection,
  doc,
  getDocs,
  query,
  orderBy,
  writeBatch,
  increment,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from './config'
import type { Comment } from '../types/comment'

function commentsCol(storyId: string, chapterId: string) {
  return collection(db, 'stories', storyId, 'chapters', chapterId, 'comments')
}

function fromDoc(snap: QueryDocumentSnapshot<DocumentData>): Comment {
  const data = snap.data()
  return {
    id: snap.id,
    authorUid: data.authorUid,
    authorDisplayName: data.authorDisplayName,
    authorPhotoURL: data.authorPhotoURL ?? null,
    text: data.text,
    createdAt: data.createdAt ?? 0,
  }
}

export async function listComments(storyId: string, chapterId: string): Promise<Comment[]> {
  const q = query(commentsCol(storyId, chapterId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(fromDoc)
}

export async function addComment(
  storyId: string,
  chapterId: string,
  author: { uid: string; displayName: string; photoURL: string | null },
  text: string,
): Promise<void> {
  const now = Date.now()
  const batch = writeBatch(db)
  const ref = doc(commentsCol(storyId, chapterId))
  batch.set(ref, {
    authorUid: author.uid,
    authorDisplayName: author.displayName,
    authorPhotoURL: author.photoURL,
    text,
    createdAt: now,
  })
  batch.update(doc(db, 'stories', storyId, 'chapters', chapterId), { commentCount: increment(1) })
  await batch.commit()
}

export async function deleteComment(storyId: string, chapterId: string, commentId: string): Promise<void> {
  const batch = writeBatch(db)
  batch.delete(doc(commentsCol(storyId, chapterId), commentId))
  batch.update(doc(db, 'stories', storyId, 'chapters', chapterId), { commentCount: increment(-1) })
  await batch.commit()
}
