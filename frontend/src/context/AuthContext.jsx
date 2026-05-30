import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser, verifyOtp as verifyOtpApi } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // Step 1: Login — just sends OTP, does NOT store token yet
  const login = async (email, password) => {
    const data = await loginUser({ email, password })
    return data // { message: "OTP sent..." }
  }

  // Step 2: Verify OTP — stores token and user
  const verifyOtp = async (email, otp) => {
    const data = await verifyOtpApi({ email, otp })
    setToken(data.access_token)
    setUser(data.user)
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data
  }

  const register = async (name, email, password) => {
    const data = await registerUser({ name, email, password })
    return data // { message: "Registration successful..." }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
