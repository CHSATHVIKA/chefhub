import { useState } from 'react'
import { updateMyProfile } from '../../api/chefDashboard'
import { getErrorMessage } from '../../api/client'
import { useToast } from '../../context/ToastContext'
import ChefCard from '../ChefCard'
import ErrorMessage from '../ErrorMessage'

export default function ProfileForm({ profile, onSaved }) {
  const toast = useToast()
  const [form, setForm] = useState({
    bio: profile.bio || '',
    cuisines: profile.cuisines.join(', '),
    pricePerVisit: profile.pricePerVisit || '',
    city: profile.city || '',
    photoUrl: profile.photoUrl || '',
    tier: profile.tier || 'STANDARD',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const updated = await updateMyProfile({ ...form, pricePerVisit: Number(form.pricePerVisit) })
      onSaved(updated)
      toast('Profile saved')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  // live preview of how the card will look in search results
  const preview = {
    ...profile,
    bio: form.bio || 'A few lines about you will appear here.',
    city: form.city,
    photoUrl: form.photoUrl,
    tier: form.tier,
    pricePerVisit: Number(form.pricePerVisit) || 0,
    cuisines: form.cuisines.split(',').map((c) => c.trim()).filter(Boolean),
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <form onSubmit={handleSubmit} className="card grid gap-5 p-6 sm:grid-cols-2 lg:col-span-3">
        {error && (
          <div className="sm:col-span-2">
            <ErrorMessage message={error} />
          </div>
        )}
        <div className="sm:col-span-2">
          <label className="label" htmlFor="bio">
            About you
          </label>
          <textarea
            id="bio"
            rows={4}
            required
            className="input"
            placeholder="Where you trained, what you love to cook, what a visit looks like"
            value={form.bio}
            onChange={update('bio')}
          />
        </div>
        <div>
          <label className="label" htmlFor="cuisines">
            Cuisines
          </label>
          <input
            id="cuisines"
            required
            className="input"
            placeholder="North Indian, Mughlai"
            value={form.cuisines}
            onChange={update('cuisines')}
          />
          <p className="mt-1 text-xs text-muted">Separate with commas.</p>
        </div>
        <div>
          <label className="label" htmlFor="city">
            City
          </label>
          <input id="city" required className="input" value={form.city} onChange={update('city')} />
        </div>
        <div>
          <label className="label" htmlFor="price">
            Price per visit (INR)
          </label>
          <input
            id="price"
            type="number"
            min={0}
            required
            className="input"
            value={form.pricePerVisit}
            onChange={update('pricePerVisit')}
          />
        </div>
        <div>
          <label className="label">Tier</label>
          <div className="flex rounded-xl bg-line/60 p-1">
            {['STANDARD', 'PREMIUM'].map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setForm({ ...form, tier })}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                  form.tier === tier ? 'bg-white shadow-sm' : 'text-muted'
                }`}
              >
                {tier === 'PREMIUM' ? 'Premium' : 'Standard'}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="photo">
            Photo URL
          </label>
          <input
            id="photo"
            type="url"
            className="input"
            placeholder="https://..."
            value={form.photoUrl}
            onChange={update('photoUrl')}
          />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" disabled={saving} className="btn-primary px-6">
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </div>
      </form>

      <div className="lg:col-span-2">
        <p className="mb-3 text-sm font-semibold text-muted">Preview in search</p>
        <ChefCard chef={preview} preview />
      </div>
    </div>
  )
}
