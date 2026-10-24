import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cancelBooking, getMyBookings } from '../api/bookings'
import { getErrorMessage } from '../api/client'
import { useToast } from '../context/ToastContext'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Icon from '../components/Icon'
import { ListSkeleton } from '../components/Skeletons'
import StatusBadge from '../components/StatusBadge'
import Tabs from '../components/Tabs'
import { FALLBACK_CHEF_PHOTO, dateParts, formatPrice, formatTime } from '../utils/format'

const ACTIVE = ['PENDING', 'CONFIRMED']

export default function MyBookings() {
  const toast = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('Upcoming')
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
      toast('Booking cancelled')
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    } finally {
      setCancellingId(null)
    }
  }

  const upcoming = bookings.filter((b) => ACTIVE.includes(b.status))
  const past = bookings.filter((b) => !ACTIVE.includes(b.status))
  const shown = tab === 'Upcoming' ? upcoming : past

  return (
    <div className="container-page max-w-4xl py-10">
      <p className="eyebrow">Your table</p>
      <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">My bookings</h1>

      <Tabs tabs={['Upcoming', 'Past']} active={tab} onChange={setTab} counts={{ Upcoming: upcoming.length }} />

      <div className="mt-6 space-y-4">
        {loading && <ListSkeleton />}
        {!loading && error && <ErrorMessage message={error} onRetry={load} />}
        {!loading && !error && shown.length === 0 && (
          <EmptyState
            icon="calendar"
            title={tab === 'Upcoming' ? 'Nothing planned yet' : 'No past bookings'}
            text={
              tab === 'Upcoming'
                ? 'Find a chef you like and book your first home-cooked meal.'
                : 'Completed, cancelled and declined bookings will show up here.'
            }
            action={
              tab === 'Upcoming' && (
                <Link to="/chefs" className="btn-primary">
                  Find a chef
                </Link>
              )
            }
          />
        )}
        {!loading &&
          shown.map((b) => {
            const { weekday, day, month } = dateParts(b.date)
            return (
              <article key={b.id} className="card card-hover flex flex-col overflow-hidden sm:flex-row">
                <div className="flex items-center gap-4 bg-ink px-5 py-4 text-cream sm:w-28 sm:flex-col sm:justify-center sm:gap-0">
                  <span className="text-xs uppercase tracking-wider text-cream/60">{weekday}</span>
                  <span className="font-display text-3xl font-semibold">{day}</span>
                  <span className="text-sm text-brand">{month}</span>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <img
                    src={b.chefPhotoUrl || FALLBACK_CHEF_PHOTO}
                    onError={(e) => (e.currentTarget.src = FALLBACK_CHEF_PHOTO)}
                    alt={b.chefName}
                    className="hidden h-16 w-16 rounded-2xl object-cover sm:block"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link to={`/chefs/${b.chefId}`} className="font-display text-xl font-semibold hover:text-brand-deep">
                        {b.chefName}
                      </Link>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Icon name="clock" className="h-4 w-4" />
                        {formatTime(b.startTime)} - {formatTime(b.endTime)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Icon name="users" className="h-4 w-4" />
                        {b.guestCount} guests
                      </span>
                    </p>
                    <p className="mt-1 line-clamp-1 text-sm text-muted">{b.address}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <span className="text-lg font-semibold">{formatPrice(b.totalPrice)}</span>
                    {ACTIVE.includes(b.status) && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        disabled={cancellingId === b.id}
                        className="btn-danger px-4 py-2"
                      >
                        {cancellingId === b.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
      </div>
    </div>
  )
}
