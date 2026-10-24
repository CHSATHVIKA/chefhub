import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="container-page flex flex-col gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-display text-base font-semibold text-ink">ChefHub</span> &middot; Home chefs in
          Mumbai, Delhi, Bengaluru, Hyderabad and Kolkata.
        </p>
        <div className="flex gap-5">
          <Link to="/chefs" className="hover:text-ink">
            Find a chef
          </Link>
          <Link to="/register" className="hover:text-ink">
            Cook with us
          </Link>
        </div>
      </div>
    </footer>
  )
}
