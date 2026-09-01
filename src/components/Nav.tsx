import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio', icon: '🏠' },
  { to: '/libro', label: 'Libro', icon: '📖' },
  { to: '/fotos', label: 'Fotos', icon: '📸' },
  { to: '/notitas', label: 'Notitas', icon: '💌' },
  { to: '/fechas', label: 'Fechas', icon: '📅' }
]

export function Nav() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col gap-1 border-r border-rose/15 px-4 py-8 md:flex dark:border-gold/10">
        <p className="mb-6 px-3 font-display text-lg text-plum dark:text-blush">
          Nuestro rincón ❤️
        </p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-blush/60 text-plum dark:bg-night-card dark:text-gold'
                  : 'text-ink-soft hover:bg-blush/30 dark:text-blush/70 dark:hover:bg-night-card/60'
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-rose/15 bg-paper/95 px-1 py-2 backdrop-blur md:hidden dark:border-gold/10 dark:bg-night-card/95">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[11px] ${
                isActive ? 'text-rose-deep dark:text-gold' : 'text-ink-soft dark:text-blush/60'
              }`
            }
          >
            <span className="text-lg leading-none">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
