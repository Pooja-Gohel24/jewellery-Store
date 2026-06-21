import { Link } from 'react-router-dom'
import { GiGemPendant } from 'react-icons/gi'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'

export default function Footer() {
  return (
    <footer className="bg-[#2c2c2c] text-gray-400 font-poppins">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-14 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <GiGemPendant className="text-2xl text-[#8b5e3c]" />
            <h3 className="text-xl font-semibold">Jewellery Store</h3>
          </div>
          <p className="text-sm leading-relaxed">
            Crafting timeless elegance since 2010. Every piece is a story of luxury, love, and artistry.
          </p>
          <div className="flex gap-3 mt-2">
            {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
              <span key={i}
                className="w-8 h-8 rounded-full border border-gray-600 hover:border-[#8b5e3c] hover:text-[#8b5e3c] flex items-center justify-center cursor-pointer transition-colors">
                <Icon className="text-xs" />
              </span>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-medium mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[['/', 'Home'], ['/shop', 'Collections'], ['/dashboard', 'My Account'], ['/cart', 'Cart']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="hover:text-[#8b5e3c] transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-medium mb-4">Categories</h4>
          <ul className="space-y-2 text-sm">
            {['Rings', 'Necklaces', 'Bracelets', 'Earrings'].map(item => (
              <li key={item}>
                <Link to={`/shop?category=${item}`} className="hover:text-[#8b5e3c] transition-colors cursor-pointer">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-medium mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MdEmail className="text-[#8b5e3c] mt-0.5 shrink-0 text-base" /> support@jewellerystore.com
            </li>
            <li className="flex items-start gap-2">
              <MdPhone className="text-[#8b5e3c] mt-0.5 shrink-0 text-base" /> +91 98765 43210
            </li>
            <li className="flex items-start gap-2">
              <MdLocationOn className="text-[#8b5e3c] mt-0.5 shrink-0 text-base" /> 123 Jewel Street, Mumbai, India
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 py-5 text-center text-sm text-gray-500 px-4">
        © {new Date().getFullYear()} Jewellery Store. All rights reserved.
      </div>
    </footer>
  )
}
