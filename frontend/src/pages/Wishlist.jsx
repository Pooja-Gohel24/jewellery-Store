import { Link, useNavigate } from 'react-router-dom'
import { FaTrash, FaHeart, FaStar, FaShoppingCart } from 'react-icons/fa'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [addedIds, setAddedIds] = useState({})

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    const added = addToCart(product)
    if (added) {
      setAddedIds(prev => ({ ...prev, [product.id]: true }))
      setTimeout(() => setAddedIds(prev => ({ ...prev, [product.id]: false })), 1500)
    }
  }

  if (wishlist.length === 0) return (
    <div className="min-h-screen bg-[#f6f2ee] font-poppins pt-20 flex items-center justify-center">
      <div className="text-center space-y-4">
        <FaHeart className="text-6xl text-gray-200 mx-auto animate-pulse" />
        <h2 className="text-xl font-semibold text-[#333]">Your wishlist is empty</h2>
        <p className="text-gray-400 text-sm">Looks like you haven't saved anything yet.</p>
        <Link to="/shop" className="btn-primary text-sm px-8 inline-block">Explore Collections</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f6f2ee] font-poppins pt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-20 py-8">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium tracking-widest uppercase text-[#8b5e3c]">Your Favorites</span>
            <h1 className="text-3xl font-semibold text-[#333] mt-1">My Wishlist ({wishlist.length} items)</h1>
          </div>
          <Link to="/shop" className="text-sm text-[#8b5e3c] hover:underline font-medium">Continue Shopping</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map(product => {
            const originalPrice = product.original_price ?? product.originalPrice
            const discount = originalPrice ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0
            
            return (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300 relative">
                
                {/* Remove button */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  title="Remove from wishlist"
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 hover:bg-red-50 hover:text-red-400 text-gray-400 rounded-full shadow flex items-center justify-center transition-colors"
                >
                  <FaTrash className="text-xs" />
                </button>

                {/* Image */}
                <Link to={`/product/${product.id}`}>
                  <div className="overflow-hidden h-44 sm:h-52 bg-[#f6f2ee]">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <span className="text-xs text-[#8b5e3c] font-medium">{product.category}</span>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-medium text-[#333] text-sm leading-snug hover:text-[#8b5e3c] transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-[#8b5e3c]">
                      {Array(5).fill(0).map((_, i) => (
                        <FaStar key={i} className={`text-xs ${i < Math.floor(product.rating) ? 'text-[#8b5e3c]' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-[#8b5e3c] font-bold text-sm sm:text-base">₹{product.price.toLocaleString('en-IN')}</span>
                    {originalPrice && (
                      <>
                        <span className="text-gray-400 line-through text-xs">₹{originalPrice.toLocaleString('en-IN')}</span>
                        <span className="text-green-600 text-xs font-medium">{discount}% off</span>
                      </>
                    )}
                  </div>

                  {/* Add to Cart / View */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`flex-1 text-[10px] sm:text-xs py-2 flex items-center justify-center gap-1.5 rounded-full font-medium transition-all duration-300 ${
                        addedIds[product.id] ? 'bg-green-500 text-white' : 'btn-primary'
                      }`}
                    >
                      <FaShoppingCart className="text-[10px]" />
                      {addedIds[product.id] ? 'Added!' : 'Cart'}
                    </button>
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="flex-1 text-[10px] sm:text-xs py-2 border border-gray-200 hover:bg-gray-50 rounded-full font-medium transition-colors text-gray-600"
                    >
                      View
                    </button>
                  </div>

                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
