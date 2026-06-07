import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserPlus, FiPhone } from 'react-icons/fi'
import { GiGemPendant } from 'react-icons/gi'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validate = () => {
    const e = {}
    const name = form.name.trim()
    const email = form.email.trim()
    const phone = form.phone.trim()
    const { password, confirmPassword } = form

    // Name
    if (!name) e.name = 'Full name is required'
    else if (name.length < 2) e.name = 'Name must be at least 2 characters'
    else if (name.length > 50) e.name = 'Name must be under 50 characters'
    else if (!/^[a-zA-Z\s]+$/.test(name)) e.name = 'Name must contain letters only'

    // Email
    if (!email) e.email = 'Email is required'
    else if (/\s/.test(email)) e.email = 'Email must not contain spaces'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address'
    else if (email.length > 100) e.email = 'Email must be under 100 characters'

    // Phone
    if (!phone) e.phone = 'Phone number is required'
    else if (!/^[6-9]\d{9}$/.test(phone)) e.phone = 'Enter a valid 10-digit Indian mobile number'

    // Password
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Minimum 6 characters'
    else if (password.length > 72) e.password = 'Password must be under 72 characters'
    else if (/\s/.test(password)) e.password = 'Password must not contain spaces'
    else if (!/[A-Z]/.test(password)) e.password = 'Must contain at least one uppercase letter'
    else if (!/[0-9]/.test(password)) e.password = 'Must contain at least one number'
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) e.password = 'Must contain at least one special character'

    // Confirm Password
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match'

    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setApiError('')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      setSuccess(true)
      setTimeout(() => navigate('/verify-otp', { state: { email: form.email, password: form.password } }), 1000)
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setApiError('')
  }

  const getStrength = () => {
    const p = form.password
    if (!p) return null
    let score = 0
    if (p.length >= 6) score++
    if (p.length >= 10) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(p)) score++
    if (score <= 1) return { label: 'Weak',   color: 'bg-red-400',   w: 'w-1/4' }
    if (score === 2) return { label: 'Fair',   color: 'bg-yellow-400', w: 'w-2/4' }
    if (score === 3) return { label: 'Good',   color: 'bg-blue-400',   w: 'w-3/4' }
    return              { label: 'Strong', color: 'bg-green-500',  w: 'w-full' }
  }

  const strength = getStrength()

  return (
    <div className="min-h-screen flex font-poppins bg-[#f6f2ee]">

      {/* Left — Image Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80')",
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-2">
            <GiGemPendant className="text-2xl text-[#e0c49a]" />
            <span className="text-xl font-semibold">Jewellery Store</span>
          </div>
          <div>
            <h2 className="text-4xl font-semibold leading-snug mb-3">Join the<br />Jewellery Store Family</h2>
            <p className="text-gray-300 text-sm">Create your account and get 20% off your first order.</p>
          </div>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 sm:px-10 py-16">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <GiGemPendant className="text-2xl text-[#8b5e3c]" />
            <span className="text-xl font-semibold text-[#333]">Jewellery Store</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10 space-y-6">

            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-semibold text-[#333]">Create Account</h1>
              <p className="text-gray-400 text-sm mt-1">Fill in the details below to get started</p>
            </div>

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <span>⚠️</span> {apiError}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <span>✅</span> Account created! OTP sent to your email...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-[#333] mb-1.5">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`input-field pl-10 ${errors.name ? 'border-red-400 focus:ring-red-300' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#333] mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`input-field pl-10 ${errors.email ? 'border-red-400 focus:ring-red-300' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#333] mb-1.5">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`input-field pl-10 ${errors.phone ? 'border-red-400 focus:ring-red-300' : ''}`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#333] mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`input-field pl-10 pr-11 ${errors.password ? 'border-red-400 focus:ring-red-300' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {strength && (
                  <div className="mt-2 space-y-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all duration-300 ${strength.color} ${strength.w}`} />
                    </div>
                    <p className="text-xs text-gray-400">Strength: <span className="font-medium text-[#333]">{strength.label}</span></p>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#333] mb-1.5">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-400 focus:ring-red-300' : ''}`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <p className="text-xs text-gray-400">
                By registering, you agree to our{' '}
                <span className="text-[#8b5e3c] hover:underline cursor-pointer">Terms of Service</span> and{' '}
                <span className="text-[#8b5e3c] hover:underline cursor-pointer">Privacy Policy</span>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <FiUserPlus />
                }
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-full py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Register with Google
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-[#8b5e3c] font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
