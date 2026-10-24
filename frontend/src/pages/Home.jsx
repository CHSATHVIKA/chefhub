import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { searchChefs } from '../api/chefs'
import ChefCard from '../components/ChefCard'
import Icon from '../components/Icon'
import { ChefCardSkeleton } from '../components/Skeletons'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=2000&q=80'
const CHEF_CTA_IMAGE = 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?w=1200&q=80'

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Kolkata']

const cuisines = [
  { name: 'Biryani', img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80' },
  { name: 'North Indian', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80' },
  { name: 'South Indian', img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&q=80' },
  { name: 'Tandoor', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80' },
]

const promises = [
  { icon: 'shield', title: 'Verified chefs', text: 'Every chef is reviewed by our team before they go live.' },
  { icon: 'clock', title: 'Confirmed in a day', text: 'Chefs accept or decline your request within 24 hours.' },
  { icon: 'calendar', title: 'Free cancellation', text: 'Plans changed? Cancel any time before the visit.' },
  { icon: 'rupee', title: 'No booking fee', text: 'You pay the chef fee. Groceries are billed at cost.' },
]

const steps = [
  { icon: 'search', title: 'Pick a chef', text: 'Browse by city, cuisine and budget. Read their story and see their signature dishes.' },
  { icon: 'calendar', title: 'Choose a slot', text: 'See real availability, pick lunch or dinner, and tell the chef how many are eating.' },
  { icon: 'hat', title: 'Eat at home', text: 'The chef arrives with a plan, cooks in your kitchen and leaves it spotless.' },
]

export default function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState({ city: '', cuisine: '' })
  const [featured, setFeatured] = useState(null)

  useEffect(() => {
    searchChefs({ size: 3 })
      .then((data) => setFeatured(data.content))
      .catch(() => setFeatured([]))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.city) params.set('city', search.city)
    if (search.cuisine.trim()) params.set('cuisine', search.cuisine.trim())
    navigate(`/chefs?${params}`)
  }

  return (
    <>
      <section className="container-page pt-4 sm:pt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink">
          <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />

          <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:py-28">
            <div className="max-w-2xl animate-fade-up">
              <p className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Home chefs, booked in minutes
              </p>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
                Restaurant-quality food, cooked in <em className="font-medium text-brand">your</em> kitchen.
              </h1>
              <p className="mt-6 max-w-lg text-base text-cream/80 sm:text-lg">
                Book verified home chefs for birthdays, family dinners and weekend lunches. Choose the menu, pick a
                slot, and enjoy the evening.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="mt-10 grid max-w-3xl animate-fade-up gap-2 rounded-2xl bg-cream p-2 shadow-lift sm:grid-cols-[1fr_1.3fr_auto]"
              style={{ animationDelay: '0.1s' }}
            >
              <label className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white">
                <Icon name="pin" className="h-5 w-5 shrink-0 text-brand" />
                <select
                  aria-label="City"
                  className="w-full bg-transparent py-1 text-sm font-medium focus:outline-none"
                  value={search.city}
                  onChange={(e) => setSearch({ ...search, city: e.target.value })}
                >
                  <option value="">Any city</option>
                  {CITIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white sm:border-l sm:border-line">
                <Icon name="search" className="h-5 w-5 shrink-0 text-brand" />
                <input
                  aria-label="Cuisine"
                  className="w-full bg-transparent py-1 text-sm font-medium placeholder:font-normal placeholder:text-muted focus:outline-none"
                  placeholder="Biryani, South Indian, Continental..."
                  value={search.cuisine}
                  onChange={(e) => setSearch({ ...search, cuisine: e.target.value })}
                />
              </label>
              <button type="submit" className="btn-primary px-7 py-3 text-base">
                Book a chef
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream/75">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="verified" className="h-4 w-4 text-brand" /> Every chef reviewed by our team
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="rupee" className="h-4 w-4 text-brand" /> From &#8377;2,200 per visit
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page mt-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((p) => (
            <div key={p.title} className="flex gap-3 rounded-2xl p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand-deep">
                <Icon name={p.icon} />
              </span>
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="mt-0.5 text-sm text-muted">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Browse by cuisine</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">What are you craving?</h2>
          </div>
          <Link to="/chefs" className="hidden items-center gap-1 text-sm font-semibold text-brand-deep sm:inline-flex">
            All cuisines <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {cuisines.map((c) => (
            <Link
              key={c.name}
              to={`/chefs?cuisine=${encodeURIComponent(c.name)}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <img
                src={c.img}
                alt={c.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between text-white">
                <span className="font-display text-xl font-semibold sm:text-2xl">{c.name}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur transition group-hover:bg-brand">
                  <Icon name="arrow" className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Featured</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Chefs cooking this week</h2>
          </div>
          <Link to="/chefs" className="hidden items-center gap-1 text-sm font-semibold text-brand-deep sm:inline-flex">
            See all chefs <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured === null
            ? [1, 2, 3].map((i) => <ChefCardSkeleton key={i} />)
            : featured.map((chef) => <ChefCard key={chef.id} chef={chef} />)}
        </div>
      </section>

      <section className="container-page mt-20">
        <div className="text-center">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">Dinner sorted in three steps</h2>
        </div>
        <div className="relative mt-12 grid gap-8 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-7 hidden border-t-2 border-dashed border-brand/30 md:block" />
          {steps.map((step, i) => (
            <div key={step.title} className="relative text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/30">
                <Icon name={step.icon} className="h-6 w-6" />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted">Step {i + 1}</p>
              <h3 className="mt-1 text-xl font-semibold">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page mt-24">
        <div className="grid overflow-hidden rounded-[2rem] bg-ink md:grid-cols-2">
          <div className="p-8 sm:p-12">
            <p className="eyebrow text-brand">For chefs</p>
            <h2 className="mt-3 text-3xl font-semibold text-cream sm:text-4xl">
              Turn your cooking into a steady income.
            </h2>
            <p className="mt-4 text-cream/70">
              Set your own price, menu and hours. We bring you families in your city who want real home food. No
              commission during our launch.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-cream/85">
              {['Your menu, your price', 'Accept only the slots that suit you', 'Get discovered in your city'].map(
                (point) => (
                  <li key={point} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                      <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                )
              )}
            </ul>
            <Link to="/register" className="btn-primary mt-8 px-6 py-3">
              Join as a chef <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <img src={CHEF_CTA_IMAGE} alt="A cook stirring a pan at home" className="h-64 w-full object-cover md:h-full" />
        </div>
      </section>
    </>
  )
}
