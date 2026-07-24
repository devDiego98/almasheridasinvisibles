import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './config'
import { DEFAULT_PROFILE, type Profile } from '../types/profile'

const profileRef = doc(db, 'profile', 'main')

export async function getProfile(): Promise<Profile> {
  const snap = await getDoc(profileRef)
  if (!snap.exists()) return DEFAULT_PROFILE
  return { ...DEFAULT_PROFILE, ...snap.data() } as Profile
}

export async function saveProfile(profile: Profile): Promise<void> {
  await setDoc(profileRef, profile, { merge: true })
}
