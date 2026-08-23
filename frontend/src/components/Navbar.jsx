import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} className="text-xl font-bold tracking-wide text-white hover:text-blue-400 transition">
        AutoVault
      </Link>
      {user && (
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-300">
            {user.name}
            <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase">
              {user.role}
            </span>
          </span>
          {user.role === 'ADMIN' && (
            <Link to="/admin" className="text-sm text-gray-300 hover:text-white transition">
              Admin
            </Link>
          )}
          <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white transition">
            Vehicles
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
