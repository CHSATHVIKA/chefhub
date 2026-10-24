export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between">
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="font-semibold underline underline-offset-2">
          Try again
        </button>
      )}
    </div>
  )
}
