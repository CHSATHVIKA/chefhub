import { Link } from 'react-router-dom'

const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Kolkata']

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-cream/70">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="" className="h-8 w-8" />
            <span className="font-display text-xl font-semibold text-cream">ChefHub</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Verified home chefs for family dinners, birthdays and weekend lunches. Real food, cooked fresh in your own
            kitchen.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-cream">Cities</p>
          <ul className="mt-4 space-y-2 text-sm">
            {cities.map((city) => (
              <li key={city}>
                <Link to={`/chefs?city=${city}`} className="hover:text-cream">
                  Chefs in {city}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-cream">ChefHub</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/chefs" className="hover:text-cream">
                Find a chef
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-cream">
                Become a ChefHub chef
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-cream">
                Log in
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} ChefHub. Built with Spring Boot and React.</p>
          <p>Made in India</p>
        </div>
      </div>
    </footer>
  )
}
