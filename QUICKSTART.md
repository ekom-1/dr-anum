# Quick Start Guide - Dr. Anum Website

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Environment File
```bash
cp .env.example .env
```

### Step 3: Create Admin User
```bash
node tools/create-admin.js admin admin@dranum.com admin123
```

### Step 4: Start the Server
```bash
npm start
```

### Step 5: Access the Website
- **Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Login:** admin / admin123

## 📋 What's Included

### ✅ Frontend Pages
- Homepage with all sections (Hero, About, Services, Testimonials, Booking, FAQ, Blog Preview, Contact)
- About page with doctor profile, credentials, and philosophy
- Services page with detailed treatment information
- Blog page with health articles
- Contact page with form and clinic information

### ✅ Admin Dashboard
- Secure login system
- Dashboard with statistics
- Appointment management
- Services CRUD
- Testimonials CRUD
- Blog post management
- Contact form inbox
- Doctor profile editor
- Site settings

### ✅ Backend API
- RESTful API with Express.js
- SQLite database
- JWT authentication
- Email notifications
- Complete CRUD operations

### ✅ Features
- Responsive design (mobile, tablet, desktop)
- Smooth animations
- Form validation
- Email notifications for bookings
- SEO optimized (sitemap, robots.txt, meta tags)
- Structured data for search engines

## 📧 Email Setup (Optional)

To enable email notifications:

1. Get Gmail App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Generate new app password

2. Update `.env`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@dranum.com
```

## 🎨 Customization

### Change Colors
Edit `public/css/style.css`:
```css
:root {
  --color-rose-gold: #D4A574;  /* Change this */
  --color-accent: #C9A882;     /* And this */
}
```

### Update Content
- Login to admin panel
- Go to Doctor Profile to update doctor info
- Go to Services to add/edit treatments
- Go to Testimonials to add patient reviews

## 🔒 Security Notes

⚠️ **Before going live:**
1. Change admin password
2. Update JWT_SECRET in .env
3. Use strong passwords
4. Enable HTTPS
5. Set up firewall rules

## 📱 Test the Website

1. **Homepage:** Check all sections load correctly
2. **Booking Form:** Try submitting an appointment
3. **Admin Login:** Login with admin credentials
4. **Manage Content:** Add a service or testimonial
5. **Mobile View:** Test on mobile device

## 🆘 Troubleshooting

**Port already in use?**
```bash
# Change PORT in .env
PORT=3001
```

**Database errors?**
```bash
# Delete and recreate database
rm -rf .tmp/dranum.db
node tools/create-admin.js
```

**Email not working?**
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Verify Gmail App Password is correct
- Check spam folder

## 📞 Support

Need help? Contact:
- Email: info@dranum.com
- Phone: (555) 123-4567

---

**Ready to launch!** 🎉