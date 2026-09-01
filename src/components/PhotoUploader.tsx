import { useRef, useState, type DragEvent } from 'react'
import { isAllowedImage } from '@/utils/imageCompression'

interface PendingPhoto {
  file: File
  previewUrl: string
}

export function PhotoUploader({
  onFilesSelected,
  multiple = true,
  uploading = false
}: {
  onFilesSelected: (files: File[]) => void
  multiple?: boolean
  uploading?: boolean
}) {
  const [pending, setPending] = useState<PendingPhoto[]>([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return
    const valid = Array.from(fileList).filter(isAllowedImage)
    if (valid.length === 0) return
    const next = valid.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))
    setPending((prev) => [...prev, ...next])
    onFilesSelected(valid)
  }

  function removePending(index: number) {
    setPending((prev) => prev.filter((_, i) => i !== index))
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          dragOver
            ? 'border-rose bg-blush/30 dark:border-gold dark:bg-night'
            : 'border-rose/30 dark:border-gold/25'
        }`}
      >
        <span className="text-2xl">📷</span>
        <p className="text-sm text-ink-soft dark:text-blush/70">
          Toca para elegir fotos o arrástralas aquí
        </p>
        <p className="text-xs text-ink-soft/70 dark:text-blush/40">JPG, PNG o WEBP · máx. 10MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {pending.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {pending.map((p, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl">
              <img src={p.previewUrl} alt="" className="h-full w-full object-cover" />
              {uploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-plum/40">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-cream border-t-transparent" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => removePending(i)}
                  className="absolute right-1 top-1 rounded-full bg-plum/70 px-1.5 py-0.5 text-xs text-cream"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
