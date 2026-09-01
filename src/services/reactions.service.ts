import { supabase } from '@/lib/supabase'
import type { ReactionType } from '@/types'

export async function toggleReaction(noteId: string, userId: string, reaction: ReactionType) {
  const { data: existing } = await supabase
    .from('reactions')
    .select('id, reaction')
    .eq('note_id', noteId)
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    if (existing.reaction === reaction) {
      await supabase.from('reactions').delete().eq('id', existing.id)
      return
    }
    await supabase.from('reactions').update({ reaction }).eq('id', existing.id)
    return
  }

  await supabase.from('reactions').insert({ note_id: noteId, user_id: userId, reaction })
}
