import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyOtp from './pages/VerifyOtp'
import ForgotPassword from './pages/ForgotPassword'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Dashboard from './pages/Dashboard'
import Wishlist from './pages/Wishlist'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminUsers from './pages/admin/AdminUsers'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCategories from './pages/admin/AdminCategories'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen font-poppins">
              <Routes>
                {/* Admin routes - no Navbar/Footer */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />

                {/* Public routes - with Navbar/Footer */}
                <Route path="/*" element={
                  <>
                    <Navbar />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/"            element={<Home />} />
                        <Route path="/login"       element={<Login />} />
                        <Route path="/register"    element={<Register />} />
                        <Route path="/verify-otp"      element={<VerifyOtp />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/shop"        element={<Shop />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/cart"        element={<Cart />} />
                        <Route path="/checkout"    element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                        <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/wishlist"    element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                      </Routes>
                    </main>
                    <Footer />
                  </>
                } />
              </Routes>
            </div>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
