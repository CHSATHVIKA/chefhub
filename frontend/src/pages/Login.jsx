import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import { homePathFor, useAuth } from '../context/AuthContext'
import ErrorMessage from '../components/ErrorMessage'

const DEMO_ACCOUNTS = [
  { label: 'Customer', email: 'priya@example.com', password: 'password123' },
  { label: 'Chef', email: 'arjun@chefhub.in', password: 'password123' },
  { label: 'Admin', email: 'admin@chefhub.in', password: 'admin123' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(form.email, form.password)
      navigate(location.state?.from || homePathFor(user.role), { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page flex justify-center py-14">
      <div className="w-full max-w-md">
        <h1 className="text-center text-4xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-center text-muted">Log in to book chefs or manage your kitchen.</p>

        <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-6 sm:p-8">
          <ErrorMessage message={error} />
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
          <p className="text-center text-sm text-muted">
            New to ChefHub?{' '}
            <Link to="/register" className="font-semibold text-brand-deep hover:underline">
              Create an account
            </Link>
          </p>
        </form>

        <div className="mt-6 rounded-2xl border border-dashed border-line p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Demo accounts</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.label}
                type="button"
                onClick={() => setForm({ email: acc.email, password: acc.password })}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-sm hover:border-brand"
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
