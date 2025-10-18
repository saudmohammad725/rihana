import { useEffect, useState } from 'react'
import { Users, Calendar, CheckCircle, Clock, DollarSign, TrendingUp, Eye, Package } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('http://localhost:5000/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Fetch dashboard error:', error)
    } finally {
      setLoading(false)
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

  const statCards = [
    {
      title: 'إجمالي المستخدمين',
      value: stats?.statistics?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400'
    },
    {
      title: 'إجمالي الحجوزات',
      value: stats?.statistics?.totalBookings || 0,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    },
    {
      title: 'حجوزات معلقة',
      value: stats?.statistics?.pendingBookings || 0,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-400'
    },
    {
      title: 'حجوزات مكتملة',
      value: stats?.statistics?.completedBookings || 0,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400'
    },
    {
      title: 'إجمالي الإيرادات',
      value: `${stats?.statistics?.totalRevenue || 0} ر.س`,
      icon: DollarSign,
      color: 'from-luxury-gold to-amber-600',
      bgColor: 'bg-luxury-gold/10',
      textColor: 'text-luxury-gold'
    },
    {
      title: 'مستخدمين جدد (هذا الشهر)',
      value: stats?.statistics?.newUsersThisMonth || 0,
      icon: TrendingUp,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-400'
    }
  ]

  // Prepare data for charts
  const serviceData = Object.entries(stats?.serviceStats || {}).map(([name, value]) => ({
    name: getServiceName(name),
    value
  }))

  const COLORS = ['#C9A961', '#3B82F6', '#8B5CF6', '#10B981']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h1>
        <p className="text-gray-400">مرحباً بك في لوحة التحكم - ريحانة</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className={`px-3 py-1 bg-gradient-to-r ${stat.color} rounded-full`}>
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Trend */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">تطور الحجوزات (آخر 7 أيام)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats?.trendData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line type="monotone" dataKey="count" stroke="#C9A961" strokeWidth={3} dot={{ fill: '#C9A961', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Service Distribution */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">توزيع الحجوزات حسب الخدمة</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">أحدث الحجوزات</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">المستخدم</th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">الخدمة</th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">السعر</th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">الحالة</th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentBookings?.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="py-3 px-4 text-white">{booking.users?.name || 'غير معروف'}</td>
                  <td className="py-3 px-4 text-gray-300">{booking.service_name}</td>
                  <td className="py-3 px-4 text-gray-300">{booking.price} ر.س</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    {new Date(booking.created_at).toLocaleDateString('ar-SA')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function getServiceName(serviceType) {
  const names = {
    'workers': 'العاملات',
    'drivers': 'السواقين',
    'trips': 'الرحلات',
    'babysitters': 'حاضنات الأطفال'
  }
  return names[serviceType] || serviceType
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

function getStatusText(status) {
  const texts = {
    'pending': 'معلق',
    'confirmed': 'مؤكد',
    'completed': 'مكتمل',
    'cancelled': 'ملغي'
  }
  return texts[status] || status
}

export default AdminDashboard

