-- ============================================
-- STEP 5: Create Policies for Services (Run this fifth)
-- ============================================

CREATE POLICY "services_select_policy" ON services
  FOR SELECT
  USING (true);

CREATE POLICY "services_insert_policy" ON services
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "services_update_policy" ON services
  FOR UPDATE
  USING (true);

CREATE POLICY "services_delete_policy" ON services
  FOR DELETE
  USING (true);
