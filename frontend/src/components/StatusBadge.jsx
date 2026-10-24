const styles = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-sky-100 text-sky-800',
  CANCELLED: 'bg-stone-200 text-stone-700',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] || ''}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}
