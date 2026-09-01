import { supabase } from '@/lib/supabase'
import { compressImage, isAllowedImage } from '@/utils/imageCompression'
import type { Photo } from '@/types'

const BUCKET = 'memory-photos'
const SIGNED_URL_TTL_SECONDS = 60 * 60 // 1 hora

export async function uploadPhoto(params: {
  file: File
  userId: string
  memoryId?: string
  noteId?: string
  description?: string
}): Promise<Photo> {
  const { file, userId, memoryId, noteId, description } = params

  if (!isAllowedImage(file)) {
    throw new Error('Formato o tamaño de imagen no permitido (JPG, PNG o WEBP, máx. 10MB).')
  }

  const compressed = await compressImage(file)
  const ext = compressed.type === 'image/webp' ? 'webp' : file.name.split('.').pop()
  const path = `${userId}/${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, compressed, {
    contentType: compressed.type,
    upsert: false
  })
  if (uploadError) throw uploadError

  const { data, error } = await supabase
    .from('photos')
    .insert({
      storage_path: path,
      user_id: userId,
      memory_id: memoryId ?? null,
      note_id: noteId ?? null,
      description: description ?? null
    })
    .select()
    .single()

  if (error) throw error
  return data as Photo
}

export async function getSignedUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS)
  if (error || !data) return ''
  return data.signedUrl
}

export async function deletePhoto(photo: Photo): Promise<void> {
  await supabase.storage.from(BUCKET).remove([photo.storage_path])
  await supabase.from('photos').delete().eq('id', photo.id)
}

export async function attachSignedUrls(photos: Photo[]): Promise<Photo[]> {
  return Promise.all(
    photos.map(async (p) => ({ ...p, url: await getSignedUrl(p.storage_path) }))
  )
}
