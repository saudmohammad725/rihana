import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Phone, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../config/firebase'
import { authAPI } from '../services/api'

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور غير متطابقة')
      return
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    setLoading(true)

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      // Update user profile with name
      await updateProfile(userCredential.user, {
        displayName: formData.name
      })

      // Save user data via API
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        firebaseUid: userCredential.user.uid
      })

      // Navigate to home page
      navigate('/')
    } catch (error) {
      console.error('Registration error:', error)
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('البريد الإلكتروني مستخدم بالفعل')
          break
        case 'auth/invalid-email':
          setError('البريد الإلكتروني غير صحيح')
          break
        case 'auth/weak-password':
          setError('كلمة المرور ضعيفة جداً')
          break
        default:
          setError('حدث خطأ في التسجيل. حاول مرة أخرى')
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
            إنشاء حساب جديد
          </h2>
          <p className="text-gray-700 mt-2">
            انضم إلينا وابدأ بحجز خدماتك المفضلة
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
                الاسم الكامل
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-lg focus:border-luxury-gold focus:outline-none transition-colors"
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
            </div>

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
                رقم الجوال
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-lg focus:border-luxury-gold focus:outline-none transition-colors"
                  placeholder="05xxxxxxxx"
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

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pr-12 pl-12 py-3 border-2 border-gray-200 rounded-lg focus:border-luxury-gold focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-start">
                <input type="checkbox" className="ml-2 mt-1 w-4 h-4 text-purple-600" required />
                <span className="text-gray-600 text-sm">
                  أوافق على <a href="#" className="text-gray-700 hover:text-gray-900 hover:underline">الشروط والأحكام</a> و <a href="#" className="text-gray-700 hover:text-gray-900 hover:underline">سياسة الخصوصية</a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-luxury-gold hover:bg-luxury-darkGold text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </button>

            <div className="text-center">
              <span className="text-gray-600">لديك حساب بالفعل؟ </span>
              <Link to="/login" className="text-luxury-gold hover:text-luxury-darkGold font-bold transition-colors">
                تسجيل الدخول
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register

