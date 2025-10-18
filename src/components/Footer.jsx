import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-20 relative z-10 hidden md:block">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gradient-gold">
              ريحانة
            </h3>
            <p className="text-gray-600">
              منصتك الموثوقة لحجز خدمات التأجير بالساعة. نوفر لك أفضل العاملات، السواقين، الرحلات، وحاضنات الأطفال.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/workers" className="text-gray-600 hover:text-gray-800 transition-colors">
                  العاملات
                </Link>
              </li>
              <li>
                <Link to="/drivers" className="text-gray-600 hover:text-gray-800 transition-colors">
                  السواقين
                </Link>
              </li>
              <li>
                <Link to="/trips" className="text-gray-600 hover:text-gray-800 transition-colors">
                  الرحلات الترفيهية
                </Link>
              </li>
              <li>
                <Link to="/babysitters" className="text-gray-600 hover:text-gray-800 transition-colors">
                  حاضنات الأطفال
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-luxury-gold" />
                <span className="text-gray-600">+966 50 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-luxury-gold" />
                <span className="text-gray-600">info@reehata.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-luxury-gold" />
                <span className="text-gray-600">الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">تابعنا</h4>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-white border border-gray-200 hover:bg-gray-100 hover:border-gray-300 rounded-full transition-colors group">
                <Facebook className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
              </a>
              <a href="#" className="p-3 bg-white border border-gray-200 hover:bg-gray-100 hover:border-gray-300 rounded-full transition-colors group">
                <Twitter className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
              </a>
              <a href="#" className="p-3 bg-white border border-gray-200 hover:bg-gray-100 hover:border-gray-300 rounded-full transition-colors group">
                <Instagram className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
          <p>© 2024 ريحانة. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

