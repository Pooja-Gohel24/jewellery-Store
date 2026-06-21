import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { resendOtp } from '../api/auth'
import { GiGemPendant } from 'react-icons/gi'
import { FiMail } from 'react-icons/fi'

export default function VerifyOtp() {
  const { verifyOtp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email || ''
  const password = location.state?.password || ''

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendMsg, setResendMsg] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [otpExpiry, setOtpExpiry] = useState(300) // 5 minutes in seconds

  const inputRefs = useRef([])

  // Redirect if no email in state
  useEffect(() => {
    if (!email) navigate('/login')
  }, [email, navigate])

  // Resend cooldown timer
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  // OTP expiry timer (5 minutes)
  useEffect(() => {
    if (otpExpiry <= 0) return
    const timer = setTimeout(() => setOtpExpiry(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [otpExpiry])

  const formatExpiry = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // digits only
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')
    // Auto-focus next
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    pasted.split('').forEach((char, i) => { newOtp[i] = char })
    setOtp(newOtp)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    if (otpValue.length < 6) { setError('Please enter the complete 6-digit OTP'); return }
    setLoading(true)
    setError('')
    try {
      const data = await verifyOtp(email, otpValue)
      navigate(data.user.is_admin ? '/admin' : '/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired OTP. Please try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    setResending(true)
    setResendMsg('')
    setError('')
    try {
      await resendOtp({ email })
      setResendMsg('OTP resent successfully!')
      setCountdown(60)
      setCanResend(false)
      setOtpExpiry(300)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err) {
      setError('Failed to resend OTP. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex font-poppins bg-[#f6f2ee]">

      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&q=80')",
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-2">
            <GiGemPendant className="text-2xl text-[#e0c49a]" />
            <span className="text-xl font-semibold">Jewellery Store</span>
          </div>
          <div>
            <h2 className="text-4xl font-semibold leading-snug mb-3">Two-Step<br />Verification</h2>
            <p className="text-gray-300 text-sm">We keep your account secure with email OTP verification.</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 sm:px-10 py-16">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <GiGemPendant className="text-2xl text-[#8b5e3c]" />
            <span className="text-xl font-semibold text-[#333]">Jewellery Store</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10 space-y-6">

            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#f6f2ee] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="text-3xl text-[#8b5e3c]" />
              </div>
              <h1 className="text-2xl font-semibold text-[#333]">Verify Your Email</h1>
              <p className="text-gray-400 text-sm mt-2">
                We sent a 6-digit OTP to
              </p>
              <p className="text-[#8b5e3c] font-medium text-sm mt-0.5">{email}</p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Resend success */}
            {resendMsg && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <span>✅</span> {resendMsg}
              </div>
            )}

            {/* OTP Input */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold border-2 rounded-xl outline-none transition-all duration-200
                      ${digit ? 'border-[#8b5e3c] bg-[#f6f2ee] text-[#8b5e3c]' : 'border-gray-200 bg-white text-[#333]'}
                      focus:border-[#8b5e3c] focus:ring-2 focus:ring-[#8b5e3c]/20`}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>

            {/* Countdown + Resend */}
            <div className="text-center space-y-2">
              {!canResend ? (
                <p className="text-sm text-gray-400">
                  Resend OTP in <span className="text-[#8b5e3c] font-semibold">{countdown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-sm text-[#8b5e3c] font-semibold hover:underline disabled:opacity-60"
                >
                  {resending ? 'Resending...' : 'Resend OTP'}
                </button>
              )}
              <p className="text-xs text-gray-400">
                OTP expires in{' '}
                <span className={`font-semibold ${otpExpiry <= 60 ? 'text-red-500' : 'text-[#8b5e3c]'}`}>
                  {otpExpiry > 0 ? formatExpiry(otpExpiry) : 'Expired'}
                </span>
              </p>
            </div>

            <p className="text-center text-sm text-gray-500">
              <Link to="/login" className="text-[#8b5e3c] hover:underline font-medium">← Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
