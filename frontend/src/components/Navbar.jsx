import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'
import Icon from './Icon'

const linkClass = ({ isActive }) =>
  `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'text-ink after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:bg-brand' : 'text-muted hover:text-ink'
  }`

const roleLabel = { CUSTOMER: 'Customer', CHEF: 'Chef', ADMIN: 'Admin' }

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [{ to: '/chefs', label: 'Find a chef' }]
  if (user?.role === 'CUSTOMER') links.push({ to: '/my-bookings', label: 'My bookings' })
  if (user?.role === 'CHEF') links.push({ to: '/chef/dashboard', label: 'Dashboard' })
  if (user?.role === 'ADMIN') links.push({ to: '/admin', label: 'Admin' })

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header
      className={`sticky top-0 z-30 border-b bg-cream/85 backdrop-blur-md transition-shadow ${
        scrolled ? 'border-line shadow-sm' : 'border-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
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
            <div className="ml-4 flex items-center gap-3 border-l border-line pl-4">
              <Avatar name={user.name} size="sm" />
              <div className="leading-tight">
                <p className="text-sm font-semibold">{user.name.split(' ')[0]}</p>
                <p className="text-xs text-muted">{roleLabel[user.role]}</p>
              </div>
              <button onClick={handleLogout} className="btn-ghost ml-1 px-3 py-2" title="Log out">
                <Icon name="logout" className="h-4 w-4" />
                <span className="sr-only lg:not-sr-only">Log out</span>
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

        <button className="rounded-lg p-2 text-ink md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <Icon name={open ? 'close' : 'menu'} className="h-6 w-6" />
        </button>
      </div>

      {open && (
        <nav className="animate-fade-up border-t border-line bg-cream md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {user && (
              <div className="mb-2 flex items-center gap-3 rounded-xl bg-card p-3">
                <Avatar name={user.name} />
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-muted">{roleLabel[user.role]}</p>
                </div>
              </div>
            )}
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-brand/10 text-brand-deep' : 'text-ink'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <button onClick={handleLogout} className="btn-outline mt-2">
                Log out
              </button>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to="/login" className="btn-outline">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary">
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
