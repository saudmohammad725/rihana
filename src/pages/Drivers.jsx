import { useState } from 'react'
import { ShoppingCart, Star, Car, Award } from 'lucide-react'

function Drivers({ addToCart }) {
  const [filter, setFilter] = useState('all')

  const drivers = [
    {
      id: 'driver-1',
      name: 'أحمد محمد',
      specialty: 'سيارة عائلية',
      rating: 4.9,
      reviews: 234,
      price: 40,
      experience: '10 سنوات',
      carType: 'تويوتا كامري 2023',
      driverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      carImage: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=500&fit=crop',
      description: 'سائق محترف وملتزم بالمواعيد'
    },
    {
      id: 'driver-2',
      name: 'خالد عبدالله',
      specialty: 'سيارة فخمة',
      rating: 5.0,
      reviews: 189,
      price: 80,
      experience: '12 سنة',
      carType: 'مرسيدس S-Class',
      driverImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      carImage: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=500&fit=crop',
      description: 'خدمة VIP بسيارات فاخرة'
    },
    {
      id: 'driver-3',
      name: 'محمود حسن',
      specialty: 'سيارة اقتصادية',
      rating: 4.8,
      reviews: 156,
      price: 35,
      experience: '8 سنوات',
      carType: 'هونداي أكسنت 2023',
      driverImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      carImage: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&h=500&fit=crop',
      description: 'سعر مناسب وخدمة ممتازة'
    },
    {
      id: 'driver-4',
      name: 'عمر سالم',
      specialty: 'سيارة عائلية',
      rating: 4.9,
      reviews: 198,
      price: 45,
      experience: '9 سنوات',
      carType: 'GMC يوكن',
      driverImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
      carImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=500&fit=crop',
      description: 'سيارات واسعة للعائلات الكبيرة'
    },
    {
      id: 'driver-5',
      name: 'يوسف أحمد',
      specialty: 'سيارة رياضية',
      rating: 4.7,
      reviews: 142,
      price: 70,
      experience: '7 سنوات',
      carType: 'BMW 5 Series',
      driverImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      carImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=500&fit=crop',
      description: 'تجربة قيادة رياضية مميزة'
    },
    {
      id: 'driver-6',
      name: 'سعد علي',
      specialty: 'سيارة اقتصادية',
      rating: 4.8,
      reviews: 167,
      price: 35,
      experience: '6 سنوات',
      carType: 'كيا سيراتو 2024',
      driverImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
      carImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=500&fit=crop',
      description: 'موثوق ومريح في التعامل'
    }
  ]

  const filteredDrivers = filter === 'all' 
    ? drivers 
    : drivers.filter(driver => driver.specialty === filter)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="py-20 border-b-2 border-luxury-gold/20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800">خدمة السائقين</h1>
          <p className="text-xl text-gray-700">
            سائقون محترفون مع سيارات فاخرة ومريحة
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-luxury-gold text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilter('سيارة اقتصادية')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'سيارة اقتصادية'
                ? 'bg-luxury-gold text-white shadow-lg'
                : 'bg-white text-luxury-navy hover:bg-luxury-cream border border-gray-200'
            }`}
          >
            سيارة اقتصادية
          </button>
          <button
            onClick={() => setFilter('سيارة عائلية')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'سيارة عائلية'
                ? 'bg-luxury-gold text-white shadow-lg'
                : 'bg-white text-luxury-navy hover:bg-luxury-cream border border-gray-200'
            }`}
          >
            سيارة عائلية
          </button>
          <button
            onClick={() => setFilter('سيارة فخمة')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'سيارة فخمة'
                ? 'bg-luxury-gold text-white shadow-lg'
                : 'bg-white text-luxury-navy hover:bg-luxury-cream border border-gray-200'
            }`}
          >
            سيارة فخمة
          </button>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              className="group bg-white rounded-3xl luxury-card overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* صورة السيارة */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={driver.carImage}
                  alt={driver.carType}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* تدرج في الأسفل */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* التقييم */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl flex items-center gap-1 shadow-lg">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-bold text-gray-800">{driver.rating}</span>
                  <span className="text-gray-500 text-sm">({driver.reviews})</span>
                </div>

                {/* صورة السائق صغيرة في الزاوية */}
                <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full border-4 border-white shadow-xl overflow-hidden">
                  <img
                    src={driver.driverImage}
                    alt={driver.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* نوع السيارة */}
                <div className="absolute bottom-4 left-4 bg-luxury-gold/95 backdrop-blur-sm px-3 py-1 rounded-lg">
                  <span className="text-white text-sm font-bold">{driver.specialty}</span>
                </div>
              </div>
              
              {/* المحتوى */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    {driver.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Car className="w-4 h-4 text-luxury-gold" />
                  <span className="text-gray-600 font-medium">{driver.carType}</span>
                </div>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {driver.description}
                </p>
                
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500 text-sm">{driver.experience} خبرة</span>
                </div>

                {/* السعر والزر */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-800">
                        {driver.price}
                      </span>
                      <span className="text-gray-500 text-sm">ريال/ساعة</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart({ ...driver, type: 'سائق' })}
                    className="bg-gradient-to-r from-luxury-gold to-luxury-darkGold hover:shadow-xl text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 group-hover:scale-105"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    احجز
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Drivers

