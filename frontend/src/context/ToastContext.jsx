import { createContext, useCallback, useContext, useState } from 'react'
import Icon from '../components/Icon'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = (id) => setToasts((list) => list.filter((t) => t.id !== id))

  const show = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((list) => [...list, { id, message, type }])
    setTimeout(() => dismiss(id), 3500)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex animate-slide-in items-start gap-3 rounded-xl bg-ink px-4 py-3 text-sm text-cream shadow-lift"
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
              }`}
            >
              <Icon name={toast.type === 'error' ? 'close' : 'check'} className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => dismiss(toast.id)} className="text-cream/60 hover:text-cream" aria-label="Dismiss">
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
