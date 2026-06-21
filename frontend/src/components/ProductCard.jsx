import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [added, setAdded] = useState(false)
  const originalPrice = product.original_price ?? product.originalPrice
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100)

  const wishlistKey = user ? `wishlist_${user.id}` : 'wishlist_guest'

  const [wishlisted, setWishlisted] = useState(() => {
    try {
      const key = user ? `wishlist_${user.id}` : 'wishlist_guest'
      const list = JSON.parse(localStorage.getItem(key) || '[]')
      return list.some(p => p.id === product.id)
    } catch { return false }
  })

  const toggleWishlist = (e) => {
    e.preventDefault()
    const list = JSON.parse(localStorage.getItem(wishlistKey) || '[]')
    let updated
    if (wishlisted) {
      updated = list.filter(p => p.id !== product.id)
    } else {
      updated = [...list, product]
    }
    localStorage.setItem(wishlistKey, JSON.stringify(updated))
    setWishlisted(!wishlisted)
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    const added = addToCart(product)
    if (added) {
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300 relative">

      {/* Wishlist */}
      <button
        className={`absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center transition-colors ${
          wishlisted ? 'text-red-400' : 'text-gray-300 hover:text-red-400'
        }`}
        onClick={toggleWishlist}
        title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <FaHeart className="text-sm" />
      </button>

      {/* Badge */}
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 bg-[#8b5e3c] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
          {product.badge}
        </span>
      )}

      {/* Image */}
      <Link to={`/product/${product.id}`}>
        <div className="overflow-hidden h-52 bg-[#f6f2ee]">
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
          <span className="text-[#8b5e3c] font-bold text-base">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="text-gray-400 line-through text-xs">₹{originalPrice.toLocaleString('en-IN')}</span>
          <span className="text-green-600 text-xs font-medium">{discount}% off</span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className={`w-full text-xs py-2 flex items-center justify-center gap-2 mt-1 rounded-full font-medium transition-all duration-300 ${
            added ? 'bg-green-500 text-white' : 'btn-primary'
          }`}
        >
          <FaShoppingCart /> {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
