const COVER_WIDTH = 800
const COVER_HEIGHT = 1200
const AVATAR_SIZE = 400

/**
 * Resizes and center-crops an image file to fixed target dimensions (object-fit: cover
 * behavior), returning a JPEG blob ready to upload. Uses createImageBitmap so large
 * phone-camera photos aren't fully decoded before downscaling.
 */
async function cropResizeImage(file: File, targetWidth: number, targetHeight: number): Promise<Blob> {
  const sourceBitmap = await createImageBitmap(file)
  const sourceRatio = sourceBitmap.width / sourceBitmap.height
  const targetRatio = targetWidth / targetHeight

  let sx = 0
  let sy = 0
  let sw = sourceBitmap.width
  let sh = sourceBitmap.height

  if (sourceRatio > targetRatio) {
    sw = sourceBitmap.height * targetRatio
    sx = (sourceBitmap.width - sw) / 2
  } else {
    sh = sourceBitmap.width / targetRatio
    sy = (sourceBitmap.height - sh) / 2
  }

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo procesar la imagen en este navegador.')

  ctx.drawImage(sourceBitmap, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight)
  sourceBitmap.close()

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('No se pudo generar la imagen.'))),
      'image/jpeg',
      0.88,
    )
  })
}

export function resizeCoverImage(file: File): Promise<Blob> {
  return cropResizeImage(file, COVER_WIDTH, COVER_HEIGHT)
}

export function resizeAvatarImage(file: File): Promise<Blob> {
  return cropResizeImage(file, AVATAR_SIZE, AVATAR_SIZE)
}
