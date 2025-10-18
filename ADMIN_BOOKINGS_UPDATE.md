# 📋 تحديث نظام الحجوزات - Admin Panel

## ✨ الميزات الجديدة

### 1. رقم الفاتورة التلقائي 🧾
- **صيغة**: `INV-YYYYMMDD-XXXXXX`
- **مثال**: `INV-20241018-000001`
- يتم إنشاؤه تلقائياً لكل حجز جديد
- رقم فريد لا يتكرر

### 2. الرقم المشفر (الكود السري) 🔐
- **صيغة**: `RHN-XXXXXXXXXXXX`
- **مثال**: `RHN-A3F2E9B7C1D4`
- كود مشفر بـ MD5
- يتم إنشاؤه تلقائياً لكل حجز
- يمكن استخدامه للتحقق من الحجز

### 3. معلومات العميل الكاملة 👤
في لوحة التحكم، يظهر لكل حجز:
- ✅ اسم العميل
- ✅ البريد الإلكتروني
- ✅ رقم الجوال
- ✅ تفاصيل الحجز كاملة

### 4. أزرار قبول/رفض الطلبات ✅❌
- **زر قبول**: يحول الحالة إلى "مقبول" (confirmed)
- **زر رفض**: يحول الحالة إلى "مرفوض" (rejected)
- تأكيد قبل تنفيذ أي إجراء

### 5. تبويبات منظمة 📑
- **جميع الطلبات**: عرض كل الحجوزات
- **طلبات معلقة**: الحجوزات بانتظار القبول/الرفض
- **طلبات مقبولة**: الحجوزات المقبولة فقط

### 6. تصميم جديد كامل 🎨
- كروت كبيرة مع جميع التفاصيل
- ألوان مميزة لكل حالة
- عرض رقم الفاتورة والكود بشكل واضح
- responsive للجوال

---

## 🔧 خطوات التطبيق

### 1. تحديث Database (مهم!)

افتح Supabase SQL Editor ونفذ الـ Migration:

```sql
-- نسخ محتوى ملف: server/database/migration_add_invoice.sql
```

أو نفذ هذا الـ SQL:

```sql
-- 1. إضافة الأعمدة الجديدة
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS invoice_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS encrypted_code TEXT;

-- 2. تحديث status enum
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rejected'));

-- 3. Create sequence
CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1;

-- 4. Functions
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  invoice_num TEXT;
BEGIN
  SELECT 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('invoice_seq')::TEXT, 6, '0') INTO invoice_num;
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_encrypted_code()
RETURNS TEXT AS $$
BEGIN
  RETURN 'RHN-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 12));
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger
CREATE OR REPLACE FUNCTION set_booking_codes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := generate_invoice_number();
  END IF;
  IF NEW.encrypted_code IS NULL THEN
    NEW.encrypted_code := generate_encrypted_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bookings_set_codes_trigger ON bookings;
CREATE TRIGGER bookings_set_codes_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_codes();

-- 6. تحديث الحجوزات الموجودة
UPDATE bookings 
SET 
  invoice_number = 'INV-' || TO_CHAR(created_at, 'YYYYMMDD') || '-' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 6, '0'),
  encrypted_code = 'RHN-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || created_at::TEXT) FROM 1 FOR 12))
WHERE invoice_number IS NULL;
```

### 2. إعادة تشغيل Backend

```bash
cd server
npm start
```

### 3. إعادة تشغيل Frontend

```bash
npm run dev
```

---

## 📊 كيفية الاستخدام

### للمدير:

#### 1. عرض الطلبات
1. افتح Admin Panel: http://localhost:5173/admin.html
2. اذهب إلى "الحجوزات"
3. شاهد جميع الطلبات مع التفاصيل الكاملة

#### 2. قبول طلب
1. اضغط على **"قبول الطلب"** (زر أخضر)
2. تأكيد القبول
3. الطلب ينتقل إلى "طلبات مقبولة"

#### 3. رفض طلب
1. اضغط على **"رفض الطلب"** (زر أحمر)
2. تأكيد الرفض
3. الطلب يصبح حالته "مرفوض"

#### 4. التصفية
- استخدم التبويبات للتنقل بين الطلبات
- استخدم فلتر الخدمات لعرض خدمة محددة

---

## 🎯 API Endpoints الجديدة

### قبول حجز
```http
POST /api/bookings/:bookingId/accept
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "message": "تم قبول الحجز بنجاح",
  "booking": {
    "id": "...",
    "status": "confirmed",
    "invoice_number": "INV-20241018-000001",
    "encrypted_code": "RHN-A3F2E9B7C1D4",
    "users": {
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "phone": "0512345678"
    }
  }
}
```

### رفض حجز
```http
POST /api/bookings/:bookingId/reject
Authorization: Bearer {admin_token}
```

---

## 🎨 الشكل الجديد

### Card التفاصيل تعرض:

**Header:**
- حالة الحجز (ملون حسب الحالة)
- تاريخ الإنشاء
- رقم الفاتورة (ذهبي)
- الكود السري (أزرق)

**معلومات العميل:**
- الاسم
- البريد الإلكتروني
- رقم الجوال

**تفاصيل الحجز:**
- اسم الخدمة
- التاريخ والوقت
- السعر
- الملاحظات (إن وجدت)

**الأزرار:**
- قبول (أخضر) - للطلبات المعلقة
- رفض (أحمر) - للطلبات المعلقة
- حذف (رمادي)

---

## 📝 ملاحظات مهمة

### 1. رقم الفاتورة:
- يتم إنشاؤه تلقائياً
- صيغته: `INV-{تاريخ}-{رقم متسلسل}`
- فريد ولا يتكرر
- يُحفظ في قاعدة البيانات

### 2. الكود المشفر:
- يتم إنشاؤه تلقائياً
- مشفر بـ MD5
- طوله 12 حرف (بعد RHN-)
- يمكن استخدامه للتحقق من الحجز

### 3. الحالات المتاحة:
- **pending**: معلق (بانتظار القرار)
- **confirmed**: مقبول ✅
- **rejected**: مرفوض ❌
- **completed**: مكتمل
- **cancelled**: ملغي

### 4. التصفية:
- التبويبات تعمل على الجهة الأمامية (frontend)
- فلتر الخدمات يعمل على الجهة الخلفية (backend)

---

## 🐛 حل المشاكل

### المشكلة: "رقم الفاتورة لا يظهر"
**الحل**: 
1. تأكد من تنفيذ SQL Migration
2. أعد تشغيل Backend Server
3. أنشئ حجز جديد للاختبار

### المشكلة: "أزرار قبول/رفض لا تعمل"
**الحل**:
1. تأكد من تشغيل Backend Server
2. افتح Console المتصفح للأخطاء
3. تأكد من صلاحيات Admin

### المشكلة: "معلومات المستخدم لا تظهر"
**الحل**:
1. تحقق من وجود جدول users
2. تأكد من العلاقة بين bookings و users

---

## ✅ Checklist

قبل البدء:
- [ ] تنفيذ SQL Migration في Supabase
- [ ] إعادة تشغيل Backend Server
- [ ] إعادة تشغيل Frontend
- [ ] اختبار إنشاء حجز جديد
- [ ] التحقق من ظهور رقم الفاتورة والكود
- [ ] اختبار أزرار قبول/رفض

---

## 🎉 تم بحمد الله!

النظام الآن يعرض:
- ✅ رقم فاتورة لكل حجز
- ✅ كود سري مشفر
- ✅ معلومات العميل كاملة
- ✅ أزرار قبول/رفض
- ✅ تبويبات منظمة
- ✅ تصميم احترافي

**استمتع بالاستخدام! 🚀**

