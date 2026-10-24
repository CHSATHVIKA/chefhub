import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cancelBooking, getMyBookings } from '../api/bookings'
import { getErrorMessage } from '../api/client'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import StatusBadge from '../components/StatusBadge'
import { FALLBACK_CHEF_PHOTO, formatPrice, formatSlot } from '../utils/format'

export default function MyBookings() {
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  const load = () => {
    setLoading(true)
    setError('')
    getMyBookings()
      .then(setBookings)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking? The slot will be released for others.')) return
    setCancellingId(id)
    try {
      const updated = await cancelBooking(id)
      setBookings((list) => list.map((b) => (b.id === id ? updated : b)))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="container-page max-w-4xl py-10">
      <h1 className="text-4xl font-semibold">My bookings</h1>

      {location.state?.justBooked && (
        <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Request sent. The chef will confirm your booking shortly.
        </p>
      )}

      <div className="mt-8 space-y-4">
        {loading && <Loader />}
        {!loading && error && <ErrorMessage message={error} onRetry={load} />}
        {!loading && !error && bookings.length === 0 && (
          <EmptyState
            title="No bookings yet"
            text="When you book a chef, your requests and visits will show up here."
            action={
              <Link to="/chefs" className="btn-primary">
                Find a chef
              </Link>
            }
          />
        )}
        {!loading &&
          bookings.map((b) => (
            <article key={b.id} className="card flex flex-col gap-4 p-5 sm:flex-row">
              <img
                src={b.chefPhotoUrl || FALLBACK_CHEF_PHOTO}
                onError={(e) => (e.currentTarget.src = FALLBACK_CHEF_PHOTO)}
                alt={b.chefName}
                className="h-24 w-full rounded-xl object-cover sm:w-28"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/chefs/${b.chefId}`} className="font-display text-xl font-semibold hover:underline">
                    {b.chefName}
                  </Link>
                  <StatusBadge status={b.status} />
                </div>
                <p className="mt-1 text-sm font-medium">{formatSlot(b)}</p>
                <p className="mt-1 text-sm text-muted">
                  {b.guestCount} guests &middot; {b.address}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <span className="font-semibold">{formatPrice(b.totalPrice)}</span>
                {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    disabled={cancellingId === b.id}
                    className="btn-danger px-4 py-2"
                  >
                    {cancellingId === b.id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}
              </div>
            </article>
          ))}
      </div>
    </div>
  )
}
