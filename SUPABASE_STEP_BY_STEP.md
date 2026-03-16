# 🚀 SUPABASE SETUP - STEP BY STEP GUIDE

## ✅ FIXED: No More Errors!

I've split the SQL script into **6 separate files** that you run one at a time. This fixes the "EXPLAIN only works on a single SQL statement" error.

---

## 📋 Step-by-Step Instructions (5 minutes)

### Step 1: Create Tables
1. Go to: https://supabase.com/dashboard/project/dgbxlrzxxeqploptckul
2. Click **SQL Editor** → **New Query**
3. Open file: `supabase-step1-tables.sql`
4. Copy ALL contents
5. Paste into Supabase
6. Click **RUN**
7. ✅ Should see: "Success. No rows returned"

### Step 2: Enable Row Level Security
1. Click **New Query** again
2. Open file: `supabase-step2-rls.sql`
3. Copy ALL contents
4. Paste into Supabase
5. Click **RUN**
6. ✅ Should see: "Success. No rows returned"

### Step 3: Create Bookings Policies
1. Click **New Query** again
2. Open file: `supabase-step3-bookings-policies.sql`
3. Copy ALL contents
4. Paste into Supabase
5. Click **RUN**
6. ✅ Should see: "Success. No rows returned"

### Step 4: Create Contact Policies
1. Click **New Query** again
2. Open file: `supabase-step4-contact-policies.sql`
3. Copy ALL contents
4. Paste into Supabase
5. Click **RUN**
6. ✅ Should see: "Success. No rows returned"

### Step 5: Create Services Policies
1. Click **New Query** again
2. Open file: `supabase-step5-services-policies.sql`
3. Copy ALL contents
4. Paste into Supabase
5. Click **RUN**
6. ✅ Should see: "Success. No rows returned"

### Step 6: Insert Sample Data
1. Click **New Query** again
2. Open file: `supabase-step6-data.sql`
3. Copy ALL contents
4. Paste into Supabase
5. Click **RUN**
6. ✅ Should see: "Success. 3 rows returned" (or similar)

---

## ✅ Verify Setup

### Check Tables Created
1. In Supabase, click **Table Editor** (left sidebar)
2. You should see 3 tables:
   - ✅ `bookings` (1 test row)
   - ✅ `contact_submissions` (1 test row)
   - ✅ `services` (6 rows)

### Check Policies
1. Click on `bookings` table
2. Click **Policies** tab
3. You should see 4 policies:
   - ✅ bookings_insert_policy
   - ✅ bookings_select_policy
   - ✅ bookings_update_policy
   - ✅ bookings_delete_policy

---

## 🧪 Test the System

### Test 1: View Test Data in Admin
1. Go to: http://localhost:3000/admin
2. Login: `admin` / `admin123`
3. Click **"Appointments"**
4. ✅ You should see "Test Patient" booking
5. Click **"Contact Forms"**
6. ✅ You should see "Test User" submission

### Test 2: Submit Real Booking
1. Open: http://localhost:3000
2. Scroll to booking section
3. Fill out the form:
   - Name: Your Name
   - Email: your@email.com
   - Phone: 555-9999
   - Service: Acne Treatment
   - Date: Tomorrow
   - Time: 2:00 PM
4. Click "Book Appointment"
5. ✅ Should see: "Appointment booked successfully!"

### Test 3: Check Admin Dashboard
1. Go back to: http://localhost:3000/admin
2. Click **"Appointments"**
3. ✅ Your new booking should appear!
4. Try clicking **"Approve"**
5. ✅ Status changes to "approved"

### Test 4: Submit Contact Form
1. Go to: http://localhost:3000/contact.html
2. Fill out the form
3. Submit
4. Go to admin → **"Contact Forms"**
5. ✅ Your submission appears!

---

## 🐛 Troubleshooting

### Issue: "Cannot read properties of undefined (reading 'from')"
**Cause**: Supabase client not initialized

**Fix**:
1. Open browser console (F12)
2. Type: `window.supabaseClient`
3. If it shows `undefined`, refresh the page
4. Make sure you see the Supabase object

### Issue: Forms submit but no data appears
**Cause**: RLS policies not created

**Fix**:
1. Make sure you ran ALL 6 SQL steps
2. Check Supabase → Table Editor → Click table → Policies tab
3. Should see 4 policies per table

### Issue: "Error loading appointments"
**Cause**: Tables don't exist

**Fix**:
1. Go to Supabase → Table Editor
2. Check if tables exist
3. If not, run Step 1 again

---

## 📁 SQL Files Created

1. ✅ `supabase-step1-tables.sql` - Creates 3 tables
2. ✅ `supabase-step2-rls.sql` - Enables security
3. ✅ `supabase-step3-bookings-policies.sql` - Bookings permissions
4. ✅ `supabase-step4-contact-policies.sql` - Contact permissions
5. ✅ `supabase-step5-services-policies.sql` - Services permissions
6. ✅ `supabase-step6-data.sql` - Sample data

---

## 🎯 What Each Step Does

### Step 1: Tables
Creates the database structure for bookings, contacts, and services.

### Step 2: RLS
Enables Row Level Security to protect your data.

### Step 3-5: Policies
Sets up permissions so:
- Anyone can INSERT (submit forms)
- Anyone can SELECT (read data)
- Anyone can UPDATE (admin changes)
- Anyone can DELETE (admin removes)

### Step 6: Data
Inserts sample services and test data.

---

## ✅ After Setup Complete

Your system will have:
- ✅ 3 database tables in Supabase
- ✅ Security policies configured
- ✅ 6 sample services
- ✅ 1 test booking
- ✅ 1 test contact submission
- ✅ Full admin dashboard working
- ✅ Forms submitting to Supabase
- ✅ Real-time data sync

---

## 🎉 Success Checklist

- [ ] Ran Step 1 - Tables created
- [ ] Ran Step 2 - RLS enabled
- [ ] Ran Step 3 - Bookings policies created
- [ ] Ran Step 4 - Contact policies created
- [ ] Ran Step 5 - Services policies created
- [ ] Ran Step 6 - Sample data inserted
- [ ] Verified tables exist in Table Editor
- [ ] Tested admin dashboard shows data
- [ ] Submitted test booking from website
- [ ] Booking appeared in admin dashboard
- [ ] Submitted contact form
- [ ] Contact appeared in admin dashboard

---

## 💡 Pro Tips

1. **Run one step at a time** - Don't try to run multiple queries together
2. **Check for success** - Each step should say "Success"
3. **Use Table Editor** - You can view/edit data directly in Supabase
4. **Check browser console** - Press F12 to see any JavaScript errors
5. **Refresh admin page** - After submitting forms, refresh to see new data

---

## 🆘 Still Having Issues?

### Quick Debug Steps:
1. Open browser console (F12)
2. Go to http://localhost:3000
3. Type: `window.supabaseClient.from('bookings').select('*')`
4. Press Enter
5. You should see your bookings data

If you see an error, check:
- ✅ Supabase URL is correct in `supabase-config.js`
- ✅ API key is correct
- ✅ Tables exist in Supabase
- ✅ Policies are created

---

**Start with Step 1 now!** 🚀

Open `supabase-step1-tables.sql` and run it in Supabase SQL Editor.
