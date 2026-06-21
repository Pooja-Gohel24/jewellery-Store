import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FaStar, FaShoppingCart, FaHeart, FaShieldAlt, FaTruck, FaUndo } from 'react-icons/fa'
import { getProduct, getProducts } from '../api/products'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const wishlistKey = user ? `wishlist_${user.id}` : 'wishlist_guest'

  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    setLoading(true)
    setQuantity(1)
    getProduct(id)
      .then(data => {
        setProduct(data)
        // Check wishlist for this product
        const list = JSON.parse(localStorage.getItem(wishlistKey) || '[]')
        setWishlisted(list.some(p => p.id === data.id))
        return getProducts({ category: data.category })
      })
      .then(all => setRelated(all.filter(p => p.id !== Number(id)).slice(0, 4)))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  const toggleWishlist = () => {
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

  const handleAddToCart = () => {
    const added = addToCart(product, quantity)
    if (added) {
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f6f2ee] font-poppins pt-20 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#8b5e3c] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f2ee] font-poppins pt-20">
      <div className="text-center space-y-4">
        <p className="text-5xl">💎</p>
        <p className="text-gray-500 font-medium">Product not found</p>
        <Link to="/shop" className="btn-primary text-sm px-6">Back to Shop</Link>
      </div>
    </div>
  )

  const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100)

  return (
    <div className="min-h-screen bg-[#f6f2ee] font-poppins pt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-20 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-[#8b5e3c]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#8b5e3c]">Shop</Link>
          <span>/</span>
          <span className="text-[#333]">{product.name}</span>
        </div>

        {/* Product Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row gap-10">

          {/* Image */}
          <div className="md:w-1/2">
            <div className="bg-[#f6f2ee] rounded-2xl overflow-hidden aspect-square relative">
              <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#8b5e3c] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="md:w-1/2 space-y-5">
            <div>
              <span className="text-xs font-medium tracking-widest uppercase text-[#8b5e3c]">{product.category}</span>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#333] mt-1">{product.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex text-[#8b5e3c]">
                {Array(5).fill(0).map((_, i) => (
                  <FaStar key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-[#8b5e3c]' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#8b5e3c]">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="text-gray-400 line-through text-base">₹{product.original_price.toLocaleString('en-IN')}</span>
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">{discount}% OFF</span>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>

            <hr className="border-gray-100" />

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[#333]">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-[#f6f2ee] transition-colors text-lg">−</button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-[#f6f2ee] transition-colors text-lg">+</button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                  addedToCart ? 'bg-green-500 text-white' : 'bg-[#8b5e3c] hover:bg-[#7a4f30] text-white'
                }`}
              >
                <FaShoppingCart />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={toggleWishlist}
                title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                  wishlisted ? 'bg-red-50 border-red-300 text-red-400' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'
                }`}
              >
                <FaHeart />
              </button>
            </div>

            <button onClick={() => { const ok = addToCart(product, quantity); if (ok) navigate('/checkout') }} className="w-full btn-outline py-3 text-sm font-medium">
              Buy Now
            </button>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: FaTruck,      label: 'Free Shipping' },
                { icon: FaShieldAlt,  label: 'Secure Payment' },
                { icon: FaUndo,       label: '7-Day Returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 bg-[#f6f2ee] rounded-xl py-3 text-center">
                  <Icon className="text-[#8b5e3c] text-lg" />
                  <span className="text-xs text-gray-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-14">
            <div className="mb-6">
              <span className="text-xs font-medium tracking-widest uppercase text-[#8b5e3c]">You May Also Like</span>
              <h2 className="text-2xl font-semibold text-[#333] mt-1">Related Products</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
