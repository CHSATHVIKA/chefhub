import { useEffect, useState } from 'react'
import { approveChef, blockChef, getAllBookings, getAllChefs } from '../api/admin'
import { getErrorMessage } from '../api/client'
import { useToast } from '../context/ToastContext'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Icon from '../components/Icon'
import { ListSkeleton } from '../components/Skeletons'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import Tabs from '../components/Tabs'
import { formatPrice, formatSlot } from '../utils/format'

const BOOKING_STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'REJECTED', 'CANCELLED']

export default function AdminDashboard() {
  const toast = useToast()
  const [tab, setTab] = useState('Chefs')
  const [chefs, setChefs] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [chefQuery, setChefQuery] = useState('')
  const [chefFilter, setChefFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

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
      toast(updated.approved ? `${chef.name} is now live` : `${chef.name} has been blocked`)
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    } finally {
      setBusyId(null)
    }
  }

  const pendingCount = chefs.filter((c) => !c.approved).length
  const completedValue = bookings
    .filter((b) => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0)

  const query = chefQuery.trim().toLowerCase()
  const visibleChefs = chefs.filter((c) => {
    const matchesQuery =
      !query || `${c.name} ${c.email} ${c.city}`.toLowerCase().includes(query)
    const matchesFilter =
      chefFilter === 'ALL' || (chefFilter === 'PENDING' ? !c.approved : c.approved)
    return matchesQuery && matchesFilter
  })
  const visibleBookings = bookings.filter((b) => statusFilter === 'ALL' || b.status === statusFilter)

  return (
    <div className="container-page py-10">
      <p className="eyebrow">Control room</p>
      <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Admin dashboard</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Chefs" value={chefs.length} icon="hat" />
        <StatCard label="Awaiting approval" value={pendingCount} icon="info" />
        <StatCard label="Bookings" value={bookings.length} icon="calendar" />
        <StatCard label="Completed value" value={formatPrice(completedValue)} icon="rupee" />
      </div>

      <Tabs tabs={['Chefs', 'Bookings']} active={tab} onChange={setTab} counts={{ Chefs: pendingCount }} />

      <div className="mt-6">
        {loading && <ListSkeleton />}
        {!loading && error && <ErrorMessage message={error} onRetry={load} />}

        {!loading && !error && tab === 'Chefs' && (
          <>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 sm:w-80">
                <Icon name="search" className="h-4 w-4 text-muted" />
                <input
                  className="w-full bg-transparent py-2.5 text-sm focus:outline-none"
                  placeholder="Search by name, email or city"
                  value={chefQuery}
                  onChange={(e) => setChefQuery(e.target.value)}
                />
              </label>
              <div className="flex rounded-xl bg-line/60 p-1 text-sm">
                {[
                  ['ALL', 'All'],
                  ['PENDING', 'Pending'],
                  ['APPROVED', 'Approved'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setChefFilter(value)}
                    className={`rounded-lg px-4 py-1.5 font-semibold transition ${
                      chefFilter === value ? 'bg-white shadow-sm' : 'text-muted'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {visibleChefs.length === 0 ? (
              <EmptyState icon="search" title="No chefs found" text="Try a different search or filter." />
            ) : (
              <div className="card overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="border-b border-line bg-cream/60 text-xs uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Chef</th>
                      <th className="px-5 py-3 font-semibold">City</th>
                      <th className="px-5 py-3 font-semibold">Tier</th>
                      <th className="px-5 py-3 font-semibold">Price</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {visibleChefs.map((chef) => (
                      <tr key={chef.id} className="transition hover:bg-cream/50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={chef.name} src={chef.photoUrl} />
                            <div>
                              <p className="font-semibold">{chef.name}</p>
                              <p className="text-xs text-muted">{chef.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">{chef.city || <span className="text-muted">Not set</span>}</td>
                        <td className="px-5 py-3">{chef.tier === 'PREMIUM' ? 'Premium' : 'Standard'}</td>
                        <td className="px-5 py-3">{formatPrice(chef.pricePerVisit)}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              chef.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${chef.approved ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                            {chef.approved ? 'Live' : 'Pending'}
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
          </>
        )}

        {!loading && !error && tab === 'Bookings' && (
          <>
            <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
              {BOOKING_STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    statusFilter === status
                      ? 'border-ink bg-ink text-cream'
                      : 'border-line bg-white hover:border-ink'
                  }`}
                >
                  {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            {visibleBookings.length === 0 ? (
              <EmptyState icon="calendar" title="No bookings here" text="Bookings matching this filter will appear here." />
            ) : (
              <div className="card overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b border-line bg-cream/60 text-xs uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Booking</th>
                      <th className="px-5 py-3 font-semibold">Customer</th>
                      <th className="px-5 py-3 font-semibold">Chef</th>
                      <th className="px-5 py-3 font-semibold">When</th>
                      <th className="px-5 py-3 font-semibold">Guests</th>
                      <th className="px-5 py-3 font-semibold">Amount</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {visibleBookings.map((b) => (
                      <tr key={b.id} className="transition hover:bg-cream/50">
                        <td className="px-5 py-3 font-mono text-xs text-muted">#CH{String(b.id).padStart(5, '0')}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar name={b.customerName} size="sm" />
                            {b.customerName}
                          </div>
                        </td>
                        <td className="px-5 py-3">{b.chefName}</td>
                        <td className="px-5 py-3">{formatSlot(b)}</td>
                        <td className="px-5 py-3">{b.guestCount}</td>
                        <td className="px-5 py-3 font-semibold">{formatPrice(b.totalPrice)}</td>
                        <td className="px-5 py-3">
                          <StatusBadge status={b.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
