# 🌟 ريحانة - منصة حجز الخدمات المنزلية

## 📖 نظرة عامة

**ريحانة** هي منصة شاملة لحجز الخدمات المنزلية في السعودية، تشمل:
- 👷‍♀️ العاملات المنزلية
- 🚗 السواقين الخاصين
- 🎉 الرحلات الترفيهية
- 👶 حاضنات الأطفال

---

## ✨ المميزات الرئيسية

### للمستخدمين:
- ✅ تسجيل دخول آمن عبر Firebase
- ✅ حجز الخدمات بسهولة
- ✅ إدارة الملف الشخصي
- ✅ تصميم جميل وسلس
- ✅ خط عربي فاخر (Amiri)
- ✅ responsive design للجوال

### للمدير (Admin):
- 📊 لوحة تحكم متكاملة
- 👥 إدارة المستخدمين
- 📅 إدارة الحجوزات
- 📈 إحصائيات مفصلة
- 👁️ تتبع الزوار
- 💰 تقارير الإيرادات

---

## 🏗️ البنية التقنية

### Frontend:
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Authentication**: Firebase Auth
- **Charts**: Recharts

### Backend:
- **Server**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + Firebase Admin
- **Security**: CORS, bcrypt, Row Level Security

### Infrastructure:
- **Frontend Hosting**: Vercel/Netlify
- **Backend Hosting**: Heroku/Render/Railway
- **Database**: Supabase Cloud
- **CDN**: Cloudflare (optional)

---

## 🚀 التثبيت السريع

### المتطلبات:
- Node.js 18+
- npm أو yarn
- حساب Supabase
- حساب Firebase

### الخطوات:

#### 1. Clone المشروع
```bash
git clone https://github.com/yourusername/rihana.git
cd rihana
```

#### 2. تثبيت Dependencies
```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

#### 3. إعداد Environment Variables

**Frontend (.env)**:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Backend (server/.env)**:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret
SUPABASE_URL=your_url
SUPABASE_SERVICE_KEY=your_key
ADMIN_EMAIL=admin@rihana.com
ADMIN_PASSWORD=Admin@123456
FRONTEND_URL=http://localhost:5173
```

#### 4. إعداد Database
1. افتح Supabase SQL Editor
2. نفذ `server/database/schema.sql`

#### 5. التشغيل
```bash
# Terminal 1: Backend
cd server
npm start

# Terminal 2: Frontend
npm run dev
```

---

## 📂 هيكل المشروع

```
rihana/
├── src/
│   ├── admin/              # Admin Panel
│   │   ├── components/
│   │   ├── pages/
│   │   ├── AdminApp.jsx
│   │   └── main.jsx
│   ├── components/         # React Components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── BottomNav.jsx
│   ├── pages/              # Pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── Workers.jsx
│   │   ├── Drivers.jsx
│   │   ├── Trips.jsx
│   │   └── Babysitters.jsx
│   ├── services/           # API Services
│   │   └── api.js
│   ├── config/             # Configuration
│   │   ├── firebase.js
│   │   └── supabase.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/                 # Backend API
│   ├── config/
│   │   └── supabase.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── users.js
│   │   ├── bookings.js
│   │   └── analytics.js
│   ├── database/
│   │   └── schema.sql
│   ├── package.json
│   └── index.js
├── fonts/                  # Arabic Fonts (Amiri)
├── index.html
├── admin.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 📚 التوثيق

| الملف | الوصف |
|-------|--------|
| `QUICK_START.md` | دليل البدء السريع (5 دقائق) |
| `SERVER_README.md` | توثيق Backend & API بالتفصيل |
| `SUPABASE_SETUP.md` | إعداد قاعدة البيانات |
| `DEPLOYMENT.md` | دليل النشر على الإنترنت |
| `تعليمات_الاستخدام.md` | تعليمات للمستخدمين (عربي) |

---

## 🎯 الوصول للنظام

### Development:
| الخدمة | URL |
|--------|-----|
| الموقع الرئيسي | http://localhost:5173 |
| Admin Panel | http://localhost:5173/admin.html |
| Backend API | http://localhost:5000 |
| API Health | http://localhost:5000/api/health |

### بيانات Admin الافتراضية:
- **Email**: admin@rihana.com
- **Password**: Admin@123456

---

## 🔐 الأمان

### مستوى Backend:
- ✅ Service Role Key محفوظ في السيرفر فقط
- ✅ JWT Authentication لجميع Endpoints الحساسة
- ✅ bcrypt لتشفير كلمات السر
- ✅ CORS محدود للـ Frontend فقط
- ✅ Rate Limiting (يمكن إضافته)

### مستوى Database:
- ✅ Row Level Security مفعل
- ✅ Policies محددة لكل جدول
- ✅ Foreign Keys و Constraints

### مستوى Frontend:
- ✅ Firebase Auth للمصادقة
- ✅ لا يوجد Service Keys في Frontend
- ✅ جميع الطلبات الحساسة عبر API

---

## 📊 Database Schema

### Tables:
1. **users**: بيانات المستخدمين
2. **bookings**: الحجوزات
3. **visitors**: تتبع الزوار

### Relationships:
- `bookings.user_id` → `users.id`

---

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `GET /api/auth/profile/:userId` - جلب ملف المستخدم
- `PUT /api/auth/profile/:userId` - تحديث الملف

### Admin
- `POST /api/admin/login` - تسجيل دخول المدير
- `GET /api/admin/verify` - التحقق من Token
- `POST /api/admin/logout` - تسجيل خروج

### Users (Admin)
- `GET /api/users` - جلب جميع المستخدمين
- `GET /api/users/:userId` - جلب مستخدم محدد
- `DELETE /api/users/:userId` - حذف مستخدم

### Bookings
- `POST /api/bookings` - إنشاء حجز
- `GET /api/bookings/user/:userId` - حجوزات المستخدم
- `GET /api/bookings` - جميع الحجوزات (Admin)
- `PATCH /api/bookings/:id/status` - تحديث الحالة
- `DELETE /api/bookings/:id` - حذف حجز

### Analytics (Admin)
- `GET /api/analytics/dashboard` - إحصائيات Dashboard
- `POST /api/analytics/visitor` - تتبع زائر
- `GET /api/analytics/visitors` - إحصائيات الزوار

---

## 🎨 التصميم

- **الألوان الرئيسية**: ذهبي فاخر (#C9A961)
- **الخط**: Amiri (عربي فاخر)
- **Responsive**: كامل لجميع الشاشات
- **Bottom Navigation**: للجوالات
- **Animations**: سلسة وجميلة

---

## 🔄 Workflow

### للمستخدم:
1. التسجيل/تسجيل الدخول
2. تصفح الخدمات
3. إنشاء حجز
4. تتبع الحجوزات
5. تعديل الملف الشخصي

### للمدير:
1. تسجيل دخول Admin Panel
2. مراجعة Dashboard والإحصائيات
3. إدارة المستخدمين
4. إدارة الحجوزات (تأكيد/إلغاء/إكمال)
5. مراجعة تقارير الزوار

---

## 🐛 Troubleshooting

### المشاكل الشائعة:

**1. Backend لا يعمل**
```bash
cd server
rm -rf node_modules package-lock.json
npm install
npm start
```

**2. CORS Error**
- تأكد من `FRONTEND_URL` في `server/.env`
- تأكد من تشغيل Frontend على Port 5173

**3. Database Connection Failed**
- تحقق من Supabase keys
- تأكد من تنفيذ SQL schema

**4. Admin Panel لا يعمل**
- تأكد من فتح `/admin.html` وليس `/admin`
- تحقق من تشغيل Backend Server

---

## 📈 الإحصائيات المتاحة

في Admin Panel:
- إجمالي المستخدمين
- إجمالي الحجوزات
- حجوزات معلقة/مكتملة
- إجمالي الإيرادات
- مستخدمين جدد هذا الشهر
- رسم بياني لتطور الحجوزات
- توزيع الخدمات (Pie Chart)
- عدد الزوار والصفحات الأكثر زيارة

---

## 🚀 التطويرات المستقبلية

- [ ] نظام الإشعارات (Push Notifications)
- [ ] دفع إلكتروني (Stripe/Moyasar)
- [ ] تقييم الخدمات والمقدمين
- [ ] Chat System بين المستخدم والمدير
- [ ] Mobile App (React Native)
- [ ] Multi-language Support
- [ ] Advanced Analytics & Reports
- [ ] Email Notifications

---

## 👨‍💻 المطور

تم تطوير هذا المشروع بواسطة: **AI Assistant + المستخدم**

---

## 📄 الترخيص

هذا المشروع خاص ومملوك بالكامل للعميل.

---

## 🎉 شكراً لاستخدامك ريحانة!

إذا واجهت أي مشاكل أو لديك اقتراحات، لا تتردد في التواصل.

**Happy Coding! 🚀**

