import mammoth from 'mammoth'

/**
 * Converts an uploaded .docx or .txt file into chapter-editor-ready HTML.
 * .txt files are split on blank lines into paragraphs; .docx is converted with mammoth,
 * which preserves paragraphs and Word's built-in heading/bold/italic styles but not
 * custom fonts, colors, tables, or footnotes.
 */
export async function importContentFile(file: File): Promise<string> {
  const isDocx = file.name.toLowerCase().endsWith('.docx')

  if (isDocx) {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.convertToHtml({ arrayBuffer })
    return result.value
  }

  const text = await file.text()
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`)
    .join('')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
