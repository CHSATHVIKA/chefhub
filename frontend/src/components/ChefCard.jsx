import { Link } from 'react-router-dom'
import Icon from './Icon'
import { FALLBACK_CHEF_PHOTO, formatPrice } from '../utils/format'

export default function ChefCard({ chef, preview = false }) {
  const Wrapper = preview ? 'div' : Link

  return (
    <Wrapper
      to={preview ? undefined : `/chefs/${chef.id}`}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-line">
        <img
          src={chef.photoUrl || FALLBACK_CHEF_PHOTO}
          onError={(e) => (e.currentTarget.src = FALLBACK_CHEF_PHOTO)}
          alt={chef.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {chef.tier === 'PREMIUM' && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-ink/85 px-3 py-1 text-xs font-semibold text-cream backdrop-blur">
            <Icon name="sparkle" className="h-3.5 w-3.5 text-brand" />
            Premium
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-cream/95 px-3 py-1 text-xs font-semibold text-ink">
          {formatPrice(chef.pricePerVisit)}
          <span className="font-normal text-muted"> / visit</span>
        </span>
        <div className="absolute inset-x-4 bottom-3 text-white">
          <h3 className="text-2xl font-semibold leading-tight">{chef.name || 'Your name'}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-white/85">
            <Icon name="pin" className="h-4 w-4" />
            {chef.city || 'Your city'}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-1.5">
          {chef.cuisines.map((c) => (
            <span key={c} className="chip">
              {c}
            </span>
          ))}
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{chef.bio}</p>
        <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-sm">
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
            <Icon name="verified" className="h-4 w-4" />
            Verified chef
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-brand-deep transition-transform group-hover:translate-x-0.5">
            View profile
            <Icon name="arrow" className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Wrapper>
  )
}
