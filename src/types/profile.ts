export interface SocialLinks {
  instagram?: string
  tiktok?: string
  reddit?: string
  discord?: string
}

export interface Profile {
  displayName: string
  bio: string
  photoURL: string | null
  heroTitle: string
  heroSubtitle: string
  socialLinks: SocialLinks
  defaultCommentsEnabled: boolean
}

export const DEFAULT_PROFILE: Profile = {
  displayName: 'Tu nombre',
  bio: 'Escribo historias sobre almas heridas e invisibles.',
  photoURL: null,
  heroTitle: 'Historias que se quedan con vos',
  heroSubtitle: 'Bienvenido a mi rincón de relatos por capítulos.',
  socialLinks: {},
  defaultCommentsEnabled: true,
}
