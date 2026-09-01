import { Outlet, Link } from 'react-router-dom'
import { Nav } from '@/components/Nav'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useAuth } from '@/hooks/useAuth'

export function AppLayout() {
  const { isDark, toggle } = useDarkMode()
  const { profile, signOut } = useAuth()

  return (
    <div className="flex min-h-screen bg-cream dark:bg-night">
      <Nav />
      <div className="flex min-h-screen w-full flex-col">
        <header className="flex items-center justify-between border-b border-rose/15 px-5 py-3 dark:border-gold/10">
          <Link to="/" className="font-display text-base text-plum md:hidden dark:text-blush">
            Nuestro rincón ❤️
          </Link>
          <span className="hidden text-sm text-ink-soft md:inline dark:text-blush/60">
            Hola, {profile?.name ?? '...'} ❤️
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Cambiar tema"
              className="rounded-full p-2 text-lg hover:bg-blush/40 dark:hover:bg-night-card"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <Link
              to="/configuracion"
              className="rounded-full p-2 text-lg hover:bg-blush/40 dark:hover:bg-night-card"
              aria-label="Configuración"
            >
              ⚙️
            </Link>
            <button
              onClick={signOut}
              className="hidden text-xs text-ink-soft underline md:inline dark:text-blush/50"
            >
              cerrar sesión
            </button>
          </div>
        </header>
        <main className="flex-1 px-5 py-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
