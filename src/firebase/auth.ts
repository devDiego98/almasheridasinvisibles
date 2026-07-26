import {
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithCredential,
  linkWithPopup,
  GoogleAuthProvider,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  signOut,
  updateProfile,
  type User,
  type UserCredential,
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
 * linkWithPopup/signInWithCredential don't always copy the Google profile's
 * displayName/photoURL onto the top-level User record — only providerData gets it
 * reliably. Backfill from providerData so the rest of the app can just read
 * user.photoURL / user.displayName.
 */
async function syncProfileFromGoogle(user: User): Promise<void> {
  const googleInfo = user.providerData.find((p) => p.providerId === 'google.com')
  if (!googleInfo) return
  const nextPhotoURL = user.photoURL || googleInfo.photoURL
  const nextDisplayName = user.displayName || googleInfo.displayName
  if (nextPhotoURL !== user.photoURL || nextDisplayName !== user.displayName) {
    await updateProfile(user, { photoURL: nextPhotoURL, displayName: nextDisplayName })
  }
}

/**
 * Upgrades an anonymous reader session to a Google account, preserving the same uid
 * (so existing likes/comments stay attached). Falls back to a plain sign-in if the
 * Google account is already linked to a different Firebase user.
 */
export async function signInReaderWithGoogle(): Promise<void> {
  const current = auth.currentUser
  let credential: UserCredential
  if (current?.isAnonymous) {
    try {
      credential = await linkWithPopup(current, googleProvider)
    } catch (error) {
      const code = (error as { code?: string }).code
      if (code === 'auth/credential-already-in-use') {
        const existingCredential = GoogleAuthProvider.credentialFromError(
          error as Parameters<typeof GoogleAuthProvider.credentialFromError>[0],
        )
        if (existingCredential) {
          credential = await signInWithCredential(auth, existingCredential)
        } else {
          throw error
        }
      } else {
        throw error
      }
    }
  } else {
    credential = await signInWithPopup(auth, googleProvider)
  }
  await syncProfileFromGoogle(credential.user)
}

export async function signOutUser(): Promise<void> {
  await signOut(auth)
}

export async function checkIsAdmin(user: User | null): Promise<boolean> {
  if (!user) return false
  const snap = await getDoc(doc(db, 'admins', user.uid))
  return snap.exists()
}

/** Changing a password is a "sensitive" operation — Firebase requires re-proving identity first. */
export async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<void> {
  const user = auth.currentUser
  if (!user?.email) throw new Error('No hay sesión activa.')
  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)
  await updatePassword(user, newPassword)
}
