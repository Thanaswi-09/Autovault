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
  const [selectedVehicle, setSelectedVehicle] = useState(null)

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
      if (err.response?.status === 422) setPriceError('Min price cannot be greater than max price')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchVehicles() }, [fetchVehicles])

  function showToast(message, type = 'success') {
    setToast({ message, type })
    window.setTimeout(() => setToast(null), 12000)
  }

  async function handlePurchase(vehicleId) {
    setPurchasing(vehicleId)
    try {
      await api.post(`/vehicles/${vehicleId}/purchase`)
      showToast('Pay at delivery. We will contact you through email and phone number.')
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

  function openVehicleDetails(vehicle) {
    setSelectedVehicle(vehicle)
  }

  function closeVehicleDetails() {
    setSelectedVehicle(null)
  }

  const inputClass = "w-full rounded-2xl border border-[#dfeee7] bg-[#f8fbfa] px-3.5 py-2.75 text-sm text-slate-800 placeholder:text-slate-500 focus:border-[#0f766e] focus:outline-none focus:ring-4 focus:ring-emerald-100"

  return (
    <div className="min-h-screen bg-[#f3f7f2] text-slate-800">
      <Navbar />

      {toast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 px-4 backdrop-blur-sm">
          <div className={`relative w-full max-w-[600px] rounded-[26px] border px-8 py-10 text-center shadow-[0_24px_70px_rgba(15,23,42,0.2)] sm:px-12 ${
            toast.type === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="absolute right-5 top-4 text-2xl font-normal leading-none opacity-70 transition hover:opacity-100"
              aria-label="Close notification"
            >
              ×
            </button>
            <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-5xl font-bold text-emerald-600">
              {toast.type === 'error' ? '×' : '✓'}
            </div>
            <h3 className="text-3xl font-black tracking-tight sm:text-4xl">
              {toast.type === 'error' ? 'Purchase Failed' : 'Purchase Confirmed'}
            </h3>
            <p className="mx-auto mt-6 max-w-[480px] text-center text-xl font-medium leading-relaxed sm:text-2xl">
              {toast.message}
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-6 lg:py-10">
        <div className="mb-8">
          <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#0f766e] sm:text-left">AutoVault showroom</p>
          <h2 className="text-center text-4xl font-black text-slate-900 sm:text-left">Browse Vehicles</h2>
          <p className="mt-2 text-center text-slate-600">Explore the full inventory and pick your next dream ride</p>
        </div>

        <div className="mb-8 rounded-[28px] border border-[#dfeee7] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 sm:text-left">Filter Vehicles</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input type="text" name="make" value={filters.make} onChange={handleFilterChange} placeholder="Make" className={inputClass} />
            <input type="text" name="model" value={filters.model} onChange={handleFilterChange} placeholder="Model" className={inputClass} />
            <select name="category" value={filters.category} onChange={handleFilterChange} className={inputClass}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min Price (₹)" className={inputClass} />
            <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max Price (₹)" className={inputClass} />
          </div>
          {priceError && <p className="mt-3 text-sm font-medium text-rose-600">{priceError}</p>}
          <button onClick={clearFilters} className="mt-4 text-sm font-bold text-emerald-600 transition hover:text-emerald-700">
            ✕ Clear all filters
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            <p className="text-sm text-slate-500">Loading vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-6xl">🚗</div>
            <p className="text-2xl font-black text-slate-800">No vehicles found</p>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              {filters.make || filters.model || filters.category !== 'All' || filters.minPrice || filters.maxPrice
                ? 'Try adjusting or clearing your filters.'
                : 'No vehicles have been added to inventory yet.'}
            </p>
            {(filters.make || filters.model || filters.category !== 'All' || filters.minPrice || filters.maxPrice) && (
              <button onClick={clearFilters} className="mt-4 text-sm font-bold text-emerald-600 underline transition hover:text-emerald-700">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="mb-5 text-center text-sm font-medium text-slate-600 sm:text-left">{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onPurchase={handlePurchase}
                  purchasing={purchasing}
                  onPreview={openVehicleDetails}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
            <button
              onClick={closeVehicleDetails}
              className="absolute right-5 top-5 z-20 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-xl text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              aria-label="Close modal"
            >
              ×
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="relative min-h-[390px]">
                <img
                  src={selectedVehicle.image_url || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80'}
                  alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/65 via-slate-900/20 to-transparent" />
                <div className="absolute left-6 top-6 rounded-full bg-[#ecfeff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f766e]">
                  {selectedVehicle.category || 'Sedan'}
                </div>
              </div>

              <div className="bg-slate-50 p-7 lg:p-8">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-3xl font-black tracking-[-0.05em] text-slate-900">{selectedVehicle.make}</div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Year of Manufacturing: {selectedVehicle.year || 2024}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black tracking-[-0.05em] text-[#0f766e]">₹{Math.max(1, Math.round(Number(selectedVehicle.price || 0) / 10000))} Cr</div>
                    <div className="text-sm text-slate-500">${Number(selectedVehicle.price || 0) * 1.6}k</div>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Category</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{selectedVehicle.category || 'Sedan'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Year</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{selectedVehicle.year || 2024}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Fuel Type</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{selectedVehicle.fuel_type || 'Petrol'}</p>
                  </div>
                </div>

                <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Transmission</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{selectedVehicle.transmission || 'Automatic'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Mileage</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{selectedVehicle.mileage || '10 kmpl'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Stock</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{selectedVehicle.quantity || 3} units</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">About this vehicle</p>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    {selectedVehicle.description || `The ${selectedVehicle.make} ${selectedVehicle.model} features a refined premium design, modern safety systems, and a smooth performance profile built for comfort and reliability.`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handlePurchase(selectedVehicle.id)}
                  disabled={selectedVehicle.quantity === 0 || purchasing === selectedVehicle.id}
                  className="mt-6 w-full rounded-2xl bg-[#0f766e] px-4 py-4 text-xl font-black text-white transition hover:bg-[#0a5d58] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {purchasing === selectedVehicle.id ? 'Processing...' : 'Purchase Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
