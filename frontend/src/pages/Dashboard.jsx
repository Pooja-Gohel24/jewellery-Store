import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiUser, FiShoppingBag, FiHeart, FiSettings, FiLogOut, FiEdit2, FiX, FiEye, FiEyeOff } from 'react-icons/fi'
import { FaCheckCircle, FaClock, FaTruck, FaBan } from 'react-icons/fa'
import { GiGemPendant } from 'react-icons/gi'
import { getMyOrders } from '../api/orders'
import { updateProfile } from '../api/auth'

const statusConfig = {
  Delivered:  { icon: FaCheckCircle, color: 'text-green-500',  bg: 'bg-green-50',  border: 'border-green-200' },
  Shipped:    { icon: FaTruck,        color: 'text-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  Processing: { icon: FaClock,        color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  Cancelled:  { icon: FaBan,          color: 'text-red-400',    bg: 'bg-red-50',    border: 'border-red-200' },
}

const tabs = [
  { id: 'profile',  label: 'Profile',   icon: FiUser },
  { id: 'orders',   label: 'My Orders', icon: FiShoppingBag },
  { id: 'wishlist', label: 'Wishlist',  icon: FiHeart },
  { id: 'settings', label: 'Settings', icon: FiSettings },
]

export default function Dashboard() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  // Edit profile state
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', current_password: '', new_password: '', confirm_password: '' })
  const [editErrors, setEditErrors] = useState({})
  const [editApiError, setEditApiError] = useState('')
  const [editSuccess, setEditSuccess] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  // Wishlist — persisted per user in localStorage
  const wishlistKey = user ? `wishlist_${user.id}` : 'wishlist_guest'
  const [wishlist, setWishlist] = useState(() => {
    try {
      const key = user ? `wishlist_${user.id}` : 'wishlist_guest'
      return JSON.parse(localStorage.getItem(key) || '[]')
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(wishlistKey, JSON.stringify(wishlist))
  }, [wishlist, wishlistKey])

  useEffect(() => {
    if (activeTab === 'orders') {
      setOrdersLoading(true)
      getMyOrders()
        .then(setOrders)
        .catch(console.error)
        .finally(() => setOrdersLoading(false))
    }
  }, [activeTab])

  // Pre-fetch orders for profile stats
  useEffect(() => {
    getMyOrders().then(setOrders).catch(() => {})
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '—'

  const totalSpent = orders.reduce((s, o) => s + o.total_amount, 0)

  const openEdit = () => {
    setEditForm({ name: user?.name || '', current_password: '', new_password: '', confirm_password: '' })
    setEditErrors({})
    setEditApiError('')
    setEditSuccess('')
    setEditOpen(true)
  }

  const validateEdit = () => {
    const e = {}
    if (!editForm.name.trim()) e.name = 'Name is required'
    else if (editForm.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    else if (!/^[a-zA-Z\s]+$/.test(editForm.name.trim())) e.name = 'Name must contain letters only'
    if (editForm.new_password) {
      if (editForm.new_password.length < 6) e.new_password = 'Minimum 6 characters'
      if (!editForm.current_password) e.current_password = 'Current password is required to change password'
      if (editForm.new_password !== editForm.confirm_password) e.confirm_password = 'Passwords do not match'
    }
    return e
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    const errs = validateEdit()
    if (Object.keys(errs).length) { setEditErrors(errs); return }
    setEditLoading(true)
    setEditApiError('')
    try {
      const payload = { name: editForm.name.trim() }
      if (editForm.new_password) {
        payload.current_password = editForm.current_password
        payload.new_password = editForm.new_password
      }
      const updated = await updateProfile(payload)
      // Update localStorage user data
      const stored = JSON.parse(localStorage.getItem('user') || '{}')
      localStorage.setItem('user', JSON.stringify({ ...stored, name: updated.name }))
      setEditSuccess('Profile updated successfully!')
      setTimeout(() => { setEditOpen(false); window.location.reload() }, 1000)
    } catch (err) {
      setEditApiError(err.response?.data?.detail || 'Failed to update profile.')
    } finally {
      setEditLoading(false)
    }
  }

  const removeFromWishlist = (id) => setWishlist(prev => prev.filter(p => p.id !== id))

  return (
    <div className="min-h-screen bg-[#f6f2ee] font-poppins pt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-20 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-[#f6f2ee] rounded-full flex items-center justify-center mx-auto">
                  <GiGemPendant className="text-4xl text-[#8b5e3c]" />
                </div>
                <h3 className="font-semibold text-[#333]">{user?.name}</h3>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                      activeTab === tab.id ? 'bg-[#8b5e3c] text-white font-medium' : 'text-gray-600 hover:bg-[#f6f2ee]'
                    }`}>
                    <tab.icon className="text-base" /> {tab.label}
                    {tab.id === 'wishlist' && wishlist.length > 0 && (
                      <span className="ml-auto bg-[#8b5e3c] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                        {wishlist.length}
                      </span>
                    )}
                  </button>
                ))}
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-50 transition-colors">
                  <FiLogOut className="text-base" /> Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1">

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#333]">My Profile</h2>
                  <button onClick={openEdit} className="flex items-center gap-2 text-sm text-[#8b5e3c] hover:underline">
                    <FiEdit2 /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: 'Full Name',     value: user?.name },
                    { label: 'Email Address', value: user?.email },
                    { label: 'Member Since',  value: memberSince },
                  ].map(field => (
                    <div key={field.label} className="space-y-1">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{field.label}</p>
                      <p className="text-sm font-medium text-[#333] bg-[#f6f2ee] px-4 py-3 rounded-xl">{field.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  {[
                    { label: 'Total Orders', value: orders.length },
                    { label: 'Total Spent',  value: orders.length > 0 ? `₹${totalSpent.toLocaleString('en-IN')}` : '₹0' },
                    { label: 'Wishlist',     value: wishlist.length },
                  ].map(stat => (
                    <div key={stat.label} className="bg-[#f6f2ee] rounded-xl p-4 text-center">
                      <p className="text-xl font-bold text-[#8b5e3c]">{stat.value}</p>
                      <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('orders')} className="text-sm text-[#8b5e3c] hover:underline font-medium">
                  View My Orders →
                </button>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-5">
                <h2 className="text-xl font-semibold text-[#333]">My Orders</h2>
                {ordersLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-[#8b5e3c] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <FiShoppingBag className="text-5xl text-gray-200 mx-auto" />
                    <p className="text-gray-400 text-sm">No orders yet</p>
                    <button onClick={() => navigate('/shop')} className="btn-primary text-sm px-6">Shop Now</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => {
                      const s = statusConfig[order.status] || statusConfig.Processing
                      return (
                        <div key={order.id} className="border border-gray-100 rounded-2xl p-5 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <p className="font-semibold text-[#333] text-sm">#ORD-{String(order.id).padStart(4, '0')}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                {' · '}{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                              </p>
                              <p className="text-sm font-bold text-[#8b5e3c]">₹{order.total_amount.toLocaleString('en-IN')}</p>
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium ${s.bg} ${s.border} ${s.color} w-fit`}>
                              <s.icon /> {order.status}
                            </div>
                          </div>
                          {order.items?.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pt-1">
                              {order.items.map(item => (
                                <div key={item.id} className="shrink-0 flex items-center gap-2 bg-[#f6f2ee] rounded-xl px-3 py-2">
                                  {item.product_img && (
                                    <img src={item.product_img} alt={item.product_name} className="w-8 h-8 rounded-lg object-cover" />
                                  )}
                                  <div>
                                    <p className="text-xs font-medium text-[#333] max-w-[120px] truncate">{item.product_name}</p>
                                    <p className="text-xs text-gray-400">Qty: {item.quantity} · ₹{item.price.toLocaleString('en-IN')}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
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
                {wishlist.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <FiHeart className="text-5xl text-gray-200 mx-auto" />
                    <p className="text-gray-400 text-sm">Your wishlist is empty</p>
                    <button onClick={() => navigate('/shop')} className="btn-primary text-sm px-6">Browse Products</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {wishlist.map(item => (
                      <div key={item.id} className="bg-[#f6f2ee] rounded-2xl overflow-hidden relative group">
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-2 right-2 z-10 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors"
                        >
                          <FiX className="text-xs" />
                        </button>
                        <img src={item.img} alt={item.name} className="w-full h-32 object-cover" />
                        <div className="p-3 space-y-1">
                          <p className="text-xs font-medium text-[#333] line-clamp-2">{item.name}</p>
                          <p className="text-sm font-bold text-[#8b5e3c]">₹{item.price.toLocaleString('en-IN')}</p>
                          <button onClick={() => navigate(`/product/${item.id}`)} className="w-full btn-primary text-xs py-1.5 mt-1">
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#333]">Edit Profile</h2>
              <button onClick={() => setEditOpen(false)}><FiX className="text-gray-400 text-xl" /></button>
            </div>

            {editApiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">⚠️ {editApiError}</div>
            )}
            {editSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-3 py-2 rounded-lg">✅ {editSuccess}</div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => { setEditForm({ ...editForm, name: e.target.value }); setEditErrors({ ...editErrors, name: '' }) }}
                  className={`input-field mt-1 ${editErrors.name ? 'border-red-400' : ''}`}
                />
                {editErrors.name && <p className="text-red-500 text-xs mt-1">{editErrors.name}</p>}
              </div>

              <hr className="border-gray-100" />
              <p className="text-xs text-gray-400">Leave password fields blank to keep current password</p>

              <div>
                <label className="text-xs font-medium text-gray-500">Current Password</label>
                <input
                  type="password"
                  value={editForm.current_password}
                  onChange={e => { setEditForm({ ...editForm, current_password: e.target.value }); setEditErrors({ ...editErrors, current_password: '' }) }}
                  placeholder="Enter current password"
                  className={`input-field mt-1 ${editErrors.current_password ? 'border-red-400' : ''}`}
                />
                {editErrors.current_password && <p className="text-red-500 text-xs mt-1">{editErrors.current_password}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">New Password</label>
                <div className="relative mt-1">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={editForm.new_password}
                    onChange={e => { setEditForm({ ...editForm, new_password: e.target.value }); setEditErrors({ ...editErrors, new_password: '' }) }}
                    placeholder="New password (min 6 characters)"
                    className={`input-field pr-11 ${editErrors.new_password ? 'border-red-400' : ''}`}
                  />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showNewPw ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {editErrors.new_password && <p className="text-red-500 text-xs mt-1">{editErrors.new_password}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Confirm New Password</label>
                <input
                  type="password"
                  value={editForm.confirm_password}
                  onChange={e => { setEditForm({ ...editForm, confirm_password: e.target.value }); setEditErrors({ ...editErrors, confirm_password: '' }) }}
                  placeholder="Confirm new password"
                  className={`input-field mt-1 ${editErrors.confirm_password ? 'border-red-400' : ''}`}
                />
                {editErrors.confirm_password && <p className="text-red-500 text-xs mt-1">{editErrors.confirm_password}</p>}
              </div>

              <button type="submit" disabled={editLoading} className="w-full btn-primary py-2.5 text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                {editLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
