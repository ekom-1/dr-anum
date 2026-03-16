-- Supabase Database Setup for Dr. Anum Website
-- Run this script in Supabase SQL Editor to create all required tables

-- ============================================
-- Table 1: Bookings (Appointments)
-- ============================================

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public inserts" ON bookings;
DROP POLICY IF EXISTS "Allow authenticated reads" ON bookings;
DROP POLICY IF EXISTS "Allow authenticated updates" ON bookings;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON bookings;
DROP POLICY IF EXISTS "Allow anon reads" ON bookings;

-- Allow public inserts (for booking form on website)
CREATE POLICY "Allow public inserts" ON bookings
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anon to read their own bookings
CREATE POLICY "Allow anon reads" ON bookings
  FOR SELECT TO anon
  USING (true);

-- Allow authenticated reads (for admin dashboard)
CREATE POLICY "Allow authenticated reads" ON bookings
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated updates (for admin to change status)
CREATE POLICY "Allow authenticated updates" ON bookings
  FOR UPDATE TO authenticated
  USING (true);

-- Allow authenticated deletes (for admin to delete bookings)
CREATE POLICY "Allow authenticated deletes" ON bookings
  FOR DELETE TO authenticated
  USING (true);

-- ============================================
-- Table 2: Contact Submissions
-- ============================================

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public inserts" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated reads" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated updates" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON contact_submissions;
DROP POLICY IF EXISTS "Allow anon reads" ON contact_submissions;

-- Allow public inserts (for contact form on website)
CREATE POLICY "Allow public inserts" ON contact_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anon to read (optional - remove if you don't want public to see submissions)
CREATE POLICY "Allow anon reads" ON contact_submissions
  FOR SELECT TO anon
  USING (true);

-- Allow authenticated reads (for admin dashboard)
CREATE POLICY "Allow authenticated reads" ON contact_submissions
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated updates (for admin to mark as read)
CREATE POLICY "Allow authenticated updates" ON contact_submissions
  FOR UPDATE TO authenticated
  USING (true);

-- Allow authenticated deletes (for admin to delete submissions)
CREATE POLICY "Allow authenticated deletes" ON contact_submissions
  FOR DELETE TO authenticated
  USING (true);

-- ============================================
-- Table 3: Services (Optional - for dynamic services)
-- ============================================

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price TEXT,
  duration TEXT,
  image_url TEXT,
  visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public reads" ON services;
DROP POLICY IF EXISTS "Allow authenticated all" ON services;

-- Allow public to read visible services
CREATE POLICY "Allow public reads" ON services
  FOR SELECT TO anon
  USING (visible = true);

-- Allow authenticated users all operations
CREATE POLICY "Allow authenticated all" ON services
  FOR ALL TO authenticated
  USING (true);

-- ============================================
-- Insert Sample Data (Optional)
-- ============================================

-- Sample Services
INSERT INTO services (name, slug, description, price, duration, visible, sort_order)
SELECT 'Acne Treatment', 'acne-treatment', 'Comprehensive acne treatment using advanced medical techniques and personalized care plans.', '$150 - $300', '45 minutes', true, 1
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'acne-treatment')
UNION ALL
SELECT 'Anti-Aging Treatments', 'anti-aging', 'Advanced anti-aging solutions including Botox, fillers, and skin rejuvenation treatments.', '$200 - $500', '60 minutes', true, 2
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'anti-aging')
UNION ALL
SELECT 'Chemical Peels', 'chemical-peels', 'Professional chemical peels to improve skin texture, tone, and overall appearance.', '$180 - $350', '30 minutes', true, 3
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'chemical-peels')
UNION ALL
SELECT 'Laser Hair Removal', 'laser-hair-removal', 'Safe and effective laser hair removal for all skin types with long-lasting results.', '$100 - $400', '30-90 minutes', true, 4
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'laser-hair-removal')
UNION ALL
SELECT 'Skin Cancer Screening', 'skin-cancer-screening', 'Comprehensive skin cancer screening and early detection services.', '$120', '30 minutes', true, 5
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'skin-cancer-screening')
UNION ALL
SELECT 'Microneedling', 'microneedling', 'Collagen induction therapy to improve skin texture, scars, and fine lines.', '$250 - $400', '60 minutes', true, 6
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug = 'microneedling');

-- Sample Test Booking (for testing)
INSERT INTO bookings (name, email, phone, service, date, time, message, status)
SELECT 'Test Patient', 'test@example.com', '555-1234', 'Acne Treatment', CURRENT_DATE + INTERVAL '1 day', '10:00 AM', 'This is a test booking', 'pending'
WHERE NOT EXISTS (SELECT 1 FROM bookings WHERE email = 'test@example.com');

-- Sample Test Contact Submission (for testing)
INSERT INTO contact_submissions (name, email, phone, subject, message, status)
SELECT 'Test User', 'testuser@example.com', '555-5678', 'General Inquiry', 'This is a test contact submission to verify the system is working correctly.', 'unread'
WHERE NOT EXISTS (SELECT 1 FROM contact_submissions WHERE email = 'testuser@example.com');

-- ============================================
-- Verification Queries
-- ============================================

-- Check if tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('bookings', 'contact_submissions', 'services');

-- Check bookings
SELECT COUNT(*) as total_bookings FROM bookings;

-- Check contact submissions
SELECT COUNT(*) as total_contacts FROM contact_submissions;

-- Check services
SELECT COUNT(*) as total_services FROM services;

-- ============================================
-- Success Message
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database setup complete!';
  RAISE NOTICE 'Tables created: bookings, contact_submissions, services';
  RAISE NOTICE 'RLS policies configured';
  RAISE NOTICE 'Sample data inserted';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Go to http://localhost:3000';
  RAISE NOTICE '2. Submit a test booking';
  RAISE NOTICE '3. Login to admin at http://localhost:3000/admin';
  RAISE NOTICE '4. View your booking in the dashboard';
END $$;
