import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import { homePathFor, useAuth } from '../context/AuthContext'
import ErrorMessage from '../components/ErrorMessage'

export default function Register() {
  const { register } = useAuth()
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
      navigate(homePathFor(user.role), { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page flex justify-center py-14">
      <div className="w-full max-w-md">
        <h1 className="text-center text-4xl font-semibold">Create your account</h1>
        <p className="mt-2 text-center text-muted">Book a chef, or start cooking for families in your city.</p>

        <form onSubmit={handleSubmit} className="card mt-8 space-y-5 p-6 sm:p-8">
          <ErrorMessage message={error} />

          <div className="grid grid-cols-2 gap-2 rounded-xl bg-line/60 p-1">
            {[
              { value: 'CUSTOMER', label: 'I want to book' },
              { value: 'CHEF', label: 'I am a chef' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setForm({ ...form, role: option.value })}
                className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
                  form.role === option.value ? 'bg-white text-ink shadow-sm' : 'text-muted'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div>
            <label className="label" htmlFor="name">
              Full name
            </label>
            <input id="name" required className="input" value={form.name} onChange={update('name')} />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" type="email" required className="input" value={form.email} onChange={update('email')} />
          </div>
          <div>
            <label className="label" htmlFor="phone">
              Phone <span className="font-normal text-muted">(optional)</span>
            </label>
            <input id="phone" className="input" value={form.phone} onChange={update('phone')} />
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
            <p className="rounded-xl bg-brand/10 px-4 py-3 text-sm text-brand-deep">
              After signing up, fill in your profile. Our team reviews every chef before they appear in search.
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
          <p className="text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-deep hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
