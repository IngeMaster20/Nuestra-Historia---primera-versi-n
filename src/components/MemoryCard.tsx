import { Link } from 'react-router-dom'
import { formatLongDate } from '@/utils/dateHelpers'
import type { Memory } from '@/types'

const categoryLabels: Record<string, string> = {
  viaje: 'Viaje',
  cita: 'Cita',
  aniversario: 'Aniversario',
  cotidiano: 'Cotidiano',
  sorpresa: 'Sorpresa',
  otro: 'Otro'
}

export function MemoryCard({ memory }: { memory: Memory }) {
  const cover = memory.photos?.[0]

  return (
    <Link
      to={`/libro/${memory.id}`}
      className="surface-card group block overflow-hidden transition-transform duration-150 hover:-translate-y-0.5"
    >
      {cover?.url && (
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={cover.url}
            alt={memory.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <span className="text-xs uppercase tracking-wide text-rose-deep dark:text-gold">
          {categoryLabels[memory.category] ?? memory.category}
        </span>
        <h3 className="mt-1 font-display text-lg text-plum dark:text-blush">{memory.title}</h3>
        <p className="mt-1 text-xs text-ink-soft dark:text-blush/50">
          {formatLongDate(memory.date)}
          {memory.location ? ` · ${memory.location}` : ''}
        </p>
        {memory.description && (
          <p className="mt-2 line-clamp-2 text-sm text-ink-soft dark:text-blush/70">
            {memory.description}
          </p>
        )}
      </div>
    </Link>
  )
}
