import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

const heroImage = 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post('/auth/register', form)
      const loginRes = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      })
      localStorage.setItem('token', loginRes.data.access_token)
      const me = await api.get('/auth/me')
      login(me.data, loginRes.data.access_token)
      navigate(me.data.role === 'ADMIN' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-[1500px] grid-cols-1 gap-8 px-5 py-6 lg:grid-cols-[1.25fr_0.9fr] lg:items-center lg:px-8 lg:py-8">
        <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-slate-100 shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
          <img src={heroImage} alt="Luxury car" className="h-[680px] w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/80 via-[#0f172a]/35 to-[#0b2d2a]/20" />
          <div className="absolute inset-x-0 bottom-0 left-0 p-8 lg:p-12">
            <div className="mb-5 h-1 w-20 rounded-full bg-[#f59e0b]" />
            <h1 className="max-w-md text-5xl font-black leading-[0.9] tracking-[-0.06em] text-white lg:text-7xl">
              Premium
              <br />
              Vehicles.
              <br />
              <span className="text-[#fbbf24]">Delivered.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-slate-200 lg:text-xl">
              Create your account and explore a curated portfolio of premium vehicles.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[520px] rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_28px_80px_rgba(15,23,42,0.08)] lg:p-8">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f766e] text-lg font-black text-white shadow-lg shadow-teal-200">
              A
            </div>
            <div className="text-3xl font-black tracking-tight text-slate-900">
              AUTO<span className="text-[#0f766e]">VAULT</span>
            </div>
          </div>

          <h2 className="mb-2 text-4xl font-black leading-none tracking-[-0.05em] text-slate-900 lg:text-5xl">Create account</h2>
          <p className="mb-7 text-lg text-slate-500">Set up your showroom access</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Full name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Smith"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#0f766e] focus:outline-none focus:ring-4 focus:ring-teal-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#0f766e] focus:outline-none focus:ring-4 focus:ring-teal-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#0f766e] focus:outline-none focus:ring-4 focus:ring-teal-100"
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#0f766e] px-4 py-3.5 text-lg font-black text-white transition hover:bg-[#0a5d58] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-base text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#0f766e]">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
