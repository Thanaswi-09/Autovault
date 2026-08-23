export default function VehicleCard({ vehicle, onPurchase, purchasing, onPreview }) {
  const outOfStock = vehicle.quantity === 0
  const priceLabel = `₹${Math.max(1, Math.round(Number(vehicle.price || 0) / 10000))} Cr`
  const stockText = outOfStock ? 'Out of stock' : `${vehicle.quantity} units`

  return (
    <div className="overflow-hidden rounded-[22px] border border-[#dfeee7] bg-white shadow-[0_18px_35px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-[#9adbc5]">
      <div className="relative">
        <img
          src={vehicle.image_url || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80'}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-52 w-full object-cover"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0f766e] backdrop-blur-sm">
          {vehicle.category || 'Sedan'}
        </span>
      </div>

      <div className="p-5 text-center">
        <div className="mb-3 flex items-center justify-center gap-3">
          <p className="text-[15px] font-bold text-slate-700">{vehicle.make}</p>
          <span className="text-[11px] text-slate-500">{vehicle.year || '2024'}</span>
        </div>

        <div className="mb-5 text-[30px] font-black leading-none tracking-[-0.06em] text-slate-900">
          {vehicle.model}
        </div>

        <div className="mb-5 flex items-end justify-between gap-4 border-b border-slate-200 pb-4 text-left">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Price</p>
            <p className="mt-2 text-[24px] font-black tracking-[-0.05em] text-[#0f766e]">{priceLabel}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Stock</p>
            <p className="mt-2 text-base font-bold text-slate-700">{stockText}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onPurchase(vehicle.id)}
          disabled={outOfStock || purchasing === vehicle.id}
          className="w-full rounded-xl bg-[#0f766e] px-4 py-3.5 text-base font-black text-white transition hover:bg-[#0d605a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {purchasing === vehicle.id ? 'Processing...' : outOfStock ? 'Unavailable' : 'Purchase Now'}
        </button>
      </div>
    </div>
  )
}
