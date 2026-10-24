import { useEffect, useState } from 'react'
import { addMenuItem, deleteMenuItem, getMyMenu, updateMenuItem } from '../../api/chefDashboard'
import { getErrorMessage } from '../../api/client'
import EmptyState from '../EmptyState'
import ErrorMessage from '../ErrorMessage'
import Loader from '../Loader'
import VegMark from '../VegMark'
import { formatPrice } from '../../utils/format'

const EMPTY_FORM = { name: '', description: '', price: '', veg: true }

export default function MenuManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getMyMenu()
      .then(setItems)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = { ...form, price: Number(form.price) }
    try {
      if (editingId) {
        const updated = await updateMenuItem(editingId, payload)
        setItems((list) => list.map((i) => (i.id === editingId ? updated : i)))
      } else {
        const created = await addMenuItem(payload)
        setItems((list) => [...list, created])
      }
      resetForm()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setForm({ name: item.name, description: item.description || '', price: item.price, veg: item.veg })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this dish from your menu?')) return
    try {
      await deleteMenuItem(id)
      setItems((list) => list.filter((i) => i.id !== id))
      if (editingId === id) resetForm()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) return <Loader />

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form onSubmit={handleSubmit} className="card h-fit space-y-4 p-6 lg:col-span-2">
        <h2 className="text-xl font-semibold">{editingId ? 'Edit dish' : 'Add a dish'}</h2>
        <ErrorMessage message={error} />
        <div>
          <label className="label" htmlFor="dish-name">
            Dish name
          </label>
          <input
            id="dish-name"
            required
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label" htmlFor="dish-desc">
            Description
          </label>
          <textarea
            id="dish-desc"
            rows={2}
            className="input"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="dish-price">
              Price (INR)
            </label>
            <input
              id="dish-price"
              type="number"
              min={0}
              required
              className="input"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="dish-type">
              Type
            </label>
            <select
              id="dish-type"
              className="input"
              value={form.veg ? 'veg' : 'nonveg'}
              onChange={(e) => setForm({ ...form, veg: e.target.value === 'veg' })}
            >
              <option value="veg">Veg</option>
              <option value="nonveg">Non-veg</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? 'Saving...' : editingId ? 'Update dish' : 'Add dish'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-ghost">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="lg:col-span-3">
        {items.length === 0 ? (
          <EmptyState title="Your menu is empty" text="Add three or four signature dishes so customers know what to expect." />
        ) : (
          <ul className="card divide-y divide-line">
            {items.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4 p-5">
                <div className="flex gap-3">
                  <span className="mt-1">
                    <VegMark veg={item.veg} />
                  </span>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    {item.description && <p className="text-sm text-muted">{item.description}</p>}
                    <p className="mt-1 text-sm font-medium">{formatPrice(item.price)}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(item)} className="btn-ghost px-3 py-1.5">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="btn-ghost px-3 py-1.5 text-red-700">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
