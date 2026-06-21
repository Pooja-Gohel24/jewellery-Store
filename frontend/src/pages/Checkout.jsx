import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { FaShieldAlt, FaCheckCircle } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { placeOrder } from '../api/orders'

export default function Checkout() {
  const { cartItems, totalPrice, totalItems, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [orderTotal, setOrderTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: '', address: '', city: '', state: '', pincode: '', paymentMethod: 'cod'
  })
  const [errors, setErrors] = useState({})

  const shipping = totalPrice > 50000 ? 0 : 499
  const tax = Math.round(totalPrice * 0.03)
  const grandTotal = totalPrice + shipping + tax

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Phone is required'
    else if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit mobile number'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.state.trim()) e.state = 'State is required'
    if (!form.pincode.trim()) e.pincode = 'Pincode is required'
    else if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter valid 6-digit pincode'
    return e
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setApiError('')
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.id,
          product_name: item.name,
          product_img: item.img || '',
          price: item.price,
          quantity: item.quantity,
        })),
        total_amount: grandTotal,
        shipping_amount: shipping,
        tax_amount: tax,
        payment_method: form.paymentMethod,
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      }
      const order = await placeOrder(orderData)
      setOrderId(order.id)
      setOrderTotal(grandTotal)
      clearCart()
      setOrderPlaced(true)
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-[#f6f2ee] font-poppins pt-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-400">Your cart is empty.</p>
          <Link to="/shop" className="btn-primary text-sm px-8 inline-block">Shop Now</Link>
        </div>
      </div>
    )
  }

  if (orderPlaced) return (
    <div className="min-h-screen bg-[#f6f2ee] font-poppins pt-20 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center space-y-5 shadow-sm">
        <FaCheckCircle className="text-6xl text-green-500 mx-auto" />
        <h2 className="text-2xl font-semibold text-[#333]">Order Placed!</h2>
        <p className="text-gray-400 text-sm">
          Thank you for your order. We'll send a confirmation to <span className="text-[#8b5e3c] font-medium">{form.email}</span>.
        </p>
        <div className="bg-[#f6f2ee] rounded-xl p-4 text-sm text-gray-500 space-y-1">
          {orderId && <p>Order ID: <span className="font-semibold text-[#333]">#ORD-{String(orderId).padStart(4, '0')}</span></p>}
          <p>Order Total: <span className="font-semibold text-[#333]">₹{orderTotal.toLocaleString('en-IN')}</span></p>
          <p>Payment: <span className="font-semibold text-[#333]">{form.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span></p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/dashboard', { state: { tab: 'orders' } })} className="btn-outline text-sm px-6">View Orders</button>
          <Link to="/" className="btn-primary text-sm px-8 inline-block">Back to Home</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f6f2ee] font-poppins pt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-20 py-8">

        <div className="mb-6">
          <span className="text-xs font-medium tracking-widest uppercase text-[#8b5e3c]">Checkout</span>
          <h1 className="text-3xl font-semibold text-[#333] mt-1">Complete Your Order</h1>
        </div>

        {apiError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            ⚠️ {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left — Delivery + Payment */}
            <div className="flex-1 space-y-6">

              {/* Delivery Info */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-5">
                <h2 className="font-semibold text-[#333] text-lg">Delivery Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'name',    label: 'Full Name',     icon: FiUser,   placeholder: 'John Doe',        col: 'sm:col-span-2' },
                    { name: 'email',   label: 'Email Address', icon: FiMail,   placeholder: 'you@example.com', col: '' },
                    { name: 'phone',   label: 'Phone Number',  icon: FiPhone,  placeholder: '9876543210',      col: '' },
                    { name: 'address', label: 'Street Address',icon: FiMapPin, placeholder: '123, MG Road',    col: 'sm:col-span-2' },
                    { name: 'city',    label: 'City',          icon: null,     placeholder: 'Mumbai',          col: '' },
                    { name: 'state',   label: 'State',         icon: null,     placeholder: 'Maharashtra',     col: '' },
                    { name: 'pincode', label: 'Pincode',       icon: null,     placeholder: '400001',          col: '' },
                  ].map(field => (
                    <div key={field.name} className={field.col}>
                      <label className="block text-sm font-medium text-[#333] mb-1.5">{field.label}</label>
                      <div className="relative">
                        {field.icon && <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />}
                        <input
                          type="text"
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          maxLength={field.name === 'phone' ? 10 : field.name === 'pincode' ? 6 : undefined}
                          className={`input-field ${field.icon ? 'pl-10' : ''} ${errors[field.name] ? 'border-red-400' : ''}`}
                        />
                      </div>
                      {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-4">
                <h2 className="font-semibold text-[#333] text-lg">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: 'cod',    label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                    { value: 'online', label: 'Online Payment',    desc: 'UPI, Cards, Net Banking (Coming Soon)' },
                  ].map(method => (
                    <label key={method.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        form.paymentMethod === method.value ? 'border-[#8b5e3c] bg-[#f6f2ee]' : 'border-gray-100'
                      }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={form.paymentMethod === method.value}
                        onChange={handleChange}
                        className="accent-[#8b5e3c]"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#333]">{method.label}</p>
                        <p className="text-xs text-gray-400">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Order Summary */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-white rounded-2xl p-6 space-y-4 sticky top-24">
                <h2 className="font-semibold text-[#333] text-lg">Order Summary</h2>

                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-[#f6f2ee]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#333] line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold text-[#8b5e3c] shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-100" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span><span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>GST (3%)</span><span>₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between font-bold text-[#333] text-base">
                    <span>Total</span><span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-70">
                  {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <FaShieldAlt className="text-[#8b5e3c]" /> Secure & Encrypted Checkout
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
