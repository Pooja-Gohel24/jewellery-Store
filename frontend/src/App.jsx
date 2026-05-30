import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyOtp from './pages/VerifyOtp'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen font-poppins">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/"            element={<Home />} />
                <Route path="/login"       element={<Login />} />
                <Route path="/register"    element={<Register />} />
                <Route path="/verify-otp"  element={<VerifyOtp />} />
                <Route path="/shop"        element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart"        element={<Cart />} />
                <Route path="/checkout"    element={<Checkout />} />
                <Route path="/dashboard"   element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
