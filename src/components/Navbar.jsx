import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Settings, UserCircle2 } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import { useState, useRef, useEffect } from 'react'

function Navbar({ cartCount, isLoggedIn, setIsLoggedIn, currentUser, userProfile }) {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      if (setIsLoggedIn) setIsLoggedIn(false)
      setShowDropdown(false)
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // إغلاق القائمة المنسدلة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-luxury-gold/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="text-3xl font-bold text-gradient-gold">
              ريحانة
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-semibold transition-colors">
              الرئيسية
            </Link>
            <Link to="/workers" className="text-gray-700 hover:text-gray-900 font-semibold transition-colors">
              العاملات
            </Link>
            <Link to="/drivers" className="text-gray-700 hover:text-gray-900 font-semibold transition-colors">
              السواقين
            </Link>
            <Link to="/trips" className="text-gray-700 hover:text-gray-900 font-semibold transition-colors">
              الرحلات الترفيهية
            </Link>
            <Link to="/babysitters" className="text-gray-700 hover:text-gray-900 font-semibold transition-colors">
              حاضنات الأطفال
            </Link>
          </div>

          {/* Icons - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart" className="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-luxury-gold text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-full transition-colors"
                  title="الملف الشخصي"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-luxury-gold to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
                    {/* User Info */}
                    <div className="bg-gradient-to-br from-luxury-gold to-amber-600 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{userProfile?.name || 'مستخدم'}</p>
                          <p className="text-xs text-white/80 truncate">{currentUser?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-700"
                      >
                        <UserCircle2 className="w-5 h-5 text-luxury-gold" />
                        <span className="font-semibold">الملف الشخصي</span>
                      </Link>
                      
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-700"
                      >
                        <Settings className="w-5 h-5 text-luxury-gold" />
                        <span className="font-semibold">الإعدادات</span>
                      </Link>

                      <hr className="my-2 border-gray-100" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors text-red-600"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-semibold">تسجيل الخروج</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 font-semibold">
                <User className="w-5 h-5" />
                <span className="hidden lg:inline">دخول</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

