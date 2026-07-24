import {
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithCredential,
  linkWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './config'

const googleProvider = new GoogleAuthProvider()

/** Ensures every visitor has *some* Firebase Auth identity, silently. */
export async function ensureReaderSession(): Promise<void> {
  if (!auth.currentUser) {
    await signInAnonymously(auth)
  }
}

export async function signInAdmin(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password)
}

/**
 * Upgrades an anonymous reader session to a Google account, preserving the same uid
 * (so existing likes/comments stay attached). Falls back to a plain sign-in if the
 * Google account is already linked to a different Firebase user.
 */
export async function signInReaderWithGoogle(): Promise<void> {
  const current = auth.currentUser
  if (current?.isAnonymous) {
    try {
      await linkWithPopup(current, googleProvider)
      return
    } catch (error) {
      const code = (error as { code?: string }).code
      if (code === 'auth/credential-already-in-use') {
        const credential = GoogleAuthProvider.credentialFromError(error as Parameters<typeof GoogleAuthProvider.credentialFromError>[0])
        if (credential) {
          await signInWithCredential(auth, credential)
          return
        }
      }
      throw error
    }
  }
  await signInWithPopup(auth, googleProvider)
}

export async function signOutUser(): Promise<void> {
  await signOut(auth)
}

export async function checkIsAdmin(user: User | null): Promise<boolean> {
  if (!user) return false
  const snap = await getDoc(doc(db, 'admins', user.uid))
  return snap.exists()
}
