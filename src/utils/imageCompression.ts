import imageCompression from 'browser-image-compression'

const MAX_SIZE_MB = 1.2
const MAX_WIDTH_OR_HEIGHT = 1920

export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_UPLOAD_MB = 10

export function isAllowedImage(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type) && file.size <= MAX_UPLOAD_MB * 1024 * 1024
}

/** Comprime y redimensiona una imagen en el navegador antes de subirla. */
export async function compressImage(file: File): Promise<File> {
  try {
    return await imageCompression(file, {
      maxSizeMB: MAX_SIZE_MB,
      maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
      useWebWorker: true,
      fileType: 'image/webp'
    })
  } catch {
    // si la compresión falla, subimos el archivo original validado
    return file
  }
}
