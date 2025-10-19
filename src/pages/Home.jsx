import { Link, useNavigate } from 'react-router-dom'

import { Users, Car, Compass, Baby, Clock, Shield, Star, Sparkles } from 'lucide-react'

import { useEffect, useRef } from 'react'

import { analyticsAPI } from '../services/api'


// Import local images
import workersImage from '../images/sa.png'
import driversImage from '../images/saa.png'
import tripsImage from '../images/saaa.png'
import babysittersImage from '../images/saaaa.png'


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

      // Silently ignore analytics errors if server is not running

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

            <div className="text-center mb-20 observe">
              <div className="inline-block">

                <div className="inline-flex items-center gap-3 bg-luxury-gold/10 border border-luxury-gold/30 px-6 py-3 rounded-full mb-6">
                  <Sparkles className="w-6 h-6 text-luxury-gold" />
                  <span className="text-luxury-gold text-lg font-bold">خدماتنا المتميزة</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                  اكتشف عالماً من الخدمات الفاخرة
                </h2>

                <div className="h-1.5 w-40 bg-gradient-gold mx-auto rounded-full"></div>
              </div>

              <p className="text-xl md:text-2xl text-gray-700 mt-8 max-w-3xl mx-auto leading-relaxed">
                نقدم لك أفضل الخدمات بأعلى معايير الجودة والاحترافية
              </p>

            </div>



            {/* Services with Alternating Layout */}
            <div className="max-w-7xl mx-auto space-y-32">
              {/* Service 1 - Workers (Image Right, Text Left) */}
              <div className="observe group">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  {/* Text Content - Left */}
                  <div className="order-2 lg:order-1 text-center lg:text-right space-y-6">
                    <div className="inline-flex items-center gap-3 bg-luxury-navy/5 px-5 py-2.5 rounded-full">
                      <Users className="w-5 h-5 text-luxury-navy" />
                      <span className="text-luxury-navy text-sm font-bold">خدمة احترافية</span>
                    </div>
                    
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                      العاملات المنزليات
                    </h3>
                    
                    <p className="text-xl text-gray-600 leading-relaxed">
                      احجز عاملة منزلية محترفة ومدربة لتنظيف منزلك بأعلى معايير الجودة. خدمة مرنة بالساعة تناسب احتياجاتك.
                    </p>
                    
                    <ul className="space-y-4 text-right">
                      <li className="flex items-center gap-3 text-gray-700 text-lg">
                        <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>
                        <span>عاملات مدربات ومؤهلات</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700 text-lg">
                        <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>
                        <span>خدمة مرنة بالساعة</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700 text-lg">
                        <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>
                        <span>أسعار تنافسية وشفافة</span>
                      </li>
                    </ul>
                    
                    <Link
                      to="/workers"
                      className="inline-flex items-center gap-3 bg-luxury-navy hover:bg-luxury-navy/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                      <span>اكتشف المزيد</span>
                      <svg className="w-5 h-5 transform group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Image - Right */}
                  <div className="order-1 lg:order-2 relative">
                    <div className="relative">
                      {/* Main Image */}
                      <div className="relative">
                        <img 
                          src={workersImage} 
                          alt="خدمات العاملات المنزليات"
                          className="w-full h-[650px] object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service 2 - Drivers (Image Left, Text Right) */}
              <div className="observe group">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  {/* Image - Left */}
                  <div className="relative">
                    <div className="relative">
                      {/* Main Image */}
                      <div className="relative">
                        <img 
                          src={driversImage} 
                          alt="خدمات السائقين"
                          className="w-full h-[600px] object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Content - Right */}
                  <div className="text-center lg:text-right space-y-6">
                    <div className="inline-flex items-center gap-3 bg-luxury-gold/10 px-5 py-2.5 rounded-full">
                      <Car className="w-5 h-5 text-luxury-gold" />
                      <span className="text-luxury-gold text-sm font-bold">تنقل آمن</span>
                    </div>
                    
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                      السائقون المحترفون
                    </h3>
                    
                    <p className="text-xl text-gray-600 leading-relaxed">
                      سائقون ذوو خبرة وكفاءة عالية لتوصيلك إلى وجهتك بأمان وراحة. خدمة تأجير مرنة بالساعة مع سيارات حديثة ونظيفة.
                    </p>
                    
                    <ul className="space-y-4 text-right">
                      <li className="flex items-center gap-3 text-gray-700 text-lg">
                        <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>
                        <span>سائقون مرخصون وموثوقون</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700 text-lg">
                        <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>
                        <span>سيارات حديثة ونظيفة</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700 text-lg">
                        <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>
                        <span>خدمة 24/7 طوال الأسبوع</span>
                      </li>
                    </ul>
                    
                  <Link

                      to="/drivers"
                      className="inline-flex items-center gap-3 bg-luxury-gold hover:bg-luxury-darkGold text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                      <span>اكتشف المزيد</span>
                      <svg className="w-5 h-5 transform group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Service 3 - Trips (Image Right, Text Left) */}
              <div className="observe group">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  {/* Text Content - Left */}
                  <div className="order-2 lg:order-1 text-center lg:text-right space-y-6">
                    <div className="inline-flex items-center gap-3 bg-slate-700/10 px-5 py-2.5 rounded-full">
                      <Compass className="w-5 h-5 text-slate-700" />
                      <span className="text-slate-700 text-sm font-bold">مغامرات لا تُنسى</span>
                    </div>

                    
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                      الرحلات الترفيهية
                    </h3>

                    
                    <p className="text-xl text-gray-600 leading-relaxed">
                      استمتع برحلات ترفيهية مميزة وآمنة لجميع أفراد العائلة. من الرحلات الصحراوية إلى الجولات السياحية، نوفر لك تجربة لا تُنسى.
                    </p>
                    
                    <ul className="space-y-4 text-right">
                      <li className="flex items-center gap-3 text-gray-700 text-lg">
                        <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>
                        <span>برامج سياحية متنوعة</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700 text-lg">
                        <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>
                        <span>مرشدون سياحيون محترفون</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700 text-lg">
                        <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>
                        <span>أنشطة ترفيهية ممتعة</span>
                      </li>
                    </ul>
                    
                    <Link
                      to="/trips"
                      className="inline-flex items-center gap-3 bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                      <span>اكتشف المزيد</span>
                      <svg className="w-5 h-5 transform group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />

                      </svg>

                    </Link>
                  </div>

                  {/* Image - Right */}
                  <div className="order-1 lg:order-2 relative">
                    <div className="relative">
                      {/* Main Image */}
                      <div className="relative">
                        <img 
                          src={tripsImage} 
                          alt="الرحلات الترفيهية"
                          className="w-full h-[600px] object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service 4 - Babysitters (Image Left, Text Right) */}
              <div className="observe group">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  {/* Image - Left */}
                  <div className="relative">
                    <div className="relative">
                      {/* Main Image */}
                      <div className="relative">
                        <img 
                          src={babysittersImage} 
                          alt="حاضنات الأطفال"
                          className="w-full h-[600px] object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Content - Right */}
                  <div className="text-center lg:text-right space-y-6">
                    <div className="inline-flex items-center gap-3 bg-amber-700/10 px-5 py-2.5 rounded-full">
                      <Baby className="w-5 h-5 text-amber-700" />
                      <span className="text-amber-700 text-sm font-bold">رعاية متخصصة</span>
                    </div>

                    

                    <h3 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                      حاضنات الأطفال
                    </h3>
                    
                    <p className="text-xl text-gray-600 leading-relaxed">
                      حاضنات أطفال موثوقات ومدربات على أعلى مستوى لرعاية أطفالك بكل حب واهتمام. نضمن لك راحة البال وأنت تعلم أن أطفالك بأيدٍ أمينة.
                    </p>
                    
                    <ul className="space-y-4 text-right">
                      <li className="flex items-center gap-3 text-gray-700 text-lg">
                        <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>
                        <span>حاضنات مؤهلات ومدربات</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700 text-lg">
                        <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>
                        <span>خبرة في رعاية الأطفال</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700 text-lg">
                        <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>
                        <span>متابعة مستمرة وتقارير</span>
                      </li>
                    </ul>
                    
                    <Link
                      to="/babysitters"
                      className="inline-flex items-center gap-3 bg-amber-700 hover:bg-amber-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                      <span>اكتشف المزيد</span>
                      <svg className="w-5 h-5 transform group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                  </Link>

                  </div>
                </div>
              </div>
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
                    
                  <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-2xl bg-white luxury-shadow mb-6 transition-all duration-300 transform group-hover:scale-105 border border-luxury-gold/20 overflow-hidden">
                    {/* Icon */}

                    <div className="relative z-10">

                      <Icon className="w-16 h-16 text-luxury-gold transition-colors duration-300" />
                    </div>

                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-3 transition-colors duration-200">
                    {feature.title}

                  </h3>

                  <p className="text-gray-600 text-lg transition-colors duration-200">
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
