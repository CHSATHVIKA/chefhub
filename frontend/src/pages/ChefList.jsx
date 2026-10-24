import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchChefs } from '../api/chefs'
import { getErrorMessage } from '../api/client'
import ChefCard from '../components/ChefCard'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata']
const PAGE_SIZE = 6

export default function ChefList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    cuisine: searchParams.get('cuisine') || '',
    tier: searchParams.get('tier') || '',
  })
  const page = Number(searchParams.get('page') || 0)

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadChefs = () => {
    setLoading(true)
    setError('')
    searchChefs({
      city: searchParams.get('city') || undefined,
      cuisine: searchParams.get('cuisine') || undefined,
      tier: searchParams.get('tier') || undefined,
      page,
      size: PAGE_SIZE,
    })
      .then(setResult)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(loadChefs, [searchParams])

  const applyFilters = (e) => {
    e.preventDefault()
    const params = {}
    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) params[key] = value.trim()
    })
    setSearchParams(params)
  }

  const clearFilters = () => {
    setFilters({ city: '', cuisine: '', tier: '' })
    setSearchParams({})
  }

  const goToPage = (next) => {
    const params = Object.fromEntries(searchParams)
    setSearchParams({ ...params, page: next })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-4xl font-semibold">Find your chef</h1>
      <p className="mt-2 text-muted">Filter by city, cuisine or tier. Prices are per visit, groceries billed at cost.</p>

      <form onSubmit={applyFilters} className="card mt-8 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <div>
          <label className="label" htmlFor="city">
            City
          </label>
          <select
            id="city"
            className="input"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          >
            <option value="">All cities</option>
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="cuisine">
            Cuisine
          </label>
          <input
            id="cuisine"
            className="input"
            placeholder="e.g. Biryani, South Indian"
            value={filters.cuisine}
            onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
          />
        </div>
        <div>
          <label className="label" htmlFor="tier">
            Tier
          </label>
          <select
            id="tier"
            className="input"
            value={filters.tier}
            onChange={(e) => setFilters({ ...filters, tier: e.target.value })}
          >
            <option value="">Any tier</option>
            <option value="STANDARD">Standard</option>
            <option value="PREMIUM">Premium</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1">
            Search
          </button>
          <button type="button" onClick={clearFilters} className="btn-ghost">
            Clear
          </button>
        </div>
      </form>

      <div className="mt-8">
        {loading && <Loader text="Finding chefs..." />}
        {!loading && error && <ErrorMessage message={error} onRetry={loadChefs} />}
        {!loading && !error && result?.content.length === 0 && (
          <EmptyState
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
            <p className="mb-4 text-sm text-muted">
              {result.totalElements} chef{result.totalElements === 1 ? '' : 's'} found
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.content.map((chef) => (
                <ChefCard key={chef.id} chef={chef} />
              ))}
            </div>
            {result.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button className="btn-outline" disabled={page === 0} onClick={() => goToPage(page - 1)}>
                  Previous
                </button>
                <span className="text-sm text-muted">
                  Page {page + 1} of {result.totalPages}
                </span>
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
