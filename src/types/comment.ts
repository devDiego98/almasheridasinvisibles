export interface Comment {
  id: string
  authorUid: string
  authorDisplayName: string
  authorPhotoURL: string | null
  text: string
  createdAt: number
}
