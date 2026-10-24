export default function Tabs({ tabs, active, onChange, counts = {} }) {
  return (
    <div className="no-scrollbar mt-8 flex gap-1 overflow-x-auto border-b border-line">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`-mb-px inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
            active === tab ? 'border-brand text-brand-deep' : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          {tab}
          {counts[tab] > 0 && (
            <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">{counts[tab]}</span>
          )}
        </button>
      ))}
    </div>
  )
}
