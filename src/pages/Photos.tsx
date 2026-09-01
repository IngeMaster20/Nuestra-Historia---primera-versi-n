import { useEffect, useState } from 'react'
import { EmptyState } from '@/components/EmptyState'
import { listMemories } from '@/services/memories.service'
import { formatShortDate } from '@/utils/dateHelpers'
import type { Memory, Photo } from '@/types'

interface GalleryPhoto extends Photo {
  memoryTitle: string
  memoryDate: string
  memoryLocation: string | null
}

export function Photos() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<GalleryPhoto | null>(null)

  useEffect(() => {
    listMemories()
      .then((memories: Memory[]) => {
        const all: GalleryPhoto[] = memories.flatMap((m) =>
          (m.photos ?? []).map((p) => ({
            ...p,
            memoryTitle: m.title,
            memoryDate: m.date,
            memoryLocation: m.location
          }))
        )
        setPhotos(all)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-xl bg-blush/30 dark:bg-night-card" />
        ))}
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay fotos aquí"
        subtitle="Agrega fotografías a un recuerdo desde 📖 Nuestro Libro."
      />
    )
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-plum dark:text-blush">📸 Momentos</h1>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className="aspect-square overflow-hidden rounded-xl"
          >
            <img
              src={p.url}
              alt={p.description ?? ''}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-plum/90 p-4"
          onClick={() => setSelected(null)}
        >
          <img
            src={selected.url}
            alt=""
            className="max-h-[75vh] max-w-full rounded-xl object-contain"
          />
          <div className="text-center text-cream">
            <p className="font-display">{selected.memoryTitle}</p>
            <p className="text-xs opacity-80">
              {formatShortDate(selected.memoryDate)}
              {selected.memoryLocation ? ` · ${selected.memoryLocation}` : ''}
            </p>
          </div>
          <button className="text-xs text-cream underline">cerrar</button>
        </div>
      )}
    </div>
  )
}
