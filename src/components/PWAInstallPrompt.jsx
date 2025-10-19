import { useState, useEffect } from 'react'
import { X, Download, Smartphone, XCircle } from 'lucide-react'

function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // التحقق إذا كان المستخدم اختار "عدم الظهور مرة أخرى"
    const dismissedForever = localStorage.getItem('pwa-never-show')
    if (dismissedForever === 'true') {
      return
    }

    // الاستماع لحدث beforeinstallprompt
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // التحقق إذا كان التطبيق مثبت مسبقاً
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false)
    } else {
      // إظهار البانر بعد ثانيتين
      setTimeout(() => {
        setShowPrompt(true)
      }, 2000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    // التحقق من نوع الجهاز
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    const isAndroid = /Android/.test(navigator.userAgent)

    if (!deferredPrompt) {
      // للأجهزة التي لا تدعم beforeinstallprompt (iOS Safari)
      if (isIOS) {
        // عرض تعليمات مفصّلة لـ iOS
        const iosInstructions = document.createElement('div')
        iosInstructions.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          z-index: 10000;
          max-width: 90%;
          text-align: center;
          direction: rtl;
        `
        iosInstructions.innerHTML = `
          <div style="font-size: 48px; margin-bottom: 20px;">📱</div>
          <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #333;">
            تثبيت تطبيق ريحانة
          </h3>
          <div style="text-align: right; margin: 20px 0; color: #666; line-height: 1.8;">
            <div style="margin: 10px 0; display: flex; align-items: center; gap: 10px;">
              <span style="background: #C9A961; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">1</span>
              <span>اضغط على زر <strong>المشاركة</strong> 📤 في الأسفل</span>
            </div>
            <div style="margin: 10px 0; display: flex; align-items: center; gap: 10px;">
              <span style="background: #C9A961; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">2</span>
              <span>اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong> ➕</span>
            </div>
            <div style="margin: 10px 0; display: flex; align-items: center; gap: 10px;">
              <span style="background: #C9A961; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">3</span>
              <span>اضغط على <strong>"إضافة"</strong> ✅</span>
            </div>
          </div>
          <button onclick="this.parentElement.remove()" style="
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #C9A961 0%, #B8984F 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
          ">
            فهمت!
          </button>
        `
        document.body.appendChild(iosInstructions)
        setShowPrompt(false)
      } else {
        // لباقي الأجهزة
        alert('لتثبيت التطبيق:\n\n1. افتح قائمة المتصفح (⋮)\n2. اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"\n3. اتبع التعليمات')
        setShowPrompt(false)
      }
      return
    }

    try {
      // إظهار نافذة التثبيت التلقائية (Chrome/Android/Edge)
      await deferredPrompt.prompt()
      
      // انتظار اختيار المستخدم
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('✅ تم تثبيت التطبيق بنجاح!')
        
        // عرض رسالة نجاح
        const successMsg = document.createElement('div')
        successMsg.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          z-index: 10000;
          text-align: center;
          animation: scaleIn 0.3s ease;
        `
        successMsg.innerHTML = `
          <div style="font-size: 64px; margin-bottom: 15px;">🎉</div>
          <h3 style="font-size: 22px; font-weight: bold; margin-bottom: 10px; color: #333;">
            تم التثبيت بنجاح!
          </h3>
          <p style="color: #666; margin-bottom: 20px;">
            يمكنك الآن فتح التطبيق من الشاشة الرئيسية
          </p>
        `
        document.body.appendChild(successMsg)
        
        setTimeout(() => {
          successMsg.remove()
        }, 3000)
        
        localStorage.setItem('pwa-never-show', 'true')
      } else {
        console.log('❌ المستخدم ألغى التثبيت')
      }
      
      setDeferredPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error('خطأ في التثبيت:', error)
      setShowPrompt(false)
    }
  }

  const handleClose = () => {
    // إغلاق مؤقت - ستظهر الشاشة مرة أخرى عند إعادة تحميل الصفحة
    setShowPrompt(false)
  }

  const handleDismissForever = () => {
    // عدم الظهور مرة أخرى
    localStorage.setItem('pwa-never-show', 'true')
    setShowPrompt(false)
  }

  if (!showPrompt) {
    return null
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in flex items-center justify-center p-4"
      >
        {/* Popup */}
        <div className="w-full max-w-lg animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-luxury-gold/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-luxury-gold to-luxury-darkGold p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <img 
                  src="/iconapp/ios_60.png" 
                  alt="ريحانة" 
                  className="w-10 h-10 rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">تطبيق ريحانة</h3>
                <p className="text-white/90 text-sm">خدمات التأجير بالساعة</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-luxury-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-luxury-gold" />
              </div>
              <div>
                <h4 className="text-gray-800 font-bold text-lg mb-2">
                  تجربة أفضل وأسلس! 🚀
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  نزّل التطبيق الآن واستمتع بتجربة أسرع، حجز أسهل، وإشعارات فورية لجميع خدماتك!
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full"></div>
                <span>وصول سريع من الشاشة الرئيسية</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full"></div>
                <span>يعمل بدون اتصال بالإنترنت</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full"></div>
                <span>إشعارات فورية لحجوزاتك</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleInstall}
                className="w-full px-4 py-3 bg-gradient-to-r from-luxury-gold to-luxury-darkGold hover:from-luxury-darkGold hover:to-luxury-gold text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                تنزيل الآن
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-all"
                >
                  ليس الآن
                </button>
                <button
                  onClick={handleDismissForever}
                  className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1"
                  title="عدم الظهور مرة أخرى"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-up {
          animation: scale-up 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  )
}

export default PWAInstallPrompt

