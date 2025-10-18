import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminBookingsNew from './pages/AdminBookingsNew'
import AdminLayout from './components/AdminLayout'

function AdminApp() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adminData, setAdminData] = useState(null)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('http://localhost:5000/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setIsAdminLoggedIn(true)
        setAdminData(data.admin)
      } else {
        localStorage.removeItem('adminToken')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('adminToken')
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAdminLoggedIn(false)
    setAdminData(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!isAdminLoggedIn) {
    return <AdminLogin setIsAdminLoggedIn={setIsAdminLoggedIn} setAdminData={setAdminData} />
  }

  return (
    <Router basename="/admin">
      <AdminLayout adminData={adminData} onLogout={handleAdminLogout}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/bookings" element={<AdminBookingsNew />} />
        </Routes>
      </AdminLayout>
    </Router>
  )
}

export default AdminApp

