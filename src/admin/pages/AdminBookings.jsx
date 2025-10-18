import { useEffect, useState } from 'react'
import { Calendar, Filter, CheckCircle, XCircle, Clock, User } from 'lucide-react'

function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [serviceFilter, setServiceFilter] = useState('')
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

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        alert('تم تحديث حالة الحجز بنجاح')
        fetchBookings()
      }
    } catch (error) {
      console.error('Update status error:', error)
      alert('حدث خطأ أثناء التحديث')
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

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-luxury-gold focus:outline-none"
        >
          <option value="">كل الحالات</option>
          <option value="pending">معلق</option>
          <option value="confirmed">مؤكد</option>
          <option value="completed">مكتمل</option>
          <option value="cancelled">ملغي</option>
        </select>

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

      {/* Bookings Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="text-right py-4 px-4 text-gray-400 font-semibold">العميل</th>
                <th className="text-right py-4 px-4 text-gray-400 font-semibold">الخدمة</th>
                <th className="text-right py-4 px-4 text-gray-400 font-semibold">التاريخ</th>
                <th className="text-right py-4 px-4 text-gray-400 font-semibold">الوقت</th>
                <th className="text-right py-4 px-4 text-gray-400 font-semibold">السعر</th>
                <th className="text-right py-4 px-4 text-gray-400 font-semibold">الحالة</th>
                <th className="text-right py-4 px-4 text-gray-400 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-t border-gray-700 hover:bg-gray-700/50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white font-semibold">{booking.users?.name || 'غير معروف'}</p>
                      <p className="text-gray-400 text-sm">{booking.users?.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{booking.service_name}</td>
                  <td className="py-4 px-4 text-gray-300">
                    {new Date(booking.booking_date).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="py-4 px-4 text-gray-300">{booking.booking_time}</td>
                  <td className="py-4 px-4 text-gray-300">{booking.price} ر.س</td>
                  <td className="py-4 px-4">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)} bg-opacity-20 border-0 cursor-pointer`}
                    >
                      <option value="pending">معلق</option>
                      <option value="confirmed">مؤكد</option>
                      <option value="completed">مكتمل</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="text-red-400 hover:text-red-300 font-semibold"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    'confirmed': 'bg-blue-500/20 text-blue-400',
    'completed': 'bg-green-500/20 text-green-400',
    'cancelled': 'bg-red-500/20 text-red-400'
  }
  return colors[status] || 'bg-gray-500/20 text-gray-400'
}

export default AdminBookings

