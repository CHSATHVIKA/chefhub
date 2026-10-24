import { Link } from 'react-router-dom'
import { FALLBACK_CHEF_PHOTO, formatPrice } from '../utils/format'

export default function ChefCard({ chef }) {
  return (
    <Link
      to={`/chefs/${chef.id}`}
      className="card group flex flex-col overflow-hidden transition-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-line">
        <img
          src={chef.photoUrl || FALLBACK_CHEF_PHOTO}
          onError={(e) => (e.currentTarget.src = FALLBACK_CHEF_PHOTO)}
          alt={chef.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {chef.tier === 'PREMIUM' && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-xs font-semibold text-cream">
            Premium
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold">{chef.name}</h3>
          <span className="whitespace-nowrap text-sm text-muted">{chef.city}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {chef.cuisines.map((c) => (
            <span key={c} className="chip">
              {c}
            </span>
          ))}
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-muted">{chef.bio}</p>
        <p className="mt-auto pt-4 text-sm">
          <span className="text-lg font-semibold text-ink">{formatPrice(chef.pricePerVisit)}</span>
          <span className="text-muted"> per visit</span>
        </p>
      </div>
    </Link>
  )
}
