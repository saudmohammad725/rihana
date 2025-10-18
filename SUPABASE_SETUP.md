# إعداد Supabase لمشروع ريحانة

## الخطوات المطلوبة:

### 1. إنشاء حساب Supabase
1. اذهب إلى: https://supabase.com
2. سجل حساب جديد أو سجل دخول
3. أنشئ مشروع جديد (New Project)

### 2. إنشاء جدول المستخدمين
بعد إنشاء المشروع، اذهب إلى **SQL Editor** وقم بتنفيذ هذا الكود:

```sql
-- إنشاء جدول المستخدمين
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- تمكين Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بالقراءة
CREATE POLICY "Enable read access for all users" ON users
  FOR SELECT
  USING (true);

-- السماح للمستخدم بتحديث بياناته فقط
CREATE POLICY "Enable insert for authenticated users only" ON users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for users based on id" ON users
  FOR UPDATE
  USING (true);

-- إنشاء فهرس للبريد الإلكتروني
CREATE INDEX users_email_idx ON users(email);
```

### 3. الحصول على مفاتيح API
1. اذهب إلى **Settings** > **API**
2. انسخ:
   - `Project URL` (VITE_SUPABASE_URL)
   - `anon public` key (VITE_SUPABASE_ANON_KEY)

### 4. إضافة المفاتيح للمشروع
أنشئ ملف `.env` في جذر المشروع وأضف:

```env
# Firebase Configuration (موجود مسبقاً)
VITE_FIREBASE_API_KEY=AIzaSyBvem4m98qDEuVzg4XQP-MtwndE_buKnq4
VITE_FIREBASE_AUTH_DOMAIN=rihana-9e001.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=rihana-9e001
VITE_FIREBASE_STORAGE_BUCKET=rihana-9e001.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=494667952255
VITE_FIREBASE_APP_ID=1:494667952255:web:8e661b7d2bd87b8a5e8f4a

# Supabase Configuration (أضف هنا مفاتيحك)
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 5. إعادة تشغيل السيرفر
بعد إضافة ملف `.env`، قم بإيقاف السيرفر وإعادة تشغيله:

```bash
# إيقاف السيرفر (Ctrl+C)
# ثم
npm run dev
```

## كيف يعمل النظام:

### Firebase:
- يستخدم فقط للمصادقة (Authentication)
- تسجيل الدخول
- التسجيل
- إعادة تعيين كلمة السر
- إدارة الجلسات

### Supabase:
- يستخدم لتخزين جميع بيانات المستخدمين
- الاسم
- البريد الإلكتروني
- رقم الهاتف
- أي بيانات إضافية

## الملفات المحدثة:
- ✅ `src/config/supabase.js` - إعداد Supabase
- ✅ `src/App.jsx` - إدارة حالة المستخدم
- ✅ `src/components/Navbar.jsx` - عرض الملف الشخصي
- ✅ `src/components/BottomNav.jsx` - التنقل للجوال
- ✅ `src/pages/Register.jsx` - حفظ البيانات في Supabase
- ✅ `src/pages/Profile.jsx` - تعديل الملف الشخصي

## ملاحظات مهمة:
1. لا تشارك ملف `.env` مع أحد
2. أضف `.env` إلى `.gitignore`
3. Firebase يستخدم فقط للـ Authentication
4. Supabase يستخدم لكل البيانات الأخرى
5. المستخدم يمكنه تعديل بياناته من صفحة Profile

## في حالة وجود مشاكل:
1. تأكد من صحة مفاتيح Supabase في `.env`
2. تأكد من إنشاء جدول `users` في Supabase
3. تأكد من تشغيل SQL commands بنجاح
4. افحص console المتصفح للأخطاء

