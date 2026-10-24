export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-muted">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
      <span className="text-sm">{text}</span>
    </div>
  )
}
