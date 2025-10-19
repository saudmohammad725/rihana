import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Clock, CheckCircle, XCircle, Calendar, DollarSign, FileText } from 'lucide-react'

function Orders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all') // all, pending, confirmed, completed

  useEffect(() => {
    // جلب الطلبات من localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    setOrders(bookings.reverse()) // أحدث أولاً
  }, [])

  const getStatusBadge = (status) => {
    const statusStyles = {
      'تحت الإجراء': 'bg-yellow-100 text-yellow-800',
      'مؤكد': 'bg-green-100 text-green-800',
      'مكتمل': 'bg-blue-100 text-blue-800',
      'ملغي': 'bg-red-100 text-red-800'
    }
    
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'تحت الإجراء':
        return <Clock className="w-6 h-6 text-yellow-600" />
      case 'مؤكد':
        return <CheckCircle className="w-6 h-6 text-green-600" />
      case 'مكتمل':
        return <CheckCircle className="w-6 h-6 text-blue-600" />
      case 'ملغي':
        return <XCircle className="w-6 h-6 text-red-600" />
      default:
        return <Package className="w-6 h-6 text-gray-600" />
    }
  }

  const getServiceName = (serviceType) => {
    const services = {
      'workers': 'عاملة منزلية',
      'drivers': 'سائق',
      'trips': 'رحلة ترفيهية',
      'babysitters': 'حاضنة أطفال'
    }
    return services[serviceType] || serviceType
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => {
        if (filter === 'pending') return order.status === 'تحت الإجراء'
        if (filter === 'confirmed') return order.status === 'مؤكد'
        if (filter === 'completed') return order.status === 'مكتمل'
        return true
      })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            طلباتي
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-luxury-gold to-luxury-darkGold mx-auto rounded-full"></div>
          <p className="text-xl text-gray-600 mt-4">
            تابع جميع حجوزاتك وطلباتك من هنا
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                filter === 'all'
                  ? 'bg-luxury-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              الكل ({orders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                filter === 'pending'
                  ? 'bg-luxury-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              تحت الإجراء ({orders.filter(o => o.status === 'تحت الإجراء').length})
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                filter === 'confirmed'
                  ? 'bg-luxury-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              مؤكد ({orders.filter(o => o.status === 'مؤكد').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                filter === 'completed'
                  ? 'bg-luxury-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              مكتمل ({orders.filter(o => o.status === 'مكتمل').length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              لا توجد طلبات
            </h2>
            <p className="text-gray-600 mb-8">
              ابدأ بحجز خدمتك الأولى الآن
            </p>
            <Link
              to="/workers"
              className="inline-block px-8 py-4 bg-luxury-gold hover:bg-luxury-darkGold text-white rounded-lg font-bold text-lg transition-all"
            >
              تصفح الخدمات
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <div
                key={order.id || index}
                className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-all"
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        حجز {getServiceName(order.serviceType)}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        رقم الطلب: {order.id}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-luxury-gold" />
                    <div>
                      <p className="text-sm text-gray-500">التاريخ</p>
                      <p className="font-bold text-gray-800">{order.date || 'غير محدد'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-luxury-gold" />
                    <div>
                      <p className="text-sm text-gray-500">الوقت</p>
                      <p className="font-bold text-gray-800">{order.time || 'غير محدد'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-luxury-gold" />
                    <div>
                      <p className="text-sm text-gray-500">المبلغ الإجمالي</p>
                      <p className="font-bold text-gray-800">{order.totalAmount} ريال</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">طريقة الدفع</p>
                      <p className="font-bold text-gray-800">
                        {order.paymentMethod === 'visa' ? 'فيزا' :
                         order.paymentMethod === 'mada' ? 'مدى' :
                         order.paymentMethod === 'cash' ? 'نقداً' :
                         order.paymentMethod}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">المبلغ المدفوع</p>
                      <p className="font-bold text-green-600">{order.paidAmount || 0} ريال</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">المبلغ المتبقي</p>
                      <p className="font-bold text-orange-600">{order.remainingAmount || order.totalAmount} ريال</p>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-500 mb-2">معلومات العميل</p>
                  <div className="flex flex-wrap gap-4">
                    <span className="text-gray-700">
                      <strong>الاسم:</strong> {order.fullName}
                    </span>
                    <span className="text-gray-700">
                      <strong>الهاتف:</strong> {order.phone}
                    </span>
                    <span className="text-gray-700">
                      <strong>البريد:</strong> {order.email}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-6">
                  <button
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    تفاصيل الطلب
                  </button>
                  {order.status === 'تحت الإجراء' && (
                    <button
                      onClick={() => {
                        if (confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) {
                          const updatedOrders = orders.map(o => 
                            o.id === order.id ? { ...o, status: 'ملغي' } : o
                          )
                          localStorage.setItem('bookings', JSON.stringify(updatedOrders))
                          setOrders(updatedOrders.reverse())
                        }
                      }}
                      className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold transition-all"
                    >
                      إلغاء الطلب
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders

