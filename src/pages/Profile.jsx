import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateProfile, updateEmail, updatePassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../config/firebase'
import { authAPI } from '../services/api'
import { UserCircle2, Mail, Lock, Save, LogOut, AlertCircle, CheckCircle2, User } from 'lucide-react'
import { signOut } from 'firebase/auth'

function Profile({ currentUser, userProfile, setUserProfile }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    name: userProfile?.name || currentUser?.displayName || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setMessage({ type: '', text: '' })
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // تحديث الاسم في Firebase
      if (formData.name !== currentUser?.displayName) {
        await updateProfile(currentUser, {
          displayName: formData.name
        })
      }

      // تحديث البيانات via API
      await authAPI.updateProfile(currentUser.uid, {
        name: formData.name
      })

      // تحديث البيانات المحلية
      setUserProfile({
        ...userProfile,
        name: formData.name
      })

      setMessage({ 
        type: 'success', 
        text: 'تم تحديث الملف الشخصي بنجاح! ✓' 
      })
    } catch (error) {
      console.error('Profile update error:', error)
      setMessage({ 
        type: 'error', 
        text: getErrorMessage(error.code) 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // تحديث البريد الإلكتروني في Firebase
      await updateEmail(currentUser, formData.email)

      // تحديث البريد الإلكتروني via API
      await authAPI.updateProfile(currentUser.uid, {
        email: formData.email
      })

      setMessage({ 
        type: 'success', 
        text: 'تم تحديث البريد الإلكتروني بنجاح! ✓' 
      })
    } catch (error) {
      console.error('Email update error:', error)
      setMessage({ 
        type: 'error', 
        text: getErrorMessage(error.code) 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    // التحقق من تطابق كلمة السر
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ 
        type: 'error', 
        text: 'كلمة السر الجديدة غير متطابقة' 
      })
      setLoading(false)
      return
    }

    // التحقق من طول كلمة السر
    if (formData.newPassword.length < 6) {
      setMessage({ 
        type: 'error', 
        text: 'كلمة السر يجب أن تكون 6 أحرف على الأقل' 
      })
      setLoading(false)
      return
    }

    try {
      await updatePassword(currentUser, formData.newPassword)
      
      setMessage({ 
        type: 'success', 
        text: 'تم تحديث كلمة السر بنجاح! ✓' 
      })
      
      // إعادة تعيين حقول كلمة السر
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Password update error:', error)
      setMessage({ 
        type: 'error', 
        text: getErrorMessage(error.code) 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await sendPasswordResetEmail(auth, currentUser.email)
      setMessage({ 
        type: 'success', 
        text: 'تم إرسال رابط إعادة تعيين كلمة السر إلى بريدك الإلكتروني' 
      })
    } catch (error) {
      console.error('Reset password error:', error)
      setMessage({ 
        type: 'error', 
        text: getErrorMessage(error.code) 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/requires-recent-login': 'يجب عليك تسجيل الدخول مرة أخرى للقيام بهذا الإجراء',
      'auth/invalid-email': 'البريد الإلكتروني غير صالح',
      'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
      'auth/weak-password': 'كلمة السر ضعيفة جداً',
      'auth/wrong-password': 'كلمة السر الحالية غير صحيحة'
    }
    return errorMessages[errorCode] || 'حدث خطأ، يرجى المحاولة مرة أخرى'
  }

  if (!currentUser) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-cream via-white to-luxury-cream/50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-luxury-gold to-amber-600 rounded-full text-white text-4xl font-bold shadow-2xl mb-6">
            {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : currentUser?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">الملف الشخصي</h1>
          <p className="text-gray-600">إدارة معلوماتك الشخصية وإعدادات الحساب</p>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-fade-in-up ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="font-semibold">{message.text}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Update Name */}
          <div className="luxury-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-luxury-gold/10 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-luxury-gold" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">تعديل الاسم</h2>
                <p className="text-sm text-gray-600">قم بتحديث اسمك الشخصي</p>
              </div>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">الاسم</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 transition-all"
                  placeholder="أدخل اسمك"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-gold text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>حفظ التغييرات</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Update Email */}
          <div className="luxury-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">تعديل البريد الإلكتروني</h2>
                <p className="text-sm text-gray-600">قم بتحديث بريدك الإلكتروني</p>
              </div>
            </div>
            
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>حفظ التغييرات</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Update Password */}
          <div className="luxury-card p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">تغيير كلمة السر</h2>
                <p className="text-sm text-gray-600">قم بتحديث كلمة السر الخاصة بك</p>
              </div>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">كلمة السر الجديدة</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                    placeholder="كلمة السر الجديدة"
                    minLength="6"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">تأكيد كلمة السر</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                    placeholder="تأكيد كلمة السر"
                    minLength="6"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading || !formData.newPassword || !formData.confirmPassword}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>جاري الحفظ...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>تحديث</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-luxury-gold hover:text-amber-700 font-semibold underline"
                >
                  نسيت كلمة السر؟ إرسال رابط إعادة التعيين
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 font-bold rounded-xl transition-all duration-300 border-2 border-transparent hover:border-red-200"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile

