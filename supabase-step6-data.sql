-- ============================================
-- STEP 6: Insert Sample Data (Run this last)
-- ============================================

INSERT INTO services (name, slug, description, price, duration, visible, sort_order) VALUES
  ('Acne Treatment', 'acne-treatment', 'Comprehensive acne treatment using advanced medical techniques.', '$150 - $300', '45 minutes', true, 1),
  ('Anti-Aging Treatments', 'anti-aging', 'Advanced anti-aging solutions including Botox and fillers.', '$200 - $500', '60 minutes', true, 2),
  ('Chemical Peels', 'chemical-peels', 'Professional chemical peels to improve skin texture.', '$180 - $350', '30 minutes', true, 3),
  ('Laser Hair Removal', 'laser-hair-removal', 'Safe and effective laser hair removal.', '$100 - $400', '30-90 minutes', true, 4),
  ('Skin Cancer Screening', 'skin-cancer-screening', 'Comprehensive skin cancer screening.', '$120', '30 minutes', true, 5),
  ('Microneedling', 'microneedling', 'Collagen induction therapy.', '$250 - $400', '60 minutes', true, 6);

INSERT INTO bookings (name, email, phone, service, date, time, message) VALUES
  ('Test Patient', 'test@example.com', '555-1234', 'Acne Treatment', CURRENT_DATE + 1, '10:00 AM', 'Test booking');

INSERT INTO contact_submissions (name, email, phone, subject, message) VALUES
  ('Test User', 'testuser@example.com', '555-5678', 'General Inquiry', 'Test contact message');
