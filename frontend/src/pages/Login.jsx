import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import { homePathFor, useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import AuthLayout from '../components/AuthLayout'
import ErrorMessage from '../components/ErrorMessage'

const DEMO_ACCOUNTS = [
  { label: 'Customer', email: 'priya@example.com', password: 'password123' },
  { label: 'Chef', email: 'arjun@chefhub.in', password: 'password123' },
  { label: 'Admin', email: 'admin@chefhub.in', password: 'admin123' },
]

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
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
      toast(`Welcome back, ${user.name.split(' ')[0]}`)
      navigate(location.state?.from || homePathFor(user.role), { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to book chefs or manage your kitchen.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <ErrorMessage message={error} />
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="input py-3"
            placeholder="you@example.com"
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
            className="input py-3"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 text-base">
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
        <p className="text-center text-sm text-muted">
          New to ChefHub?{' '}
          <Link to="/register" className="font-semibold text-brand-deep hover:underline">
            Create an account
          </Link>
        </p>
      </form>

      <div className="mt-8 rounded-2xl bg-cream p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Try a demo account</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.label}
              type="button"
              onClick={() => setForm({ email: acc.email, password: acc.password })}
              className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium transition hover:border-brand hover:text-brand-deep"
            >
              {acc.label}
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  )
}
