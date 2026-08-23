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

  function isActive(path) {
    return location.pathname === path
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 text-white px-6 py-4 flex items-center justify-between">
      <Link
        to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}
        className="text-xl font-bold tracking-wide text-white hover:text-blue-400 transition"
      >
        Auto<span className="text-blue-500">Vault</span>
      </Link>

      {user && (
        <div className="flex items-center gap-5">
          <Link
            to="/dashboard"
            className={`text-sm transition ${isActive('/dashboard') ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}
          >
            Vehicles
          </Link>
          {user.role === 'ADMIN' && (
            <Link
              to="/admin"
              className={`text-sm transition ${isActive('/admin') ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}
            >
              Inventory
            </Link>
          )}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-700">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-white leading-none">{user.name}</p>
              <p className="text-xs text-blue-400 mt-0.5 uppercase tracking-wide">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm bg-gray-800 hover:bg-red-600 border border-gray-700 hover:border-red-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
