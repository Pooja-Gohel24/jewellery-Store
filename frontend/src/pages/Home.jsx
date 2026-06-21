import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaTruck, FaGem, FaBoxOpen, FaStar, FaChevronLeft, FaChevronRight, FaQuoteLeft, FaShoppingCart } from 'react-icons/fa'
import { GiRing, GiNecklace, GiChainedHeart, GiEarrings } from 'react-icons/gi'
import { MdWatch } from 'react-icons/md'
import { useCart } from '../context/CartContext'
import { getProducts } from '../api/products'

const heroSlides = [
  {
    img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&q=80',
    tag: 'New Collection 2025',
    title: 'Our Luxury\nCollections',
    desc: 'Discover premium jewelry crafted with elegance and perfection.',
  },
  {
    img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80',
    tag: 'Exclusive Designs',
    title: 'Timeless\nElegance',
    desc: 'Each piece tells a story of beauty, craftsmanship and love.',
  },
  {
    img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=80',
    tag: 'Handcrafted',
    title: 'Crafted For\nYou',
    desc: 'Every gemstone hand-selected, every setting meticulously crafted.',
  },
  {
    img: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1600&q=80',
    tag: 'Premium Quality',
    title: 'Pure Gold\nJewellery',
    desc: 'Finest gold and diamond pieces for every special occasion.',
  },
]

const features = [
  { icon: FaTruck,   title: 'Free Shipping',    desc: 'Fast delivery across India' },
  { icon: FaGem,     title: 'Exclusive Design',  desc: 'Unique premium styles' },
  { icon: FaBoxOpen, title: 'Good Packaging',    desc: 'Secure and elegant' },
  { icon: FaStar,    title: 'Highest Quality',   desc: 'Top craftsmanship' },
]

const categories = [
  { icon: GiRing,      label: 'Rings' },
  { icon: GiNecklace,  label: 'Necklaces' },
  { icon: GiChainedHeart,  label: 'Bracelets' },
  { icon: GiEarrings,  label: 'Earrings' },
  { icon: MdWatch,     label: 'Watches' },
]

const testimonials = [
  { name: 'Priya S.',    review: 'Absolutely stunning pieces! The quality exceeded my expectations. Will definitely shop again.', rating: 5, avatar: 'https://i.pravatar.cc/60?img=47' },
  { name: 'Anjali R.',   review: 'The packaging was gorgeous and the ring fits perfectly. A truly luxurious experience.',          rating: 5, avatar: 'https://i.pravatar.cc/60?img=32' },
  { name: 'Meera T.',    review: 'Fast shipping and beautiful jewellery. My go-to store for gifts and personal treats!',           rating: 5, avatar: 'https://i.pravatar.cc/60?img=25' },
]

export default function Home() {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [addedIds, setAddedIds] = useState({})
  const [current, setCurrent] = useState(0)
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    getProducts().then(data => setFeaturedProducts(data.slice(0, 8))).catch(console.error)
  }, [])

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    const added = addToCart(product)
    if (added) {
      setAddedIds(prev => ({ ...prev, [product.id]: true }))
      setTimeout(() => setAddedIds(prev => ({ ...prev, [product.id]: false })), 1500)
    }
  }

  // Auto-scroll hero every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % heroSlides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent(p => (p - 1 + heroSlides.length) % heroSlides.length)
  const next = () => setCurrent(p => (p + 1) % heroSlides.length)

  return (
    <div className="font-poppins">

      {/* ── HERO SLIDER ── */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.2) 100%), url('${slide.img}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="h-full flex items-center px-6 sm:px-12 md:px-20">
              <div className="max-w-lg text-white space-y-4 sm:space-y-5">
                <span className="text-xs sm:text-sm font-medium tracking-widest uppercase text-[#e0c49a]">
                  {slide.tag}
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight whitespace-pre-line">
                  {slide.title}
                </h1>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{slide.desc}</p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link to="/shop" className="btn-primary text-sm px-6 py-3">Shop Now</Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <button onClick={prev} className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-[#8b5e3c] text-white w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors">
          <FaChevronLeft />
        </button>
        <button onClick={next} className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-[#8b5e3c] text-white w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors">
          <FaChevronRight />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? 'bg-[#8b5e3c] w-6 h-2' : 'bg-white/50 w-2 h-2'}`}
            />
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-white py-10 sm:py-12 px-6 sm:px-8 md:px-14">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {features.map(f => (
            <div key={f.title} className="space-y-2 p-4">
              <f.icon className="text-3xl sm:text-4xl text-[#8b5e3c] mx-auto" />
              <h4 className="font-semibold text-[#333] text-sm">{f.title}</h4>
              <p className="text-gray-400 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-14 sm:py-16 px-6 sm:px-8 md:px-20 bg-[#f6f2ee]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-14">
          <img
            src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80"
            alt="About"
            className="w-full md:w-[380px] h-64 sm:h-[380px] md:h-[420px] object-cover rounded-2xl shadow-lg"
          />
          <div className="space-y-4 sm:space-y-5 max-w-lg">
            <span className="text-xs font-medium tracking-widest uppercase text-[#8b5e3c]">Our Story</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#333] leading-snug">
              The Art Of Radiant Refinement
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              For over 15 years, Jewellery Store has been crafting jewellery that captures the essence of elegance. Our artisans blend traditional techniques with modern design to create pieces that are truly one of a kind.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Every gemstone is hand-selected, every setting meticulously crafted — because you deserve nothing less than perfection.
            </p>
            <Link to="/shop" className="btn-primary text-sm inline-block">Shop Now</Link>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="py-14 sm:py-16 px-6 sm:px-8 md:px-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-medium tracking-widest uppercase text-[#8b5e3c]">Handpicked</span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#333] mt-1">Our Collection</h2>
            </div>
            <Link to="/shop" className="text-sm text-[#8b5e3c] hover:underline font-medium">View All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="bg-[#f6f2ee] rounded-2xl overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300">
                <div className="overflow-hidden h-40 sm:h-52">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 sm:p-4 space-y-1">
                  <h4 className="font-medium text-[#333] text-xs sm:text-sm">{p.name}</h4>
                  <p className="text-[#8b5e3c] font-semibold text-sm">₹{p.price.toLocaleString('en-IN')}</p>
                  <button
                    onClick={(e) => handleAddToCart(e, p)}
                    className={`w-full mt-1 sm:mt-2 text-xs py-1.5 sm:py-2 px-3 rounded-full font-medium flex items-center justify-center gap-1.5 transition-all duration-300 ${
                      addedIds[p.id] ? 'bg-green-500 text-white' : 'btn-primary'
                    }`}
                  >
                    <FaShoppingCart className="text-xs" />
                    {addedIds[p.id] ? 'Added!' : 'Add to Cart'}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-14 sm:py-16 px-6 sm:px-8 md:px-20 bg-[#f6f2ee]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-medium tracking-widest uppercase text-[#8b5e3c]">Browse</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#333] mt-1">Choose The Type!</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {categories.map(cat => (
              <button
                key={cat.label}
                onClick={() => navigate(`/shop?category=${cat.label}`)}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:bg-[#8b5e3c] group cursor-pointer transition-all duration-300"
              >
                <cat.icon className="text-xl sm:text-2xl text-[#8b5e3c] group-hover:text-white transition-colors" />
                <span className="text-xs font-medium text-[#333] group-hover:text-white mt-1 transition-colors">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER ── */}
      <section
        className="py-20 sm:py-24 px-6 sm:px-8 md:px-20 bg-cover bg-center relative"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1600&q=80')",
        }}
      >
        <div className="max-w-xl mx-auto text-center text-white space-y-4 sm:space-y-5">
          <span className="text-xs tracking-widest uppercase text-[#e0c49a]">Limited Offer</span>
          <h2 className="text-3xl sm:text-4xl font-semibold">Get 20% Off Your First Order</h2>
          <p className="text-gray-300 text-sm">Sign up today and unlock exclusive deals on our finest jewellery collection.</p>
          <Link to="/register" className="btn-primary px-8 sm:px-10 py-3 text-sm inline-block">
            Create Account
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-14 sm:py-16 px-6 sm:px-8 md:px-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-medium tracking-widest uppercase text-[#8b5e3c]">Reviews</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#333] mt-1">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map(t => (
              <div key={t.name} className="bg-[#f6f2ee] rounded-2xl p-5 sm:p-6 space-y-4">
                <FaQuoteLeft className="text-[#8b5e3c] text-xl" />
                <p className="text-gray-500 text-sm leading-relaxed">"{t.review}"</p>
                <div className="flex text-[#8b5e3c] gap-0.5">
                  {Array(t.rating).fill(0).map((_, i) => <FaStar key={i} className="text-xs" />)}
                </div>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <span className="font-medium text-sm text-[#333]">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-12 sm:py-14 px-6 sm:px-8 bg-[#f6f2ee] border-t border-gray-200">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-semibold text-[#333]">Stay in the Loop</h3>
          <p className="text-gray-400 text-sm">Subscribe for new arrivals, exclusive offers & jewellery tips.</p>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field rounded-full px-5 flex-1"
            />
            <button className="btn-primary whitespace-nowrap text-sm px-6 py-3">Subscribe</button>
          </div>
        </div>
      </section>

    </div>
  )
}
