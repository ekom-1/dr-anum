// Database Schema and Models
// Using SQLite for simplicity - can be easily migrated to PostgreSQL/MySQL

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection
const dbPath = path.join(__dirname, '..', '..', '.tmp', 'dranum.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
function initializeDatabase() {
    db.serialize(() => {
        // Users table (for admin authentication)
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'admin',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Appointments table
        db.run(`
            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT NOT NULL,
                appointment_date DATE NOT NULL,
                appointment_time TEXT NOT NULL,
                service TEXT NOT NULL,
                message TEXT,
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Services table
        db.run(`
            CREATE TABLE IF NOT EXISTS services (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                description TEXT,
                icon TEXT,
                image_url TEXT,
                price TEXT,
                duration TEXT,
                visible INTEGER DEFAULT 1,
                sort_order INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Testimonials table
        db.run(`
            CREATE TABLE IF NOT EXISTS testimonials (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_name TEXT NOT NULL,
                treatment TEXT NOT NULL,
                rating INTEGER DEFAULT 5,
                testimonial_text TEXT NOT NULL,
                visible INTEGER DEFAULT 1,
                sort_order INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Blog posts table
        db.run(`
            CREATE TABLE IF NOT EXISTS blog_posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                content TEXT NOT NULL,
                excerpt TEXT,
                featured_image TEXT,
                category TEXT,
                tags TEXT,
                author TEXT DEFAULT 'Dr. Anum',
                status TEXT DEFAULT 'draft',
                meta_title TEXT,
                meta_description TEXT,
                published_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Pages table (for CMS)
        db.run(`
            CREATE TABLE IF NOT EXISTS pages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                content TEXT NOT NULL,
                template TEXT DEFAULT 'default',
                status TEXT DEFAULT 'draft',
                meta_title TEXT,
                meta_description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Contact submissions table
        db.run(`
            CREATE TABLE IF NOT EXISTS contact_submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                status TEXT DEFAULT 'unread',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Site settings table
        db.run(`
            CREATE TABLE IF NOT EXISTS site_settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                setting_key TEXT UNIQUE NOT NULL,
                setting_value TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Doctor profile table
        db.run(`
            CREATE TABLE IF NOT EXISTS doctor_profile (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                specialty TEXT,
                qualifications TEXT,
                biography TEXT,
                photo_url TEXT,
                certifications TEXT,
                experience_years INTEGER,
                social_facebook TEXT,
                social_instagram TEXT,
                social_tiktok TEXT,
                social_whatsapp TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Media library table
        db.run(`
            CREATE TABLE IF NOT EXISTS media (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                original_name TEXT NOT NULL,
                file_path TEXT NOT NULL,
                file_type TEXT,
                file_size INTEGER,
                alt_text TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Database tables initialized successfully');
    });
}

// Model: Appointments
const Appointments = {
    create: (data, callback) => {
        const sql = `INSERT INTO appointments (full_name, phone, email, appointment_date, appointment_time, service, message)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.run(sql, [data.fullName, data.phone, data.email, data.date, data.time, data.service, data.message], callback);
    },

    getAll: (callback) => {
        const sql = `SELECT * FROM appointments ORDER BY appointment_date DESC, appointment_time DESC`;
        db.all(sql, callback);
    },

    getById: (id, callback) => {
        const sql = `SELECT * FROM appointments WHERE id = ?`;
        db.get(sql, [id], callback);
    },

    updateStatus: (id, status, callback) => {
        const sql = `UPDATE appointments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        db.run(sql, [status, id], callback);
    },

    delete: (id, callback) => {
        const sql = `DELETE FROM appointments WHERE id = ?`;
        db.run(sql, [id], callback);
    }
};

// Model: Services
const Services = {
    create: (data, callback) => {
        const sql = `INSERT INTO services (name, slug, description, icon, image_url, price, duration, visible, sort_order)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(sql, [data.name, data.slug, data.description, data.icon, data.imageUrl, data.price, data.duration, data.visible, data.sortOrder], callback);
    },

    getAll: (callback) => {
        const sql = `SELECT * FROM services ORDER BY sort_order ASC`;
        db.all(sql, callback);
    },

    getVisible: (callback) => {
        const sql = `SELECT * FROM services WHERE visible = 1 ORDER BY sort_order ASC`;
        db.all(sql, callback);
    },

    getBySlug: (slug, callback) => {
        const sql = `SELECT * FROM services WHERE slug = ?`;
        db.get(sql, [slug], callback);
    },

    update: (id, data, callback) => {
        const sql = `UPDATE services SET name = ?, slug = ?, description = ?, icon = ?, image_url = ?,
                     price = ?, duration = ?, visible = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        db.run(sql, [data.name, data.slug, data.description, data.icon, data.imageUrl, data.price, data.duration, data.visible, data.sortOrder, id], callback);
    },

    delete: (id, callback) => {
        const sql = `DELETE FROM services WHERE id = ?`;
        db.run(sql, [id], callback);
    }
};

// Model: Testimonials
const Testimonials = {
    create: (data, callback) => {
        const sql = `INSERT INTO testimonials (patient_name, treatment, rating, testimonial_text, visible, sort_order)
                     VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql, [data.patientName, data.treatment, data.rating, data.testimonialText, data.visible, data.sortOrder], callback);
    },

    getAll: (callback) => {
        const sql = `SELECT * FROM testimonials ORDER BY sort_order ASC`;
        db.all(sql, callback);
    },

    getVisible: (callback) => {
        const sql = `SELECT * FROM testimonials WHERE visible = 1 ORDER BY sort_order ASC`;
        db.all(sql, callback);
    },

    update: (id, data, callback) => {
        const sql = `UPDATE testimonials SET patient_name = ?, treatment = ?, rating = ?,
                     testimonial_text = ?, visible = ?, sort_order = ? WHERE id = ?`;
        db.run(sql, [data.patientName, data.treatment, data.rating, data.testimonialText, data.visible, data.sortOrder, id], callback);
    },

    delete: (id, callback) => {
        const sql = `DELETE FROM testimonials WHERE id = ?`;
        db.run(sql, [id], callback);
    }
};

// Model: Blog Posts
const BlogPosts = {
    create: (data, callback) => {
        const sql = `INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, category, tags,
                     author, status, meta_title, meta_description, published_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(sql, [data.title, data.slug, data.content, data.excerpt, data.featuredImage, data.category,
                     data.tags, data.author, data.status, data.metaTitle, data.metaDescription, data.publishedAt], callback);
    },

    getAll: (callback) => {
        const sql = `SELECT * FROM blog_posts ORDER BY created_at DESC`;
        db.all(sql, callback);
    },

    getPublished: (callback) => {
        const sql = `SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC`;
        db.all(sql, callback);
    },

    getBySlug: (slug, callback) => {
        const sql = `SELECT * FROM blog_posts WHERE slug = ?`;
        db.get(sql, [slug], callback);
    },

    update: (id, data, callback) => {
        const sql = `UPDATE blog_posts SET title = ?, slug = ?, content = ?, excerpt = ?, featured_image = ?,
                     category = ?, tags = ?, author = ?, status = ?, meta_title = ?, meta_description = ?,
                     published_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        db.run(sql, [data.title, data.slug, data.content, data.excerpt, data.featuredImage, data.category,
                     data.tags, data.author, data.status, data.metaTitle, data.metaDescription, data.publishedAt, id], callback);
    },

    delete: (id, callback) => {
        const sql = `DELETE FROM blog_posts WHERE id = ?`;
        db.run(sql, [id], callback);
    }
};

// Model: Contact Submissions
const ContactSubmissions = {
    create: (data, callback) => {
        const sql = `INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)`;
        db.run(sql, [data.name, data.email, data.message], callback);
    },

    getAll: (callback) => {
        const sql = `SELECT * FROM contact_submissions ORDER BY created_at DESC`;
        db.all(sql, callback);
    },

    markAsRead: (id, callback) => {
        const sql = `UPDATE contact_submissions SET status = 'read' WHERE id = ?`;
        db.run(sql, [id], callback);
    },

    delete: (id, callback) => {
        const sql = `DELETE FROM contact_submissions WHERE id = ?`;
        db.run(sql, [id], callback);
    }
};

// Model: Site Settings
const SiteSettings = {
    get: (key, callback) => {
        const sql = `SELECT setting_value FROM site_settings WHERE setting_key = ?`;
        db.get(sql, [key], callback);
    },

    set: (key, value, callback) => {
        const sql = `INSERT OR REPLACE INTO site_settings (setting_key, setting_value, updated_at)
                     VALUES (?, ?, CURRENT_TIMESTAMP)`;
        db.run(sql, [key, value], callback);
    },

    getAll: (callback) => {
        const sql = `SELECT * FROM site_settings`;
        db.all(sql, callback);
    }
};

// Model: Doctor Profile
const DoctorProfile = {
    get: (callback) => {
        const sql = `SELECT * FROM doctor_profile LIMIT 1`;
        db.get(sql, callback);
    },

    update: (data, callback) => {
        const sql = `INSERT OR REPLACE INTO doctor_profile (id, name, specialty, qualifications, biography,
                     photo_url, certifications, experience_years, social_facebook, social_instagram,
                     social_tiktok, social_whatsapp, updated_at)
                     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;
        db.run(sql, [data.name, data.specialty, data.qualifications, data.biography, data.photoUrl,
                     data.certifications, data.experienceYears, data.socialFacebook, data.socialInstagram,
                     data.socialTiktok, data.socialWhatsapp], callback);
    }
};

// Model: Users (Admin)
const Users = {
    create: (data, callback) => {
        const sql = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;
        db.run(sql, [data.username, data.email, data.password, data.role], callback);
    },

    findByUsername: (username, callback) => {
        const sql = `SELECT * FROM users WHERE username = ?`;
        db.get(sql, [username], callback);
    },

    findByEmail: (email, callback) => {
        const sql = `SELECT * FROM users WHERE email = ?`;
        db.get(sql, [email], callback);
    }
};

module.exports = {
    db,
    initializeDatabase,
    Appointments,
    Services,
    Testimonials,
    BlogPosts,
    ContactSubmissions,
    SiteSettings,
    DoctorProfile,
    Users
};