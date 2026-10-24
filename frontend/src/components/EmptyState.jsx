import Icon from './Icon'

export default function EmptyState({ title, text, action, icon = 'hat' }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-card/60 px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
        <Icon name={icon} className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      {text && <p className="mt-2 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
