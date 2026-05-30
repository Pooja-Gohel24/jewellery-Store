import { Link, useNavigate } from 'react-router-dom'
import { FaTrash, FaShoppingBag } from 'react-icons/fa'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart()
  const navigate = useNavigate()

  const shipping = totalPrice > 50000 ? 0 : 499
  const tax = Math.round(totalPrice * 0.03)
  const grandTotal = totalPrice + shipping + tax

  if (cartItems.length === 0) return (
    <div className="min-h-screen bg-[#f6f2ee] font-poppins pt-20 flex items-center justify-center">
      <div className="text-center space-y-4">
        <FaShoppingBag className="text-6xl text-gray-200 mx-auto" />
        <h2 className="text-xl font-semibold text-[#333]">Your cart is empty</h2>
        <p className="text-gray-400 text-sm">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn-primary text-sm px-8 inline-block">Shop Now</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f6f2ee] font-poppins pt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-20 py-8">

        <div className="mb-6">
          <span className="text-xs font-medium tracking-widest uppercase text-[#8b5e3c]">Your Cart</span>
          <h1 className="text-3xl font-semibold text-[#333] mt-1">Shopping Cart ({totalItems} items)</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-4 sm:p-6 flex gap-4 sm:gap-6">
                <Link to={`/product/${item.id}`}>
                  <img src={item.img} alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-[#f6f2ee] shrink-0" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div>
                      <span className="text-xs text-[#8b5e3c] font-medium">{item.category}</span>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-medium text-[#333] text-sm sm:text-base hover:text-[#8b5e3c] transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                      </Link>
                    </div>
                    <button onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-[#f6f2ee] transition-colors">
                        <FiMinus className="text-xs" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-[#f6f2ee] transition-colors">
                        <FiPlus className="text-xs" />
                      </button>
                    </div>
                    <span className="text-[#8b5e3c] font-bold text-base">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl p-6 space-y-4 sticky top-24">
              <h2 className="font-semibold text-[#333] text-lg">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>GST (3%)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[#8b5e3c] bg-[#f6f2ee] px-3 py-2 rounded-lg">
                    Add ₹{(50000 - totalPrice).toLocaleString('en-IN')} more for FREE shipping!
                  </p>
                )}
                <hr className="border-gray-100" />
                <div className="flex justify-between font-bold text-[#333] text-base">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')} className="w-full btn-primary py-3 text-sm">
                Proceed to Checkout
              </button>
              <Link to="/shop" className="block text-center text-sm text-[#8b5e3c] hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
