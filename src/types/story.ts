export type StoryType = 'original' | 'fanfic'

export type StoryStatus = 'in_progress' | 'completed' | 'hiatus'

export const GENRES = [
  'Acción',
  'Adulto',
  'Aventura',
  'Ciencia Ficción',
  'Comedia',
  'Drama',
  'Fantasía',
  'Histórico',
  'Juvenil',
  'LGBTIQ+',
  'Misterio',
  'Romance',
  'Suspenso',
  'Terror',
] as const

export type Genre = (typeof GENRES)[number]

export const MAX_GENRES = 5
export const MAX_TAGS = 10

export interface Story {
  id: string
  title: string
  slug: string
  synopsis: string
  coverURL: string | null
  storyType: StoryType
  genres: string[]
  tags: string[]
  isAdultContent: boolean
  commentsEnabled: boolean
  status: StoryStatus
  published: boolean
  chapterCount: number
  publishedChapterCount: number
  viewCount: number
  likeCount: number
  authorUid: string
  createdAt: number
  updatedAt: number
}

export type StoryInput = Pick<
  Story,
  | 'title'
  | 'synopsis'
  | 'storyType'
  | 'genres'
  | 'tags'
  | 'isAdultContent'
  | 'commentsEnabled'
  | 'status'
  | 'published'
>
