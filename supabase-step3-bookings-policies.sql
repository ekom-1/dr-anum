-- ============================================
-- STEP 3: Create Policies for Bookings (Run this third)
-- ============================================

CREATE POLICY "bookings_insert_policy" ON bookings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "bookings_select_policy" ON bookings
  FOR SELECT
  USING (true);

CREATE POLICY "bookings_update_policy" ON bookings
  FOR UPDATE
  USING (true);

CREATE POLICY "bookings_delete_policy" ON bookings
  FOR DELETE
  USING (true);
