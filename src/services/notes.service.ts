import { supabase } from '@/lib/supabase'
import { attachSignedUrls } from '@/services/photos.service'
import type { Note, NoteStatus } from '@/types'

export async function listNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*, author:profiles!notes_user_id_fkey(*), photo:photos(*), reactions(*)')
    .eq('status', 'published')
    .order('date', { ascending: false })
  if (error) throw error
  const notes = (data ?? []) as unknown as Note[]
  return Promise.all(
    notes.map(async (n) => ({
      ...n,
      photo: n.photo ? (await attachSignedUrls([n.photo]))[0] : null
    }))
  )
}

export async function createNote(input: {
  userId: string
  title: string
  content: string
  emoji: string
  date: string
  status: NoteStatus
}): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: input.userId,
      title: input.title || null,
      content: input.content,
      emoji: input.emoji || null,
      date: input.date,
      status: input.status
    })
    .select()
    .single()
  if (error) throw error
  return data as Note
}

export async function updateNoteStatus(id: string, status: NoteStatus): Promise<void> {
  const { error } = await supabase
    .from('notes')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) throw error
}

/** Suscripción realtime a nuevas notitas publicadas. */
export function subscribeToNotes(onChange: () => void) {
  const channel = supabase
    .channel('notes-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, onChange)
    .subscribe()
  return () => {
    supabase.removeChannel(channel)
  }
}
