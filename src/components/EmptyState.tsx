export function EmptyState({
  title,
  subtitle,
  actionLabel,
  onAction
}: {
  title: string
  subtitle: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-soft border border-dashed border-rose/30 px-6 py-16 text-center dark:border-gold/20">
      <p className="font-display text-xl text-plum dark:text-blush">{title}</p>
      <p className="max-w-xs text-sm text-ink-soft dark:text-blush/60">{subtitle}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary mt-2">
          {actionLabel}
        </button>
      )}
    </div>
  )
}
