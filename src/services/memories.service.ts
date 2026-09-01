import { supabase } from '@/lib/supabase'
import { attachSignedUrls } from '@/services/photos.service'
import type { Memory, MemoryCategory } from '@/types'

export async function listMemories(): Promise<Memory[]> {
  const { data, error } = await supabase
    .from('memories')
    .select('*, photos(*), author:profiles!memories_created_by_fkey(*)')
    .order('date', { ascending: false })

  if (error) throw error
  const memories = (data ?? []) as Memory[]
  return Promise.all(
    memories.map(async (m) => ({ ...m, photos: await attachSignedUrls(m.photos ?? []) }))
  )
}

export async function getMemory(id: string): Promise<Memory> {
  const { data, error } = await supabase
    .from('memories')
    .select('*, photos(*), author:profiles!memories_created_by_fkey(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  const memory = data as Memory
  memory.photos = await attachSignedUrls(memory.photos ?? [])
  return memory
}

export async function createMemory(input: {
  title: string
  description: string
  date: string
  location: string
  category: MemoryCategory
  createdBy: string
}): Promise<Memory> {
  const { data, error } = await supabase
    .from('memories')
    .insert({
      title: input.title,
      description: input.description,
      date: input.date,
      location: input.location,
      category: input.category,
      created_by: input.createdBy
    })
    .select()
    .single()
  if (error) throw error
  return data as Memory
}

export async function updateMemory(id: string, changes: Partial<Memory>): Promise<void> {
  const { error } = await supabase
    .from('memories')
    .update({ ...changes, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteMemory(id: string): Promise<void> {
  const { error } = await supabase.from('memories').delete().eq('id', id)
  if (error) throw error
}
