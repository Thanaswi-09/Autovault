import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import VehicleForm from '../components/VehicleForm'
import api from '../api/client'

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [modal, setModal] = useState(null)
  const [restockQty, setRestockQty] = useState('')

  async function fetchVehicles() {
    setLoading(true)
    try {
      const { data } = await api.get('/vehicles')
      setVehicles(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVehicles() }, [])

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleAdd(payload) {
    setFormLoading(true)
    try {
      await api.post('/vehicles', payload)
      showToast('Vehicle added successfully')
      setModal(null)
      fetchVehicles()
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to add vehicle', 'error')
    } finally { setFormLoading(false) }
  }

  async function handleEdit(payload) {
    setFormLoading(true)
    try {
      await api.put(`/vehicles/${modal.vehicle.id}`, payload)
      showToast('Vehicle updated successfully')
      setModal(null)
      fetchVehicles()
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to update vehicle', 'error')
    } finally { setFormLoading(false) }
  }

  async function handleDelete() {
    setFormLoading(true)
    try {
      await api.delete(`/vehicles/${modal.vehicle.id}`)
      showToast('Vehicle deleted')
      setModal(null)
      fetchVehicles()
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to delete vehicle', 'error')
    } finally { setFormLoading(false) }
  }

  async function handleRestock() {
    const qty = parseInt(restockQty)
    if (!qty || qty <= 0) { showToast('Enter a valid quantity', 'error'); return }
    setFormLoading(true)
    try {
      await api.post(`/vehicles/${modal.vehicle.id}/restock`, { quantity: qty })
      showToast('Restocked successfully')
      setModal(null)
      setRestockQty('')
      fetchVehicles()
    } catch (err) {
      showToast(err.response?.data?.detail || 'Restock failed', 'error')
    } finally { setFormLoading(false) }
  }

  const totalVehicles = vehicles.length
  const totalStock = vehicles.reduce((sum, v) => sum + v.quantity, 0)
  const outOfStock = vehicles.filter(v => v.quantity === 0).length

  const stats = [
    { label: 'Total Models', value: totalVehicles, icon: '🚗', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-100' },
    { label: 'Total Stock', value: totalStock, icon: '📦', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
    { label: 'Out of Stock', value: outOfStock, icon: '⚠️', bg: outOfStock > 0 ? 'bg-red-50' : 'bg-yellow-50', text: outOfStock > 0 ? 'text-red-600' : 'text-yellow-700', border: outOfStock > 0 ? 'border-red-100' : 'border-yellow-100' },
  ]

  const inputClass = "w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition placeholder-gray-400"

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold border ${
          toast.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Inventory Management</h2>
            <p className="text-gray-500 mt-1">Add, edit, restock, and remove vehicles</p>
          </div>
          <button
            onClick={() => setModal({ type: 'add' })}
            className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md shadow-sky-200 flex items-center gap-2"
          >
            <span className="text-base leading-none">+</span> Add Vehicle
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, icon, bg, text, border }) => (
            <div key={label} className={`${bg} border ${border} rounded-2xl p-5`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                <span className="text-2xl">{icon}</span>
              </div>
              <p className={`text-4xl font-extrabold ${text}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Loading inventory...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-800 text-xl font-bold">No vehicles in inventory</p>
            <p className="text-gray-400 text-sm mt-2">Click "Add Vehicle" to get started</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Make', 'Model', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {vehicles.map(vehicle => (
                  <tr key={vehicle.id} className="hover:bg-sky-50/50 transition">
                    <td className="px-5 py-4 font-bold text-gray-900">{vehicle.make}</td>
                    <td className="px-5 py-4 text-gray-600">{vehicle.model}</td>
                    <td className="px-5 py-4">
                      <span className="bg-sky-100 text-sky-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                        {vehicle.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-900 font-semibold">₹{vehicle.price.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        vehicle.quantity === 0
                          ? 'bg-red-100 text-red-600'
                          : vehicle.quantity <= 3
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {vehicle.quantity === 0 ? 'Out of stock' : `${vehicle.quantity} units`}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setModal({ type: 'edit', vehicle })}
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition font-semibold">
                          Edit
                        </button>
                        <button onClick={() => { setRestockQty(''); setModal({ type: 'restock', vehicle }) }}
                          className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg transition font-semibold">
                          Restock
                        </button>
                        <button onClick={() => setModal({ type: 'delete', vehicle })}
                          className="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded-lg transition font-semibold">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-2xl">

            {(modal.type === 'add' || modal.type === 'edit') && (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-5">
                  {modal.type === 'add' ? '🚗 Add New Vehicle' : '✏️ Edit Vehicle'}
                </h3>
                <VehicleForm
                  initial={modal.vehicle}
                  onSubmit={modal.type === 'add' ? handleAdd : handleEdit}
                  onCancel={() => setModal(null)}
                  loading={formLoading}
                />
              </>
            )}

            {modal.type === 'restock' && (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-1">📦 Restock Vehicle</h3>
                <p className="text-gray-500 text-sm mb-5">
                  {modal.vehicle.make} {modal.vehicle.model} — current stock:{' '}
                  <span className="text-gray-900 font-bold">{modal.vehicle.quantity}</span>
                </p>
                <input
                  type="number" value={restockQty} onChange={e => setRestockQty(e.target.value)}
                  placeholder="Quantity to add" min="1" className={`${inputClass} mb-4`}
                />
                <div className="flex gap-3">
                  <button onClick={handleRestock} disabled={formLoading}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition">
                    {formLoading ? 'Restocking...' : 'Confirm Restock'}
                  </button>
                  <button onClick={() => setModal(null)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl transition">
                    Cancel
                  </button>
                </div>
              </>
            )}

            {modal.type === 'delete' && (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-2">🗑️ Delete Vehicle</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Are you sure you want to delete{' '}
                  <span className="text-gray-900 font-bold">{modal.vehicle.make} {modal.vehicle.model}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button onClick={handleDelete} disabled={formLoading}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition">
                    {formLoading ? 'Deleting...' : 'Delete Vehicle'}
                  </button>
                  <button onClick={() => setModal(null)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl transition">
                    Cancel
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
