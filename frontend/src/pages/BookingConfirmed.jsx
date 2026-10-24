import { Link, Navigate, useLocation } from 'react-router-dom'
import Icon from '../components/Icon'
import { formatPrice, formatSlot } from '../utils/format'

export default function BookingConfirmed() {
  const booking = useLocation().state?.booking

  // opened directly without a booking, nothing to show
  if (!booking) return <Navigate to="/my-bookings" replace />

  return (
    <div className="container-page max-w-xl py-16 text-center">
      <div className="mx-auto flex h-20 w-20 animate-fade-up items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <Icon name="check" className="h-10 w-10" strokeWidth={2.5} />
      </div>
      <h1 className="mt-6 text-4xl font-semibold">Request sent</h1>
      <p className="mt-3 text-muted">
        {booking.chefName} will confirm your booking within 24 hours. You can track it in My bookings.
      </p>

      <div className="card mt-8 space-y-3 p-6 text-left text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted">Booking ID</span>
          <span className="font-semibold">#CH{String(booking.id).padStart(5, '0')}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted">Chef</span>
          <span className="font-medium">{booking.chefName}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted">When</span>
          <span className="text-right font-medium">{formatSlot(booking)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted">Guests</span>
          <span className="font-medium">{booking.guestCount}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted">Address</span>
          <span className="text-right font-medium">{booking.address}</span>
        </div>
        <div className="flex justify-between gap-4 border-t border-line pt-3 text-base">
          <span className="font-semibold">Chef fee</span>
          <span className="font-semibold">{formatPrice(booking.totalPrice)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/my-bookings" className="btn-primary px-6 py-3">
          View my bookings
        </Link>
        <Link to="/chefs" className="btn-outline px-6 py-3">
          Browse more chefs
        </Link>
      </div>
    </div>
  )
}
