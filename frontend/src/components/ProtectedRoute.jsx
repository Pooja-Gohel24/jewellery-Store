import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f2ee]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#8b5e3c] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400 font-poppins">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}
