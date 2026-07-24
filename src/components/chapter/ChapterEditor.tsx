import { forwardRef, useImperativeHandle } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { EditorToolbar } from './EditorToolbar'

export interface ChapterEditorHandle {
  setContent: (html: string) => void
}

interface ChapterEditorProps {
  initialContent: string
  onUpdate: (state: { html: string; words: number; characters: number }) => void
  placeholder?: string
}

export const ChapterEditor = forwardRef<ChapterEditorHandle, ChapterEditorProps>(function ChapterEditor(
  { initialContent, onUpdate, placeholder = 'Escribí el contenido de tu capítulo…' },
  ref,
) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
      CharacterCount.configure(),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onUpdate({
        html: editor.getHTML(),
        words: editor.storage.characterCount.words(),
        characters: editor.storage.characterCount.characters(),
      })
    },
  })

  useImperativeHandle(ref, () => ({
    setContent: (html: string) => {
      editor?.commands.setContent(html, true)
      if (editor) {
        onUpdate({
          html: editor.getHTML(),
          words: editor.storage.characterCount.words(),
          characters: editor.storage.characterCount.characters(),
        })
      }
    },
  }))

  return (
    <div className="tiptap-editor rounded-xl border border-slate-200 dark:border-slate-700">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="chapter-content" />
    </div>
  )
})
