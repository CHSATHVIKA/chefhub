import { useEffect, useState } from 'react'
import { addSlot, deleteSlot, getMySlots } from '../../api/chefDashboard'
import { getErrorMessage } from '../../api/client'
import EmptyState from '../EmptyState'
import ErrorMessage from '../ErrorMessage'
import Loader from '../Loader'
import { formatSlot } from '../../utils/format'

// en-CA gives YYYY-MM-DD in the local time zone
const today = () => new Date().toLocaleDateString('en-CA')

export default function SlotManager() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ date: today(), startTime: '19:00', endTime: '22:00' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getMySlots()
      .then(setSlots)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const created = await addSlot(form)
      setSlots((list) =>
        [...list, created].sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))
      )
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteSlot(id)
      setSlots((list) => list.filter((s) => s.id !== id))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) return <Loader />

  const upcoming = slots.filter((s) => s.date >= today())

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={handleSubmit} className="card h-fit space-y-4 p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">Add availability</h2>
        <ErrorMessage message={error} />
        <div>
          <label className="label" htmlFor="slot-date">
            Date
          </label>
          <input
            id="slot-date"
            type="date"
            min={today()}
            required
            className="input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="slot-start">
              Start
            </label>
            <input
              id="slot-start"
              type="time"
              required
              className="input"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="slot-end">
              End
            </label>
            <input
              id="slot-end"
              type="time"
              required
              className="input"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            />
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? 'Adding...' : 'Add slot'}
        </button>
      </form>

      <div className="lg:col-span-3">
        {upcoming.length === 0 ? (
          <EmptyState title="No upcoming slots" text="Add a few lunch or dinner slots so customers can book you." />
        ) : (
          <ul className="card divide-y divide-line">
            {upcoming.map((slot) => (
              <li key={slot.id} className="flex items-center justify-between gap-3 p-4">
                <span className="text-sm font-medium">{formatSlot(slot)}</span>
                {slot.booked ? (
                  <span className="chip">Booked</span>
                ) : (
                  <button onClick={() => handleDelete(slot.id)} className="btn-ghost px-3 py-1.5 text-red-700">
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
