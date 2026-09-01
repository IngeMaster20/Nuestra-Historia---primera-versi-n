import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/Toast'
import { Modal } from '@/components/Modal'
import { EmptyState } from '@/components/EmptyState'
import { MemoryCard } from '@/components/MemoryCard'
import { PhotoUploader } from '@/components/PhotoUploader'
import { listMemories, createMemory } from '@/services/memories.service'
import { uploadPhoto } from '@/services/photos.service'
import type { Memory, MemoryCategory } from '@/types'

const categories: { value: MemoryCategory; label: string }[] = [
  { value: 'viaje', label: 'Viaje' },
  { value: 'cita', label: 'Cita' },
  { value: 'aniversario', label: 'Aniversario' },
  { value: 'cotidiano', label: 'Cotidiano' },
  { value: 'sorpresa', label: 'Sorpresa' },
  { value: 'otro', label: 'Otro' }
]

export function Book() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState<MemoryCategory>('cotidiano')
  const [files, setFiles] = useState<File[]>([])

  function refresh() {
    setLoading(true)
    listMemories()
      .then(setMemories)
      .finally(() => setLoading(false))
  }

  useEffect(refresh, [])

  function resetForm() {
    setTitle('')
    setDescription('')
    setDate('')
    setLocation('')
    setCategory('cotidiano')
    setFiles([])
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      const memory = await createMemory({
        title,
        description,
        date,
        location,
        category,
        createdBy: user.id
      })
      await Promise.all(
        files.map((file) => uploadPhoto({ file, userId: user.id, memoryId: memory.id }))
      )
      showToast('Recuerdo guardado ❤️')
      setModalOpen(false)
      resetForm()
      refresh()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Algo salió mal', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-plum dark:text-blush">📖 Nuestro Libro</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          + Nuevo recuerdo
        </button>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-soft bg-blush/30 dark:bg-night-card" />
          ))}
        </div>
      ) : memories.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Nuestro libro todavía tiene páginas en blanco…"
            subtitle="¿Creamos nuestro primer recuerdo? ❤️"
            actionLabel="Crear el primero"
            onAction={() => setModalOpen(true)}
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {memories.map((m) => (
            <MemoryCard key={m.id} memory={m} />
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo recuerdo">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="input-field"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value as MemoryCategory)}
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <input
            className="input-field"
            placeholder="Lugar"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <textarea
            className="input-field min-h-24"
            placeholder="Cuéntanos qué pasó ese día…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <PhotoUploader onFilesSelected={setFiles} uploading={saving} />
          <button type="submit" disabled={saving} className="btn-primary mt-1 disabled:opacity-60">
            {saving ? 'Guardando…' : 'Guardar recuerdo'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
