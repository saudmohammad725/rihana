# 🚀 دليل البدء السريع - ريحانة

## خطوات التشغيل السريعة

### 1️⃣ إعداد قاعدة البيانات (5 دقائق)

1. افتح Supabase SQL Editor: https://app.supabase.com
2. انسخ والصق محتوى ملف `server/database/schema.sql`
3. اضغط Run

✅ تم إنشاء جداول: `bookings`, `visitors`

### 2️⃣ إعداد Backend Server (دقيقة واحدة)

```bash
cd server
npm install
npm start
```

✅ السيرفر يعمل على: http://localhost:5000

### 3️⃣ تشغيل Frontend (دقيقة واحدة)

```bash
npm run dev
```

✅ الموقع يعمل على: http://localhost:5173

---

## 🎯 الوصول السريع

### الموقع الرئيسي
**URL**: http://localhost:5173

### لوحة التحكم (Admin Panel)
**URL**: http://localhost:5173/admin.html

**بيانات الدخول الافتراضية**:
- Email: `admin@rihana.com`
- Password: `Admin@123456`

### API Server
**URL**: http://localhost:5000/api/health

---

## ⚡ اختبار سريع

### 1. اختبار API
```bash
curl http://localhost:5000/api/health
```
يجب أن يرجع: `{"status":"OK"}`

### 2. اختبار تسجيل مستخدم جديد
1. افتح الموقع: http://localhost:5173
2. اضغط "إنشاء حساب"
3. سجل بيانات جديدة
4. تحقق من وجود المستخدم في Admin Panel

### 3. اختبار Admin Panel
1. افتح: http://localhost:5173/admin.html
2. سجل دخول بالبيانات الافتراضية
3. شاهد Dashboard والإحصائيات

---

## 🔧 إذا واجهت مشكلة

### Backend لا يعمل؟
```bash
cd server
cat .env  # تأكد من وجود الملف والمفاتيح
npm install
npm start
```

### Frontend لا يظهر بشكل صحيح؟
```bash
npm install
npm run dev
```

### لا تظهر بيانات في Admin Panel؟
- تأكد من تشغيل Backend Server
- تأكد من تنفيذ SQL schema في Supabase
- افتح Console المتصفح وابحث عن أخطاء

---

## 📚 المزيد من التفاصيل

- **Backend & API**: اقرأ `SERVER_README.md`
- **Supabase Setup**: اقرأ `SUPABASE_SETUP.md`
- **User Instructions**: اقرأ `تعليمات_الاستخدام.md`

---

## 🎉 كل شيء يعمل؟

ممتاز! النظام جاهز للاستخدام:
- ✅ الموقع الرئيسي
- ✅ لوحة التحكم
- ✅ API Server
- ✅ قاعدة البيانات
- ✅ نظام الإحصائيات

**استمتع بالاستخدام! 🚀**

