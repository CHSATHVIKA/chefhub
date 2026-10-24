import { useState } from 'react'
import { updateBookingStatus } from '../../api/chefDashboard'
import { getErrorMessage } from '../../api/client'
import { useToast } from '../../context/ToastContext'
import Avatar from '../Avatar'
import EmptyState from '../EmptyState'
import Icon from '../Icon'
import StatusBadge from '../StatusBadge'
import { dateParts, formatPrice, formatTime } from '../../utils/format'

const ACTIONS = {
  PENDING: [
    { status: 'CONFIRMED', label: 'Accept', className: 'btn-primary' },
    { status: 'REJECTED', label: 'Decline', className: 'btn-danger' },
  ],
  CONFIRMED: [{ status: 'COMPLETED', label: 'Mark as completed', className: 'btn-dark' }],
}

const MESSAGES = {
  CONFIRMED: 'Booking accepted. The customer can see it now.',
  REJECTED: 'Booking declined and the slot is open again.',
  COMPLETED: 'Nice work. Visit marked as completed.',
}

const SECTIONS = [
  { title: 'Needs your reply', statuses: ['PENDING'] },
  { title: 'Upcoming visits', statuses: ['CONFIRMED'] },
  { title: 'History', statuses: ['COMPLETED', 'REJECTED', 'CANCELLED'] },
]

export default function IncomingBookings({ bookings, onChange }) {
  const toast = useToast()
  const [busyId, setBusyId] = useState(null)

  const changeStatus = async (id, status) => {
    setBusyId(id)
    try {
      const updated = await updateBookingStatus(id, status)
      onChange(bookings.map((b) => (b.id === id ? updated : b)))
      toast(MESSAGES[status])
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    } finally {
      setBusyId(null)
    }
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon="calendar"
        title="No booking requests yet"
        text="Keep your slots updated. New requests from customers will show up here."
      />
    )
  }

  return (
    <div className="space-y-10">
      {SECTIONS.map((section) => {
        const items = bookings.filter((b) => section.statuses.includes(b.status))
        if (items.length === 0) return null
        return (
          <section key={section.title}>
            <h2 className="text-lg font-semibold">
              {section.title} <span className="font-sans text-sm font-normal text-muted">({items.length})</span>
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {items.map((b) => {
                const { weekday, day, month } = dateParts(b.date)
                return (
                  <article key={b.id} className="card flex flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={b.customerName} />
                        <div>
                          <p className="font-semibold">{b.customerName}</p>
                          {b.customerPhone && <p className="text-xs text-muted">{b.customerPhone}</p>}
                        </div>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-cream p-3 text-center text-sm">
                      <div>
                        <p className="text-xs text-muted">Date</p>
                        <p className="font-semibold">
                          {weekday} {day} {month}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Time</p>
                        <p className="font-semibold">{formatTime(b.startTime)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Guests</p>
                        <p className="font-semibold">{b.guestCount}</p>
                      </div>
                    </div>

                    <p className="mt-3 flex items-start gap-2 text-sm text-muted">
                      <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0" /> {b.address}
                    </p>
                    {b.notes && (
                      <p className="mt-2 rounded-lg border-l-2 border-brand bg-brand/5 px-3 py-2 text-sm italic">
                        "{b.notes}"
                      </p>
                    )}

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
                      <span className="font-semibold">{formatPrice(b.totalPrice)}</span>
                      <div className="flex gap-2">
                        {(ACTIONS[b.status] || []).map((action) => (
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
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
