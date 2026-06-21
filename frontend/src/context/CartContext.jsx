import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const cartKey = user ? `cart_${user.id}` : 'cart_guest'

  const [cartItems, setCartItems] = useState(() => {
    try {
      const key = user ? `cart_${user.id}` : 'cart_guest'
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  // Reload cart when user changes (login/logout)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(cartKey)
      setCartItems(saved ? JSON.parse(saved) : [])
    } catch { setCartItems([]) }
  }, [cartKey])

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems))
  }, [cartItems, cartKey])

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      navigate('/login')
      return false
    }
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
    return true
  }

  const removeFromCart = (id) => setCartItems(prev => prev.filter(item => item.id !== id))

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) { removeFromCart(id); return }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem(cartKey)
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
