export const FALLBACK_CHEF_PHOTO =
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80'

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
    amount || 0
  )
}

export function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function formatTime(time) {
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`
}

export const formatSlot = (slot) =>
  `${formatDate(slot.date)}, ${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`
