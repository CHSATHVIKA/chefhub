import { useState } from 'react'
import { updateMyProfile } from '../../api/chefDashboard'
import { getErrorMessage } from '../../api/client'
import ErrorMessage from '../ErrorMessage'

export default function ProfileForm({ profile, onSaved }) {
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
  const [saved, setSaved] = useState(false)

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    setSaved(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const updated = await updateMyProfile({ ...form, pricePerVisit: Number(form.pricePerVisit) })
      onSaved(updated)
      setSaved(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card grid gap-5 p-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <ErrorMessage message={error} />
        {saved && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Profile saved.</p>}
      </div>
      <div className="md:col-span-2">
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
        <label className="label" htmlFor="tier">
          Tier
        </label>
        <select id="tier" className="input" value={form.tier} onChange={update('tier')}>
          <option value="STANDARD">Standard</option>
          <option value="PREMIUM">Premium</option>
        </select>
      </div>
      <div className="md:col-span-2">
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
      <div className="md:col-span-2">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </div>
    </form>
  )
}
