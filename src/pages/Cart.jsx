import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

function Cart({ cart, removeFromCart, updateQuantity }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-32 h-32 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            سلة الحجوزات فارغة
          </h2>
          <p className="text-gray-600 mb-8">
            لم تقم بإضافة أي خدمات بعد
          </p>
          <Link
            to="/"
            className="inline-block bg-luxury-gold hover:bg-luxury-darkGold text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            تصفح الخدمات
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="py-20 border-b-2 border-luxury-gold/20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800">سلة الحجوزات</h1>
          <p className="text-xl text-gray-700">
            راجع حجوزاتك واستكمل عملية الحجز
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl luxury-card p-6"
              >
                <div className="flex gap-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-xl"
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-luxury-gold font-semibold">
                          {item.type} • {item.specialty}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-xl font-bold w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-luxury-gold hover:bg-luxury-darkGold text-white p-2 rounded-full transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="text-gray-600 mr-2">
                          {item.duration ? '' : 'ساعات'}
                        </span>
                      </div>

                      <div className="text-left">
                        <div className="text-3xl font-bold text-gray-800">
                          {item.price * item.quantity}
                          <span className="text-lg text-gray-600 mr-2">ريال</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.price} ريال × {item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl luxury-shadow p-6 sticky top-24 border border-luxury-gold/10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                ملخص الحجز
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>عدد الخدمات</span>
                  <span className="font-semibold">{cart.length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>إجمالي الساعات</span>
                  <span className="font-semibold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>المجموع الفرعي</span>
                    <span className="font-semibold">{total} ريال</span>
                  </div>
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>ضريبة القيمة المضافة (15%)</span>
                    <span className="font-semibold">{(total * 0.15).toFixed(2)} ريال</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-2xl font-bold">
                    <span className="text-gray-800">المجموع الكلي</span>
                    <span className="text-luxury-gold">
                      {(total * 1.15).toFixed(2)} ريال
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/login"
                className="block w-full bg-luxury-gold hover:bg-luxury-darkGold text-white text-center py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all mb-4"
              >
                إتمام الحجز
              </Link>

              <Link
                to="/"
                className="block w-full bg-white text-gray-700 text-center py-4 rounded-lg font-bold hover:bg-gray-50 transition-all border-2 border-gray-200"
              >
                مواصلة التسوق
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

