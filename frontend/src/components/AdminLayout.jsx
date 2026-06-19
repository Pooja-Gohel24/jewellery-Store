import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiGrid, FiPackage, FiUsers, FiLogOut } from 'react-icons/fi'
import { GiGemPendant } from 'react-icons/gi'

const links = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/products', label: 'Products', icon: FiPackage },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
]

export default function AdminLayout({ children }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="min-h-screen flex bg-[#f6f2ee] font-poppins">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-white shadow-sm flex flex-col">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
          <GiGemPendant className="text-2xl text-[#8b5e3c]" />
          <div>
            <p className="font-semibold text-[#333] text-sm">Jewellery Store</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive ? 'bg-[#8b5e3c] text-white font-medium' : 'text-gray-600 hover:bg-[#f6f2ee]'
                }`
              }
            >
              <link.icon className="text-base" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-50 transition-colors"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
