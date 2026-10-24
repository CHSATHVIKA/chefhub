const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
}

export default function Avatar({ name = '', src, size = 'md' }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} shrink-0 rounded-full object-cover`} />
  }
  return (
    <span
      className={`${sizes[size]} inline-flex shrink-0 items-center justify-center rounded-full bg-brand/15 font-semibold text-brand-deep`}
    >
      {initials}
    </span>
  )
}
