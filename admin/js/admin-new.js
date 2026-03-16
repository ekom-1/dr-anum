// Admin Dashboard JavaScript - Supabase Integration
// Handles all admin panel functionality with Supabase

let authToken = localStorage.getItem('adminToken');

// ===================================
// Authentication
// ===================================

// Check if user is logged in
function checkAuth() {
    if (!authToken) {
        showLoginScreen();
        return false;
    }
    return true;
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';

    // Load Supabase data
    if (window.loadBookings) {
        window.loadBookings();
    }
    if (window.loadContactSubmissions) {
        window.loadContactSubmissions();
    }
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    // Simple authentication (you can enhance this)
    if (username === 'admin' && password === 'admin123') {
        authToken = 'admin-token-' + Date.now();
        localStorage.setItem('adminToken', authToken);
        errorDiv.textContent = '';
        showDashboard();
    } else {
        errorDiv.textContent = 'Invalid username or password';
    }
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    authToken = null;
    showLoginScreen();
});

// ===================================
// Navigation
// ===================================

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();

        // Don't handle logout button here
        if (item.id === 'logoutBtn') return;

        const section = item.getAttribute('data-section');
        if (!section) return;

        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Show selected section
        document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');

            // Load data when switching to appointments or contact sections
            if (section === 'appointments' && window.loadBookings) {
                window.loadBookings();
            } else if (section === 'contact' && window.loadContactSubmissions) {
                window.loadContactSubmissions();
            }
        }
    });
});

// ===================================
// Initialize
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        showDashboard();
    } else {
        showLoginScreen();
    }
});
