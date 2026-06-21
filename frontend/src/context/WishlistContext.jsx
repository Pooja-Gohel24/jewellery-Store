import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from '../api/wishlist'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setLoading(true)
      getWishlist()
        .then(setWishlist)
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      try {
        const guest = localStorage.getItem('wishlist_guest')
        setWishlist(guest ? JSON.parse(guest) : [])
      } catch {
        setWishlist([])
      }
    }
  }, [user])

  const toggleWishlist = async (product) => {
    if (!user) {
      navigate('/login')
      return
    }

    const exists = wishlist.some(item => item.id === product.id)
    if (exists) {
      try {
        await apiRemoveFromWishlist(product.id)
        setWishlist(prev => prev.filter(item => item.id !== product.id))
      } catch (err) {
        console.error("Failed to remove from wishlist", err)
      }
    } else {
      try {
        await apiAddToWishlist(product.id)
        setWishlist(prev => [...prev, product])
      } catch (err) {
        console.error("Failed to add to wishlist", err)
      }
    }
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId)
  }

  const removeFromWishlist = async (productId) => {
    if (!user) {
      const updated = wishlist.filter(item => item.id !== productId)
      setWishlist(updated)
      localStorage.setItem('wishlist_guest', JSON.stringify(updated))
      return
    }
    try {
      await apiRemoveFromWishlist(productId)
      setWishlist(prev => prev.filter(item => item.id !== productId))
    } catch (err) {
      console.error("Failed to remove from wishlist", err)
    }
  }

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
