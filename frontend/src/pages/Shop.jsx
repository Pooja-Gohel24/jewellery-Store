import { useState, useMemo, useEffect } from 'react'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../api/products'
import { getCategories } from '../api/categories'
import ProductCard from '../components/ProductCard'

const sortOptions = [
  { value: 'default',    label: 'Default' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'newest',     label: 'Newest First' },
]

export default function Shop() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')
  const [sortBy, setSortBy] = useState('default')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    getCategories()
      .then(data => {
        setCategories(['All', ...data.map(c => c.name)])
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setActiveCategory(cat)
  }, [searchParams])

  useEffect(() => {
    setLoading(true)
    getProducts()
      .then(data => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let result = [...products]
    if (search.trim())
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (activeCategory !== 'All')
      result = result.filter(p => p.category === activeCategory)
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    if (sortBy === 'price-low')  result.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price)
    if (sortBy === 'rating')     result.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'newest')     result.sort((a, b) => b.id - a.id)
    return result
  }, [products, search, activeCategory, sortBy, priceRange])

  const clearFilters = () => {
    setSearch('')
    setActiveCategory('All')
    setSortBy('default')
    setPriceRange([0, 100000])
  }

  const isFiltered = search || activeCategory !== 'All' || sortBy !== 'default' || priceRange[1] !== 100000

  return (
    <div className="min-h-screen bg-[#f6f2ee] font-poppins pt-20">

      <div className="bg-white border-b border-gray-100 py-8 px-6 sm:px-10 md:px-20">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-medium tracking-widest uppercase text-[#8b5e3c]">Our Store</span>
          <h1 className="text-3xl font-semibold text-[#333] mt-1">All Collections</h1>
          <p className="text-gray-400 text-sm mt-1">{loading ? 'Loading...' : `${filtered.length} products found`}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-20 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <aside className={`
            lg:w-64 shrink-0
            fixed lg:static inset-0 z-40 bg-white lg:bg-transparent
            transform transition-transform duration-300
            ${showFilter ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="bg-white rounded-2xl p-6 space-y-6 h-full lg:h-auto overflow-y-auto">
              <div className="flex items-center justify-between lg:hidden">
                <h3 className="font-semibold text-[#333]">Filters</h3>
                <button onClick={() => setShowFilter(false)}><FiX className="text-xl" /></button>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#333] mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setShowFilter(false) }}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        activeCategory === cat
                          ? 'bg-[#8b5e3c] text-white font-medium'
                          : 'text-gray-600 hover:bg-[#f6f2ee]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#333] mb-3">Max Price</h4>
                <input
                  type="range" min={0} max={100000} step={1000}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([0, Number(e.target.value)])}
                  className="w-full accent-[#8b5e3c]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>₹0</span>
                  <span className="text-[#8b5e3c] font-medium">₹{priceRange[1].toLocaleString('en-IN')}</span>
                </div>
              </div>

              {isFiltered && (
                <button onClick={clearFilters} className="w-full btn-outline text-sm py-2">
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {showFilter && (
            <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setShowFilter(false)} />
          )}

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" placeholder="Search jewellery..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="input-field pl-10 bg-white"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="input-field bg-white w-auto text-sm"
                >
                  {sortOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowFilter(true)}
                  className="lg:hidden btn-outline text-sm py-2 px-4 flex items-center gap-2"
                >
                  <FiFilter /> Filter
                </button>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {categories.map(cat => (
                <button
                  key={cat} onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 text-xs px-4 py-1.5 rounded-full border transition-colors ${
                    activeCategory === cat
                      ? 'bg-[#8b5e3c] text-white border-[#8b5e3c]'
                      : 'border-gray-300 text-gray-600 bg-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-52 bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-8 bg-gray-200 rounded-full mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 space-y-3">
                <p className="text-5xl">💎</p>
                <p className="text-gray-500 font-medium">No products found</p>
                <button onClick={clearFilters} className="btn-primary text-sm px-6">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
