import { useState } from 'react'
import { Lock, Mail, Shield, AlertCircle } from 'lucide-react'

function AdminLogin({ setIsAdminLoggedIn, setAdminData }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        setAdminData(data.admin)
        setIsAdminLoggedIn(true)
      } else {
        setError(data.message || 'فشل تسجيل الدخول')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-luxury-gold to-amber-600 rounded-2xl mb-4 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            لوحة التحكم
          </h1>
          <p className="text-gray-400">
            ريحانة - Admin Panel
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          {error && (
            <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-2 text-red-200">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 font-semibold mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pr-12 pl-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-luxury-gold focus:outline-none transition-colors text-white"
                  placeholder="admin@rihana.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pr-12 pl-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:border-luxury-gold focus:outline-none transition-colors text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-luxury-gold to-amber-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <p className="text-gray-400 text-sm text-center">
              <strong className="text-gray-300">البيانات الافتراضية:</strong><br />
              Email: admin@rihana.com<br />
              Password: Admin@123456
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

