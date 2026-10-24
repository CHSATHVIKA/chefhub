import { useEffect, useState } from 'react'
import { getIncomingBookings, updateBookingStatus } from '../../api/chefDashboard'
import { getErrorMessage } from '../../api/client'
import EmptyState from '../EmptyState'
import ErrorMessage from '../ErrorMessage'
import Loader from '../Loader'
import StatusBadge from '../StatusBadge'
import { formatPrice, formatSlot } from '../../utils/format'

const ACTIONS = {
  PENDING: [
    { status: 'CONFIRMED', label: 'Accept', className: 'btn-primary' },
    { status: 'REJECTED', label: 'Decline', className: 'btn-danger' },
  ],
  CONFIRMED: [{ status: 'COMPLETED', label: 'Mark completed', className: 'btn-outline' }],
}

export default function IncomingBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = () => {
    setLoading(true)
    setError('')
    getIncomingBookings()
      .then(setBookings)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const changeStatus = async (id, status) => {
    setBusyId(id)
    setError('')
    try {
      const updated = await updateBookingStatus(id, status)
      setBookings((list) => list.map((b) => (b.id === id ? updated : b)))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-4">
      <ErrorMessage message={error} onRetry={load} />
      {bookings.length === 0 && !error && (
        <EmptyState
          title="No booking requests yet"
          text="Keep your slots updated. New requests from customers will appear here."
        />
      )}
      {bookings.map((b) => (
        <article key={b.id} className="card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold">{b.customerName}</h3>
                <StatusBadge status={b.status} />
              </div>
              <p className="mt-1 text-sm font-medium">{formatSlot(b)}</p>
              <p className="mt-1 text-sm text-muted">
                {b.guestCount} guests &middot; {b.address}
              </p>
              {b.customerPhone && <p className="mt-1 text-sm text-muted">Phone: {b.customerPhone}</p>}
              {b.notes && <p className="mt-2 rounded-lg bg-cream px-3 py-2 text-sm">"{b.notes}"</p>}
            </div>
            <span className="font-semibold">{formatPrice(b.totalPrice)}</span>
          </div>
          {ACTIONS[b.status] && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
              {ACTIONS[b.status].map((action) => (
                <button
                  key={action.status}
                  disabled={busyId === b.id}
                  onClick={() => changeStatus(b.id, action.status)}
                  className={`${action.className} px-4 py-2`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  )
}
