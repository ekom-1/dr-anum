// Tool to create admin user
// Run: node tools/create-admin.js

const bcrypt = require('bcryptjs');
const { db, Users, initializeDatabase } = require('../backend/models/database');

async function createAdmin() {
    console.log('Creating admin user...');

    // Initialize database first
    initializeDatabase();

    // Wait a bit for database to initialize
    setTimeout(async () => {
        const username = process.argv[2] || 'admin';
        const email = process.argv[3] || 'admin@dranum.com';
        const password = process.argv[4] || 'admin123';

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin user
        Users.create({
            username,
            email,
            password: hashedPassword,
            role: 'admin'
        }, (err) => {
            if (err) {
                console.error('Error creating admin:', err.message);
                if (err.message.includes('UNIQUE')) {
                    console.log('Admin user already exists!');
                }
            } else {
                console.log('\n✓ Admin user created successfully!');
                console.log('Username:', username);
                console.log('Email:', email);
                console.log('Password:', password);
                console.log('\nIMPORTANT: Change the password after first login!');
            }
            process.exit(0);
        });
    }, 1000);
}

createAdmin();