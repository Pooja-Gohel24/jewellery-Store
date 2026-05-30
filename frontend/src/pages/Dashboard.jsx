import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiShoppingBag, FiHeart, FiSettings, FiLogOut, FiEdit2 } from 'react-icons/fi'
import { FaCheckCircle, FaClock, FaTruck } from 'react-icons/fa'
import { GiGemPendant } from 'react-icons/gi'

const dummyOrders = [
  { id: '#ORD-1001', date: '12 Apr 2025', items: 2, total: 57500,  status: 'Delivered' },
  { id: '#ORD-1002', date: '28 Apr 2025', items: 1, total: 28000,  status: 'Shipped' },
  { id: '#ORD-1003', date: '05 May 2025', items: 3, total: 95000,  status: 'Processing' },
]

const statusConfig = {
  Delivered:  { icon: FaCheckCircle, color: 'text-green-500',  bg: 'bg-green-50',  border: 'border-green-200' },
  Shipped:    { icon: FaTruck,        color: 'text-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  Processing: { icon: FaClock,        color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
}

const tabs = [
  { id: 'profile',  label: 'Profile',     icon: FiUser },
  { id: 'orders',   label: 'My Orders',   icon: FiShoppingBag },
  { id: 'wishlist', label: 'Wishlist',    icon: FiHeart },
  { id: 'settings', label: 'Settings',   icon: FiSettings },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f6f2ee] font-poppins pt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-20 py-8">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── SIDEBAR ── */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 space-y-6">

              {/* Avatar */}
              <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-[#f6f2ee] rounded-full flex items-center justify-center mx-auto">
                  <GiGemPendant className="text-4xl text-[#8b5e3c]" />
                </div>
                <h3 className="font-semibold text-[#333]">{user?.name}</h3>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>

              {/* Nav */}
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#8b5e3c] text-white font-medium'
                        : 'text-gray-600 hover:bg-[#f6f2ee]'
                    }`}
                  >
                    <tab.icon className="text-base" />
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="text-base" /> Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1">

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#333]">My Profile</h2>
                  <button className="flex items-center gap-2 text-sm text-[#8b5e3c] hover:underline">
                    <FiEdit2 /> Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: 'Full Name',     value: user?.name },
                    { label: 'Email Address', value: user?.email },
                    { label: 'Phone Number',  value: '+91 XXXXX XXXXX' },
                    { label: 'Member Since',  value: 'May 2025' },
                  ].map(field => (
                    <div key={field.label} className="space-y-1">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{field.label}</p>
                      <p className="text-sm font-medium text-[#333] bg-[#f6f2ee] px-4 py-3 rounded-xl">{field.value}</p>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                  {[
                    { label: 'Total Orders',  value: dummyOrders.length },
                    { label: 'Total Spent',   value: `₹${dummyOrders.reduce((s, o) => s + o.total, 0).toLocaleString('en-IN')}` },
                    { label: 'Wishlist Items', value: '5' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-[#f6f2ee] rounded-xl p-4 text-center">
                      <p className="text-xl font-bold text-[#8b5e3c]">{stat.value}</p>
                      <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-5">
                <h2 className="text-xl font-semibold text-[#333]">My Orders</h2>
                {dummyOrders.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <FiShoppingBag className="text-5xl text-gray-200 mx-auto" />
                    <p className="text-gray-400 text-sm">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dummyOrders.map(order => {
                      const s = statusConfig[order.status]
                      return (
                        <div key={order.id} className="border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <p className="font-semibold text-[#333] text-sm">{order.id}</p>
                            <p className="text-xs text-gray-400">{order.date} · {order.items} item{order.items > 1 ? 's' : ''}</p>
                            <p className="text-sm font-bold text-[#8b5e3c]">₹{order.total.toLocaleString('en-IN')}</p>
                          </div>
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium ${s.bg} ${s.border} ${s.color} w-fit`}>
                            <s.icon /> {order.status}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-5">
                <h2 className="text-xl font-semibold text-[#333]">My Wishlist</h2>
                <div className="text-center py-12 space-y-3">
                  <FiHeart className="text-5xl text-gray-200 mx-auto" />
                  <p className="text-gray-400 text-sm">Your wishlist is empty</p>
                  <button onClick={() => navigate('/shop')} className="btn-primary text-sm px-6">Browse Products</button>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6">
                <h2 className="text-xl font-semibold text-[#333]">Account Settings</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Email Notifications', desc: 'Receive order updates via email' },
                    { label: 'SMS Notifications',   desc: 'Receive order updates via SMS' },
                    { label: 'Promotional Emails',  desc: 'Receive offers and new arrivals' },
                  ].map(setting => (
                    <div key={setting.label} className="flex items-center justify-between p-4 bg-[#f6f2ee] rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-[#333]">{setting.label}</p>
                        <p className="text-xs text-gray-400">{setting.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-5 bg-gray-200 peer-checked:bg-[#8b5e3c] rounded-full transition-colors peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                      </label>
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  <button className="text-sm text-red-400 hover:underline font-medium">Delete Account</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
