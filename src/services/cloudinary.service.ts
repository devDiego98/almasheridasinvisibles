import { resizeCoverImage, resizeAvatarImage } from '../utils/imageResize'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

async function uploadToCloudinary(blob: Blob, folder: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', blob)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('No se pudo subir la imagen.')

  const data = await res.json()
  return data.secure_url as string
}

export async function uploadStoryCover(file: File): Promise<string> {
  const blob = await resizeCoverImage(file)
  return uploadToCloudinary(blob, 'covers')
}

export async function uploadProfilePhoto(file: File): Promise<string> {
  const blob = await resizeAvatarImage(file)
  return uploadToCloudinary(blob, 'profile')
}
