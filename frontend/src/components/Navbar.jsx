import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-40 border-b border-[#dfeee7] bg-[#f5faf7] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-6">
        <Link to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f766e] text-base font-black text-white shadow-[0_0_18px_rgba(15,118,110,0.25)]">
            A
          </div>
          <div className="text-2xl font-black tracking-tight text-slate-900">
            AUTO<span className="text-[#0f766e]">DEALER</span>
          </div>
        </Link>

        {user && (
          <div className="flex items-center gap-6 lg:gap-8">
            <Link
              to="/dashboard"
              className={`text-sm font-semibold transition ${
                isActive('/dashboard') ? 'text-[#0f766e]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/vehicles"
              className={`text-sm font-semibold transition ${
                isActive('/vehicles') ? 'text-[#0f766e]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Browse Vehicles
            </Link>
            {user.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`text-sm font-semibold transition ${
                  isActive('/admin') ? 'text-[#0f766e]' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin Panel
              </Link>
            )}

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <span className="hidden text-sm text-slate-600 sm:block">Signed in as</span>
              <span className="rounded-full border border-[#bfe8dd] bg-[#eafaf5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0f766e]">
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-[#dfeee7] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0f766e] hover:text-[#0f766e]"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
