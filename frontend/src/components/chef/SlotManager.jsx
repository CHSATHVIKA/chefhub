import { useEffect, useState } from 'react'
import { addSlot, deleteSlot, getMySlots } from '../../api/chefDashboard'
import { getErrorMessage } from '../../api/client'
import { useToast } from '../../context/ToastContext'
import EmptyState from '../EmptyState'
import ErrorMessage from '../ErrorMessage'
import Icon from '../Icon'
import Loader from '../Loader'
import { formatDate, formatTime, todayIso } from '../../utils/format'

const PRESETS = [
  { label: 'Breakfast', startTime: '08:00', endTime: '11:00' },
  { label: 'Lunch', startTime: '12:00', endTime: '15:00' },
  { label: 'Dinner', startTime: '19:00', endTime: '22:00' },
]

export default function SlotManager() {
  const toast = useToast()
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ date: todayIso(), startTime: '19:00', endTime: '22:00' })
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
      toast(`Slot added for ${formatDate(created.date)}`)
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
      toast('Slot removed')
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    }
  }

  if (loading) return <Loader />

  const grouped = {}
  slots
    .filter((s) => s.date >= todayIso())
    .forEach((slot) => {
      grouped[slot.date] = grouped[slot.date] || []
      grouped[slot.date].push(slot)
    })

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <form onSubmit={handleSubmit} className="card h-fit space-y-5 p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">Add availability</h2>
        <ErrorMessage message={error} />
        <div>
          <label className="label" htmlFor="slot-date">
            Date
          </label>
          <input
            id="slot-date"
            type="date"
            min={todayIso()}
            required
            className="input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div>
          <p className="label">Quick pick</p>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((preset) => {
              const active = form.startTime === preset.startTime && form.endTime === preset.endTime
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setForm({ ...form, startTime: preset.startTime, endTime: preset.endTime })}
                  className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                    active ? 'border-brand bg-brand/10 text-brand-deep' : 'border-line bg-white hover:border-brand'
                  }`}
                >
                  {preset.label}
                  <span className="block font-normal text-muted">{formatTime(preset.startTime)}</span>
                </button>
              )
            })}
          </div>
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
          <Icon name="plus" className="h-4 w-4" />
          {saving ? 'Adding...' : 'Add slot'}
        </button>
      </form>

      <div className="lg:col-span-3">
        {Object.keys(grouped).length === 0 ? (
          <EmptyState
            icon="calendar"
            title="No upcoming slots"
            text="Add a few lunch or dinner slots so customers can book you."
          />
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([date, daySlots]) => (
              <div key={date} className="card p-4">
                <p className="text-sm font-semibold">{formatDate(date)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {daySlots.map((slot) => (
                    <span
                      key={slot.id}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                        slot.booked ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-line bg-white'
                      }`}
                    >
                      <Icon name="clock" className="h-4 w-4" />
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      {slot.booked ? (
                        <span className="text-xs font-semibold">Booked</span>
                      ) : (
                        <button
                          onClick={() => handleDelete(slot.id)}
                          className="text-muted hover:text-red-600"
                          aria-label="Remove slot"
                        >
                          <Icon name="close" className="h-4 w-4" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
