import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Briefcase, ShoppingCart, User, LogOut, Package } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

function BottomNav({ cartCount, isLoggedIn, setIsLoggedIn, currentUser }) {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    {
      name: 'الرئيسية',
      path: '/',
      icon: Home
    },
    {
      name: 'الخدمات',
      path: '/workers',
      icon: Briefcase
    },
    {
      name: 'السلة',
      path: '/cart',
      icon: ShoppingCart,
      badge: cartCount
    },
    {
      name: 'الطلبات',
      path: '/orders',
      icon: Package
    },
    {
      name: isLoggedIn ? 'حسابي' : 'حسابي',
      path: isLoggedIn ? '/profile' : '/login',
      icon: User,
      action: null
    }
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 shadow-2xl z-50 bottom-nav">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          const content = (
            <>
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-gold rounded-b-full animate-slide-down"></div>
              )}
              
              {/* Background Ripple Effect */}
              {isActive && (
                <div className="absolute inset-0 bg-luxury-gold/5 rounded-lg animate-pulse"></div>
              )}
              
              <div className="relative z-10">
                <Icon 
                  className={`w-6 h-6 transition-all duration-300 ${
                    isActive ? 'scale-110 drop-shadow-lg' : ''
                  }`} 
                />
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-gold text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-bounce">
                    {item.badge}
                  </span>
                )}
              </div>
              
              <span className={`text-xs font-semibold z-10 transition-all duration-300 ${
                isActive ? 'text-luxury-gold scale-105' : ''
              }`}>
                {item.name}
              </span>
            </>
          )
          
          if (item.action) {
            return (
              <button
                key={index}
                onClick={item.action}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative active:scale-95 ${
                  isActive 
                    ? 'text-luxury-gold' 
                    : 'text-gray-500 active:text-gray-700'
                }`}
              >
                {content}
              </button>
            )
          }
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative active:scale-95 ${
                isActive 
                  ? 'text-luxury-gold' 
                  : 'text-gray-500 active:text-gray-700'
              }`}
            >
              {content}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNav

