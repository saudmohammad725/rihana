import { useState } from 'react'
import { ShoppingCart, Star, Award, Heart } from 'lucide-react'

function Babysitters({ addToCart }) {
  const [filter, setFilter] = useState('all')

  const babysitters = [
    {
      id: 'babysitter-1',
      name: 'آمنة محمد',
      specialty: 'حديثي الولادة',
      rating: 5.0,
      reviews: 178,
      price: 55,
      experience: '8 سنوات',
      certification: 'معتمدة',
      image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop',
      description: 'خبيرة في العناية بالأطفال الرضع'
    },
    {
      id: 'babysitter-2',
      name: 'لطيفة أحمد',
      specialty: 'أطفال 1-3 سنوات',
      rating: 4.9,
      reviews: 234,
      price: 50,
      experience: '10 سنوات',
      certification: 'معتمدة',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop',
      description: 'تتعامل مع الأطفال بحب وصبر'
    },
    {
      id: 'babysitter-3',
      name: 'هدى سالم',
      specialty: 'أطفال 3-6 سنوات',
      rating: 4.8,
      reviews: 156,
      price: 45,
      experience: '7 سنوات',
      certification: 'معتمدة',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop',
      description: 'متخصصة في الأنشطة التعليمية للأطفال'
    },
    {
      id: 'babysitter-4',
      name: 'نجلاء علي',
      specialty: 'أطفال ذوي احتياجات خاصة',
      rating: 5.0,
      reviews: 198,
      price: 70,
      experience: '12 سنة',
      certification: 'معتمدة ومتخصصة',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop',
      description: 'خبيرة في التعامل مع ذوي الاحتياجات الخاصة'
    },
    {
      id: 'babysitter-5',
      name: 'سلمى حسن',
      specialty: 'حديثي الولادة',
      rating: 4.9,
      reviews: 189,
      price: 55,
      experience: '9 سنوات',
      certification: 'معتمدة',
      image: 'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=400&h=400&fit=crop',
      description: 'رعاية متميزة للأطفال حديثي الولادة'
    },
    {
      id: 'babysitter-6',
      name: 'رقية عبدالله',
      specialty: 'أطفال 1-3 سنوات',
      rating: 4.8,
      reviews: 167,
      price: 50,
      experience: '6 سنوات',
      certification: 'معتمدة',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
      description: 'محبة للأطفال وتهتم بتطويرهم'
    }
  ]

  const filteredBabysitters = filter === 'all' 
    ? babysitters 
    : babysitters.filter(babysitter => babysitter.specialty === filter)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="py-20 border-b-2 border-luxury-gold/20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800">حاضنات الأطفال</h1>
          <p className="text-xl text-gray-700">
            حاضنات موثوقات ومعتمدات للعناية بأطفالك بحب واهتمام
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
            onClick={() => setFilter('حديثي الولادة')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'حديثي الولادة'
                ? 'bg-luxury-gold text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            حديثي الولادة
          </button>
          <button
            onClick={() => setFilter('أطفال 1-3 سنوات')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'أطفال 1-3 سنوات'
                ? 'bg-luxury-gold text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            1-3 سنوات
          </button>
          <button
            onClick={() => setFilter('أطفال 3-6 سنوات')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'أطفال 3-6 سنوات'
                ? 'bg-luxury-gold text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            3-6 سنوات
          </button>
        </div>

        {/* Babysitters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBabysitters.map((babysitter) => (
            <div
              key={babysitter.id}
              className="bg-white rounded-2xl luxury-card overflow-hidden"
            >
              <div className="relative h-64">
                <img
                  src={babysitter.image}
                  alt={babysitter.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-bold">{babysitter.rating}</span>
                  <span className="text-gray-500 text-sm">({babysitter.reviews})</span>
                </div>
                {babysitter.rating === 5.0 && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-current" />
                    الأفضل
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {babysitter.name}
                </h3>
                <p className="text-luxury-gold font-semibold mb-3">
                  {babysitter.specialty}
                </p>
                <p className="text-gray-600 mb-4">
                  {babysitter.description}
                </p>
                
                <div className="space-y-2 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>{babysitter.experience} خبرة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-semibold">{babysitter.certification}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-gray-800">
                      {babysitter.price}
                    </span>
                    <span className="text-gray-500 mr-2">ريال/ساعة</span>
                  </div>
                  <button
                    onClick={() => addToCart({ ...babysitter, type: 'حاضنة' })}
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

export default Babysitters

