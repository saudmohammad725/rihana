# 🌐 دليل نشر ريحانة - Deployment Guide

## نشر Backend Server

### خيارات النشر:

#### 1. Heroku
```bash
# تثبيت Heroku CLI
npm install -g heroku

# تسجيل الدخول
heroku login

# إنشاء تطبيق جديد
cd server
heroku create rihana-api

# إضافة environment variables
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_SERVICE_KEY=your_key
heroku config:set JWT_SECRET=your_secret
# ... إضافة باقي المتغيرات

# نشر
git push heroku master
```

#### 2. Render.com (مجاني)
1. أنشئ حساب على https://render.com
2. اضغط "New +" → "Web Service"
3. اربط مع Git Repository
4. اختر `server` directory
5. أضف Environment Variables
6. اضغط Deploy

#### 3. Railway (مجاني)
1. أنشئ حساب على https://railway.app
2. اضغط "New Project"
3. اختر "Deploy from GitHub repo"
4. حدد المشروع والـ `server` directory
5. أضف Environment Variables
6. Deploy تلقائياً

---

## نشر Frontend

### Vercel (موصى به)

```bash
# تثبيت Vercel CLI
npm install -g vercel

# النشر
vercel

# Production deploy
vercel --prod
```

**تحديث API URL**:
في `src/services/api.js`:
```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'https://your-api-url.com/api';
```

### Netlify

```bash
# Build
npm run build

# Deploy on Netlify
# 1. اذهب إلى https://netlify.com
# 2. اسحب مجلد dist إلى Netlify
```

**Configuration**:
أنشئ `netlify.toml`:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Environment Variables للـ Production

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your_secure_random_secret_here
SUPABASE_URL=https://thrzjehqcuqrwmpwplgk.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
ADMIN_EMAIL=admin@rihana.com
ADMIN_PASSWORD=your_strong_password
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend (.env)
```env
VITE_API_URL=https://your-api-url.com/api
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## إعداد HTTPS

### Certbot (للسيرفر الخاص)

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Cloudflare (مجاني)
1. أضف موقعك إلى Cloudflare
2. حدث DNS records
3. فعّل SSL/TLS (Full)

---

## CORS Configuration للـ Production

في `server/index.js`:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend-url.com',
    'https://admin.your-frontend-url.com'
  ],
  credentials: true
}));
```

---

## Database Backup

### Supabase Backups (تلقائي)
- Supabase يعمل نسخ احتياطي تلقائي
- يمكنك تصدير البيانات من Dashboard

### Manual Backup
```bash
# في Supabase SQL Editor
SELECT * FROM users;
SELECT * FROM bookings;
SELECT * FROM visitors;
```

احفظ النتائج كـ CSV أو JSON

---

## Monitoring & Logs

### Backend Logs

**Heroku**:
```bash
heroku logs --tail -a rihana-api
```

**Render/Railway**:
- شاهد Logs من Dashboard

### Frontend Analytics

أضف Google Analytics:
```html
<!-- في index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## Performance Optimization

### 1. Enable Gzip Compression

في `server/index.js`:
```javascript
import compression from 'compression';
app.use(compression());
```

### 2. Cache Static Assets

```javascript
app.use(express.static('public', {
  maxAge: '1d'
}));
```

### 3. Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Security Checklist

- [ ] تغيير JWT_SECRET لقيمة عشوائية قوية
- [ ] تغيير ADMIN_PASSWORD
- [ ] تفعيل HTTPS
- [ ] إضافة Rate Limiting
- [ ] تحديث CORS origins
- [ ] إخفاء Error details في Production
- [ ] تفعيل Helmet.js للأمان
- [ ] مراجعة Supabase RLS Policies

---

## Post-Deployment Testing

### 1. اختبار API
```bash
curl https://your-api-url.com/api/health
```

### 2. اختبار Frontend
- افتح الموقع
- سجل حساب جديد
- جرب الحجز

### 3. اختبار Admin Panel
- افتح /admin.html
- سجل دخول
- تحقق من الإحصائيات

---

## 🎉 تهانينا!

موقعك الآن على الإنترنت! 🚀

**تذكر**:
- راجع Logs بانتظام
- عمل Backup للبيانات
- تحديث Dependencies بانتظام
- مراقبة الأداء والأمان

