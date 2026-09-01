import { supabase } from '@/lib/supabase'
import { attachSignedUrls } from '@/services/photos.service'
import type { ImportantDate } from '@/types'

export async function listImportantDates(): Promise<ImportantDate[]> {
  const { data, error } = await supabase
    .from('important_dates')
    .select('*, photo:photos(*)')
    .order('date', { ascending: true })
  if (error) throw error
  const dates = (data ?? []) as unknown as ImportantDate[]
  return Promise.all(
    dates.map(async (d) => ({
      ...d,
      photo: d.photo ? (await attachSignedUrls([d.photo]))[0] : null
    }))
  )
}

export async function createImportantDate(input: {
  title: string
  date: string
  description: string
  createdBy: string
}): Promise<ImportantDate> {
  const { data, error } = await supabase
    .from('important_dates')
    .insert({
      title: input.title,
      date: input.date,
      description: input.description,
      created_by: input.createdBy
    })
    .select()
    .single()
  if (error) throw error
  return data as ImportantDate
}

export async function deleteImportantDate(id: string): Promise<void> {
  const { error } = await supabase.from('important_dates').delete().eq('id', id)
  if (error) throw error
}
