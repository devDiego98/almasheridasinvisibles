export type ChapterStatus = 'draft' | 'published'

export interface Chapter {
  id: string
  storyId: string
  title: string
  subtitle: string | null
  order: number
  contentHTML: string
  authorNoteStart: string | null
  authorNoteEnd: string | null
  wordCount: number
  charCount: number
  status: ChapterStatus
  viewCount: number
  likeCount: number
  commentCount: number
  publishedAt: number | null
  createdAt: number
  updatedAt: number
}

export type ChapterInput = Pick<
  Chapter,
  'title' | 'subtitle' | 'contentHTML' | 'authorNoteStart' | 'authorNoteEnd' | 'wordCount' | 'charCount' | 'status'
>
