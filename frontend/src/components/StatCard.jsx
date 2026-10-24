import Icon from './Icon'

export default function StatCard({ label, value, icon, hint }) {
  return (
    <div className="card flex items-start justify-between p-5">
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      </div>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand-deep">
        <Icon name={icon} />
      </span>
    </div>
  )
}
