import type { ReactNode } from 'react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blush/50 via-cream to-cream px-5 dark:from-night-card dark:via-night dark:to-night">
      <div className="animate-floatIn w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-3xl">❤️</span>
          <h1 className="mt-2 font-display text-2xl text-plum dark:text-blush">
            Bienvenidos a nuestro pequeño mundo
          </h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-blush/60">
            Solo nosotros podemos entrar aquí.
          </p>
        </div>
        <div className="surface-card p-6">{children}</div>
      </div>
    </div>
  )
}
