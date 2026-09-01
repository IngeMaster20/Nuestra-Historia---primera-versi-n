import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/components/Toast'
import { getMemory, deleteMemory } from '@/services/memories.service'
import { formatLongDate } from '@/utils/dateHelpers'
import type { Memory } from '@/types'

export function MemoryDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [memory, setMemory] = useState<Memory | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!id) return
    getMemory(id)
      .then(setMemory)
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    if (!id) return
    await deleteMemory(id)
    showToast('Recuerdo eliminado')
    navigate('/libro')
  }

  if (loading) {
    return <div className="h-64 animate-pulse rounded-soft bg-blush/30 dark:bg-night-card" />
  }
  if (!memory) return <p>No encontramos ese recuerdo.</p>

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate('/libro')}
        className="mb-4 text-sm text-ink-soft underline dark:text-blush/50"
      >
        ← volver al libro
      </button>

      <span className="text-xs uppercase tracking-wide text-rose-deep dark:text-gold">
        {memory.category}
      </span>
      <h1 className="mt-1 font-display text-2xl text-plum dark:text-blush">{memory.title}</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-blush/50">
        📅 {formatLongDate(memory.date)} {memory.location && `· 📍 ${memory.location}`}
      </p>
      {memory.description && (
        <p className="mt-4 whitespace-pre-wrap text-ink dark:text-blush/90">
          {memory.description}
        </p>
      )}

      {memory.photos && memory.photos.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {memory.photos.map((p) => (
            <img
              key={p.id}
              src={p.url}
              alt={p.description ?? ''}
              loading="lazy"
              className="aspect-square w-full rounded-xl object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-8 border-t border-rose/15 pt-4 dark:border-gold/10">
        {confirmDelete ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink-soft dark:text-blush/60">¿Eliminar este recuerdo?</span>
            <button onClick={handleDelete} className="text-sm text-rose-deep underline">
              Sí, eliminar
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-sm text-ink-soft underline dark:text-blush/50"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-sm text-ink-soft underline dark:text-blush/40"
          >
            Eliminar recuerdo
          </button>
        )}
      </div>
    </div>
  )
}
