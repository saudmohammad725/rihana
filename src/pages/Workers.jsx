import { useState } from 'react'
import { ShoppingCart, Star, Clock, Award } from 'lucide-react'

function Workers({ addToCart }) {
  const [filter, setFilter] = useState('all')

  const workers = [
    {
      id: 'worker-1',
      name: 'فاطمة أحمد',
      specialty: 'تنظيف منزلي',
      rating: 4.9,
      reviews: 127,
      price: 50,
      experience: '5 سنوات',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      description: 'خبرة واسعة في التنظيف المنزلي الشامل'
    },
    {
      id: 'worker-2',
      name: 'نورة محمد',
      specialty: 'طبخ',
      rating: 4.8,
      reviews: 98,
      price: 60,
      experience: '7 سنوات',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
      description: 'متخصصة في الطبخ العربي والخليجي'
    },
    {
      id: 'worker-3',
      name: 'عائشة سالم',
      specialty: 'عناية بكبار السن',
      rating: 5.0,
      reviews: 156,
      price: 70,
      experience: '8 سنوات',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      description: 'خبيرة في العناية بكبار السن بحب واهتمام'
    },
    {
      id: 'worker-4',
      name: 'مريم علي',
      specialty: 'تنظيف وطبخ',
      rating: 4.7,
      reviews: 89,
      price: 55,
      experience: '4 سنوات',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      description: 'متعددة المهارات في التنظيف والطبخ'
    },
    {
      id: 'worker-5',
      name: 'خديجة حسن',
      specialty: 'تنظيف منزلي',
      rating: 4.9,
      reviews: 143,
      price: 50,
      experience: '6 سنوات',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
      description: 'دقة وإتقان في العمل المنزلي'
    },
    {
      id: 'worker-6',
      name: 'سارة عبدالله',
      specialty: 'طبخ',
      rating: 4.8,
      reviews: 112,
      price: 65,
      experience: '9 سنوات',
      image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop',
      description: 'طبخ متنوع وحلويات شرقية'
    }
  ]

  const filteredWorkers = filter === 'all' 
    ? workers 
    : workers.filter(worker => worker.specialty === filter)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="py-20 border-b-2 border-luxury-gold/20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800">العاملات المنزليات</h1>
          <p className="text-xl text-gray-700">
            عاملات محترفات ومدربات على أعلى مستوى من الكفاءة
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
            onClick={() => setFilter('تنظيف منزلي')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'تنظيف منزلي'
                ? 'bg-luxury-gold text-white shadow-lg'
                : 'bg-white text-luxury-navy hover:bg-luxury-cream border border-gray-200'
            }`}
          >
            تنظيف منزلي
          </button>
          <button
            onClick={() => setFilter('طبخ')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'طبخ'
                ? 'bg-luxury-gold text-white shadow-lg'
                : 'bg-white text-luxury-navy hover:bg-luxury-cream border border-gray-200'
            }`}
          >
            طبخ
          </button>
          <button
            onClick={() => setFilter('عناية بكبار السن')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'عناية بكبار السن'
                ? 'bg-luxury-gold text-white shadow-lg'
                : 'bg-white text-luxury-navy hover:bg-luxury-cream border border-gray-200'
            }`}
          >
            عناية بكبار السن
          </button>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="group bg-white rounded-3xl luxury-card overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* صورة العاملة */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={worker.image}
                  alt={worker.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* تدرج في الأسفل */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                
                {/* التقييم */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl flex items-center gap-1 shadow-lg">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-bold text-gray-800">{worker.rating}</span>
                  <span className="text-gray-500 text-sm">({worker.reviews})</span>
                </div>

                {/* الاسم والتخصص في الأسفل */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {worker.name}
                  </h3>
                  <div className="inline-block bg-luxury-gold/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <span className="text-white text-sm font-bold">{worker.specialty}</span>
                  </div>
                </div>
              </div>
              
              {/* المحتوى */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {worker.description}
                </p>
                
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 text-sm">{worker.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 text-sm font-medium">متاحة اليوم</span>
                  </div>
                </div>

                {/* السعر والزر */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-800">
                        {worker.price}
                      </span>
                      <span className="text-gray-500 text-sm">ريال/ساعة</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart({ ...worker, type: 'عاملة' })}
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

export default Workers

