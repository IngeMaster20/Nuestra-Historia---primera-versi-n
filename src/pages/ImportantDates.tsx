import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/Toast'
import { Modal } from '@/components/Modal'
import { EmptyState } from '@/components/EmptyState'
import { listImportantDates, createImportantDate, deleteImportantDate } from '@/services/dates.service'
import { daysUntilNextOccurrence, formatLongDate } from '@/utils/dateHelpers'
import type { ImportantDate } from '@/types'

export function ImportantDates() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [dates, setDates] = useState<ImportantDate[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')

  function refresh() {
    setLoading(true)
    listImportantDates()
      .then(setDates)
      .finally(() => setLoading(false))
  }

  useEffect(refresh, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      await createImportantDate({ title, date, description, createdBy: user.id })
      showToast('Fecha guardada ❤️')
      setModalOpen(false)
      setTitle('')
      setDate('')
      setDescription('')
      refresh()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Algo salió mal', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    await deleteImportantDate(id)
    refresh()
  }

  const sorted = [...dates].sort(
    (a, b) => daysUntilNextOccurrence(a.date) - daysUntilNextOccurrence(b.date)
  )

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-plum dark:text-blush">
          📅 Fechas que queremos recordar
        </h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          + Agregar
        </button>
      </div>

      {loading ? (
        <div className="mt-8 flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-soft bg-blush/30 dark:bg-night-card" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Aún no hay fechas guardadas"
            subtitle="Agrega cumpleaños, aniversarios o cualquier fecha especial."
            actionLabel="Agregar la primera"
            onAction={() => setModalOpen(true)}
          />
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {sorted.map((d) => (
            <div key={d.id} className="surface-card flex items-center justify-between p-4">
              <div>
                <p className="font-display text-lg text-plum dark:text-blush">{d.title}</p>
                <p className="text-xs text-ink-soft dark:text-blush/50">{formatLongDate(d.date)}</p>
                {d.description && (
                  <p className="mt-1 text-sm text-ink-soft dark:text-blush/70">{d.description}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-full bg-blush/60 px-3 py-1 text-xs text-rose-deep dark:bg-night dark:text-gold">
                  faltan {daysUntilNextOccurrence(d.date)} días
                </span>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="text-xs text-ink-soft underline dark:text-blush/40"
                >
                  eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva fecha importante">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="input-field"
            placeholder="Título (ej. Su cumpleaños)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="date"
            className="input-field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <textarea
            className="input-field min-h-20"
            placeholder="Descripción (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" disabled={saving} className="btn-primary mt-1 disabled:opacity-60">
            {saving ? 'Guardando…' : 'Guardar fecha'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
