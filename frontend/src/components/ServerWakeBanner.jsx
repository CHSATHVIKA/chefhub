import { useEffect, useState } from 'react'

export default function ServerWakeBanner() {
  const [waking, setWaking] = useState(false)

  useEffect(() => {
    const onChange = (e) => setWaking(e.detail)
    window.addEventListener('server-waking', onChange)
    return () => window.removeEventListener('server-waking', onChange)
  }, [])

  if (!waking) return null

  return (
    <div className="fixed inset-x-0 top-16 z-40 flex justify-center px-4">
      <div className="flex animate-fade-up items-center gap-3 rounded-full bg-ink px-5 py-2.5 text-sm text-cream shadow-lift">
        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-cream/30 border-t-brand" />
        Waking up the server. The first load can take up to a minute on free hosting.
      </div>
    </div>
  )
}
