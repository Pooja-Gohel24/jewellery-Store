import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiHeart } from 'react-icons/fi'
import { GiGemPendant } from 'react-icons/gi'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const { wishlist } = useWishlist()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/shop', label: 'Collections' },
  ]

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'}`}>
      <div className="flex items-center justify-between px-5 sm:px-8 md:px-14 py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-[#8b5e3c]">
          <GiGemPendant className="text-2xl" />
          <span className="text-lg sm:text-xl font-semibold text-[#333] tracking-wide font-poppins">
            Jewellery Store
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `text-sm font-poppins transition-colors duration-200 ${isActive ? 'text-[#8b5e3c] font-medium' : 'text-[#333] hover:text-[#8b5e3c]'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm text-[#333] font-medium font-poppins hover:text-[#8b5e3c] transition-colors"
              >
                <FiUser className="text-[#8b5e3c]" /> Hi, {user.name.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-[#8b5e3c] hover:underline font-medium font-poppins"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-[#333] hover:text-[#8b5e3c] transition-colors font-poppins">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-5">
                Register
              </Link>
            </>
          )}
          <Link to="/wishlist" className="relative text-[#333] hover:text-[#8b5e3c] transition-colors">
            <FiHeart className="text-xl" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#8b5e3c] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative text-[#333] hover:text-[#8b5e3c] transition-colors">
            <FiShoppingCart className="text-xl" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#8b5e3c] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Right */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/wishlist" className="relative text-[#333] hover:text-[#8b5e3c] transition-colors">
            <FiHeart className="text-xl" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#8b5e3c] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative text-[#333]">
            <FiShoppingCart className="text-xl" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#8b5e3c] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button className="text-[#333]" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 space-y-4 font-poppins shadow-lg">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block text-sm py-1 ${isActive ? 'text-[#8b5e3c] font-medium' : 'text-[#333]'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="btn-outline text-sm py-2 px-4 flex items-center gap-1.5">
                  <FiUser /> Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-outline text-sm py-2 px-4 flex items-center gap-1.5">
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline text-sm py-2 px-4">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm py-2 px-4">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
