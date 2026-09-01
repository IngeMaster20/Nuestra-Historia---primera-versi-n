export interface Profile {
  id: string
  name: string
  avatar_url: string | null
  created_at: string
}

export type MemoryCategory =
  | 'viaje'
  | 'cita'
  | 'aniversario'
  | 'cotidiano'
  | 'sorpresa'
  | 'otro'

export interface Memory {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  category: MemoryCategory
  created_by: string
  created_at: string
  updated_at: string
  photos?: Photo[]
  author?: Profile
}

export interface Photo {
  id: string
  memory_id: string | null
  note_id: string | null
  user_id: string
  storage_path: string
  description: string | null
  created_at: string
  url?: string
}

export type NoteStatus = 'draft' | 'published'

export interface Note {
  id: string
  user_id: string
  title: string | null
  content: string
  emoji: string | null
  date: string
  status: NoteStatus
  created_at: string
  updated_at: string
  author?: Profile
  photo?: Photo | null
  reactions?: Reaction[]
}

export type ReactionType = 'heart' | 'love' | 'wow' | 'kiss'

export interface Reaction {
  id: string
  note_id: string
  user_id: string
  reaction: ReactionType
  created_at: string
}

export interface ImportantDate {
  id: string
  title: string
  date: string
  description: string | null
  photo_id: string | null
  created_by: string
  photo?: Photo | null
}
