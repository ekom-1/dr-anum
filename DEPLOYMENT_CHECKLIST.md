# Deployment Checklist - Dr. Anum Website

## Pre-Deployment Security

- [ ] Change default admin username and password
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Remove or secure .env file
- [ ] Review all API endpoints for security
- [ ] Enable rate limiting on API endpoints
- [ ] Set up CORS for production domain only
- [ ] Disable debug/verbose logging
- [ ] Remove any test/demo data

## Environment Configuration

- [ ] Set NODE_ENV=production
- [ ] Update SITE_URL to production domain
- [ ] Configure production email service
- [ ] Set up production database (PostgreSQL/MySQL recommended)
- [ ] Configure database connection pooling
- [ ] Set up database backups (daily recommended)
- [ ] Configure SSL/TLS certificates
- [ ] Set secure cookie flags

## Database Migration

- [ ] Export data from SQLite (if needed)
- [ ] Set up production database
- [ ] Run database migrations
- [ ] Create database indexes for performance
- [ ] Set up database user with limited permissions
- [ ] Test database connection
- [ ] Verify all tables created correctly

## Content Updates

- [ ] Update all placeholder content
- [ ] Replace placeholder images with real photos
- [ ] Update doctor profile information
- [ ] Add real services and pricing
- [ ] Add authentic patient testimonials
- [ ] Update contact information (phone, email, address)
- [ ] Update working hours
- [ ] Add real social media links
- [ ] Update sitemap.xml with production URLs
- [ ] Update robots.txt with production domain

## SEO Optimization

- [ ] Update meta titles and descriptions
- [ ] Add Open Graph images
- [ ] Verify structured data markup
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up Google Analytics
- [ ] Set up Google Tag Manager (optional)
- [ ] Verify canonical URLs
- [ ] Test mobile-friendliness (Google Mobile-Friendly Test)
- [ ] Check page speed (Google PageSpeed Insights)

## Testing

- [ ] Test all forms (booking, contact)
- [ ] Verify email notifications work
- [ ] Test admin login and all CRUD operations
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test on different screen sizes
- [ ] Verify all links work
- [ ] Test appointment booking flow
- [ ] Test admin appointment management
- [ ] Check for console errors
- [ ] Verify images load correctly
- [ ] Test navigation on all pages

## Performance Optimization

- [ ] Minify CSS and JavaScript
- [ ] Compress images (WebP format recommended)
- [ ] Enable gzip/brotli compression
- [ ] Set up CDN for static assets (optional)
- [ ] Configure browser caching headers
- [ ] Optimize database queries
- [ ] Enable HTTP/2
- [ ] Lazy load images
- [ ] Remove unused CSS/JS

## Server Configuration

- [ ] Set up reverse proxy (Nginx/Apache)
- [ ] Configure firewall rules
- [ ] Set up SSL/TLS (Let's Encrypt recommended)
- [ ] Configure automatic SSL renewal
- [ ] Set up process manager (PM2 recommended)
- [ ] Configure automatic restart on crash
- [ ] Set up log rotation
- [ ] Configure server monitoring
- [ ] Set up uptime monitoring
- [ ] Configure backup strategy

## Domain & DNS

- [ ] Purchase domain name
- [ ] Configure DNS records (A, AAAA, CNAME)
- [ ] Set up www redirect
- [ ] Configure email DNS records (MX, SPF, DKIM)
- [ ] Verify DNS propagation
- [ ] Set up domain email forwarding (optional)

## Legal & Compliance

- [ ] Add Privacy Policy page
- [ ] Add Terms & Conditions page
- [ ] Add Cookie Policy (if using cookies)
- [ ] Add HIPAA compliance notice (if applicable)
- [ ] Add medical disclaimer
- [ ] Verify GDPR compliance (if serving EU users)
- [ ] Add accessibility statement
- [ ] Review medical advertising regulations

## Monitoring & Maintenance

- [ ] Set up error logging (Sentry, LogRocket, etc.)
- [ ] Configure uptime monitoring (UptimeRobot, Pingdom)
- [ ] Set up performance monitoring (New Relic, DataDog)
- [ ] Configure email alerts for errors
- [ ] Set up database monitoring
- [ ] Schedule regular backups
- [ ] Plan maintenance windows
- [ ] Document deployment process

## Post-Deployment

- [ ] Test production site thoroughly
- [ ] Monitor error logs for 24-48 hours
- [ ] Check email notifications work
- [ ] Verify booking system works
- [ ] Test admin panel functionality
- [ ] Monitor server resources (CPU, memory, disk)
- [ ] Check SSL certificate validity
- [ ] Verify all redirects work
- [ ] Test from different locations/networks
- [ ] Update documentation with production URLs

## Marketing & Launch

- [ ] Submit to Google My Business
- [ ] Submit to medical directories
- [ ] Set up social media profiles
- [ ] Create launch announcement
- [ ] Email existing patients (if applicable)
- [ ] Set up Google Ads (optional)
- [ ] Set up Facebook/Instagram ads (optional)
- [ ] Create content calendar for blog
- [ ] Plan SEO strategy

## Ongoing Maintenance

- [ ] Schedule weekly database backups
- [ ] Monitor site performance monthly
- [ ] Update content regularly
- [ ] Review and respond to contact forms
- [ ] Manage appointments daily
- [ ] Update blog monthly
- [ ] Review analytics monthly
- [ ] Update dependencies quarterly
- [ ] Renew SSL certificates annually
- [ ] Review security annually

---

## Quick Deployment Commands

### Using PM2 (Recommended)
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start backend/server.js --name dranum

# Save PM2 configuration
pm2 save

# Set up auto-start on reboot
pm2 startup
```

### Using Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name dranum.com www.dranum.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d dranum.com -d www.dranum.com
```

---

## Emergency Contacts

**Hosting Provider:** _________________
**Domain Registrar:** _________________
**Email Service:** _________________
**Developer:** _________________

---

**Last Updated:** March 14, 2026
**Version:** 1.0.0