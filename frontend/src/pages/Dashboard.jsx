import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

const TIPS = [
  { icon: '🔍', title: 'Smart Search', desc: 'Filter by make, model, category or price range to discover your ideal car.' },
  { icon: '⚡', title: 'Fast Purchase', desc: 'One-click buying flow keeps the checkout smooth and instant.' },
  { icon: '🛡️', title: 'Secure Access', desc: 'JWT protected sessions keep every account safe and private.' },
  { icon: '📦', title: 'Live Inventory', desc: 'Stock updates in real time across the full dealership network.' },
  { icon: '🚗', title: 'Premium Range', desc: 'From compact sedans to luxury SUVs, everything is in one place.' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total: 0, available: 0, categories: 0 })
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/vehicles')
      .then(({ data }) => {
        const available = data.filter((v) => v.quantity > 0).length
        const categories = new Set(data.map((v) => v.category)).size
        setStats({ total: data.length, available, categories })
        setFeatured(data.filter((v) => v.image_url && v.quantity > 0).slice(0, 3))
      })
      .catch(() => {
        setStats({ total: 0, available: 0, categories: 0 })
        setFeatured([])
      })
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Total Models', value: stats.total, icon: '01', accent: 'bg-[#dff7f2] text-[#0f172a] border border-[#bce7de]' },
    { label: 'Available Now', value: stats.available, icon: '02', accent: 'bg-[#eaf9ee] text-[#0f172a] border border-[#cfeccb]' },
    { label: 'Categories', value: stats.categories, icon: '03', accent: 'bg-[#f5efe6] text-[#0f172a] border border-[#e9d7bc]' },
  ]

  return (
    <div className="min-h-screen bg-[#f3f7f3] text-slate-800">
      <Navbar />

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-6 lg:py-10">
        <div className="mb-8 overflow-hidden rounded-[28px] border border-[#dfeee7] bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:p-10">
          <div className="flex flex-col gap-8 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
            <div className="w-full">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Welcome back</p>
              <h1 className="text-center text-5xl font-black tracking-[-0.06em] text-slate-900 lg:text-left lg:text-6xl">
                Hello, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 lg:mx-0 lg:text-left lg:text-lg">
                Browse premium inventory, compare standout models, and find the perfect vehicle for your next drive.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
              <button
                onClick={() => navigate('/vehicles')}
                className="rounded-2xl bg-[#0f766e] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0b615c]"
              >
                Browse Vehicles
              </button>
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="rounded-2xl border border-slate-200 bg-[#fff7ed] px-5 py-3 text-sm font-black text-slate-700 transition hover:border-[#f59e0b] hover:bg-[#fff1d6]"
                >
                  Admin Panel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {statCards.map(({ label, value, icon, accent }) => (
            <div key={label} className={`${accent} rounded-[22px] p-5 text-center`}>
              <div className="mb-3 flex items-center justify-between gap-3 text-left">
                <span className="text-2xl font-black text-slate-900">{icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</span>
              </div>
              <p className="text-center text-5xl font-black leading-none tracking-[-0.06em] text-slate-900">{loading ? '—' : value}</p>
            </div>
          ))}
        </div>

        {featured.length > 0 && (
          <div className="mb-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-900">Featured Vehicles</h2>
              <button onClick={() => navigate('/vehicles')} className="text-sm font-bold text-[#0f766e] transition hover:text-[#0a5d58]">
                View all →
              </button>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {featured.map((v) => (
                <div key={v.id} className="overflow-hidden rounded-[24px] border border-[#dfeee7] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                  <img src={v.image_url} alt={`${v.make} ${v.model}`} className="h-44 w-full object-cover" />
                  <div className="space-y-3 p-5 text-center">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xl font-black text-slate-900">{v.make} {v.model}</p>
                      <span className="rounded-full bg-[#ecfeff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#0f766e]">{v.category}</span>
                    </div>
                    <p className="text-center text-3xl font-black tracking-[-0.05em] text-[#0f766e]">₹{Math.max(1, Math.round(Number(v.price || 0) / 10000))} Cr</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-5 text-center text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-left">Quick Tips</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {TIPS.map(({ icon, title, desc }) => (
              <div key={title} className="rounded-[22px] border border-[#dfeee7] bg-white p-5 text-center shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                <div className="mb-3 inline-block text-3xl">{icon}</div>
                <p className="mb-1 text-sm font-black text-slate-900">{title}</p>
                <p className="text-xs leading-relaxed text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
