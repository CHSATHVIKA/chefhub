import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createBooking } from '../api/bookings'
import { getChef } from '../api/chefs'
import { getErrorMessage } from '../api/client'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import { FALLBACK_CHEF_PHOTO, formatPrice, formatSlot } from '../utils/format'

export default function Booking() {
  const { chefId, slotId } = useParams()
  const navigate = useNavigate()
  const [chef, setChef] = useState(null)
  const [slot, setSlot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [form, setForm] = useState({ address: '', guestCount: 4, notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getChef(chefId)
      .then((data) => {
        setChef(data.chef)
        const found = data.slots.find((s) => String(s.id) === slotId)
        if (found) setSlot(found)
        else setLoadError('This slot is no longer available. Please pick another one.')
      })
      .catch((err) => setLoadError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [chefId, slotId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await createBooking({
        slotId: Number(slotId),
        address: form.address,
        guestCount: Number(form.guestCount),
        notes: form.notes,
      })
      navigate('/my-bookings', { state: { justBooked: true } })
    } catch (err) {
      setError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  if (loading) return <Loader text="Getting your slot ready..." />

  if (loadError) {
    return (
      <div className="container-page max-w-2xl py-12">
        <ErrorMessage message={loadError} />
        <Link to={`/chefs/${chefId}`} className="btn-outline mt-6">
          Back to chef
        </Link>
      </div>
    )
  }

  return (
    <div className="container-page max-w-4xl py-10">
      <Link to={`/chefs/${chefId}`} className="text-sm font-medium text-muted hover:text-ink">
        &larr; Back to {chef.name}
      </Link>
      <h1 className="mt-4 text-4xl font-semibold">Confirm your booking</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-5">
        <form onSubmit={handleSubmit} className="card space-y-5 p-6 md:col-span-3">
          <ErrorMessage message={error} />
          <div>
            <label className="label" htmlFor="address">
              Where should the chef come?
            </label>
            <textarea
              id="address"
              required
              rows={3}
              className="input"
              placeholder="Flat number, building, street, area"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="guests">
              Number of guests
            </label>
            <input
              id="guests"
              type="number"
              min={1}
              max={50}
              required
              className="input"
              value={form.guestCount}
              onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="notes">
              Notes for the chef <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea
              id="notes"
              rows={3}
              className="input"
              placeholder="Allergies, dishes you would like, kitchen details"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
            {submitting ? 'Sending request...' : 'Request booking'}
          </button>
          <p className="text-center text-xs text-muted">
            You will not be charged now. The chef confirms first, and you can cancel any time before the visit.
          </p>
        </form>

        <aside className="card h-fit overflow-hidden md:col-span-2">
          <img
            src={chef.photoUrl || FALLBACK_CHEF_PHOTO}
            onError={(e) => (e.currentTarget.src = FALLBACK_CHEF_PHOTO)}
            alt={chef.name}
            className="aspect-[16/10] w-full object-cover"
          />
          <div className="space-y-3 p-5 text-sm">
            <p className="font-display text-xl font-semibold">{chef.name}</p>
            <div className="flex justify-between">
              <span className="text-muted">When</span>
              <span className="text-right font-medium">{formatSlot(slot)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">City</span>
              <span className="font-medium">{chef.city}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-3">
              <span className="text-muted">Chef fee</span>
              <span className="text-lg font-semibold">{formatPrice(chef.pricePerVisit)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
