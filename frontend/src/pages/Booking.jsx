import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createBooking } from '../api/bookings'
import { getChef } from '../api/chefs'
import { getErrorMessage } from '../api/client'
import ErrorMessage from '../components/ErrorMessage'
import Icon from '../components/Icon'
import Loader from '../components/Loader'
import { FALLBACK_CHEF_PHOTO, formatPrice, formatSlot } from '../utils/format'

const STEPS = ['Choose slot', 'Your details', 'Confirmed']

function Stepper({ current }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-4">
            <span className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  done ? 'bg-emerald-600 text-white' : active ? 'bg-brand text-white' : 'bg-line text-muted'
                }`}
              >
                {done ? <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span className={`hidden text-sm font-medium sm:inline ${active ? 'text-ink' : 'text-muted'}`}>
                {label}
              </span>
            </span>
            {i < STEPS.length - 1 && <span className="h-px w-6 bg-line sm:w-12" />}
          </li>
        )
      })}
    </ol>
  )
}

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

  const changeGuests = (delta) =>
    setForm((f) => ({ ...f, guestCount: Math.min(50, Math.max(1, Number(f.guestCount) + delta)) }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const booking = await createBooking({
        slotId: Number(slotId),
        address: form.address,
        guestCount: Number(form.guestCount),
        notes: form.notes,
      })
      navigate('/booking/confirmed', { replace: true, state: { booking } })
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
    <div className="container-page max-w-5xl py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Link to={`/chefs/${chefId}`} className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
          <Icon name="arrow" className="h-4 w-4 rotate-180" /> Back to {chef.name}
        </Link>
        <Stepper current={1} />
      </div>
      <h1 className="mt-8 text-4xl font-semibold sm:text-5xl">Almost there</h1>
      <p className="mt-2 text-muted">Tell {chef.name.split(' ')[0]} where to come and who is eating.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="card space-y-6 p-6 sm:p-8 lg:col-span-3">
          <ErrorMessage message={error} />
          <div>
            <label className="label" htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              required
              rows={3}
              className="input"
              placeholder="Flat number, building, street, area, landmark"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="guests">
              Guests
            </label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => changeGuests(-1)} className="h-11 w-11 rounded-xl border border-line bg-white text-lg font-semibold hover:border-brand">
                -
              </button>
              <input
                id="guests"
                type="number"
                min={1}
                max={50}
                required
                className="input w-20 text-center text-base font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                value={form.guestCount}
                onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
              />
              <button type="button" onClick={() => changeGuests(1)} className="h-11 w-11 rounded-xl border border-line bg-white text-lg font-semibold hover:border-brand">
                +
              </button>
              <span className="text-sm text-muted">people</span>
            </div>
          </div>
          <div>
            <label className="label" htmlFor="notes">
              Notes for the chef <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea
              id="notes"
              rows={3}
              className="input"
              placeholder="Allergies, dishes you'd like, the occasion, kitchen details"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 text-base">
            {submitting ? 'Sending request...' : `Request booking - ${formatPrice(chef.pricePerVisit)}`}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted">
            <Icon name="shield" className="h-4 w-4" />
            No payment now. The chef confirms first and you can cancel any time before the visit.
          </p>
        </form>

        <aside className="lg:col-span-2">
          <div className="card overflow-hidden lg:sticky lg:top-24">
            <div className="flex items-center gap-4 border-b border-line p-5">
              <img
                src={chef.photoUrl || FALLBACK_CHEF_PHOTO}
                onError={(e) => (e.currentTarget.src = FALLBACK_CHEF_PHOTO)}
                alt={chef.name}
                className="h-16 w-16 rounded-2xl object-cover"
              />
              <div>
                <p className="font-display text-xl font-semibold">{chef.name}</p>
                <p className="flex items-center gap-1 text-sm text-muted">
                  <Icon name="pin" className="h-3.5 w-3.5" /> {chef.city}
                </p>
              </div>
            </div>
            <div className="space-y-3 p-5 text-sm">
              <div className="flex items-start gap-3">
                <Icon name="calendar" className="h-5 w-5 text-brand" />
                <span className="font-medium">{formatSlot(slot)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="users" className="h-5 w-5 text-brand" />
                <span className="font-medium">{form.guestCount || 1} guests</span>
              </div>
            </div>
            <div className="space-y-2 border-t border-line bg-cream/60 p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Chef fee</span>
                <span>{formatPrice(chef.pricePerVisit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Booking fee</span>
                <span className="text-emerald-700">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Groceries</span>
                <span>At cost, paid to chef</span>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(chef.pricePerVisit)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
