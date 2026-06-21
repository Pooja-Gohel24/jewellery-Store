import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { GiGemPendant } from 'react-icons/gi'
import { forgotPassword, resetPassword } from '../api/auth'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1 = email, 2 = otp + new password
  const [email, setEmail] = useState('')
  const [form, setForm] = useState({ otp: '', new_password: '', confirm_password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return setErrors({ email: 'Email is required' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return setErrors({ email: 'Enter a valid email address' })
    setErrors({})
    setApiError('')
    setLoading(true)
    try {
      await forgotPassword({ email: trimmed })
      setStep(2)
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.otp) errs.otp = 'OTP is required'
    if (!form.new_password) errs.new_password = 'Password is required'
    else if (form.new_password.length < 6) errs.new_password = 'Minimum 6 characters'
    if (form.new_password !== form.confirm_password) errs.confirm_password = 'Passwords do not match'
    if (Object.keys(errs).length) return setErrors(errs)
    setErrors({})
    setApiError('')
    setLoading(true)
    try {
      await resetPassword({ email: email.trim(), otp: form.otp, new_password: form.new_password })
      navigate('/login', { state: { message: 'Password reset successful. Please sign in.' } })
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setApiError('')
  }

  return (
    <div className="min-h-screen flex font-poppins bg-[#f6f2ee]">
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900&q=80')",
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-2">
            <GiGemPendant className="text-2xl text-[#e0c49a]" />
            <span className="text-xl font-semibold">Jewellery Store</span>
          </div>
          <div>
            <h2 className="text-4xl font-semibold leading-snug mb-3">Reset Your<br />Password</h2>
            <p className="text-gray-300 text-sm">We'll send an OTP to your email to verify your identity.</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 sm:px-10 py-16">
        <div className="w-full max-w-md">

          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <GiGemPendant className="text-2xl text-[#8b5e3c]" />
            <span className="text-xl font-semibold text-[#333]">Jewellery Store</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10 space-y-6">

            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-semibold text-[#333]">Forgot Password</h1>
              <p className="text-gray-400 text-sm mt-1">
                {step === 1 ? 'Enter your email to receive a reset OTP.' : `Enter the OTP sent to ${email.trim()}`}
              </p>
            </div>

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <span>⚠️</span> {apiError}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1.5">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors({}); setApiError('') }}
                      placeholder="you@example.com"
                      className={`input-field pl-10 ${errors.email ? 'border-red-400 focus:ring-red-300' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <FiMail />
                  }
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1.5">OTP Code</label>
                  <input
                    type="text"
                    name="otp"
                    value={form.otp}
                    onChange={handleChange}
                    placeholder="6-digit OTP"
                    maxLength={6}
                    className={`input-field tracking-widest text-center text-lg ${errors.otp ? 'border-red-400 focus:ring-red-300' : ''}`}
                  />
                  {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1.5">New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="new_password"
                      value={form.new_password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`input-field pl-10 pr-11 ${errors.new_password ? 'border-red-400 focus:ring-red-300' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.new_password && <p className="text-red-500 text-xs mt-1">{errors.new_password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#333] mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirm_password"
                      value={form.confirm_password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`input-field pl-10 ${errors.confirm_password ? 'border-red-400 focus:ring-red-300' : ''}`}
                    />
                  </div>
                  {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <FiLock />
                  }
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep(1); setApiError(''); setErrors({}) }}
                  className="w-full text-sm text-[#8b5e3c] hover:underline"
                >
                  ← Use a different email
                </button>
              </form>
            )}

            <p className="text-center text-sm text-gray-500">
              Remember your password?{' '}
              <Link to="/login" className="text-[#8b5e3c] font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
