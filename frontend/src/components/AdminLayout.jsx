import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiGrid, FiPackage, FiUsers, FiLogOut, FiShoppingBag, FiMenu, FiX, FiList } from 'react-icons/fi'
import { GiGemPendant } from 'react-icons/gi'

const links = [
  { to: '/admin',            label: 'Dashboard',  icon: FiGrid,        end: true },
  { to: '/admin/products',   label: 'Products',   icon: FiPackage },
  { to: '/admin/categories', label: 'Categories', icon: FiList },
  { to: '/admin/orders',     label: 'Orders',     icon: FiShoppingBag },
  { to: '/admin/users',      label: 'Users',      icon: FiUsers },
]

export default function AdminLayout({ children }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const SidebarContent = () => (
    <>
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
            onClick={() => setSidebarOpen(false)}
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
    </>
  )

  return (
    <div className="min-h-screen flex bg-[#f6f2ee] font-poppins">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-white shadow-sm flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg flex flex-col" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center gap-3 bg-white px-4 py-3 border-b border-gray-100 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="text-[#333]">
            <FiMenu className="text-xl" />
          </button>
          <div className="flex items-center gap-2">
            <GiGemPendant className="text-lg text-[#8b5e3c]" />
            <span className="font-semibold text-[#333] text-sm">Admin Panel</span>
          </div>
        </div>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
