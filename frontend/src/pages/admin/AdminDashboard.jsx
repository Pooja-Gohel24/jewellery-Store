import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { getAdminStats } from '../../api/admin'
import { FiUsers, FiPackage, FiGrid, FiShoppingBag } from 'react-icons/fi'

const statCards = [
  { key: 'total_users',      label: 'Total Users',    icon: FiUsers,       color: 'bg-blue-50 text-blue-500' },
  { key: 'total_products',   label: 'Total Products', icon: FiPackage,     color: 'bg-green-50 text-green-500' },
  { key: 'total_categories', label: 'Categories',     icon: FiGrid,        color: 'bg-purple-50 text-purple-500' },
  { key: 'total_orders',     label: 'Total Orders',   icon: FiShoppingBag, color: 'bg-orange-50 text-orange-500' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getAdminStats().then(setStats).catch(console.error)
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#333]">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map(card => (
            <div key={card.key} className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="text-xl" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#333]">{stats ? stats[card.key] : '...'}</p>
                <p className="text-xs text-gray-400">{card.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
