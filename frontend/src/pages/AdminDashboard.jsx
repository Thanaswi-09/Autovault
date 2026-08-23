import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import VehicleForm from '../components/VehicleForm'
import api from '../api/client'

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [modal, setModal] = useState(null) // { type: 'add' | 'edit' | 'restock' | 'delete', vehicle? }
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
    setTimeout(() => setToast(null), 3000)
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
    } finally {
      setFormLoading(false)
    }
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
    } finally {
      setFormLoading(false)
    }
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
    } finally {
      setFormLoading(false)
    }
  }

  async function handleRestock() {
    const qty = parseInt(restockQty)
    if (!qty || qty <= 0) {
      showToast('Enter a valid quantity', 'error')
      return
    }
    setFormLoading(true)
    try {
      await api.post(`/vehicles/${modal.vehicle.id}/restock`, { quantity: qty })
      showToast(`Restocked successfully`)
      setModal(null)
      setRestockQty('')
      fetchVehicles()
    } catch (err) {
      showToast(err.response?.data?.detail || 'Restock failed', 'error')
    } finally {
      setFormLoading(false)
    }
  }

  const totalVehicles = vehicles.length
  const totalStock = vehicles.reduce((sum, v) => sum + v.quantity, 0)
  const outOfStock = vehicles.filter(v => v.quantity === 0).length

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium
          ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Inventory Management</h2>
            <p className="text-gray-400 text-sm mt-1">Manage your vehicle inventory</p>
          </div>
          <button
            onClick={() => setModal({ type: 'add' })}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            + Add Vehicle
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Models', value: totalVehicles },
            { label: 'Total Stock', value: totalStock },
            { label: 'Out of Stock', value: outOfStock, warn: outOfStock > 0 },
          ].map(({ label, value, warn }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-sm">{label}</p>
              <p className={`text-3xl font-bold mt-1 ${warn ? 'text-red-400' : 'text-white'}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading inventory...</div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No vehicles in inventory</p>
            <p className="text-gray-600 text-sm mt-1">Click "Add Vehicle" to get started</p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                <tr>
                  {['Make', 'Model', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {vehicles.map(vehicle => (
                  <tr key={vehicle.id} className="hover:bg-gray-800/50 transition">
                    <td className="px-5 py-4 font-medium text-white">{vehicle.make}</td>
                    <td className="px-5 py-4 text-gray-300">{vehicle.model}</td>
                    <td className="px-5 py-4">
                      <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                        {vehicle.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white">${vehicle.price.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${vehicle.quantity === 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {vehicle.quantity}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setModal({ type: 'edit', vehicle })}
                          className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition">
                          Edit
                        </button>
                        <button onClick={() => { setRestockQty(''); setModal({ type: 'restock', vehicle }) }}
                          className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded transition">
                          Restock
                        </button>
                        <button onClick={() => setModal({ type: 'delete', vehicle })}
                          className="text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-1.5 rounded transition">
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">

            {(modal.type === 'add' || modal.type === 'edit') && (
              <>
                <h3 className="text-lg font-semibold text-white mb-5">
                  {modal.type === 'add' ? 'Add New Vehicle' : 'Edit Vehicle'}
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
                <h3 className="text-lg font-semibold text-white mb-1">Restock Vehicle</h3>
                <p className="text-gray-400 text-sm mb-5">
                  {modal.vehicle.make} {modal.vehicle.model} — current stock: {modal.vehicle.quantity}
                </p>
                <input
                  type="number"
                  value={restockQty}
                  onChange={e => setRestockQty(e.target.value)}
                  placeholder="Quantity to add"
                  min="1"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 mb-4"
                />
                <div className="flex gap-3">
                  <button onClick={handleRestock} disabled={formLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition">
                    {formLoading ? 'Restocking...' : 'Confirm Restock'}
                  </button>
                  <button onClick={() => setModal(null)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 rounded-lg transition">
                    Cancel
                  </button>
                </div>
              </>
            )}

            {modal.type === 'delete' && (
              <>
                <h3 className="text-lg font-semibold text-white mb-2">Delete Vehicle</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Are you sure you want to delete{' '}
                  <span className="text-white font-medium">{modal.vehicle.make} {modal.vehicle.model}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button onClick={handleDelete} disabled={formLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition">
                    {formLoading ? 'Deleting...' : 'Delete'}
                  </button>
                  <button onClick={() => setModal(null)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 rounded-lg transition">
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
