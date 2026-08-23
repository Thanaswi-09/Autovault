export default function VehicleCard({ vehicle, onPurchase, purchasing }) {
  const outOfStock = vehicle.quantity === 0

  return (
    <div className="bg-gray-800 rounded-xl p-5 flex flex-col gap-3 shadow hover:shadow-lg transition border border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg">
            {vehicle.make} {vehicle.model}
          </h3>
          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full mt-1 inline-block">
            {vehicle.category}
          </span>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${outOfStock ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {outOfStock ? 'Out of Stock' : `${vehicle.quantity} left`}
        </span>
      </div>

      <div className="text-2xl font-bold text-white">
        ${vehicle.price.toLocaleString()}
      </div>

      <button
        onClick={() => onPurchase(vehicle.id)}
        disabled={outOfStock || purchasing === vehicle.id}
        className="mt-auto w-full py-2 rounded-lg text-sm font-medium transition
          bg-blue-600 hover:bg-blue-700 text-white
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {purchasing === vehicle.id ? 'Processing...' : outOfStock ? 'Out of Stock' : 'Purchase'}
      </button>
    </div>
  )
}
