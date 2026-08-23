import { useState, useEffect } from 'react'

const CATEGORIES = ['Sedan', 'SUV', 'Coupe', 'Truck', 'Hatchback', 'Convertible']

export default function VehicleForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    make: '', model: '', category: 'Sedan', price: '', quantity: '',
    ...initial,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initial) setForm({ ...form, ...initial })
  }, [initial])

  function validate() {
    const e = {}
    if (!form.make.trim()) e.make = 'Make is required'
    if (!form.model.trim()) e.model = 'Model is required'
    if (form.price === '' || Number(form.price) < 0) e.price = 'Valid price required'
    if (form.quantity === '' || Number(form.quantity) < 0) e.quantity = 'Valid quantity required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      make: form.make.trim(),
      model: form.model.trim(),
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity),
    })
  }

  const inputClass = (field) =>
    `w-full bg-gray-800 text-white border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition ${errors[field] ? 'border-red-500' : 'border-gray-700'}`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Make</label>
          <input name="make" value={form.make} onChange={handleChange} className={inputClass('make')} placeholder="Toyota" />
          {errors.make && <p className="text-red-400 text-xs mt-1">{errors.make}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Model</label>
          <input name="model" value={form.model} onChange={handleChange} className={inputClass('model')} placeholder="Camry" />
          {errors.model && <p className="text-red-400 text-xs mt-1">{errors.model}</p>}
        </div>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Category</label>
        <select name="category" value={form.category} onChange={handleChange} className={inputClass('category')}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Price ($)</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} className={inputClass('price')} placeholder="25000" min="0" />
          {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Quantity</label>
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} className={inputClass('quantity')} placeholder="5" min="0" />
          {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity}</p>}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition">
          {loading ? 'Saving...' : initial ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 rounded-lg transition">
          Cancel
        </button>
      </div>
    </form>
  )
}
