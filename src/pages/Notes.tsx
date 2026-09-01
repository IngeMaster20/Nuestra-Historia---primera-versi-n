import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/Toast'
import { Modal } from '@/components/Modal'
import { EmptyState } from '@/components/EmptyState'
import { NoteEnvelope } from '@/components/NoteEnvelope'
import { PhotoUploader } from '@/components/PhotoUploader'
import { listNotes, createNote, subscribeToNotes } from '@/services/notes.service'
import { uploadPhoto } from '@/services/photos.service'
import type { Note } from '@/types'

const emojis = ['❤️', '🥰', '😍', '💕', '✨', '🌸']

export function Notes() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [emoji, setEmoji] = useState('❤️')
  const [file, setFile] = useState<File | null>(null)

  function refresh() {
    setLoading(true)
    listNotes()
      .then(setNotes)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refresh()
    const unsubscribe = subscribeToNotes(refresh)
    return unsubscribe
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      const note = await createNote({
        userId: user.id,
        title,
        content,
        emoji,
        date: new Date().toISOString(),
        status: 'published'
      })
      if (file) {
        await uploadPhoto({ file, userId: user.id, noteId: note.id })
      }
      showToast('Notita enviada 💌')
      setModalOpen(false)
      setTitle('')
      setContent('')
      setFile(null)
      refresh()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Algo salió mal', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-plum dark:text-blush">💌 Notitas para ti</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          + Escribir una notita
        </button>
      </div>

      {loading ? (
        <div className="mt-8 flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-soft bg-blush/30 dark:bg-night-card" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Todavía no hay notitas"
            subtitle="Deja el primer mensaje para sorprenderle ❤️"
            actionLabel="Escribir la primera"
            onAction={() => setModalOpen(true)}
          />
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {notes.map((n) => (
            <NoteEnvelope key={n.id} note={n} />
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Escribir una notita">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="input-field"
            placeholder="Título (opcional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="input-field min-h-28"
            placeholder="Escribe lo que sientes hoy…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <div className="flex gap-2">
            {emojis.map((e) => (
              <button
                type="button"
                key={e}
                onClick={() => setEmoji(e)}
                className={`rounded-full border px-2.5 py-1 text-lg ${
                  emoji === e ? 'border-rose bg-blush/50 dark:border-gold dark:bg-night' : 'border-transparent'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <PhotoUploader multiple={false} onFilesSelected={(files) => setFile(files[0] ?? null)} uploading={saving} />
          <button type="submit" disabled={saving} className="btn-primary mt-1 disabled:opacity-60">
            {saving ? 'Enviando…' : 'Enviar notita'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
