// the square dot mark used on Indian food packaging
export default function VegMark({ veg }) {
  const color = veg ? 'border-green-700 text-green-700' : 'border-red-700 text-red-700'
  return (
    <span
      title={veg ? 'Vegetarian' : 'Non-vegetarian'}
      className={`inline-flex h-4 w-4 shrink-0 items-center justify-center border-2 ${color}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
    </span>
  )
}
