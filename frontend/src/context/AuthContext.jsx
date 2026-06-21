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

  const login = async (email, password) => {
    const data = await loginUser({ email, password })
    return data
  }

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
    return data
  }

  const logout = () => {
    // Clear user-specific cart before wiping user
    if (user) {
      localStorage.removeItem(`cart_${user.id}`)
    }
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Also clear legacy cart key
    localStorage.removeItem('cart')
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, verifyOtp, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
