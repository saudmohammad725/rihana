import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Phone, Mail, Users, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { bookingsAPI } from '../services/api'

function BookingForm({ serviceType, serviceDetails, currentUser }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    // معلومات أساسية
    fullName: currentUser?.displayName || '',
    phone: '',
    email: currentUser?.email || '',
    
    // تفاصيل الخدمة
    date: '',
    time: '',
    hours: 1,
    
    // موقع الخدمة
    address: '',
    latitude: null,
    longitude: null,
    
    // تفاصيل خاصة بكل خدمة
    numberOfPeople: 1,
    numberOfWorkers: 1,
    cleaningTools: 'yes', // للعاملات
    
    // للسائقين
    pickupLocation: '',
    destination: '',
    serviceMode: 'point-to-point', // point-to-point أو on-demand
    numberOfPassengers: 1,
    carType: 'economy',
    
    // للرحلات
    tripPackage: '',
    adults: 1,
    children: 0,
    needsTransportation: false,
    foodRequirements: '',
    occasion: '',
    
    // لحاضنات الأطفال
    emergencyPhone: '',
    childrenCount: 1,
    childrenAges: '',
    allergies: '',
    medicalConditions: '',
    childrenRoutine: '',
    houseRules: '',
    allowOutdoorPlay: false,
    
    // ملاحظات عامة
    specialNotes: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 24.7136, lng: 46.6753 }) // الرياض كمركز افتراضي
  const [showPayment, setShowPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [bookingId, setBookingId] = useState(null)

  // التحقق من صحة رقم الجوال
  const validatePhone = (phone) => {
    return /^05\d{8}$/.test(phone)
  }

  // التحقق من صحة البريد الإلكتروني
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // الحصول على الموقع الجغرافي
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude
          const newLng = position.coords.longitude
          setFormData({
            ...formData,
            latitude: newLat,
            longitude: newLng
          })
          setMapCenter({ lat: newLat, lng: newLng })
          setShowMap(true)
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('لم نتمكن من الحصول على موقعك. يمكنك اختيار الموقع يدوياً من الخريطة.')
          // فتح الخريطة على موقع افتراضي
          setShowMap(true)
        }
      )
    } else {
      alert('المتصفح لا يدعم تحديد الموقع الجغرافي. يمكنك اختيار الموقع يدوياً من الخريطة.')
      setShowMap(true)
    }
  }

  // فتح الخريطة للاختيار اليدوي
  const openMapSelector = () => {
    setShowMap(true)
  }

  // تحديث الموقع من الخريطة
  const handleMapClick = (lat, lng) => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng
    })
    setMapCenter({ lat, lng })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    // مسح الخطأ عند التعديل
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // التحقق من المعلومات الأساسية
    if (!formData.fullName.trim()) newErrors.fullName = 'الاسم الكامل مطلوب'
    if (!validatePhone(formData.phone)) newErrors.phone = 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام'
    if (!validateEmail(formData.email)) newErrors.email = 'البريد الإلكتروني غير صحيح'
    if (!formData.date) newErrors.date = 'التاريخ مطلوب'
    if (!formData.time) newErrors.time = 'الوقت مطلوب'
    if (formData.hours < 1) newErrors.hours = 'عدد الساعات يجب أن يكون على الأقل 1'

    // التحقق حسب نوع الخدمة
    if (serviceType === 'workers' || serviceType === 'babysitters') {
      if (!formData.address.trim()) newErrors.address = 'العنوان مطلوب'
    }

    if (serviceType === 'workers') {
      if (formData.numberOfWorkers < 1) newErrors.numberOfWorkers = 'عدد العاملات يجب أن يكون على الأقل 1'
    }

    if (serviceType === 'drivers') {
      if (!formData.pickupLocation.trim()) newErrors.pickupLocation = 'نقطة الانطلاق مطلوبة'
      if (formData.serviceMode === 'point-to-point' && !formData.destination.trim()) {
        newErrors.destination = 'الوجهة مطلوبة'
      }
    }

    if (serviceType === 'trips') {
      if (!formData.tripPackage) newErrors.tripPackage = 'يجب اختيار باقة الرحلة'
    }

    if (serviceType === 'babysitters') {
      if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'رقم الطوارئ مطلوب'
      if (!validatePhone(formData.emergencyPhone)) newErrors.emergencyPhone = 'رقم الطوارئ غير صحيح'
      if (!formData.childrenAges.trim()) newErrors.childrenAges = 'أعمار الأطفال مطلوبة'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // حفظ البيانات مؤقتاً وعرض شاشة الدفع
    const newBookingId = 'booking_' + Date.now()
    setBookingId(newBookingId)
    setShowPayment(true)
  }

  const handleDemoBooking = () => {
    if (!validateForm()) {
      return
    }

    // إنشاء حجز تجريبي مباشرة بدون دفع
    const newBookingId = 'booking_' + Date.now()
    const bookingData = {
      id: newBookingId,
      serviceType,
      serviceDetails,
      ...formData,
      userId: currentUser?.uid || 'demo-user-123',
      userEmail: currentUser?.email || 'demo@rihana.com',
      status: 'تحت الإجراء',
      paymentStatus: 'غير مطلوب',
      paymentMethod: 'تجريبي',
      totalAmount: calculateTotal(),
      paidAmount: 0,
      createdAt: new Date().toISOString()
    }

    // حفظ في localStorage
    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    existingBookings.push(bookingData)
    localStorage.setItem('bookings', JSON.stringify(existingBookings))

    setSuccess(true)
    setTimeout(() => {
      navigate('/orders')
    }, 2000)
  }

  const handlePayment = () => {
    if (!paymentMethod) {
      alert('الرجاء اختيار طريقة الدفع')
      return
    }

    setLoading(true)

    // محاكاة عملية الدفع
    setTimeout(() => {
      const bookingData = {
        id: bookingId,
        serviceType,
        serviceDetails,
        ...formData,
        userId: currentUser?.uid || 'demo-user-123',
        userEmail: currentUser?.email || 'demo@rihana.com',
        status: 'مؤكد',
        paymentStatus: 'تم دفع 50%',
        paymentMethod,
        totalAmount: calculateTotal(),
        paidAmount: calculateTotal() / 2,
        remainingAmount: calculateTotal() / 2,
        createdAt: new Date().toISOString()
      }

      // حفظ في localStorage
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      existingBookings.push(bookingData)
      localStorage.setItem('bookings', JSON.stringify(existingBookings))

      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        navigate('/orders')
      }, 2000)
    }, 1500)
  }

  const calculateTotal = () => {
    const hours = parseInt(formData.hours) || 1
    const basePrice = serviceDetails?.price || 50
    return hours * basePrice
  }

  if (showPayment) {
    const total = calculateTotal()
    const deposit = total / 2

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">إتمام الدفع</h1>
              <div className="h-1 w-32 bg-gradient-to-r from-luxury-gold to-luxury-darkGold mx-auto rounded-full"></div>
            </div>

            {/* ملخص الحجز */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">ملخص الحجز</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">إجمالي المبلغ:</span>
                  <span className="font-bold text-gray-800">{total} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">مبلغ الضمان (50%):</span>
                  <span className="font-bold text-luxury-gold">{deposit} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">المبلغ المتبقي:</span>
                  <span className="font-bold text-gray-800">{deposit} ريال</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">* سيتم دفع المبلغ المتبقي عند استلام الخدمة</p>
            </div>

            {/* خيارات الدفع */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">اختر طريقة الدفع</h3>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('visa')}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  paymentMethod === 'visa'
                    ? 'border-luxury-gold bg-luxury-gold/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                      VISA
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">بطاقة فيزا</p>
                      <p className="text-sm text-gray-500">Visa Card</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    paymentMethod === 'visa' ? 'border-luxury-gold bg-luxury-gold' : 'border-gray-300'
                  }`}></div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('mada')}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  paymentMethod === 'mada'
                    ? 'border-luxury-gold bg-luxury-gold/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                      مدى
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">بطاقة مدى</p>
                      <p className="text-sm text-gray-500">Mada Card</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    paymentMethod === 'mada' ? 'border-luxury-gold bg-luxury-gold' : 'border-gray-300'
                  }`}></div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-luxury-gold bg-luxury-gold/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-2xl">
                      💵
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">الدفع نقداً</p>
                      <p className="text-sm text-gray-500">Cash Payment</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    paymentMethod === 'cash' ? 'border-luxury-gold bg-luxury-gold' : 'border-gray-300'
                  }`}></div>
                </div>
              </button>
            </div>

            {/* أزرار التأكيد */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowPayment(false)}
                className="flex-1 px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold text-lg transition-all"
              >
                رجوع
              </button>
              <button
                type="button"
                onClick={handlePayment}
                disabled={loading}
                className="flex-1 px-6 py-4 bg-luxury-gold hover:bg-luxury-darkGold text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري الدفع...' : `دفع ${deposit} ريال`}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">تم تأكيد الحجز بنجاح! 🎉</h2>
          <p className="text-xl text-gray-600 mb-6">تم دفع مبلغ الضمان بنجاح</p>
          <p className="text-gray-500">جاري التحويل إلى صفحة الطلبات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              نموذج حجز {serviceType === 'workers' ? 'عاملة منزلية' : 
                         serviceType === 'drivers' ? 'سائق' :
                         serviceType === 'trips' ? 'رحلة ترفيهية' :
                         'حاضنة أطفال'}
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-luxury-gold to-luxury-darkGold mx-auto rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* معلومات أساسية */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-luxury-gold" />
                معلومات أساسية
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors ${
                      errors.fullName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="أدخل اسمك الكامل"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    رقم الجوال <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="05xxxxxxxx"
                    maxLength="10"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* تفاصيل الموعد */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-luxury-gold" />
                تفاصيل الموعد
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    التاريخ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors ${
                      errors.date ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    الوقت <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors ${
                      errors.time ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.time && (
                    <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    عدد الساعات <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="hours"
                    value={formData.hours}
                    onChange={handleChange}
                    min="1"
                    max="24"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors ${
                      errors.hours ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.hours && (
                    <p className="text-red-500 text-sm mt-1">{errors.hours}</p>
                  )}
                </div>
              </div>
            </div>

            {/* تفاصيل خاصة بالخدمة */}
            {serviceType === 'workers' && (
              <WorkersFields 
                formData={formData} 
                handleChange={handleChange} 
                errors={errors}
                getCurrentLocation={getCurrentLocation}
                openMapSelector={openMapSelector}
                showMap={showMap}
                setShowMap={setShowMap}
                mapCenter={mapCenter}
                handleMapClick={handleMapClick}
              />
            )}

            {serviceType === 'drivers' && (
              <DriversFields 
                formData={formData} 
                handleChange={handleChange} 
                errors={errors}
              />
            )}

            {serviceType === 'trips' && (
              <TripsFields 
                formData={formData} 
                handleChange={handleChange} 
                errors={errors}
              />
            )}

            {serviceType === 'babysitters' && (
              <BabysittersFields 
                formData={formData} 
                handleChange={handleChange} 
                errors={errors}
                getCurrentLocation={getCurrentLocation}
                openMapSelector={openMapSelector}
                showMap={showMap}
                setShowMap={setShowMap}
                mapCenter={mapCenter}
                handleMapClick={handleMapClick}
              />
            )}

            {/* ملاحظات خاصة */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <label className="block text-gray-700 font-semibold mb-2">
                ملاحظات خاصة (اختياري)
              </label>
              <textarea
                name="specialNotes"
                value={formData.specialNotes}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors resize-none"
                placeholder="أي تعليمات أو ملاحظات إضافية..."
              ></textarea>
            </div>

            {/* أزرار الإرسال */}
            <div className="space-y-4 pt-6">
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold text-lg transition-all"
                >
                  رجوع
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-luxury-gold hover:bg-luxury-darkGold text-white rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? 'جاري الحجز...' : 'تأكيد الحجز ودفع الضمان'}
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">أو</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDemoBooking}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <span>🚀</span>
                <span>حجز تجريبي (بدون دفع)</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// مكونات فرعية لكل خدمة
function WorkersFields({ formData, handleChange, errors, getCurrentLocation, openMapSelector, showMap, setShowMap, mapCenter, handleMapClick }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-luxury-gold" />
        تفاصيل الخدمة
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            عدد العاملات المطلوب <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="numberOfWorkers"
            value={formData.numberOfWorkers}
            onChange={handleChange}
            min="1"
            max="10"
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors ${
              errors.numberOfWorkers ? 'border-red-500' : 'border-gray-200'
            }`}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            عدد الأفراد في المنزل
          </label>
          <input
            type="number"
            name="numberOfPeople"
            value={formData.numberOfPeople}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          عنوان المنزل <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="2"
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors resize-none ${
              errors.address ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="أدخل عنوان المنزل بالتفصيل (الحي، الشارع، رقم المبنى)"
          />
          {errors.address && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.address}
            </p>
          )}
          
          {/* أزرار تحديد الموقع */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={getCurrentLocation}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-luxury-gold hover:bg-luxury-darkGold text-white rounded-lg font-semibold transition-all"
            >
              <MapPin className="w-5 h-5" />
              موقعي الحالي
            </button>
            <button
              type="button"
              onClick={openMapSelector}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-lg font-semibold transition-all"
            >
              🗺️ اختر من الخريطة
            </button>
          </div>

          {/* الخريطة المنبثقة */}
          {showMap && (
            <InteractiveMap
              latitude={formData.latitude || mapCenter.lat}
              longitude={formData.longitude || mapCenter.lng}
              onLocationSelect={handleMapClick}
              onClose={() => setShowMap(false)}
            />
          )}

          {/* عرض الموقع المحدد */}
          {formData.latitude && formData.longitude && (
            <div className="bg-white rounded-lg border-2 border-gray-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-luxury-gold" />
                  الموقع المحدد
                </span>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">✓ تم التحديد</span>
              </div>
              <div className="h-48 rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=15&output=embed`}
                  title="الموقع على الخريطة"
                ></iframe>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                الإحداثيات: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-3">
          هل تتوفر أدوات التنظيف؟ <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="cleaningTools"
              value="yes"
              checked={formData.cleaningTools === 'yes'}
              onChange={handleChange}
              className="w-5 h-5 text-luxury-gold focus:ring-luxury-gold"
            />
            <span className="text-gray-700">نعم، أوفرها</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="cleaningTools"
              value="no"
              checked={formData.cleaningTools === 'no'}
              onChange={handleChange}
              className="w-5 h-5 text-luxury-gold focus:ring-luxury-gold"
            />
            <span className="text-gray-700">لا، أرغب في توفيرها من قبلكم (بتكلفة إضافية)</span>
          </label>
        </div>
      </div>
    </div>
  )
}

function DriversFields({ formData, handleChange, errors }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">تفاصيل الرحلة</h2>

      <div>
        <label className="block text-gray-700 font-semibold mb-3">
          نوع الخدمة <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="serviceMode"
              value="point-to-point"
              checked={formData.serviceMode === 'point-to-point'}
              onChange={handleChange}
              className="w-5 h-5 text-luxury-gold"
            />
            <span className="text-gray-700">توصيلة من نقطة أ إلى ب</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="serviceMode"
              value="on-demand"
              checked={formData.serviceMode === 'on-demand'}
              onChange={handleChange}
              className="w-5 h-5 text-luxury-gold"
            />
            <span className="text-gray-700">سائق تحت الطلب لعدة وجهات</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          نقطة الانطلاق <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="pickupLocation"
          value={formData.pickupLocation}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors ${
            errors.pickupLocation ? 'border-red-500' : 'border-gray-200'
          }`}
          placeholder="أدخل نقطة الانطلاق"
        />
        {errors.pickupLocation && (
          <p className="text-red-500 text-sm mt-1">{errors.pickupLocation}</p>
        )}
      </div>

      {formData.serviceMode === 'point-to-point' && (
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            الوجهة <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors ${
              errors.destination ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="أدخل الوجهة النهائية"
          />
          {errors.destination && (
            <p className="text-red-500 text-sm mt-1">{errors.destination}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            عدد الركاب
          </label>
          <input
            type="number"
            name="numberOfPassengers"
            value={formData.numberOfPassengers}
            onChange={handleChange}
            min="1"
            max="7"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            نوع السيارة
          </label>
          <select
            name="carType"
            value={formData.carType}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors"
          >
            <option value="economy">اقتصادية</option>
            <option value="family">عائلية</option>
            <option value="luxury">فاخرة</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function TripsFields({ formData, handleChange, errors }) {
  const tripPackages = [
    'رحلة بحرية',
    'جولة في المدينة',
    'رحلة صحراوية',
    'رحلة جبلية',
    'رحلة سياحية'
  ]

  return (
    <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">تفاصيل الرحلة</h2>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          اختيار باقة الرحلة <span className="text-red-500">*</span>
        </label>
        <select
          name="tripPackage"
          value={formData.tripPackage}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors ${
            errors.tripPackage ? 'border-red-500' : 'border-gray-200'
          }`}
        >
          <option value="">اختر الباقة</option>
          {tripPackages.map(pkg => (
            <option key={pkg} value={pkg}>{pkg}</option>
          ))}
        </select>
        {errors.tripPackage && (
          <p className="text-red-500 text-sm mt-1">{errors.tripPackage}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            عدد البالغين
          </label>
          <input
            type="number"
            name="adults"
            value={formData.adults}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            عدد الأطفال
          </label>
          <input
            type="number"
            name="children"
            value={formData.children}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="needsTransportation"
            checked={formData.needsTransportation}
            onChange={handleChange}
            className="w-5 h-5 text-luxury-gold rounded focus:ring-luxury-gold"
          />
          <span className="text-gray-700 font-semibold">هل تحتاج إلى مواصلات؟</span>
        </label>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          متطلبات خاصة بالطعام (اختياري)
        </label>
        <input
          type="text"
          name="foodRequirements"
          value={formData.foodRequirements}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors"
          placeholder="مثل: حساسية، نظام نباتي، إلخ"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          مناسبة الرحلة (اختياري)
        </label>
        <input
          type="text"
          name="occasion"
          value={formData.occasion}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors"
          placeholder="مثل: عيد ميلاد، ذكرى زواج، إلخ"
        />
      </div>
    </div>
  )
}

function BabysittersFields({ formData, handleChange, errors, getCurrentLocation, openMapSelector, showMap, setShowMap, mapCenter, handleMapClick }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">تفاصيل الخدمة</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            رقم الطوارئ الإضافي <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors ${
              errors.emergencyPhone ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="05xxxxxxxx"
            maxLength="10"
          />
          {errors.emergencyPhone && (
            <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            عدد الأطفال
          </label>
          <input
            type="number"
            name="childrenCount"
            value={formData.childrenCount}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          عنوان المنزل <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="2"
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors resize-none ${
              errors.address ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="أدخل عنوان المنزل بالتفصيل (الحي، الشارع، رقم المبنى)"
          />
          {errors.address && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.address}
            </p>
          )}
          
          {/* أزرار تحديد الموقع */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={getCurrentLocation}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-luxury-gold hover:bg-luxury-darkGold text-white rounded-lg font-semibold transition-all"
            >
              <MapPin className="w-5 h-5" />
              موقعي الحالي
            </button>
            <button
              type="button"
              onClick={openMapSelector}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-lg font-semibold transition-all"
            >
              🗺️ اختر من الخريطة
            </button>
          </div>

          {/* الخريطة المنبثقة */}
          {showMap && (
            <InteractiveMap
              latitude={formData.latitude || mapCenter.lat}
              longitude={formData.longitude || mapCenter.lng}
              onLocationSelect={handleMapClick}
              onClose={() => setShowMap(false)}
            />
          )}

          {/* عرض الموقع المحدد */}
          {formData.latitude && formData.longitude && (
            <div className="bg-white rounded-lg border-2 border-gray-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-luxury-gold" />
                  الموقع المحدد
                </span>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">✓ تم التحديد</span>
              </div>
              <div className="h-48 rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=15&output=embed`}
                  title="الموقع على الخريطة"
                ></iframe>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                الإحداثيات: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          أعمار الأطفال <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="childrenAges"
          value={formData.childrenAges}
          onChange={handleChange}
          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors ${
            errors.childrenAges ? 'border-red-500' : 'border-gray-200'
          }`}
          placeholder="مثال: 2 سنوات، 5 سنوات، 8 سنوات"
        />
        {errors.childrenAges && (
          <p className="text-red-500 text-sm mt-1">{errors.childrenAges}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          الحساسية (إن وجدت)
        </label>
        <input
          type="text"
          name="allergies"
          value={formData.allergies}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors"
          placeholder="مثل: حساسية من الفول السوداني، البيض، إلخ"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          حالة طبية خاصة أو أدوية (إن وجدت)
        </label>
        <textarea
          name="medicalConditions"
          value={formData.medicalConditions}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors resize-none"
          placeholder="أي حالة طبية أو أدوية يجب أن تعرفها الحاضنة"
        ></textarea>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          روتين الأطفال (مواعيد النوم، الأكل، إلخ)
        </label>
        <textarea
          name="childrenRoutine"
          value={formData.childrenRoutine}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors resize-none"
          placeholder="صف روتين الأطفال اليومي"
        ></textarea>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          قواعد المنزل
        </label>
        <textarea
          name="houseRules"
          value={formData.houseRules}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors resize-none"
          placeholder="القواعد الأساسية التي يجب على الحاضنة اتباعها"
        ></textarea>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="allowOutdoorPlay"
            checked={formData.allowOutdoorPlay}
            onChange={handleChange}
            className="w-5 h-5 text-luxury-gold rounded focus:ring-luxury-gold"
          />
          <span className="text-gray-700 font-semibold">هل يُسمح بالخروج من المنزل مع الأطفال؟</span>
        </label>
      </div>
    </div>
  )
}

// مكون الخريطة التفاعلية
function InteractiveMap({ latitude, longitude, onLocationSelect, onClose }) {
  const [selectedLat, setSelectedLat] = React.useState(latitude)
  const [selectedLng, setSelectedLng] = React.useState(longitude)
  const [zoom, setZoom] = React.useState(15)
  const mapContainerRef = React.useRef(null)

  React.useEffect(() => {
    // تحميل Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    // تحميل Leaflet JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => {
      if (mapContainerRef.current && window.L) {
        // إنشاء الخريطة
        const map = window.L.map(mapContainerRef.current).setView([selectedLat, selectedLng], zoom)

        // إضافة طبقة الخريطة
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map)

        // إنشاء أيقونة مخصصة
        const customIcon = window.L.divIcon({
          className: 'custom-marker',
          html: '<div style="background: #ef4444; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>',
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        })

        // إضافة علامة متحركة
        const marker = window.L.marker([selectedLat, selectedLng], {
          icon: customIcon,
          draggable: true
        }).addTo(map)

        // تحديث الموقع عند سحب العلامة
        marker.on('dragend', function(e) {
          const pos = e.target.getLatLng()
          setSelectedLat(pos.lat)
          setSelectedLng(pos.lng)
        })

        // تحديث الموقع عند النقر على الخريطة
        map.on('click', function(e) {
          const { lat, lng } = e.latlng
          marker.setLatLng([lat, lng])
          setSelectedLat(lat)
          setSelectedLng(lng)
        })

        // حفظ مرجع الخريطة للتنظيف
        mapContainerRef.current._leafletMap = map
      }
    }
    document.body.appendChild(script)

    // التنظيف عند إلغاء المكون
    return () => {
      if (mapContainerRef.current && mapContainerRef.current._leafletMap) {
        mapContainerRef.current._leafletMap.remove()
      }
    }
  }, [])

  const handleConfirm = () => {
    onLocationSelect(selectedLat, selectedLng)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">حدد موقعك على الخريطة</h3>
              <p className="text-gray-600 text-sm mt-1">انقر على الخريطة أو اسحب العلامة الحمراء</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* الخريطة */}
          <div 
            ref={mapContainerRef}
            className="h-96 rounded-xl overflow-hidden border-2 border-gray-200"
            style={{ zIndex: 1 }}
          />

          {/* معلومات الموقع */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-luxury-gold" />
              <span className="font-semibold">الإحداثيات المحددة:</span>
              <span className="text-gray-600">{selectedLat.toFixed(6)}, {selectedLng.toFixed(6)}</span>
            </div>
          </div>

          {/* تعليمات */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 space-y-1">
              <span className="block">🖱️ <strong>انقر</strong> على أي مكان في الخريطة لتحديده</span>
              <span className="block">👆 <strong>اسحب</strong> العلامة الحمراء لتحريكها</span>
              <span className="block">🔍 <strong>استخدم عجلة الماوس</strong> للتكبير والتصغير</span>
            </p>
          </div>

          {/* الأزرار */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition-all"
            >
              إلغاء
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-3 bg-luxury-gold hover:bg-luxury-darkGold text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-xl"
            >
              تأكيد الموقع ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingForm

