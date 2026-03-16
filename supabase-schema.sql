-- Supabase Database Schema for Dr. Anum Website
-- Run these SQL commands in your Supabase SQL Editor

-- Table: contact_submissions
-- Stores all contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to insert (submit forms)
CREATE POLICY "Allow anonymous insert" ON contact_submissions
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Allow authenticated users to read all submissions
CREATE POLICY "Allow authenticated read" ON contact_submissions
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to delete submissions
CREATE POLICY "Allow authenticated delete" ON contact_submissions
    FOR DELETE
    TO authenticated
    USING (true);


-- Table: bookings
-- Stores all appointment bookings
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to insert (book appointments)
CREATE POLICY "Allow anonymous insert" ON bookings
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Allow authenticated users to read all bookings
CREATE POLICY "Allow authenticated read" ON bookings
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to update bookings
CREATE POLICY "Allow authenticated update" ON bookings
    FOR UPDATE
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to delete bookings
CREATE POLICY "Allow authenticated delete" ON bookings
    FOR DELETE
    TO authenticated
    USING (true);


-- Optional: Create a view for dashboard statistics
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM contact_submissions) as total_contacts,
    (SELECT COUNT(*) FROM bookings) as total_bookings,
    (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_bookings,
    (SELECT COUNT(*) FROM bookings WHERE status = 'approved') as approved_bookings,
    (SELECT COUNT(*) FROM bookings WHERE date >= CURRENT_DATE) as upcoming_bookings;

-- Grant access to the view
GRANT SELECT ON dashboard_stats TO authenticated;
