import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import VehicleCard from '../components/VehicleCard'
import api from '../api/client'

const CATEGORIES = ['All', 'Sedan', 'SUV', 'Coupe', 'Truck', 'Hatchback', 'Convertible']

export default function CustomerDashboard() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(null)
  const [toast, setToast] = useState(null)
  const [filters, setFilters] = useState({
    make: '', model: '', category: 'All', minPrice: '', maxPrice: '',
  })
  const [priceError, setPriceError] = useState('')

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    setPriceError('')
    try {
      const params = new URLSearchParams()
      if (filters.make) params.append('make', filters.make)
      if (filters.model) params.append('model', filters.model)
      if (filters.category !== 'All') params.append('category', filters.category)
      if (filters.minPrice) params.append('min_price', filters.minPrice)
      if (filters.maxPrice) params.append('max_price', filters.maxPrice)

      const hasFilters = [...params].length > 0
      const url = hasFilters ? `/vehicles/search?${params}` : '/vehicles'
      const { data } = await api.get(url)
      setVehicles(data)
    } catch (err) {
      if (err.response?.status === 422) {
        setPriceError('Min price cannot be greater than max price')
      }
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handlePurchase(vehicleId) {
    setPurchasing(vehicleId)
    try {
      const { data } = await api.post(`/vehicles/${vehicleId}/purchase`)
      showToast(`Purchase successful! ${data.remaining_quantity} remaining.`)
      fetchVehicles()
    } catch (err) {
      showToast(err.response?.data?.detail || 'Purchase failed', 'error')
    } finally {
      setPurchasing(null)
    }
  }

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  function clearFilters() {
    setFilters({ make: '', model: '', category: 'All', minPrice: '', maxPrice: '' })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition
          ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Browse Vehicles</h2>
          <p className="text-gray-400 text-sm mt-1">Find your perfect vehicle</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-xl p-5 mb-8 border border-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <input
              type="text"
              name="make"
              value={filters.make}
              onChange={handleFilterChange}
              placeholder="Make (e.g. Toyota)"
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              name="model"
              value={filters.model}
              onChange={handleFilterChange}
              placeholder="Model (e.g. Camry)"
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min Price"
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max Price"
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          {priceError && (
            <p className="text-red-400 text-xs mt-2">{priceError}</p>
          )}
          <button
            onClick={clearFilters}
            className="mt-3 text-xs text-gray-400 hover:text-white transition"
          >
            Clear filters
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading vehicles...</div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No vehicles found</p>
            <p className="text-gray-600 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {vehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onPurchase={handlePurchase}
                purchasing={purchasing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
