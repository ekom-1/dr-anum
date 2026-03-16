-- ============================================
-- STEP 4: Create Policies for Contact Submissions (Run this fourth)
-- ============================================

CREATE POLICY "contact_insert_policy" ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "contact_select_policy" ON contact_submissions
  FOR SELECT
  USING (true);

CREATE POLICY "contact_update_policy" ON contact_submissions
  FOR UPDATE
  USING (true);

CREATE POLICY "contact_delete_policy" ON contact_submissions
  FOR DELETE
  USING (true);
