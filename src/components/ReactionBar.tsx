import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { toggleReaction } from '@/services/reactions.service'
import type { Reaction, ReactionType } from '@/types'

const options: { type: ReactionType; emoji: string }[] = [
  { type: 'heart', emoji: '❤️' },
  { type: 'love', emoji: '🥰' },
  { type: 'wow', emoji: '😍' },
  { type: 'kiss', emoji: '💕' }
]

export function ReactionBar({
  noteId,
  initialReactions
}: {
  noteId: string
  initialReactions: Reaction[]
}) {
  const { user, profile } = useAuth()
  const [reactions, setReactions] = useState(initialReactions)

  const myReaction = reactions.find((r) => r.user_id === user?.id)

  async function handleClick(type: ReactionType) {
    if (!user) return
    const isSame = myReaction?.reaction === type
    setReactions((prev) => {
      const withoutMine = prev.filter((r) => r.user_id !== user.id)
      if (isSame) return withoutMine
      return [
        ...withoutMine,
        { id: crypto.randomUUID(), note_id: noteId, user_id: user.id, reaction: type, created_at: new Date().toISOString() }
      ]
    })
    await toggleReaction(noteId, user.id, type)
  }

  return (
    <div className="flex items-center gap-2">
      {options.map((opt) => {
        const count = reactions.filter((r) => r.reaction === opt.type).length
        const active = myReaction?.reaction === opt.type
        return (
          <button
            key={opt.type}
            onClick={() => handleClick(opt.type)}
            title={active ? `Tú (${profile?.name})` : undefined}
            className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-sm transition-colors ${
              active
                ? 'border-rose bg-blush/60 dark:border-gold dark:bg-night'
                : 'border-rose/20 hover:bg-blush/30 dark:border-gold/15 dark:hover:bg-night'
            }`}
          >
            <span>{opt.emoji}</span>
            {count > 0 && <span className="text-xs text-ink-soft dark:text-blush/60">{count}</span>}
          </button>
        )
      })}
    </div>
  )
}
