import { Link, useLocation } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'
import { artisanSession } from '../lib/session'
import { useI18n } from '../lib/i18n'

const extraLinks = [
  { to: '/explore', label: 'Explore' },
  { to: '/craft-trails', label: 'Craft Trails' },
  { to: '/impact', label: 'Our Impact' },
  { to: '/track-order', label: 'Track Order' },
]

const publicLinks = [
  { to: '/', labelKey: 'home' },
  { to: '/marketplace', labelKey: 'marketplace' },
  { to: '/register', labelKey: 'join' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const session = artisanSession.get()
  const { t, lang, setLanguage } = useI18n()

  const links = [
    ...publicLinks.map((l) => ({ ...l, label: t(l.labelKey) })),
    ...extraLinks,
    ...(session
      ? [{ to: `/dashboard/${session.id}`, label: t('dashboard') }]
      : [{ to: '/login', label: t('login') }]),
  ]

  const handleLogout = () => {
    artisanSession.clear()
    setOpen(false)
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border-warm/80 bg-parchment/85 backdrop-blur-xl shadow-sm shadow-forest/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-forest to-forest-mid flex items-center justify-center shadow-md shadow-forest/20 group-hover:scale-105 transition-transform">
            <span className="font-serif text-cream text-base sm:text-lg font-bold">K</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-lg sm:text-xl text-forest tracking-tight font-bold truncate">
              Kigezi Made
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-bead font-semibold">
              Southwest Uganda
            </span>
          </div>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  location.pathname === link.to || location.pathname.startsWith(link.to + '/')
                    ? 'text-forest bg-sage-deep/60 font-semibold'
                    : 'text-stone hover:text-forest hover:bg-sage/50',
                  link.label === t('dashboard') && 'text-bead font-semibold',
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="ml-2">
            <select
              value={lang}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs border border-border-warm rounded-lg px-2.5 py-2 bg-cream font-medium text-forest"
              aria-label="Language"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="sw">SW</option>
            </select>
          </li>
          {session && (
            <li className="ml-1">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-stone hover:text-bead rounded-lg hover:bg-bead/10 transition-colors"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </li>
          )}
        </ul>

        <button
          className="md:hidden p-2.5 text-forest rounded-lg hover:bg-sage/60"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border-warm bg-parchment px-6 py-4 animate-fade-in">
          {session && (
            <p className="text-xs text-stone mb-3 pb-3 border-b border-border-warm">
              Signed in as <span className="font-semibold text-forest">{session.name}</span>
            </p>
          )}
          <select
            value={lang}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm border border-border-warm rounded-lg px-3 py-2.5 mb-3 w-full bg-cream font-medium"
            aria-label="Language"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="sw">Kiswahili</option>
          </select>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={cn(
                'block py-3 px-2 text-base font-medium rounded-lg mb-1',
                location.pathname === link.to ? 'text-forest bg-sage-deep/50' : 'text-stone',
                link.label === t('dashboard') && 'text-bead font-semibold',
              )}
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 py-3 px-2 text-base text-bead w-full font-medium"
            >
              <LogOut size={16} />
              Sign out
            </button>
          )}
        </div>
      )}
    </header>
  )
}
