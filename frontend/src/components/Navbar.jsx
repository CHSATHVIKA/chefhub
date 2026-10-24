import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'text-brand-deep' : 'text-muted hover:text-ink'
  }`

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const links = [{ to: '/chefs', label: 'Find a chef' }]
  if (user?.role === 'CUSTOMER') links.push({ to: '/my-bookings', label: 'My bookings' })
  if (user?.role === 'CHEF') links.push({ to: '/chef/dashboard', label: 'Dashboard' })
  if (user?.role === 'ADMIN') links.push({ to: '/admin', label: 'Admin' })

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img src="/favicon.svg" alt="" className="h-8 w-8" />
          <span className="font-display text-xl font-semibold">ChefHub</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <div className="ml-3 flex items-center gap-3">
              <span className="text-sm text-muted">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-outline py-2">
                Log out
              </button>
            </div>
          ) : (
            <div className="ml-3 flex items-center gap-2">
              <Link to="/login" className="btn-ghost py-2">
                Log in
              </Link>
              <Link to="/register" className="btn-primary py-2">
                Sign up
              </Link>
            </div>
          )}
        </nav>

        <button
          className="rounded-lg p-2 text-ink md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-cream md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <button onClick={handleLogout} className="btn-outline mt-2">
                Log out
              </button>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to="/login" className="btn-outline" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" className="btn-primary" onClick={() => setOpen(false)}>
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
