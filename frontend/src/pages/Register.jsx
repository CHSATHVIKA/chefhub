import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import { homePathFor, useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import AuthLayout from '../components/AuthLayout'
import ErrorMessage from '../components/ErrorMessage'
import Icon from '../components/Icon'

const ROLES = [
  { value: 'CUSTOMER', icon: 'users', title: 'I want to book', text: 'Find chefs for meals at home' },
  { value: 'CHEF', icon: 'hat', title: 'I am a chef', text: 'Cook for families in my city' },
]

export default function Register() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'CUSTOMER' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await register(form)
      toast('Account created. Welcome to ChefHub!')
      navigate(homePathFor(user.role), { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="It takes less than a minute.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <ErrorMessage message={error} />

        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((role) => {
            const active = form.role === role.value
            return (
              <button
                key={role.value}
                type="button"
                onClick={() => setForm({ ...form, role: role.value })}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  active ? 'border-brand bg-brand/5' : 'border-line bg-white hover:border-brand/40'
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    active ? 'bg-brand text-white' : 'bg-line/70 text-muted'
                  }`}
                >
                  <Icon name={role.icon} className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-semibold">{role.title}</p>
                <p className="mt-0.5 text-xs text-muted">{role.text}</p>
              </button>
            )
          })}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">
              Full name
            </label>
            <input id="name" required className="input" value={form.name} onChange={update('name')} />
          </div>
          <div>
            <label className="label" htmlFor="phone">
              Phone <span className="font-normal text-muted">(optional)</span>
            </label>
            <input id="phone" className="input" value={form.phone} onChange={update('phone')} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input id="email" type="email" required className="input" value={form.email} onChange={update('email')} />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            className="input"
            value={form.password}
            onChange={update('password')}
          />
          <p className="mt-1 text-xs text-muted">At least 6 characters.</p>
        </div>

        {form.role === 'CHEF' && (
          <p className="flex gap-2 rounded-xl bg-brand/10 px-4 py-3 text-sm text-brand-deep">
            <Icon name="info" className="h-5 w-5 shrink-0" />
            After signing up, complete your profile. Our team reviews every chef before they appear in search.
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 text-base">
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-deep hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
