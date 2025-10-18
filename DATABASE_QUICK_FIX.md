# 🔧 حل سريع لمشكلة قاعدة البيانات

## المشكلة:
```
ERROR: 42P20: window functions are not allowed in UPDATE
```

## ✅ الحل السريع:

### افتح Supabase SQL Editor وقم بتنفيذ هذا:

```sql
-- 1. إنشاء جدول users (إذا لم يكن موجوداً)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. إضافة الأعمدة الجديدة لجدول bookings
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS invoice_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS encrypted_code TEXT;

-- 3. تحديث status constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rejected'));

-- 4. إنشاء sequence
CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1;

-- 5. Functions
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

-- 6. Trigger للحجوزات الجديدة
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

-- 7. تحديث الحجوزات الموجودة (الطريقة الصحيحة)
WITH numbered_bookings AS (
  SELECT 
    id,
    created_at,
    'INV-' || TO_CHAR(created_at, 'YYYYMMDD') || '-' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 6, '0') AS new_invoice_number,
    'RHN-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || created_at::TEXT) FROM 1 FOR 12)) AS new_encrypted_code
  FROM bookings
  WHERE invoice_number IS NULL
)
UPDATE bookings
SET 
  invoice_number = numbered_bookings.new_invoice_number,
  encrypted_code = numbered_bookings.new_encrypted_code
FROM numbered_bookings
WHERE bookings.id = numbered_bookings.id;

-- 8. إضافة index
CREATE INDEX IF NOT EXISTS bookings_invoice_number_idx ON bookings(invoice_number);

-- 9. Enable RLS للـ users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 10. Policies للـ users
DROP POLICY IF EXISTS "Enable read access for users" ON users;
CREATE POLICY "Enable read access for users" ON users
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Enable insert for users" ON users;
CREATE POLICY "Enable insert for users" ON users
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for users" ON users;
CREATE POLICY "Enable update for users" ON users
  FOR UPDATE
  USING (true);

-- 11. Trigger للـ users updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

---

## ✅ تم!

بعد تنفيذ الـ SQL أعلاه:
1. ✅ جدول users موجود
2. ✅ bookings له invoice_number و encrypted_code
3. ✅ الحجوزات الجديدة ستحصل على أرقام تلقائياً
4. ✅ الحجوزات القديمة (إن وجدت) تم تحديثها

---

## 🚀 الخطوة التالية:

أعد تشغيل Backend:
```bash
cd server
npm start
```

ثم افتح Admin Panel:
```
http://localhost:5173/admin.html
```

**تم! 🎉**

