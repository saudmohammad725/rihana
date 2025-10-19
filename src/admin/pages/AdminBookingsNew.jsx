import { useEffect, useState } from 'react'
import { Calendar, CheckCircle, XCircle, Clock, User, Phone, Mail, FileText, Key, DollarSign } from 'lucide-react'

function AdminBookingsNew() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [serviceFilter, setServiceFilter] = useState('')
  const [activeTab, setActiveTab] = useState('all') // all, pending, confirmed
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchBookings()
  }, [pagination.page, statusFilter, serviceFilter])

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(
        `http://localhost:5000/api/bookings?page=${pagination.page}&limit=${pagination.limit}&status=${statusFilter}&serviceType=${serviceFilter}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Fetch bookings error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (bookingId) => {
    if (!confirm('هل أنت متأكد من قبول هذا الحجز؟')) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('تم قبول الحجز بنجاح! ✅')
        fetchBookings()
      }
    } catch (error) {
      console.error('Accept booking error:', error)
      alert('حدث خطأ أثناء قبول الحجز')
    }
  }

  const handleReject = async (bookingId) => {
    if (!confirm('هل أنت متأكد من رفض هذا الحجز؟')) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('تم رفض الحجز')
        fetchBookings()
      }
    } catch (error) {
      console.error('Reject booking error:', error)
      alert('حدث خطأ أثناء رفض الحجز')
    }
  }

  const handleDelete = async (bookingId) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحجز؟')) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('تم حذف الحجز بنجاح')
        fetchBookings()
      }
    } catch (error) {
      console.error('Delete booking error:', error)
      alert('حدث خطأ أثناء الحذف')
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'pending') return booking.status === 'pending'
    if (activeTab === 'confirmed') return booking.status === 'confirmed'
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">إدارة الحجوزات</h1>
        <p className="text-gray-400">إجمالي الحجوزات: {pagination.total}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeTab === 'all'
              ? 'text-luxury-gold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          جميع الطلبات
          {activeTab === 'all' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeTab === 'pending'
              ? 'text-yellow-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          طلبات معلقة
          <span className="mr-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
            {bookings.filter(b => b.status === 'pending').length}
          </span>
          {activeTab === 'pending' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('confirmed')}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeTab === 'confirmed'
              ? 'text-green-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          طلبات مقبولة
          <span className="mr-2 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">
            {bookings.filter(b => b.status === 'confirmed').length}
          </span>
          {activeTab === 'confirmed' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400"></div>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-luxury-gold focus:outline-none"
        >
          <option value="">كل الخدمات</option>
          <option value="workers">العاملات</option>
          <option value="drivers">السواقين</option>
          <option value="trips">الرحلات</option>
          <option value="babysitters">حاضنات الأطفال</option>
        </select>
      </div>

      {/* Bookings Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-gray-800 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all overflow-hidden"
          >
            <div className="p-6">
              {/* Header with Invoice & Code */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-lg ${getStatusBgColor(booking.status)}`}>
                    <span className={`font-bold text-sm ${getStatusTextColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{new Date(booking.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="px-4 py-2 bg-luxury-gold/10 rounded-lg border border-luxury-gold/30">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-luxury-gold" />
                      <div>
                        <p className="text-xs text-gray-400">رقم الفاتورة</p>
                        <p className="font-bold text-luxury-gold">{booking.invoice_number || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-400">الكود السري</p>
                        <p className="font-bold text-blue-400 font-mono text-sm">{booking.encrypted_code || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-luxury-gold" />
                    معلومات العميل
                  </h3>
                  <div className="space-y-3 pr-7">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">الاسم</p>
                        <p className="text-white font-semibold">{booking.users?.name || 'غير معروف'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">البريد الإلكتروني</p>
                        <p className="text-white">{booking.users?.email || 'غير متوفر'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">رقم الجوال</p>
                        <p className="text-white font-semibold direction-ltr">{booking.users?.phone || 'غير متوفر'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-luxury-gold" />
                    تفاصيل الحجز
                  </h3>
                  <div className="space-y-3 pr-7">
                    <div>
                      <p className="text-xs text-gray-400">الخدمة</p>
                      <p className="text-white font-semibold text-lg">{booking.service_name}</p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-gray-400">التاريخ</p>
                        <p className="text-white">{new Date(booking.booking_date).toLocaleDateString('ar-SA')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">الوقت</p>
                        <p className="text-white">{booking.booking_time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-xs text-gray-400">السعر</p>
                        <p className="text-white font-bold text-xl">{booking.price} ر.س</p>
                      </div>
                    </div>
                    {booking.notes && (
                      <div>
                        <p className="text-xs text-gray-400">ملاحظات</p>
                        <p className="text-gray-300 text-sm">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-gray-700 flex flex-wrap gap-3">
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAccept(booking.id)}
                      className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all font-bold shadow-lg hover:shadow-xl"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>قبول الطلب</span>
                    </button>
                    <button
                      onClick={() => handleReject(booking.id)}
                      className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all font-bold shadow-lg hover:shadow-xl"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>رفض الطلب</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(booking.id)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors font-semibold"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            السابق
          </button>
          <span className="px-4 py-2 bg-gray-800 text-white rounded-lg">
            صفحة {pagination.page} من {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  )
}

function getStatusColor(status) {
  const colors = {
    'pending': 'bg-yellow-500/20 text-yellow-400',
    'confirmed': 'bg-green-500/20 text-green-400',
    'completed': 'bg-blue-500/20 text-blue-400',
    'cancelled': 'bg-gray-500/20 text-gray-400',
    'rejected': 'bg-red-500/20 text-red-400'
  }
  return colors[status] || 'bg-gray-500/20 text-gray-400'
}

function getStatusBgColor(status) {
  const colors = {
    'pending': 'bg-yellow-500/20',
    'confirmed': 'bg-green-500/20',
    'completed': 'bg-blue-500/20',
    'cancelled': 'bg-gray-500/20',
    'rejected': 'bg-red-500/20'
  }
  return colors[status] || 'bg-gray-500/20'
}

function getStatusTextColor(status) {
  const colors = {
    'pending': 'text-yellow-400',
    'confirmed': 'text-green-400',
    'completed': 'text-blue-400',
    'cancelled': 'text-gray-400',
    'rejected': 'text-red-400'
  }
  return colors[status] || 'text-gray-400'
}

function getStatusText(status) {
  const texts = {
    'pending': 'معلق',
    'confirmed': 'مقبول',
    'completed': 'مكتمل',
    'cancelled': 'ملغي',
    'rejected': 'مرفوض'
  }
  return texts[status] || status
}

export default AdminBookingsNew

