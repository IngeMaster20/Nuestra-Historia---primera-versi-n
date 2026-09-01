import { useDarkMode } from '@/hooks/useDarkMode'
import { useAuth } from '@/hooks/useAuth'

export function Settings() {
  const { isDark, toggle } = useDarkMode()
  const { profile, user, signOut } = useAuth()

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 font-display text-2xl text-plum dark:text-blush">⚙️ Configuración</h1>

      <div className="surface-card flex flex-col gap-4 p-5">
        <div>
          <p className="text-xs text-ink-soft dark:text-blush/50">Nombre</p>
          <p className="text-ink dark:text-blush">{profile?.name}</p>
        </div>
        <div>
          <p className="text-xs text-ink-soft dark:text-blush/50">Correo</p>
          <p className="text-ink dark:text-blush">{user?.email}</p>
        </div>
        <div className="flex items-center justify-between border-t border-rose/15 pt-4 dark:border-gold/10">
          <span className="text-sm text-ink dark:text-blush">Modo oscuro</span>
          <button
            onClick={toggle}
            className={`h-7 w-12 rounded-full transition-colors ${
              isDark ? 'bg-gold' : 'bg-rose/30'
            }`}
          >
            <span
              className={`block h-5 w-5 rounded-full bg-paper transition-transform ${
                isDark ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <button onClick={signOut} className="btn-secondary mt-6 w-full">
        Cerrar sesión
      </button>
    </div>
  )
}
