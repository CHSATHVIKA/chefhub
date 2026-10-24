export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="mt-8 flex gap-1 overflow-x-auto border-b border-line">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
            active === tab ? 'border-brand text-brand-deep' : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
