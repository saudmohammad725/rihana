import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { auth } from './config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { authAPI, analyticsAPI } from './services/api'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Workers from './pages/Workers'
import Drivers from './pages/Drivers'
import Trips from './pages/Trips'
import Babysitters from './pages/Babysitters'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Booking from './pages/Booking'
import Footer from './components/Footer'
import PWAInstallPrompt from './components/PWAInstallPrompt'

function App() {
  const [cart, setCart] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // تتبع حالة تسجيل الدخول وجلب بيانات المستخدم من Supabase
  useEffect(() => {
    // التحقق من تسجيل الدخول الوهمي
    const isDemoUser = localStorage.getItem('demoUser')
    const isLoggedInStorage = localStorage.getItem('isLoggedIn')
    
    if (isDemoUser === 'true' && isLoggedInStorage === 'true') {
      setIsLoggedIn(true)
      setCurrentUser({
        uid: 'demo-user-123',
        email: 'demo@rihana.com',
        displayName: 'مستخدم تجريبي'
      })
      setUserProfile({
        name: 'مستخدم تجريبي',
        email: 'demo@rihana.com',
        phone: '0500000000'
      })
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true)
        setCurrentUser(user)
        
        // جلب بيانات المستخدم من API
        try {
          const response = await authAPI.getProfile(user.uid)
          setUserProfile(response.user)
        } catch (error) {
          // Silently ignore profile fetch errors if server is not running
        }
      } else {
        setIsLoggedIn(false)
        setCurrentUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id))
  }

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  // عرض شاشة تحميل أثناء فحص حالة المصادقة
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-luxury-cream to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-luxury-gold text-xl font-bold">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Animated Waves Background */}
        <div className="wave">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="wave-animation" style={{ height: '150px', width: '100%' }}>
            <path 
              fill="rgba(201, 169, 97, 0.03)" 
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
        
        <div className="relative z-10">
          <Navbar 
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
            isLoggedIn={isLoggedIn} 
            setIsLoggedIn={setIsLoggedIn}
            currentUser={currentUser}
            userProfile={userProfile}
          />
          <main className="flex-grow pb-20 md:pb-0">
            <Routes>
              <Route path="/" element={<Home isLoggedIn={isLoggedIn} userProfile={userProfile} />} />
              <Route path="/workers" element={<Workers />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/babysitters" element={<Babysitters />} />
              <Route path="/booking/:serviceType" element={<Booking isLoggedIn={isLoggedIn} currentUser={currentUser} />} />
              <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile currentUser={currentUser} userProfile={userProfile} setUserProfile={setUserProfile} />} />
            </Routes>
          </main>
          <Footer />
          <BottomNav 
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
            isLoggedIn={isLoggedIn} 
            setIsLoggedIn={setIsLoggedIn}
            currentUser={currentUser}
          />
        </div>
      </div>
      <PWAInstallPrompt />
    </Router>
  )
}

export default App

