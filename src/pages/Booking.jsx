import { useParams, useLocation, Navigate } from 'react-router-dom'
import BookingForm from '../components/BookingForm'

function Booking({ isLoggedIn, currentUser }) {
  const { serviceType } = useParams()
  const location = useLocation()
  const serviceDetails = location.state

  // إذا المستخدم مو مسجل دخول، نحوله لصفحة تسجيل الدخول
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // التحقق من نوع الخدمة
  const validServiceTypes = ['workers', 'drivers', 'trips', 'babysitters']
  if (!validServiceTypes.includes(serviceType)) {
    return <Navigate to="/" replace />
  }

  return (
    <BookingForm 
      serviceType={serviceType}
      serviceDetails={serviceDetails}
      currentUser={currentUser}
    />
  )
}

export default Booking

