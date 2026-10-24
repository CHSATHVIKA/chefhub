import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchChefs } from '../api/chefs'
import { getErrorMessage } from '../api/client'
import ChefCard from '../components/ChefCard'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Icon from '../components/Icon'
import { ChefCardSkeleton } from '../components/Skeletons'

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata']
const QUICK_CUISINES = ['North Indian', 'South Indian', 'Biryani', 'Bengali', 'Punjabi', 'Continental']
const TIERS = [
  { value: '', label: 'All' },
  { value: 'STANDARD', label: 'Standard' },
  { value: 'PREMIUM', label: 'Premium' },
]
const PAGE_SIZE = 6

export default function ChefList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const city = searchParams.get('city') || ''
  const cuisine = searchParams.get('cuisine') || ''
  const tier = searchParams.get('tier') || ''
  const page = Number(searchParams.get('page') || 0)

  const [cuisineInput, setCuisineInput] = useState(cuisine)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadChefs = () => {
    setLoading(true)
    setError('')
    searchChefs({
      city: city || undefined,
      cuisine: cuisine || undefined,
      tier: tier || undefined,
      page,
      size: PAGE_SIZE,
    })
      .then(setResult)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(loadChefs, [searchParams])
  useEffect(() => {
    setCuisineInput(cuisine)
  }, [cuisine])

  // any filter change resets to the first page
  const updateFilter = (key, value) => {
    const params = Object.fromEntries(searchParams)
    delete params.page
    if (value) params[key] = value
    else delete params[key]
    setSearchParams(params)
  }

  const clearFilters = () => {
    setCuisineInput('')
    setSearchParams({})
  }

  const goToPage = (next) => {
    setSearchParams({ ...Object.fromEntries(searchParams), page: next })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasFilters = city || cuisine || tier

  return (
    <div className="container-page py-10">
      <div className="animate-fade-up">
        <p className="eyebrow">{city ? `Chefs in ${city}` : 'All cities'}</p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Find your chef</h1>
        <p className="mt-3 max-w-xl text-muted">
          Every chef here is verified by our team. Prices are per visit, and groceries are billed at cost.
        </p>
      </div>

      <div className="card sticky top-[72px] z-20 mt-8 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            updateFilter('cuisine', cuisineInput.trim())
          }}
          className="grid gap-2 md:grid-cols-[180px_1fr_auto_auto] md:items-center"
        >
          <label className="flex items-center gap-2 rounded-xl border border-line bg-white px-3">
            <Icon name="pin" className="h-4 w-4 text-brand" />
            <select
              aria-label="City"
              className="w-full bg-transparent py-2.5 text-sm focus:outline-none"
              value={city}
              onChange={(e) => updateFilter('city', e.target.value)}
            >
              <option value="">All cities</option>
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-line bg-white px-3">
            <Icon name="search" className="h-4 w-4 text-brand" />
            <input
              id="cuisine"
              aria-label="Cuisine"
              className="w-full bg-transparent py-2.5 text-sm focus:outline-none"
              placeholder="Search a cuisine and press enter"
              value={cuisineInput}
              onChange={(e) => setCuisineInput(e.target.value)}
            />
          </label>
          <div className="flex rounded-xl bg-line/60 p-1">
            {TIERS.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => updateFilter('tier', t.value)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  tier === t.value ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {QUICK_CUISINES.map((c) => (
          <button
            key={c}
            onClick={() => updateFilter('cuisine', cuisine === c ? '' : c)}
            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              cuisine === c
                ? 'border-brand bg-brand text-white'
                : 'border-line bg-white text-ink hover:border-brand hover:text-brand-deep'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {!loading && !error && result && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-muted">
              <span className="font-semibold text-ink">{result.totalElements}</span> chef
              {result.totalElements === 1 ? '' : 's'} available
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-sm font-semibold text-brand-deep hover:underline">
                Clear filters
              </button>
            )}
          </div>
        )}

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <ChefCardSkeleton key={i} />
            ))}
          </div>
        )}
        {!loading && error && <ErrorMessage message={error} onRetry={loadChefs} />}
        {!loading && !error && result?.content.length === 0 && (
          <EmptyState
            icon="search"
            title="No chefs match these filters"
            text="Try another city or clear the cuisine filter to see everyone available."
            action={
              <button onClick={clearFilters} className="btn-outline">
                Clear filters
              </button>
            }
          />
        )}
        {!loading && !error && result?.content.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.content.map((chef, i) => (
                <div key={chef.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <ChefCard chef={chef} />
                </div>
              ))}
            </div>
            {result.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button className="btn-outline" disabled={page === 0} onClick={() => goToPage(page - 1)}>
                  Previous
                </button>
                {Array.from({ length: result.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`h-10 w-10 rounded-xl text-sm font-semibold ${
                      i === page ? 'bg-ink text-cream' : 'text-muted hover:bg-line/60'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="btn-outline"
                  disabled={page + 1 >= result.totalPages}
                  onClick={() => goToPage(page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
