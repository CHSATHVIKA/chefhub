import { useEffect, useState } from 'react'
import { approveChef, blockChef, getAllBookings, getAllChefs } from '../api/admin'
import { getErrorMessage } from '../api/client'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import StatusBadge from '../components/StatusBadge'
import Tabs from '../components/Tabs'
import { formatPrice, formatSlot } from '../utils/format'

export default function AdminDashboard() {
  const [tab, setTab] = useState('Chefs')
  const [chefs, setChefs] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = () => {
    setLoading(true)
    setError('')
    Promise.all([getAllChefs(), getAllBookings()])
      .then(([chefList, bookingList]) => {
        setChefs(chefList)
        setBookings(bookingList)
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const toggleApproval = async (chef) => {
    setBusyId(chef.id)
    try {
      const updated = chef.approved ? await blockChef(chef.id) : await approveChef(chef.id)
      setChefs((list) => list.map((c) => (c.id === chef.id ? updated : c)))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const pendingCount = chefs.filter((c) => !c.approved).length

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl font-semibold">Admin</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Chefs" value={chefs.length} />
        <Stat label="Waiting for approval" value={pendingCount} />
        <Stat label="Bookings" value={bookings.length} />
      </div>

      <Tabs tabs={['Chefs', 'Bookings']} active={tab} onChange={setTab} />

      <div className="mt-6">
        {loading && <Loader />}
        {!loading && error && <ErrorMessage message={error} onRetry={load} />}

        {!loading && tab === 'Chefs' && (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Chef</th>
                  <th className="px-5 py-3 font-medium">City</th>
                  <th className="px-5 py-3 font-medium">Tier</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {chefs.map((chef) => (
                  <tr key={chef.id}>
                    <td className="px-5 py-3">
                      <p className="font-semibold">{chef.name}</p>
                      <p className="text-muted">{chef.email}</p>
                    </td>
                    <td className="px-5 py-3">{chef.city || '-'}</td>
                    <td className="px-5 py-3">{chef.tier === 'PREMIUM' ? 'Premium' : 'Standard'}</td>
                    <td className="px-5 py-3">{formatPrice(chef.pricePerVisit)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          chef.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {chef.approved ? 'Approved' : 'Not approved'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        disabled={busyId === chef.id}
                        onClick={() => toggleApproval(chef)}
                        className={`${chef.approved ? 'btn-danger' : 'btn-primary'} px-4 py-1.5`}
                      >
                        {chef.approved ? 'Block' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && tab === 'Bookings' && bookings.length === 0 && (
          <EmptyState title="No bookings yet" text="Bookings from all customers will be listed here." />
        )}
        {!loading && tab === 'Bookings' && bookings.length > 0 && (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-line text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">#</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Chef</th>
                  <th className="px-5 py-3 font-medium">When</th>
                  <th className="px-5 py-3 font-medium">Guests</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="px-5 py-3 text-muted">{b.id}</td>
                    <td className="px-5 py-3">{b.customerName}</td>
                    <td className="px-5 py-3">{b.chefName}</td>
                    <td className="px-5 py-3">{formatSlot(b)}</td>
                    <td className="px-5 py-3">{b.guestCount}</td>
                    <td className="px-5 py-3">{formatPrice(b.totalPrice)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
    </div>
  )
}
