import type { ReactNode } from 'react'

export function Modal({
  open,
  onClose,
  title,
  children
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-plum/40 backdrop-blur-sm sm:items-center">
      <div
        className="animate-floatIn max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-soft bg-paper p-6 sm:rounded-soft dark:bg-night-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-plum dark:text-blush">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full p-1.5 text-ink-soft hover:bg-blush/40 dark:text-blush/60 dark:hover:bg-night"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
