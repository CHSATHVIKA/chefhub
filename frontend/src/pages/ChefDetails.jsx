import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getChef } from '../api/chefs'
import { getErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import ErrorMessage from '../components/ErrorMessage'
import Icon from '../components/Icon'
import VegMark from '../components/VegMark'
import { COVER_PHOTOS, FALLBACK_CHEF_PHOTO, dateParts, formatPrice, formatTime } from '../utils/format'

const INCLUDED = [
  'Chef brings their own spice blends and knives',
  'Menu planned with you before the visit',
  'Kitchen cleaned up after cooking',
  'Groceries bought by the chef and billed at cost',
]

export default function ChefDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [menuFilter, setMenuFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)

  const load = () => {
    setLoading(true)
    setError('')
    getChef(id)
      .then((result) => {
        setData(result)
        setSelectedDate(result.slots[0]?.date || null)
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  // group slots by date for the day picker
  const slotsByDate = useMemo(() => {
    const groups = {}
    data?.slots.forEach((slot) => {
      groups[slot.date] = groups[slot.date] || []
      groups[slot.date].push(slot)
    })
    return groups
  }, [data])

  if (loading) return <DetailsSkeleton />
  if (error) {
    return (
      <div className="container-page py-10">
        <ErrorMessage message={error} onRetry={load} />
      </div>
    )
  }

  const { chef, menu } = data
  const canBook = !user || user.role === 'CUSTOMER'
  const cover = COVER_PHOTOS[chef.id % COVER_PHOTOS.length]
  const visibleMenu = menu.filter((item) => menuFilter === 'all' || (menuFilter === 'veg' ? item.veg : !item.veg))

  const continueToBook = () => {
    if (selectedSlot) navigate(`/book/${id}/${selectedSlot.id}`)
  }

  const scrollToBooking = () => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="pb-24 lg:pb-0">
      <div className="container-page pt-6">
        <Link to="/chefs" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
          <Icon name="arrow" className="h-4 w-4 rotate-180" /> All chefs
        </Link>
        <div className="relative mt-4 h-48 overflow-hidden rounded-[2rem] sm:h-72">
          <img src={cover} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
        </div>

        <div className="relative -mt-16 flex flex-col gap-5 px-2 sm:-mt-20 sm:flex-row sm:items-start sm:px-8">
          <img
            src={chef.photoUrl || FALLBACK_CHEF_PHOTO}
            onError={(e) => (e.currentTarget.src = FALLBACK_CHEF_PHOTO)}
            alt={chef.name}
            className="h-32 w-32 rounded-3xl object-cover shadow-lift ring-4 ring-cream sm:h-40 sm:w-40"
          />
          <div className="flex-1 sm:pt-24">
            <div className="flex flex-wrap items-center gap-2">
              {chef.tier === 'PREMIUM' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-cream">
                  <Icon name="sparkle" className="h-3.5 w-3.5 text-brand" /> Premium
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <Icon name="verified" className="h-3.5 w-3.5" /> Verified
              </span>
            </div>
            <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{chef.name}</h1>
            <p className="mt-1 flex items-center gap-1 text-muted">
              <Icon name="pin" className="h-4 w-4" /> {chef.city}
            </p>
          </div>
        </div>
      </div>

      <div className="container-page mt-10 grid gap-10 lg:grid-cols-3">
        <div className="min-w-0 space-y-12 lg:col-span-2">
          <section>
            <h2 className="text-2xl font-semibold">About {chef.name.split(' ')[0]}</h2>
            <p className="mt-3 text-lg leading-relaxed text-muted">{chef.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {chef.cuisines.map((c) => (
                <span key={c} className="rounded-full border border-line bg-white px-3 py-1 text-sm font-medium">
                  {c}
                </span>
              ))}
            </div>
          </section>

          <section>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">Signature menu</h2>
                <p className="mt-1 text-sm text-muted">Indicative dish prices for a table of four.</p>
              </div>
              <div className="flex rounded-xl bg-line/60 p-1 text-sm">
                {[
                  ['all', 'All'],
                  ['veg', 'Veg'],
                  ['nonveg', 'Non-veg'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setMenuFilter(value)}
                    className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                      menuFilter === value ? 'bg-white shadow-sm' : 'text-muted'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {visibleMenu.length === 0 ? (
              <p className="mt-6 text-muted">No dishes in this category yet.</p>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {visibleMenu.map((item) => (
                  <div key={item.id} className="card flex flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="mt-1">
                          <VegMark veg={item.veg} />
                        </span>
                        <p className="font-semibold">{item.name}</p>
                      </div>
                      <span className="whitespace-nowrap font-semibold text-brand-deep">{formatPrice(item.price)}</span>
                    </div>
                    {item.description && <p className="mt-2 pl-6 text-sm text-muted">{item.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold">What's included in a visit</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {INCLUDED.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand-deep">
                    <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside id="book" className="min-w-0 lg:sticky lg:top-24 lg:h-fit">
          <div className="card overflow-hidden">
            <div className="border-b border-line p-6">
              <p className="text-sm text-muted">Chef fee</p>
              <p className="font-display text-4xl font-semibold">
                {formatPrice(chef.pricePerVisit)}
                <span className="font-sans text-sm font-normal text-muted"> / visit</span>
              </p>
              <p className="mt-1 text-xs text-muted">Up to 3 hours of cooking. Groceries extra, at cost.</p>
            </div>

            <div className="p-6">
              {Object.keys(slotsByDate).length === 0 ? (
                <div className="text-center">
                  <Icon name="calendar" className="mx-auto h-8 w-8 text-muted" />
                  <p className="mt-2 font-semibold">Fully booked</p>
                  <p className="text-sm text-muted">No open slots right now. Check back in a few days.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm font-semibold">Pick a day</p>
                  <div className="no-scrollbar -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
                    {Object.keys(slotsByDate).map((date) => {
                      const { weekday, day, month } = dateParts(date)
                      const active = date === selectedDate
                      return (
                        <button
                          key={date}
                          onClick={() => {
                            setSelectedDate(date)
                            setSelectedSlot(null)
                          }}
                          className={`flex w-16 shrink-0 flex-col items-center rounded-xl border py-2 transition ${
                            active ? 'border-brand bg-brand text-white shadow-md shadow-brand/30' : 'border-line bg-white hover:border-brand'
                          }`}
                        >
                          <span className={`text-xs ${active ? 'text-white/80' : 'text-muted'}`}>{weekday}</span>
                          <span className="font-display text-xl font-semibold">{day}</span>
                          <span className={`text-xs ${active ? 'text-white/80' : 'text-muted'}`}>{month}</span>
                        </button>
                      )
                    })}
                  </div>

                  <p className="mt-5 text-sm font-semibold">Pick a time</p>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {(slotsByDate[selectedDate] || []).map((slot) => {
                      const active = selectedSlot?.id === slot.id
                      return (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition ${
                            active ? 'border-brand bg-brand/10 text-brand-deep' : 'border-line bg-white hover:border-brand'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icon name="clock" className="h-4 w-4" />
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </span>
                          {active && <Icon name="check" className="h-4 w-4" strokeWidth={2.5} />}
                        </button>
                      )
                    })}
                  </div>

                  {canBook ? (
                    <button onClick={continueToBook} disabled={!selectedSlot} className="btn-primary mt-6 w-full py-3">
                      {selectedSlot ? 'Continue to book' : 'Select a time to continue'}
                    </button>
                  ) : (
                    <p className="mt-6 rounded-xl bg-line/50 p-3 text-center text-sm text-muted">
                      Log in with a customer account to book this chef.
                    </p>
                  )}
                  <p className="mt-3 text-center text-xs text-muted">You won't be charged yet. Free cancellation.</p>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-cream/95 p-3 backdrop-blur lg:hidden">
        <div className="container-page flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-xl font-semibold">{formatPrice(chef.pricePerVisit)}</p>
            <p className="text-xs text-muted">per visit</p>
          </div>
          {selectedSlot && canBook ? (
            <button onClick={continueToBook} className="btn-primary px-6 py-3">
              Book {dateParts(selectedSlot.date).day} {dateParts(selectedSlot.date).month}
            </button>
          ) : (
            <button onClick={scrollToBooking} className="btn-primary px-6 py-3">
              Choose a slot
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailsSkeleton() {
  return (
    <div className="container-page pt-12">
      <div className="skeleton h-48 rounded-[2rem] sm:h-72" />
      <div className="mt-6 flex gap-5">
        <div className="skeleton h-32 w-32 rounded-3xl" />
        <div className="flex-1 space-y-3 pt-6">
          <div className="skeleton h-8 w-1/3" />
          <div className="skeleton h-4 w-1/5" />
        </div>
      </div>
      <div className="mt-10 space-y-3">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-2/3" />
      </div>
    </div>
  )
}
