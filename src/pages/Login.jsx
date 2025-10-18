import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebase'

function Login({ setIsLoggedIn }) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
      setIsLoggedIn(true)
      localStorage.setItem('isLoggedIn', 'true')
      navigate('/')
    } catch (error) {
      console.error('Login error:', error)
      switch (error.code) {
        case 'auth/invalid-email':
          setError('البريد الإلكتروني غير صحيح')
          break
        case 'auth/user-not-found':
          setError('المستخدم غير موجود')
          break
        case 'auth/wrong-password':
          setError('كلمة المرور غير صحيحة')
          break
        case 'auth/invalid-credential':
          setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
          break
        default:
          setError('حدث خطأ في تسجيل الدخول. حاول مرة أخرى')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-gold mb-2">
            ريحانة
          </h1>
          <h2 className="text-3xl font-bold text-gray-800">
            تسجيل الدخول
          </h2>
          <p className="text-gray-700 mt-2">
            أهلاً بعودتك! سجل دخولك للمتابعة
          </p>
        </div>

        <div className="bg-white rounded-2xl luxury-shadow p-8 border border-luxury-gold/10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-lg focus:border-luxury-gold focus:outline-none transition-colors"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pr-12 pl-12 py-3 border-2 border-gray-200 rounded-lg focus:border-luxury-gold focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="ml-2 w-4 h-4 text-purple-600" />
                <span className="text-gray-600">تذكرني</span>
              </label>
              <a href="#" className="text-gray-600 hover:text-gray-800 font-semibold">
                نسيت كلمة المرور؟
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-luxury-gold hover:bg-luxury-darkGold text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>

            <div className="text-center">
              <span className="text-gray-600">ليس لديك حساب؟ </span>
              <Link to="/register" className="text-luxury-gold hover:text-luxury-darkGold font-bold transition-colors">
                إنشاء حساب جديد
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

