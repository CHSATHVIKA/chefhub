export default function EmptyState({ title, text, action }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
        <svg className="h-6 w-6 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M3 11h18M5 11a7 7 0 0 1 14 0M4 15h16l-1 4H5z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      {text && <p className="mt-2 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
