import { Link, useNavigate } from 'react-router-dom'
import { Users, Car, Compass, Baby, Clock, Shield, Star, Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { analyticsAPI } from '../services/api'

function Home({ isLoggedIn, userProfile }) {
  const navigate = useNavigate()
  const observerRef = useRef(null)

  // Track visitor on page load
  useEffect(() => {
    trackVisitor()
  }, [])

  const trackVisitor = async () => {
    try {
      await analyticsAPI.trackVisitor({
        page: '/',
        userAgent: navigator.userAgent,
        ip: null // IP will be captured by server
      })
    } catch (error) {
      console.error('Track visitor error:', error)
    }
  }

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.observe').forEach((el) => {
      observerRef.current.observe(el)
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])
  const categories = [
    {
      id: 1,
      title: 'العاملات',
      description: 'احجز عاملة منزلية محترفة بالساعة',
      icon: Users,
      link: '/workers',
      color: 'from-luxury-navy to-luxury-navy/80'
    },
    {
      id: 2,
      title: 'السواقين',
      description: 'خدمة سائقين محترفين بالساعة',
      icon: Car,
      link: '/drivers',
      color: 'from-luxury-gold to-luxury-darkGold'
    },
    {
      id: 3,
      title: 'الرحلات الترفيهية',
      description: 'استمتع برحلات ترفيهية مميزة',
      icon: Compass,
      link: '/trips',
      color: 'from-slate-700 to-slate-600'
    },
    {
      id: 4,
      title: 'حاضنات الأطفال',
      description: 'حاضنات أطفال موثوقات ومدربات',
      icon: Baby,
      link: '/babysitters',
      color: 'from-amber-700 to-amber-600'
    }
  ]

  const features = [
    {
      icon: Clock,
      emoji: '⚡',
      title: 'حجز سريع',
      description: 'احجز خدمتك في دقائق معدودة'
    },
    {
      icon: Shield,
      emoji: '🛡️',
      title: 'موثوق وآمن',
      description: 'جميع مقدمي الخدمات موثقون ومؤمنون'
    },
    {
      icon: Star,
      emoji: '⭐',
      title: 'جودة عالية',
      description: 'نختار الأفضل لنقدم لك خدمة متميزة'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[700px] overflow-hidden py-20">
        {/* Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent"></div>
        
        {/* Floating Shapes */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-luxury-gold/5 rounded-full blur-2xl floating"></div>
        <div className="absolute bottom-40 left-20 w-32 h-32 bg-luxury-gold/5 rounded-full blur-3xl floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-luxury-gold/5 rounded-full blur-2xl floating" style={{ animationDelay: '4s' }}></div>
        
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Right Side - Text Content */}
            <div className="fade-in-up order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-luxury-gold/10 border border-luxury-gold/30 px-4 py-2 rounded-full mb-6 hero-badge">
                <Sparkles className="w-4 h-4 text-luxury-gold" />
                <span className="text-luxury-gold text-sm font-semibold">خدمات فاخرة بمعايير عالمية</span>
              </div>
              
            {isLoggedIn ? (
              <>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-800 animate-fade-in">
                  أهلاً بك مجدداً! 👋
                  <span className="block mt-2 text-gradient-gold hero-title-gradient">جاهز للحجز؟</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-700 leading-relaxed hero-description">
                  اختر من بين خدماتنا المميزة واحجز بكل سهولة
                  <br />
                  <span className="text-luxury-gold font-semibold">نحن هنا لخدمتك على مدار الساعة</span>
                </p>
              </>
            ) : (
              <>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-800 animate-fade-in">
                  مرحباً بك في
                  <span className="block mt-2 text-gradient-gold hero-title-gradient">منصة ريحانة</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-700 leading-relaxed hero-description">
                  تجربة استثنائية في حجز خدمات التأجير بالساعة
                  <br />
                  <span className="text-luxury-gold font-semibold">عاملات • سواقين • رحلات • حاضنات أطفال</span>
                </p>
              </>
            )}
              <div className="flex gap-4 flex-wrap hero-buttons">
                {isLoggedIn ? (
                  <Link
                    to="/workers"
                    className="inline-block bg-luxury-gold hover:bg-luxury-darkGold text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl button-pulse"
                  >
                    تصفح الخدمات
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="inline-block bg-luxury-gold hover:bg-luxury-darkGold text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl button-pulse"
                    >
                      ابدأ الحجز الآن
                    </Link>
                    <Link
                      to="/login"
                      className="inline-block bg-white border-2 border-gray-200 hover:border-luxury-gold hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
                    >
                      تسجيل الدخول
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Left Side - Images */}
            <div className="order-1 lg:order-2 relative hero-images">
              {/* Main Image Grid */}
              <div className="grid grid-cols-2 gap-5">
                {/* Top Left - Service Worker */}
                <div className="image-card image-card-1 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 h-60">
                  <img 
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=500&fit=crop" 
                    alt="خدمات العاملات"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/80 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm">خدمات العاملات</span>
                  </div>
                </div>

                {/* Top Right - Driver */}
                <div className="image-card image-card-2 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 h-60">
                  <img 
                    src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=500&fit=crop" 
                    alt="خدمات السائقين"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-gold/80 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm">خدمات السائقين</span>
                  </div>
                </div>

                {/* Bottom Left - Babysitter */}
                <div className="image-card image-card-3 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 h-60">
                  <img 
                    src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=500&fit=crop" 
                    alt="حاضنات الأطفال"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-700/80 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm">حاضنات الأطفال</span>
                  </div>
                </div>

                {/* Bottom Right - Trips */}
                <div className="image-card image-card-4 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 h-60">
                  <img 
                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=500&fit=crop" 
                    alt="الرحلات الترفيهية"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-700/80 to-transparent flex items-end p-4">
                    <span className="text-white font-bold text-sm">الرحلات الترفيهية</span>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-luxury-gold/20 rounded-full blur-3xl floating"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-luxury-gold/20 rounded-full blur-3xl floating" style={{ animationDelay: '3s' }}></div>
            </div>
          </div>
        </div>
        
        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent"></div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-20">
        {isLoggedIn ? (
          <>
            <div className="text-center mb-16 observe">
              <div className="inline-flex items-center gap-3 bg-luxury-gold/10 border border-luxury-gold/30 px-6 py-3 rounded-full mb-6">
                <Sparkles className="w-6 h-6 text-luxury-gold" />
                <span className="text-luxury-gold text-lg font-bold">مرحباً بك! اختر خدمتك المفضلة</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                ابدأ رحلتك الآن
              </h2>
              <div className="h-1 w-32 bg-gradient-gold mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {categories.map((category, index) => {
                const Icon = category.icon
                const categoryImages = [
                  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop', // عاملات
                  'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop', // سواقين
                  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop', // رحلات
                  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop'  // حاضنات
                ]
                return (
                  <Link
                    key={category.id}
                    to={category.link}
                    className="observe group relative overflow-hidden rounded-3xl p-8 text-right transition-all duration-300 category-card-logged flex flex-col justify-end h-80"
                    style={{ 
                      animationDelay: `${index * 0.15}s`
                    }}
                  >
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 rounded-3xl"
                      style={{ 
                        backgroundImage: `url('${categoryImages[index]}')`
                      }}
                    ></div>
                    
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 group-hover:via-black/50 transition-all duration-300 rounded-3xl"></div>
                    
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-luxury-gold/20 rounded-full blur-2xl transition-transform duration-500"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-luxury-gold/20 rounded-full blur-2xl transition-transform duration-500"></div>
                    
                    {/* Content at Bottom */}
                    <div className="relative z-10 flex items-end gap-6">
                      <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 border-2 border-white/20">
                        <Icon className="w-12 h-12 text-white transition-transform duration-300" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2 text-white">
                          {category.title}
                        </h3>
                        <p className="text-white/90 text-base mb-3 leading-relaxed">
                          {category.description}
                        </p>
                        <div className="inline-flex items-center gap-2 text-white font-bold bg-white/20 px-5 py-2 rounded-full group-hover:bg-white/30 transition-all duration-300 text-sm">
                          <span>احجز الآن</span>
                          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-white/0 group-hover:border-white/20 transition-all duration-300"></div>
                  </Link>
                )
              })}
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-16 observe">
              <div className="inline-block">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  الخدمات
                </h2>
                <div className="h-1 w-32 bg-gradient-gold mx-auto rounded-full"></div>
              </div>
              <p className="text-xl text-gray-700 mt-6">
                اختر الخدمة المناسبة لك من بين خدماتنا المميزة
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category, index) => {
                const Icon = category.icon
                return (
                  <Link
                    key={category.id}
                    to={category.link}
                    className="observe group relative overflow-hidden rounded-2xl luxury-card p-8 text-center category-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-luxury-gold/10 group-hover:bg-luxury-gold/15 mb-6 transition-all group-hover:rotate-12 duration-500">
                      <Icon className="w-10 h-10 text-gray-700 group-hover:text-gray-900 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-gray-900 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                      {category.description}
                    </p>
                    
                    <div className="mt-6 inline-flex items-center text-luxury-gold group-hover:text-gray-800 transition-colors">
                      <span className="text-sm font-semibold">اكتشف المزيد</span>
                      <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 shine-effect"></div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
        <div className="text-center mb-16 observe">
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              لماذا ريحانة؟
            </h2>
            <div className="h-1 w-32 bg-gradient-gold mx-auto rounded-full"></div>
          </div>
          <p className="text-xl text-gray-700 mt-6">
              نقدم لك أفضل تجربة في حجز الخدمات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="observe text-center group feature-card" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-2xl bg-white luxury-shadow mb-6 group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-hover:-rotate-6 border border-luxury-gold/20 overflow-hidden">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Icon */}
                    <div className="relative z-10">
                      <Icon className="w-16 h-16 text-luxury-gold group-hover:text-white transition-colors duration-500 group-hover:scale-110" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-luxury-gold transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-lg group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="observe relative overflow-hidden rounded-3xl bg-white border-2 border-luxury-gold/20 p-12 md:p-16 text-center shadow-xl hover:shadow-2xl transition-shadow duration-500 cta-section">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl floating"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-luxury-gold/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl floating" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative z-10">
            {isLoggedIn ? (
              <>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
                  استمتع بخدماتنا!
                </h2>
                <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                  اختر الخدمة التي تناسبك واحجز الآن بكل سهولة
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/workers"
                    className="bg-luxury-gold hover:bg-luxury-darkGold text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl button-pulse"
                  >
                    تصفح الخدمات
                  </Link>
                  <Link
                    to="/cart"
                    className="bg-white border-2 border-gray-200 hover:border-luxury-gold hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
                  >
                    سلة الحجوزات
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
                  جاهز للبدء؟
                </h2>
                <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                  انضم إلى آلاف العملاء الراضين واستمتع بتجربة حجز سلسة وموثوقة
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/register"
                    className="bg-luxury-gold hover:bg-luxury-darkGold text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl button-pulse"
                  >
                    إنشاء حساب جديد
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white border-2 border-gray-200 hover:border-luxury-gold hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
                  >
                    تسجيل الدخول
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
