export const FALLBACK_CHEF_PHOTO =
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80'

// food photos used as cover images on chef pages
export const COVER_PHOTOS = [
  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1600&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80',
  'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=1600&q=80',
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1600&q=80',
]

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

export function dateParts(isoDate) {
  const d = new Date(`${isoDate}T00:00:00`)
  return {
    weekday: d.toLocaleDateString('en-IN', { weekday: 'short' }),
    day: d.getDate(),
    month: d.toLocaleDateString('en-IN', { month: 'short' }),
  }
}

export function formatTime(time) {
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`
}

export const formatSlot = (slot) =>
  `${formatDate(slot.date)}, ${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`

// en-CA gives YYYY-MM-DD in the local time zone
export const todayIso = () => new Date().toLocaleDateString('en-CA')

export function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}
