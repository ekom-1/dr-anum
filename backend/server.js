// Backend Server - Express API
// Main server file for Dr. Anum website

const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const {
    initializeDatabase,
    Appointments,
    Services,
    Testimonials,
    BlogPosts,
    ContactSubmissions,
    SiteSettings,
    DoctorProfile,
    Users
} = require('./models/database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// Initialize database
initializeDatabase();

// Email transporter configuration
const emailTransporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// ===================================
// PUBLIC API ROUTES
// ===================================

// Get all visible services
app.get('/api/services', (req, res) => {
    Services.getVisible((err, services) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch services' });
        }
        res.json(services);
    });
});

// Get service by slug
app.get('/api/services/:slug', (req, res) => {
    Services.getBySlug(req.params.slug, (err, service) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch service' });
        }
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.json(service);
    });
});

// Get all visible testimonials
app.get('/api/testimonials', (req, res) => {
    Testimonials.getVisible((err, testimonials) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch testimonials' });
        }
        res.json(testimonials);
    });
});

// Get published blog posts
app.get('/api/blog', (req, res) => {
    BlogPosts.getPublished((err, posts) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch blog posts' });
        }
        res.json(posts);
    });
});

// Get blog post by slug
app.get('/api/blog/:slug', (req, res) => {
    BlogPosts.getBySlug(req.params.slug, (err, post) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch blog post' });
        }
        if (!post || post.status !== 'published') {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        res.json(post);
    });
});

// Get doctor profile
app.get('/api/doctor-profile', (req, res) => {
    DoctorProfile.get((err, profile) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch doctor profile' });
        }
        res.json(profile || {});
    });
});

// Create appointment booking
app.post('/api/bookings', (req, res) => {
    const bookingData = req.body;

    // Validate required fields
    if (!bookingData.fullName || !bookingData.phone || !bookingData.email ||
        !bookingData.date || !bookingData.time || !bookingData.service) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    Appointments.create(bookingData, function(err) {
        if (err) {
            console.error('Booking error:', err);
            return res.status(500).json({ error: 'Failed to create appointment' });
        }

        // Send confirmation email to patient
        const patientEmail = {
            from: process.env.EMAIL_USER,
            to: bookingData.email,
            subject: 'Appointment Confirmation - Dr. Anum',
            html: `
                <h2>Appointment Confirmation</h2>
                <p>Dear ${bookingData.fullName},</p>
                <p>Thank you for booking an appointment with Dr. Anum. We have received your request and will contact you shortly to confirm.</p>
                <h3>Appointment Details:</h3>
                <ul>
                    <li><strong>Date:</strong> ${bookingData.date}</li>
                    <li><strong>Time:</strong> ${bookingData.time}</li>
                    <li><strong>Service:</strong> ${bookingData.service}</li>
                </ul>
                <p>If you have any questions, please contact us at ${process.env.CLINIC_PHONE || '(555) 123-4567'}.</p>
                <p>Best regards,<br>Dr. Anum's Clinic</p>
            `
        };

        // Send notification email to admin
        const adminEmail = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: 'New Appointment Booking',
            html: `
                <h2>New Appointment Booking</h2>
                <ul>
                    <li><strong>Name:</strong> ${bookingData.fullName}</li>
                    <li><strong>Phone:</strong> ${bookingData.phone}</li>
                    <li><strong>Email:</strong> ${bookingData.email}</li>
                    <li><strong>Date:</strong> ${bookingData.date}</li>
                    <li><strong>Time:</strong> ${bookingData.time}</li>
                    <li><strong>Service:</strong> ${bookingData.service}</li>
                    <li><strong>Message:</strong> ${bookingData.message || 'N/A'}</li>
                </ul>
            `
        };

        // Send emails (don't wait for completion)
        if (process.env.EMAIL_USER) {
            emailTransporter.sendMail(patientEmail).catch(err => console.error('Email error:', err));
            emailTransporter.sendMail(adminEmail).catch(err => console.error('Email error:', err));
        }

        res.status(201).json({
            message: 'Appointment booked successfully',
            appointmentId: this.lastID
        });
    });
});

// Submit contact form
app.post('/api/contact', (req, res) => {
    const contactData = req.body;

    if (!contactData.name || !contactData.email || !contactData.message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    ContactSubmissions.create(contactData, function(err) {
        if (err) {
            console.error('Contact submission error:', err);
            return res.status(500).json({ error: 'Failed to submit contact form' });
        }

        // Send notification email to admin
        const adminEmail = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: 'New Contact Form Submission',
            html: `
                <h2>New Contact Form Submission</h2>
                <ul>
                    <li><strong>Name:</strong> ${contactData.name}</li>
                    <li><strong>Email:</strong> ${contactData.email}</li>
                    <li><strong>Message:</strong> ${contactData.message}</li>
                </ul>
            `
        };

        if (process.env.EMAIL_USER) {
            emailTransporter.sendMail(adminEmail).catch(err => console.error('Email error:', err));
        }

        res.status(201).json({ message: 'Contact form submitted successfully' });
    });
});

// ===================================
// ADMIN AUTHENTICATION ROUTES
// ===================================

// Admin login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    Users.findByUsername(username, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        });
    });
});

// ===================================
// ADMIN API ROUTES (Protected)
// ===================================

// Get all appointments
app.get('/api/admin/appointments', authenticateToken, (req, res) => {
    Appointments.getAll((err, appointments) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch appointments' });
        }
        res.json(appointments);
    });
});

// Update appointment status
app.patch('/api/admin/appointments/:id', authenticateToken, (req, res) => {
    const { status } = req.body;

    Appointments.updateStatus(req.params.id, status, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update appointment' });
        }
        res.json({ message: 'Appointment updated successfully' });
    });
});

// Delete appointment
app.delete('/api/admin/appointments/:id', authenticateToken, (req, res) => {
    Appointments.delete(req.params.id, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete appointment' });
        }
        res.json({ message: 'Appointment deleted successfully' });
    });
});

// Get all services (admin)
app.get('/api/admin/services', authenticateToken, (req, res) => {
    Services.getAll((err, services) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch services' });
        }
        res.json(services);
    });
});

// Create service
app.post('/api/admin/services', authenticateToken, (req, res) => {
    Services.create(req.body, function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to create service' });
        }
        res.status(201).json({ message: 'Service created successfully', id: this.lastID });
    });
});

// Update service
app.put('/api/admin/services/:id', authenticateToken, (req, res) => {
    Services.update(req.params.id, req.body, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update service' });
        }
        res.json({ message: 'Service updated successfully' });
    });
});

// Delete service
app.delete('/api/admin/services/:id', authenticateToken, (req, res) => {
    Services.delete(req.params.id, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete service' });
        }
        res.json({ message: 'Service deleted successfully' });
    });
});

// Get all testimonials (admin)
app.get('/api/admin/testimonials', authenticateToken, (req, res) => {
    Testimonials.getAll((err, testimonials) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch testimonials' });
        }
        res.json(testimonials);
    });
});

// Create testimonial
app.post('/api/admin/testimonials', authenticateToken, (req, res) => {
    Testimonials.create(req.body, function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to create testimonial' });
        }
        res.status(201).json({ message: 'Testimonial created successfully', id: this.lastID });
    });
});

// Update testimonial
app.put('/api/admin/testimonials/:id', authenticateToken, (req, res) => {
    Testimonials.update(req.params.id, req.body, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update testimonial' });
        }
        res.json({ message: 'Testimonial updated successfully' });
    });
});

// Delete testimonial
app.delete('/api/admin/testimonials/:id', authenticateToken, (req, res) => {
    Testimonials.delete(req.params.id, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete testimonial' });
        }
        res.json({ message: 'Testimonial deleted successfully' });
    });
});

// Get all blog posts (admin)
app.get('/api/admin/blog', authenticateToken, (req, res) => {
    BlogPosts.getAll((err, posts) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch blog posts' });
        }
        res.json(posts);
    });
});

// Create blog post
app.post('/api/admin/blog', authenticateToken, (req, res) => {
    BlogPosts.create(req.body, function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to create blog post' });
        }
        res.status(201).json({ message: 'Blog post created successfully', id: this.lastID });
    });
});

// Update blog post
app.put('/api/admin/blog/:id', authenticateToken, (req, res) => {
    BlogPosts.update(req.params.id, req.body, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update blog post' });
        }
        res.json({ message: 'Blog post updated successfully' });
    });
});

// Delete blog post
app.delete('/api/admin/blog/:id', authenticateToken, (req, res) => {
    BlogPosts.delete(req.params.id, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete blog post' });
        }
        res.json({ message: 'Blog post deleted successfully' });
    });
});

// Get all contact submissions
app.get('/api/admin/contact-submissions', authenticateToken, (req, res) => {
    ContactSubmissions.getAll((err, submissions) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch contact submissions' });
        }
        res.json(submissions);
    });
});

// Update doctor profile
app.put('/api/admin/doctor-profile', authenticateToken, (req, res) => {
    DoctorProfile.update(req.body, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update doctor profile' });
        }
        res.json({ message: 'Doctor profile updated successfully' });
    });
});

// Get site settings
app.get('/api/admin/settings', authenticateToken, (req, res) => {
    SiteSettings.getAll((err, settings) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch settings' });
        }
        res.json(settings);
    });
});

// Update site setting
app.post('/api/admin/settings', authenticateToken, (req, res) => {
    const { key, value } = req.body;

    SiteSettings.set(key, value, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update setting' });
        }
        res.json({ message: 'Setting updated successfully' });
    });
});

// ===================================
// SERVE ADMIN PANEL
// ===================================
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
});

// ===================================
// ERROR HANDLING
// ===================================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// ===================================
// START SERVER
// ===================================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
});