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
    `w-full bg-gray-50 text-gray-900 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition placeholder-gray-400 ${
      errors[field] ? 'border-red-400' : 'border-gray-200'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Make</label>
          <input name="make" value={form.make} onChange={handleChange} className={inputClass('make')} placeholder="Toyota" />
          {errors.make && <p className="text-red-500 text-xs mt-1">{errors.make}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Model</label>
          <input name="model" value={form.model} onChange={handleChange} className={inputClass('model')} placeholder="Camry" />
          {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
        <select name="category" value={form.category} onChange={handleChange} className={inputClass('category')}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price ($)</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} className={inputClass('price')} placeholder="25000" min="0" />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Quantity</label>
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} className={inputClass('quantity')} placeholder="5" min="0" />
          {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition shadow-md shadow-sky-200">
          {loading ? 'Saving...' : initial ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl transition">
          Cancel
        </button>
      </div>
    </form>
  )
}
