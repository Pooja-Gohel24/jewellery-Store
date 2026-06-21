import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { getAdminOrders, updateOrderStatus } from '../../api/admin'
import { FaCheckCircle, FaClock, FaTruck, FaBan } from 'react-icons/fa'

const statusConfig = {
  Delivered:  { color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
  Shipped:    { color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  Processing: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  Cancelled:  { color: 'text-red-500',    bg: 'bg-red-50',    border: 'border-red-200' },
}

const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const load = () => {
    setLoading(true)
    getAdminOrders().then(setOrders).catch(console.error).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId)
    try {
      const updated = await updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o))
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#333]">Orders</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#8b5e3c] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400">No orders yet.</div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const s = statusConfig[order.status] || statusConfig.Processing
              return (
                <div key={order.id} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-[#333]">#ORD-{String(order.id).padStart(4, '0')}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm font-bold text-[#8b5e3c]">₹{order.total_amount.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full border text-xs font-medium ${s.bg} ${s.border} ${s.color}`}>
                        {order.status}
                      </span>
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#8b5e3c] disabled:opacity-60"
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Customer info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-500 bg-[#f6f2ee] rounded-xl p-3">
                    <div><span className="font-medium text-[#333]">Customer: </span>{order.full_name}</div>
                    <div><span className="font-medium text-[#333]">Email: </span>{order.email}</div>
                    <div><span className="font-medium text-[#333]">Phone: </span>{order.phone}</div>
                    <div className="sm:col-span-2"><span className="font-medium text-[#333]">Address: </span>{order.address}, {order.city}, {order.state} - {order.pincode}</div>
                    <div><span className="font-medium text-[#333]">Payment: </span>{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}</div>
                  </div>

                  {/* Items */}
                  {order.items?.length > 0 && (
                    <div className="divide-y divide-gray-50">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-3 py-2">
                          {item.product_img && (
                            <img src={item.product_img} alt={item.product_name} className="w-10 h-10 rounded-lg object-cover bg-[#f6f2ee]" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#333] truncate">{item.product_name}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold text-[#8b5e3c] shrink-0">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </p>
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
    </AdminLayout>
  )
}
