-- Supabase Database Setup for Dr. Anum Website
-- SIMPLIFIED VERSION - Run this in Supabase SQL Editor

-- ============================================
-- Step 1: Create Tables
-- ============================================

-- Table 1: Bookings (Appointments)
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

-- Table 2: Contact Submissions
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

-- Table 3: Services
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

-- ============================================
-- Step 2: Enable Row Level Security
-- ============================================

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Step 3: Create Security Policies for BOOKINGS
-- ============================================

-- Allow anyone to insert bookings (public booking form)
CREATE POLICY "bookings_insert_policy" ON bookings
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read bookings
CREATE POLICY "bookings_select_policy" ON bookings
  FOR SELECT
  USING (true);

-- Allow anyone to update bookings (for admin)
CREATE POLICY "bookings_update_policy" ON bookings
  FOR UPDATE
  USING (true);

-- Allow anyone to delete bookings (for admin)
CREATE POLICY "bookings_delete_policy" ON bookings
  FOR DELETE
  USING (true);

-- ============================================
-- Step 4: Create Security Policies for CONTACT_SUBMISSIONS
-- ============================================

-- Allow anyone to insert contact submissions (public contact form)
CREATE POLICY "contact_insert_policy" ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read contact submissions
CREATE POLICY "contact_select_policy" ON contact_submissions
  FOR SELECT
  USING (true);

-- Allow anyone to update contact submissions (for admin)
CREATE POLICY "contact_update_policy" ON contact_submissions
  FOR UPDATE
  USING (true);

-- Allow anyone to delete contact submissions (for admin)
CREATE POLICY "contact_delete_policy" ON contact_submissions
  FOR DELETE
  USING (true);

-- ============================================
-- Step 5: Create Security Policies for SERVICES
-- ============================================

-- Allow anyone to read services
CREATE POLICY "services_select_policy" ON services
  FOR SELECT
  USING (true);

-- Allow anyone to insert services (for admin)
CREATE POLICY "services_insert_policy" ON services
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update services (for admin)
CREATE POLICY "services_update_policy" ON services
  FOR UPDATE
  USING (true);

-- Allow anyone to delete services (for admin)
CREATE POLICY "services_delete_policy" ON services
  FOR DELETE
  USING (true);

-- ============================================
-- Step 6: Insert Sample Data
-- ============================================

-- Insert sample services
INSERT INTO services (name, slug, description, price, duration, visible, sort_order) VALUES
  ('Acne Treatment', 'acne-treatment', 'Comprehensive acne treatment using advanced medical techniques.', '$150 - $300', '45 minutes', true, 1),
  ('Anti-Aging Treatments', 'anti-aging', 'Advanced anti-aging solutions including Botox and fillers.', '$200 - $500', '60 minutes', true, 2),
  ('Chemical Peels', 'chemical-peels', 'Professional chemical peels to improve skin texture.', '$180 - $350', '30 minutes', true, 3),
  ('Laser Hair Removal', 'laser-hair-removal', 'Safe and effective laser hair removal.', '$100 - $400', '30-90 minutes', true, 4),
  ('Skin Cancer Screening', 'skin-cancer-screening', 'Comprehensive skin cancer screening.', '$120', '30 minutes', true, 5),
  ('Microneedling', 'microneedling', 'Collagen induction therapy.', '$250 - $400', '60 minutes', true, 6);

-- Insert test booking
INSERT INTO bookings (name, email, phone, service, date, time, message) VALUES
  ('Test Patient', 'test@example.com', '555-1234', 'Acne Treatment', CURRENT_DATE + 1, '10:00 AM', 'Test booking');

-- Insert test contact submission
INSERT INTO contact_submissions (name, email, phone, subject, message) VALUES
  ('Test User', 'testuser@example.com', '555-5678', 'General Inquiry', 'Test contact message');

-- ============================================
-- Done! Verify the setup
-- ============================================

SELECT 'Setup Complete!' as status,
       (SELECT COUNT(*) FROM bookings) as bookings_count,
       (SELECT COUNT(*) FROM contact_submissions) as contacts_count,
       (SELECT COUNT(*) FROM services) as services_count;
