import { useEffect, useState } from 'react'
import { addMenuItem, deleteMenuItem, getMyMenu, updateMenuItem } from '../../api/chefDashboard'
import { getErrorMessage } from '../../api/client'
import { useToast } from '../../context/ToastContext'
import EmptyState from '../EmptyState'
import ErrorMessage from '../ErrorMessage'
import Icon from '../Icon'
import Loader from '../Loader'
import VegMark from '../VegMark'
import { formatPrice } from '../../utils/format'

const EMPTY_FORM = { name: '', description: '', price: '', veg: true }

export default function MenuManager() {
  const toast = useToast()
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
        toast('Dish updated')
      } else {
        const created = await addMenuItem(payload)
        setItems((list) => [...list, created])
        toast(`${created.name} added to your menu`)
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
      toast('Dish removed')
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    }
  }

  if (loading) return <Loader />

  return (
    <div className="grid gap-8 lg:grid-cols-5">
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
            <p className="label">Type</p>
            <div className="flex rounded-xl bg-line/60 p-1">
              {[
                [true, 'Veg'],
                [false, 'Non-veg'],
              ].map(([veg, label]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setForm({ ...form, veg })}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
                    form.veg === veg ? 'bg-white shadow-sm' : 'text-muted'
                  }`}
                >
                  <VegMark veg={veg} />
                  {label}
                </button>
              ))}
            </div>
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
          <EmptyState
            title="Your menu is empty"
            text="Add three or four signature dishes so customers know what to expect."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.id}
                className={`card flex flex-col p-4 transition ${editingId === item.id ? 'ring-2 ring-brand' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span className="mt-1">
                      <VegMark veg={item.veg} />
                    </span>
                    <p className="font-semibold">{item.name}</p>
                  </div>
                  <span className="whitespace-nowrap font-semibold text-brand-deep">{formatPrice(item.price)}</span>
                </div>
                {item.description && <p className="mt-1 pl-6 text-sm text-muted">{item.description}</p>}
                <div className="mt-auto flex justify-end gap-1 pt-3">
                  <button onClick={() => startEdit(item)} className="btn-ghost px-3 py-1.5">
                    <Icon name="edit" className="h-4 w-4" /> Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="btn-ghost px-3 py-1.5 text-red-700">
                    <Icon name="trash" className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
