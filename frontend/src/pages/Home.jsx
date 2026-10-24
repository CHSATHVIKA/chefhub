import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchChefs } from '../api/chefs'
import ChefCard from '../components/ChefCard'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1400&q=80'

const steps = [
  {
    title: 'Pick a chef',
    text: 'Browse cooks in your city by cuisine and budget. Every chef is reviewed by our team before they go live.',
  },
  {
    title: 'Choose a slot',
    text: 'See real availability, pick a lunch or dinner slot, and tell the chef how many people are eating.',
  },
  {
    title: 'Eat at home',
    text: 'The chef confirms, arrives with a plan, cooks in your kitchen and leaves it clean.',
  },
]

const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Kolkata']

const dishes = [
  { src: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&q=80', label: 'Dum biryani' },
  { src: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900&q=80', label: 'Party starters' },
  { src: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900&q=80', label: 'Cooked in your kitchen' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    searchChefs({ size: 3 })
      .then((data) => setFeatured(data.content))
      .catch(() => setFeatured([]))
  }, [])

  return (
    <>
      <section className="container-page grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-deep">Home chefs, booked in minutes</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Restaurant-quality food, cooked in your own kitchen.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted">
            ChefHub connects you with verified home chefs for birthdays, family dinners and weekend lunches. Choose
            the menu, pick a slot, and we take care of the rest.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/chefs" className="btn-primary px-7 py-3 text-base">
              Book a chef
            </Link>
            <Link to="/register" className="btn-outline px-7 py-3 text-base">
              I am a chef
            </Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
            <div>
              <dt className="text-sm text-muted">Cities</dt>
              <dd className="font-display text-2xl font-semibold">5</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Starting at</dt>
              <dd className="font-display text-2xl font-semibold">&#8377;2,200</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Booking fee</dt>
              <dd className="font-display text-2xl font-semibold">Zero</dd>
            </div>
          </dl>
        </div>
        <div className="relative">
          <img
            src={HERO_IMAGE}
            alt="Bowls of curry and rice on a wooden table"
            className="aspect-[4/5] w-full rounded-3xl object-cover shadow-soft md:aspect-[4/5]"
          />
          <div className="card absolute -bottom-6 left-4 right-4 p-4 sm:left-auto sm:right-6 sm:w-64">
            <p className="text-sm font-semibold">Dinner for 8, sorted</p>
            <p className="mt-1 text-sm text-muted">Chef Ananya confirmed your Saturday 7 PM slot.</p>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-3xl font-semibold">How ChefHub works</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="card p-6">
              <span className="font-display text-3xl font-semibold text-brand">0{i + 1}</span>
              <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page grid gap-4 py-4 sm:grid-cols-3">
        {dishes.map((dish) => (
          <figure key={dish.label} className="relative overflow-hidden rounded-2xl">
            <img src={dish.src} alt={dish.label} className="aspect-[4/3] w-full object-cover" loading="lazy" />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-cream/95 px-3 py-1 text-sm font-medium">
              {dish.label}
            </figcaption>
          </figure>
        ))}
      </section>

      {featured.length > 0 && (
        <section className="container-page py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold">Chefs cooking this week</h2>
              <p className="mt-2 text-muted">Hand-picked cooks, reviewed by our team before they go live.</p>
            </div>
            <Link to="/chefs" className="hidden text-sm font-semibold text-brand-deep hover:underline sm:block">
              See all chefs
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((chef) => (
              <ChefCard key={chef.id} chef={chef} />
            ))}
          </div>
        </section>
      )}

      <section className="container-page py-8">
        <div className="card flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Find a chef near you</h2>
            <p className="mt-1 text-muted">We are live in five cities, with more coming soon.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <Link
                key={city}
                to={`/chefs?city=${city}`}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium hover:border-brand hover:text-brand-deep"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
