# Dr. Anum - Professional Dermatology Website

A complete, production-ready website for Dr. Anum's dermatology practice featuring a modern frontend, booking system, admin CMS, and SEO optimization.

## Features

### Frontend
- ✨ Premium medical aesthetic design with rose gold accents
- 📱 Fully responsive mobile-first layout
- 🎨 Smooth animations and micro-interactions
- 📅 Integrated appointment booking system
- 💬 Contact forms with email notifications
- ⭐ Patient testimonials carousel
- 📝 Blog with health articles
- 🔍 SEO optimized with structured data

### Admin Dashboard
- 🔐 Secure authentication with JWT
- 📊 Dashboard with statistics
- 📅 Appointment management (approve/cancel/delete)
- 💉 Services manager (CRUD operations)
- ⭐ Testimonials manager
- 📝 Blog post manager
- 👤 Doctor profile editor
- ⚙️ Site settings configuration
- ✉️ Contact form submissions inbox

### Backend
- 🚀 Express.js REST API
- 💾 SQLite database (easily migrated to PostgreSQL/MySQL)
- 📧 Email notifications (Nodemailer)
- 🔒 Secure password hashing (bcrypt)
- 🎫 JWT authentication
- 📊 Complete CRUD operations

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and update with your settings:
- Email credentials (Gmail, SendGrid, etc.)
- JWT secret key
- Clinic information

3. **Initialize database**
```bash
npm run init-db
```

4. **Create admin user**
```bash
npm run create-admin
# Or with custom credentials:
npm run create-admin username email@example.com password123
```

5. **Start the server**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

6. **Access the website**
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin

## Default Admin Credentials

**Username:** admin
**Password:** admin123

⚠️ **IMPORTANT:** Change these credentials immediately after first login!

## Project Structure

```
dr-anum-website/
├── public/                 # Frontend files
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript
│   ├── images/            # Images and assets
│   ├── index.html         # Homepage
│   ├── about.html         # About page
│   ├── services.html      # Services page
│   ├── blog.html          # Blog page
│   ├── contact.html       # Contact page
│   ├── sitemap.xml        # SEO sitemap
│   └── robots.txt         # SEO robots file
├── admin/                 # Admin dashboard
│   ├── css/               # Admin styles
│   ├── js/                # Admin JavaScript
│   └── index.html         # Admin panel
├── backend/               # Backend API
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   └── server.js          # Express server
├── tools/                 # Utility scripts
│   └── create-admin.js    # Admin user creator
├── .tmp/                  # Temporary files & database
├── .env                   # Environment variables
└── package.json           # Dependencies
```

## API Endpoints

### Public Endpoints
- `GET /api/services` - Get all visible services
- `GET /api/services/:slug` - Get service by slug
- `GET /api/testimonials` - Get all visible testimonials
- `GET /api/blog` - Get published blog posts
- `GET /api/blog/:slug` - Get blog post by slug
- `GET /api/doctor-profile` - Get doctor profile
- `POST /api/bookings` - Create appointment booking
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Requires Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/appointments` - Get all appointments
- `PATCH /api/admin/appointments/:id` - Update appointment status
- `DELETE /api/admin/appointments/:id` - Delete appointment
- `GET /api/admin/services` - Get all services
- `POST /api/admin/services` - Create service
- `PUT /api/admin/services/:id` - Update service
- `DELETE /api/admin/services/:id` - Delete service
- `GET /api/admin/testimonials` - Get all testimonials
- `POST /api/admin/testimonials` - Create testimonial
- `PUT /api/admin/testimonials/:id` - Update testimonial
- `DELETE /api/admin/testimonials/:id` - Delete testimonial
- `GET /api/admin/blog` - Get all blog posts
- `POST /api/admin/blog` - Create blog post
- `PUT /api/admin/blog/:id` - Update blog post
- `DELETE /api/admin/blog/:id` - Delete blog post
- `GET /api/admin/contact-submissions` - Get contact submissions
- `PUT /api/admin/doctor-profile` - Update doctor profile
- `GET /api/admin/settings` - Get site settings
- `POST /api/admin/settings` - Update site setting

## Email Configuration

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Update `.env`:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Other Email Services
Nodemailer supports many services. Update `EMAIL_SERVICE` in `.env`:
- SendGrid
- Mailgun
- AWS SES
- Outlook
- Yahoo

## Customization

### Design Colors
Edit `public/css/style.css` CSS variables:
```css
:root {
  --color-ivory: #FAF7F5;
  --color-nude: #E8DDD3;
  --color-rose-gold: #D4A574;
  --color-charcoal: #2C2C2C;
}
```

### Site Content
- Update doctor information in Admin Panel → Doctor Profile
- Add/edit services in Admin Panel → Services
- Manage testimonials in Admin Panel → Testimonials
- Create blog posts in Admin Panel → Blog Posts

## Deployment

### Production Checklist
- [ ] Change default admin credentials
- [ ] Update JWT_SECRET in `.env`
- [ ] Configure production email service
- [ ] Update SITE_URL in `.env`
- [ ] Set NODE_ENV=production
- [ ] Use a production database (PostgreSQL/MySQL)
- [ ] Enable HTTPS
- [ ] Set up regular database backups
- [ ] Configure firewall rules
- [ ] Update sitemap.xml with production URLs

### Deployment Options
- **VPS/Cloud:** Deploy on DigitalOcean, AWS, Google Cloud, or Azure
- **Platform as a Service:** Heroku, Railway, Render
- **Static + Serverless:** Vercel/Netlify (frontend) + Serverless functions (backend)

## Database Migration

To migrate from SQLite to PostgreSQL/MySQL:

1. Install database driver:
```bash
npm install pg  # PostgreSQL
# or
npm install mysql2  # MySQL
```

2. Update `backend/models/database.js` to use the new driver
3. Update connection string in `.env`
4. Run migrations

## Support

For issues or questions:
- Email: info@dranum.com
- Phone: (555) 123-4567

## License

Copyright © 2026 Dr. Anum. All rights reserved.

---

Built with ❤️ using Express.js, SQLite, and vanilla JavaScript