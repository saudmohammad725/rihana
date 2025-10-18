import { useState } from 'react'
import { ShoppingCart, Star, MapPin, Users, Clock } from 'lucide-react'

function Trips({ addToCart }) {
  const [filter, setFilter] = useState('all')

  const trips = [
    {
      id: 'trip-1',
      name: 'رحلة صحراوية',
      specialty: 'مغامرات',
      rating: 4.9,
      reviews: 312,
      price: 200,
      duration: '8 ساعات',
      capacity: '6 أشخاص',
      location: 'صحراء الرياض',
      image: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&h=600&fit=crop',
      description: 'استمتع بتجربة التخييم وركوب الكثبان الرملية'
    },
    {
      id: 'trip-2',
      name: 'جولة المعالم التاريخية',
      specialty: 'ثقافية',
      rating: 4.8,
      reviews: 267,
      price: 150,
      duration: '6 ساعات',
      capacity: '8 أشخاص',
      location: 'الدرعية',
      image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop',
      description: 'اكتشف تاريخ وتراث المملكة العريق'
    },
    {
      id: 'trip-3',
      name: 'رحلة بحرية',
      specialty: 'عائلية',
      rating: 5.0,
      reviews: 198,
      price: 300,
      duration: '4 ساعات',
      capacity: '10 أشخاص',
      location: 'البحر الأحمر',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      description: 'استمتع بالإبحار والغوص في مياه البحر الأحمر'
    },
    {
      id: 'trip-4',
      name: 'رحلة جبلية',
      specialty: 'مغامرات',
      rating: 4.7,
      reviews: 145,
      price: 180,
      duration: '7 ساعات',
      capacity: '6 أشخاص',
      location: 'جبال السودة',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      description: 'تسلق الجبال والاستمتاع بالمناظر الخلابة'
    },
    {
      id: 'trip-5',
      name: 'رحلة ترفيهية للأطفال',
      specialty: 'عائلية',
      rating: 4.9,
      reviews: 289,
      price: 120,
      duration: '5 ساعات',
      capacity: '12 شخص',
      location: 'مدينة الألعاب',
      image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop',
      description: 'يوم مليء بالمرح والألعاب للعائلة'
    },
    {
      id: 'trip-6',
      name: 'جولة المطاعم الفاخرة',
      specialty: 'ثقافية',
      rating: 4.8,
      reviews: 223,
      price: 250,
      duration: '4 ساعات',
      capacity: '4 أشخاص',
      location: 'الرياض',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      description: 'جولة تذوق الطعام في أفخم المطاعم'
    }
  ]

  const filteredTrips = filter === 'all' 
    ? trips 
    : trips.filter(trip => trip.specialty === filter)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="py-20 border-b-2 border-luxury-gold/20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800">الرحلات الترفيهية</h1>
          <p className="text-xl text-gray-700">
            رحلات فاخرة ومميزة لك ولعائلتك بتنظيم احترافي
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
            onClick={() => setFilter('عائلية')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'عائلية'
                ? 'bg-luxury-gold text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            عائلية
          </button>
          <button
            onClick={() => setFilter('مغامرات')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'مغامرات'
                ? 'bg-luxury-gold text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            مغامرات
          </button>
          <button
            onClick={() => setFilter('ثقافية')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'ثقافية'
                ? 'bg-luxury-gold text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            ثقافية
          </button>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl luxury-card overflow-hidden"
            >
              <div className="relative h-64">
                <img
                  src={trip.image}
                  alt={trip.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-bold">{trip.rating}</span>
                  <span className="text-gray-500 text-sm">({trip.reviews})</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{trip.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {trip.name}
                </h3>
                <p className="text-luxury-gold font-semibold mb-3">
                  {trip.specialty}
                </p>
                <p className="text-gray-600 mb-4">
                  {trip.description}
                </p>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{trip.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{trip.capacity}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-gray-800">
                      {trip.price}
                    </span>
                    <span className="text-gray-500 mr-2">ريال/رحلة</span>
                  </div>
                  <button
                    onClick={() => addToCart({ ...trip, type: 'رحلة' })}
                    className="bg-luxury-gold hover:bg-luxury-darkGold text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    احجز الآن
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

export default Trips

