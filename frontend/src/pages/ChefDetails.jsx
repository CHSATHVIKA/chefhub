import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getChef } from '../api/chefs'
import { getErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import VegMark from '../components/VegMark'
import { FALLBACK_CHEF_PHOTO, formatDate, formatPrice, formatTime } from '../utils/format'

export default function ChefDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    getChef(id)
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const bookSlot = (slotId) => navigate(`/book/${id}/${slotId}`)

  if (loading) return <Loader text="Loading chef..." />
  if (error) {
    return (
      <div className="container-page py-10">
        <ErrorMessage message={error} onRetry={load} />
      </div>
    )
  }

  const { chef, menu, slots } = data
  const canBook = !user || user.role === 'CUSTOMER'

  return (
    <div className="container-page py-10">
      <Link to="/chefs" className="text-sm font-medium text-muted hover:text-ink">
        &larr; All chefs
      </Link>

      <section className="mt-6 grid gap-8 md:grid-cols-5">
        <img
          src={chef.photoUrl || FALLBACK_CHEF_PHOTO}
          onError={(e) => (e.currentTarget.src = FALLBACK_CHEF_PHOTO)}
          alt={chef.name}
          className="aspect-square w-full rounded-3xl object-cover shadow-soft md:col-span-2"
        />
        <div className="md:col-span-3">
          <div className="flex flex-wrap items-center gap-2">
            {chef.tier === 'PREMIUM' && (
              <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-cream">Premium</span>
            )}
            <span className="text-sm text-muted">{chef.city}</span>
          </div>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{chef.name}</h1>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {chef.cuisines.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
          <p className="mt-5 text-lg leading-relaxed text-muted">{chef.bio}</p>
          <div className="card mt-6 inline-flex items-baseline gap-2 px-5 py-4">
            <span className="font-display text-3xl font-semibold">{formatPrice(chef.pricePerVisit)}</span>
            <span className="text-sm text-muted">per visit, up to 3 hours</span>
          </div>
        </div>
      </section>

      <div className="mt-14 grid gap-10 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <h2 className="text-2xl font-semibold">Signature menu</h2>
          <p className="mt-1 text-sm text-muted">Dish prices are indicative and cover ingredients for four people.</p>
          {menu.length === 0 ? (
            <p className="mt-6 text-muted">This chef has not added dishes yet.</p>
          ) : (
            <ul className="card mt-6 divide-y divide-line">
              {menu.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-4 p-5">
                  <div className="flex gap-3">
                    <span className="mt-1">
                      <VegMark veg={item.veg} />
                    </span>
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      {item.description && <p className="mt-0.5 text-sm text-muted">{item.description}</p>}
                    </div>
                  </div>
                  <span className="whitespace-nowrap font-semibold">{formatPrice(item.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="lg:col-span-2">
          <h2 className="text-2xl font-semibold">Available slots</h2>
          <p className="mt-1 text-sm text-muted">Choose a time and the chef will confirm within a day.</p>
          <div className="mt-6">
            {slots.length === 0 ? (
              <EmptyState title="Fully booked" text="No open slots right now. Check back in a few days." />
            ) : (
              <ul className="space-y-3">
                {slots.map((slot) => (
                  <li key={slot.id} className="card flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-semibold">{formatDate(slot.date)}</p>
                      <p className="text-sm text-muted">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </p>
                    </div>
                    {canBook && (
                      <button onClick={() => bookSlot(slot.id)} className="btn-primary">
                        Book
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {!canBook && (
              <p className="mt-4 text-sm text-muted">Log in with a customer account to book this chef.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
