// Admin Dashboard JavaScript
// Handles all admin panel functionality

const API_BASE = '/api';
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
    loadDashboardData();
}

// Login form handler - Simple client-side auth for Vercel deployment
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    // Simple hardcoded authentication (for demo/testing purposes)
    // In production, use proper backend authentication
    if (username === 'admin' && password === 'admin123') {
        // Generate a simple token
        authToken = 'demo-token-' + Date.now();
        localStorage.setItem('adminToken', authToken);
        errorDiv.textContent = '';
        showDashboard();
    } else {
        errorDiv.textContent = 'Invalid username or password';
        errorDiv.style.display = 'block';
        errorDiv.style.color = '#E57373';
        errorDiv.style.marginTop = '1rem';
        errorDiv.style.padding = '0.75rem';
        errorDiv.style.background = '#FFEBEE';
        errorDiv.style.borderRadius = '8px';
    }
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('adminToken');
    authToken = null;

    // Redirect to homepage
    window.location.href = '/';
});

// ===================================
// API Helper Functions
// ===================================

async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...options.headers
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('adminToken');
        showLoginScreen();
        throw new Error('Unauthorized');
    }

    return response;
}

// ===================================
// Navigation
// ===================================

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if (item.id === 'logoutBtn') return;

        e.preventDefault();
        const section = item.dataset.section;

        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Show corresponding section
        document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(section).classList.add('active');

        // Load section data
        loadSectionData(section);
    });
});

// ===================================
// Dashboard Data Loading
// ===================================

async function loadDashboardData() {
    try {
        // Check if Supabase client is initialized
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return;
        }

        // Load stats from Supabase
        const [appointmentsResult, servicesResult, contactsResult] = await Promise.all([
            window.supabaseClient.from('bookings').select('*'),
            window.supabaseClient.from('services').select('*'),
            window.supabaseClient.from('contact_submissions').select('*')
        ]);

        const appointments = appointmentsResult.data || [];
        const services = servicesResult.data || [];
        const contacts = contactsResult.data || [];

        // Update stats
        document.getElementById('totalAppointments').textContent = appointments.length;
        document.getElementById('pendingAppointments').textContent =
            appointments.filter(a => a.status === 'pending' || !a.status).length;
        document.getElementById('totalServices').textContent = services.length;
        document.getElementById('unreadMessages').textContent =
            contacts.filter(c => c.status === 'unread' || !c.status).length;

        // Show recent appointments
        displayRecentAppointments(appointments.slice(0, 5));
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function displayRecentAppointments(appointments) {
    const container = document.getElementById('recentAppointments');

    if (appointments.length === 0) {
        container.innerHTML = '<p class="empty-state">No recent appointments</p>';
        return;
    }

    const table = `
        <table>
            <thead>
                <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Service</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${appointments.map(apt => `
                    <tr>
                        <td>${apt.name}</td>
                        <td>${apt.date}</td>
                        <td>${apt.time}</td>
                        <td>${apt.service}</td>
                        <td><span class="status-badge status-${apt.status || 'pending'}">${apt.status || 'pending'}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = table;
}

// ===================================
// Section Data Loading
// ===================================

async function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'appointments':
            loadAppointments();
            break;
        case 'services':
            loadServices();
            break;
        case 'testimonials':
            loadTestimonials();
            break;
        case 'blog':
            loadBlogPosts();
            break;
        case 'contact':
            loadContactSubmissions();
            break;
        case 'profile':
            loadDoctorProfile();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// ===================================
// Appointments Management (Supabase)
// ===================================

async function loadAppointments(filter = 'all') {
    try {
        const tbody = document.querySelector('#appointmentsTable tbody');
        tbody.innerHTML = '<tr><td colspan="9" class="loading">Loading appointments...</td></tr>';

        // Check if Supabase client is initialized
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        let query = window.supabaseClient
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        // Apply filter
        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        const { data: appointments, error } = await query;

        if (error) throw error;

        if (!appointments || appointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No appointments found</td></tr>';
            return;
        }

        tbody.innerHTML = appointments.map(apt => `
            <tr>
                <td><strong>#${apt.id}</strong></td>
                <td>${apt.name}</td>
                <td><a href="mailto:${apt.email}" style="color: var(--rose-gold);">${apt.email}</a></td>
                <td><a href="tel:${apt.phone}" style="color: var(--rose-gold);">${apt.phone}</a></td>
                <td><strong>${apt.date}</strong></td>
                <td>${apt.time}</td>
                <td>${apt.service}</td>
                <td>
                    <select class="status-dropdown status-${apt.status || 'pending'}"
                            onchange="updateAppointmentStatus('${apt.id}', this.value)"
                            style="padding: 0.5rem 1rem; border-radius: 8px; border: 2px solid var(--gray-200); font-weight: 600; cursor: pointer; background: white;">
                        <option value="pending" ${(apt.status === 'pending' || !apt.status) ? 'selected' : ''}>Pending</option>
                        <option value="approved" ${apt.status === 'approved' ? 'selected' : ''}>Approved</option>
                        <option value="cancelled" ${apt.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        <option value="completed" ${apt.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </td>
                <td>
                    <button class="action-btn btn-delete" onclick="deleteAppointment('${apt.id}')" title="Delete appointment">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading appointments:', error);
        const tbody = document.querySelector('#appointmentsTable tbody');
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state" style="color: red;">Error loading appointments. Check console.</td></tr>';
    }
}

async function updateAppointmentStatus(id, status) {
    try {
        const { error } = await window.supabaseClient
            .from('bookings')
            .update({ status: status })
            .eq('id', id);

        if (error) throw error;

        alert('Appointment updated successfully');
        loadAppointments();
        loadDashboardData();
    } catch (error) {
        console.error('Error updating appointment:', error);
        alert('Failed to update appointment: ' + error.message);
    }
}

async function deleteAppointment(id) {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
        const { error } = await window.supabaseClient
            .from('bookings')
            .delete()
            .eq('id', id);

        if (error) throw error;

        alert('Appointment deleted successfully');
        loadAppointments();
        loadDashboardData();
    } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Failed to delete appointment: ' + error.message);
    }
}

// ===================================
// Services Management
// ===================================

async function loadServices() {
    try {
        const tbody = document.querySelector('#servicesTable tbody');
        tbody.innerHTML = '<tr><td colspan="7" class="loading">Loading services...</td></tr>';

        // Check if Supabase client is initialized
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data: services, error } = await window.supabaseClient
            .from('services')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;

        if (!services || services.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No services found</td></tr>';
            return;
        }

        tbody.innerHTML = services.map(service => `
            <tr>
                <td>${service.id}</td>
                <td>${service.name}</td>
                <td>${service.slug}</td>
                <td>${service.price || 'N/A'}</td>
                <td>${service.duration || 'N/A'}</td>
                <td>${service.visible ? 'Yes' : 'No'}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editService(${service.id})">Edit</button>
                    <button class="action-btn btn-delete" onclick="deleteService(${service.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading services:', error);
        const tbody = document.querySelector('#servicesTable tbody');
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state" style="color: red;">Error loading services. Check console.</td></tr>';
    }
}

function showServiceModal() {
    document.getElementById('serviceModal').classList.add('active');
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceId').value = '';
    document.getElementById('serviceModalTitle').textContent = 'Add Service';
}

function closeServiceModal() {
    document.getElementById('serviceModal').classList.remove('active');
}

async function editService(id) {
    try {
        const response = await apiRequest('/admin/services');
        const services = await response.json();
        const service = services.find(s => s.id === id);

        if (service) {
            document.getElementById('serviceId').value = service.id;
            document.getElementById('serviceName').value = service.name;
            document.getElementById('serviceSlug').value = service.slug;
            document.getElementById('serviceDescription').value = service.description || '';
            document.getElementById('servicePrice').value = service.price || '';
            document.getElementById('serviceDuration').value = service.duration || '';
            document.getElementById('serviceVisible').checked = service.visible === 1;
            document.getElementById('serviceModalTitle').textContent = 'Edit Service';
            showServiceModal();
        }
    } catch (error) {
        console.error('Error loading service:', error);
    }
}

document.getElementById('serviceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('serviceName').value,
        slug: document.getElementById('serviceSlug').value,
        description: document.getElementById('serviceDescription').value,
        price: document.getElementById('servicePrice').value,
        duration: document.getElementById('serviceDuration').value,
        visible: document.getElementById('serviceVisible').checked ? 1 : 0,
        sortOrder: 0
    };

    const id = document.getElementById('serviceId').value;

    try {
        if (id) {
            await apiRequest(`/admin/services/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
        } else {
            await apiRequest('/admin/services', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
        }

        alert('Service saved successfully');
        closeServiceModal();
        loadServices();
    } catch (error) {
        console.error('Error saving service:', error);
        alert('Failed to save service');
    }
});

async function deleteService(id) {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
        await apiRequest(`/admin/services/${id}`, { method: 'DELETE' });
        alert('Service deleted successfully');
        loadServices();
    } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service');
    }
}

// ===================================
// Testimonials Management
// ===================================

async function loadTestimonials() {
    try {
        const tbody = document.querySelector('#testimonialsTable tbody');
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading testimonials...</td></tr>';

        // Check if Supabase client is initialized
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data: testimonials, error } = await window.supabaseClient
            .from('testimonials')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;

        if (!testimonials || testimonials.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No testimonials found</td></tr>';
            return;
        }

        tbody.innerHTML = testimonials.map(test => `
            <tr>
                <td>${test.id}</td>
                <td>${test.patient_name}</td>
                <td>${test.treatment}</td>
                <td>${'★'.repeat(test.rating)}</td>
                <td>${test.visible ? 'Yes' : 'No'}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editTestimonial(${test.id})">Edit</button>
                    <button class="action-btn btn-delete" onclick="deleteTestimonial(${test.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading testimonials:', error);
        const tbody = document.querySelector('#testimonialsTable tbody');
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state" style="color: red;">Error loading testimonials. Check console.</td></tr>';
    }
}

function showTestimonialModal() {
    document.getElementById('testimonialModal').classList.add('active');
    document.getElementById('testimonialForm').reset();
    document.getElementById('testimonialId').value = '';
    document.getElementById('testimonialModalTitle').textContent = 'Add Testimonial';
}

function closeTestimonialModal() {
    document.getElementById('testimonialModal').classList.remove('active');
}

async function editTestimonial(id) {
    try {
        const response = await apiRequest('/admin/testimonials');
        const testimonials = await response.json();
        const testimonial = testimonials.find(t => t.id === id);

        if (testimonial) {
            document.getElementById('testimonialId').value = testimonial.id;
            document.getElementById('patientName').value = testimonial.patient_name;
            document.getElementById('treatment').value = testimonial.treatment;
            document.getElementById('rating').value = testimonial.rating;
            document.getElementById('testimonialText').value = testimonial.testimonial_text;
            document.getElementById('testimonialVisible').checked = testimonial.visible === 1;
            document.getElementById('testimonialModalTitle').textContent = 'Edit Testimonial';
            showTestimonialModal();
        }
    } catch (error) {
        console.error('Error loading testimonial:', error);
    }
}

document.getElementById('testimonialForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        patientName: document.getElementById('patientName').value,
        treatment: document.getElementById('treatment').value,
        rating: parseInt(document.getElementById('rating').value),
        testimonialText: document.getElementById('testimonialText').value,
        visible: document.getElementById('testimonialVisible').checked ? 1 : 0,
        sortOrder: 0
    };

    const id = document.getElementById('testimonialId').value;

    try {
        if (id) {
            await apiRequest(`/admin/testimonials/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
        } else {
            await apiRequest('/admin/testimonials', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
        }

        alert('Testimonial saved successfully');
        closeTestimonialModal();
        loadTestimonials();
    } catch (error) {
        console.error('Error saving testimonial:', error);
        alert('Failed to save testimonial');
    }
});

async function deleteTestimonial(id) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
        await apiRequest(`/admin/testimonials/${id}`, { method: 'DELETE' });
        alert('Testimonial deleted successfully');
        loadTestimonials();
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        alert('Failed to delete testimonial');
    }
}

// ===================================
// Blog Posts Management
// ===================================

async function loadBlogPosts() {
    try {
        const tbody = document.querySelector('#blogTable tbody');
        tbody.innerHTML = '<tr><td colspan="7" class="loading">Loading blog posts...</td></tr>';

        // Check if Supabase client is initialized
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data: posts, error } = await window.supabaseClient
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!posts || posts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No blog posts found</td></tr>';
            return;
        }

        tbody.innerHTML = posts.map(post => `
            <tr>
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.category || 'N/A'}</td>
                <td>${post.author || 'Dr. Anum'}</td>
                <td><span class="status-badge status-${post.status}">${post.status}</span></td>
                <td>${post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Not published'}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editBlogPost(${post.id})">Edit</button>
                    <button class="action-btn btn-delete" onclick="deleteBlogPost(${post.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading blog posts:', error);
        const tbody = document.querySelector('#blogTable tbody');
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state" style="color: red;">Error loading blog posts. Check console.</td></tr>';
    }
}

function showBlogModal() {
    document.getElementById('blogModal').classList.add('active');
    document.getElementById('blogForm').reset();
    document.getElementById('blogId').value = '';
    document.getElementById('blogModalTitle').innerHTML = '<i class="fas fa-pen"></i> Create Blog Post';

    // Auto-generate slug from title
    document.getElementById('blogTitle').addEventListener('input', (e) => {
        const slug = e.target.value.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        document.getElementById('blogSlug').value = slug;
    });
}

function closeBlogModal() {
    document.getElementById('blogModal').classList.remove('active');
}

async function editBlogPost(id) {
    try {
        const response = await apiRequest('/admin/blog');
        const posts = await response.json();
        const post = posts.find(p => p.id === id);

        if (post) {
            document.getElementById('blogId').value = post.id;
            document.getElementById('blogTitle').value = post.title;
            document.getElementById('blogSlug').value = post.slug;
            document.getElementById('blogCategory').value = post.category || 'Skin Care';
            document.getElementById('blogAuthor').value = post.author || 'Dr. Anum';
            document.getElementById('blogExcerpt').value = post.excerpt || '';
            document.getElementById('blogContent').value = post.content || '';
            document.getElementById('blogFeaturedImage').value = post.featured_image || '';
            document.getElementById('blogTags').value = post.tags || '';
            document.getElementById('blogMetaTitle').value = post.meta_title || '';
            document.getElementById('blogMetaDescription').value = post.meta_description || '';
            document.getElementById('blogStatus').value = post.status || 'draft';

            if (post.published_at) {
                const date = new Date(post.published_at);
                document.getElementById('blogPublishedAt').value = date.toISOString().slice(0, 16);
            }

            document.getElementById('blogModalTitle').innerHTML = '<i class="fas fa-pen"></i> Edit Blog Post';
            document.getElementById('blogModal').classList.add('active');
        }
    } catch (error) {
        console.error('Error loading blog post:', error);
    }
}

document.getElementById('blogForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        title: document.getElementById('blogTitle').value,
        slug: document.getElementById('blogSlug').value,
        category: document.getElementById('blogCategory').value,
        author: document.getElementById('blogAuthor').value,
        excerpt: document.getElementById('blogExcerpt').value,
        content: document.getElementById('blogContent').value,
        featuredImage: document.getElementById('blogFeaturedImage').value,
        tags: document.getElementById('blogTags').value,
        metaTitle: document.getElementById('blogMetaTitle').value,
        metaDescription: document.getElementById('blogMetaDescription').value,
        status: document.getElementById('blogStatus').value,
        publishedAt: document.getElementById('blogPublishedAt').value || null
    };

    const id = document.getElementById('blogId').value;

    try {
        if (id) {
            await apiRequest(`/admin/blog/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
        } else {
            await apiRequest('/admin/blog', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
        }

        alert('Blog post saved successfully');
        closeBlogModal();
        loadBlogPosts();
    } catch (error) {
        console.error('Error saving blog post:', error);
        alert('Failed to save blog post');
    }
});

async function deleteBlogPost(id) {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
        await apiRequest(`/admin/blog/${id}`, { method: 'DELETE' });
        alert('Blog post deleted successfully');
        loadBlogPosts();
    } catch (error) {
        console.error('Error deleting blog post:', error);
        alert('Failed to delete blog post');
    }
}

// ===================================
// Contact Submissions (Supabase)
// ===================================

async function loadContactSubmissions(filter = 'all') {
    try {
        const tbody = document.querySelector('#contactTable tbody');
        tbody.innerHTML = '<tr><td colspan="7" class="loading">Loading contact submissions...</td></tr>';

        // Check if Supabase client is initialized
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        let query = window.supabaseClient
            .from('contact_submissions')
            .select('*')
            .order('created_at', { ascending: false });

        // Apply filter
        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        const { data: submissions, error } = await query;

        if (error) throw error;

        if (!submissions || submissions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No contact submissions found</td></tr>';
            return;
        }

        tbody.innerHTML = submissions.map(sub => `
            <tr>
                <td><strong>#${sub.id}</strong></td>
                <td>${sub.name}</td>
                <td><a href="mailto:${sub.email}" style="color: var(--rose-gold);">${sub.email}</a></td>
                <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${sub.message}">${sub.message.substring(0, 50)}${sub.message.length > 50 ? '...' : ''}</td>
                <td>
                    <select class="status-dropdown status-${sub.status || 'unread'}"
                            onchange="updateContactStatus('${sub.id}', this.value)"
                            style="padding: 0.5rem 1rem; border-radius: 8px; border: 2px solid var(--gray-200); font-weight: 600; cursor: pointer; background: white;">
                        <option value="unread" ${(sub.status === 'unread' || !sub.status) ? 'selected' : ''}>Unread</option>
                        <option value="read" ${sub.status === 'read' ? 'selected' : ''}>Read</option>
                        <option value="replied" ${sub.status === 'replied' ? 'selected' : ''}>Replied</option>
                    </select>
                </td>
                <td>${new Date(sub.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="viewContactMessage('${sub.id}', \`${sub.name}\`, \`${sub.email}\`, \`${sub.phone || 'N/A'}\`, \`${sub.subject || 'No subject'}\`, \`${sub.message.replace(/`/g, '\\`').replace(/\n/g, '\\n')}\`)" title="View full message">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteContactSubmission('${sub.id}')" title="Delete message">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading contact submissions:', error);
        const tbody = document.querySelector('#contactTable tbody');
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state" style="color: red;">Error loading contact submissions. Check console.</td></tr>';
    }
}

// Update contact submission status
async function updateContactStatus(id, status) {
    try {
        const { error } = await window.supabaseClient
            .from('contact_submissions')
            .update({ status: status })
            .eq('id', id);

        if (error) throw error;

        showNotification('Contact status updated successfully', 'success');
        loadContactSubmissions();
    } catch (error) {
        console.error('Error updating contact status:', error);
        showNotification('Failed to update contact status', 'error');
    }
}

// View contact message in modal
function viewContactMessage(id, name, email, phone, subject, message) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2><i class="fas fa-envelope"></i> Contact Message</h2>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div style="padding: 1rem 0;">
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-weight: 600; color: var(--gray-600); font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">From</label>
                    <p style="font-size: 1.125rem; font-weight: 600; color: var(--charcoal);">${name}</p>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-weight: 600; color: var(--gray-600); font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Email</label>
                    <p><a href="mailto:${email}" style="color: var(--rose-gold); text-decoration: none;">${email}</a></p>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-weight: 600; color: var(--gray-600); font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Phone</label>
                    <p><a href="tel:${phone}" style="color: var(--rose-gold); text-decoration: none;">${phone}</a></p>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-weight: 600; color: var(--gray-600); font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Subject</label>
                    <p style="font-weight: 600;">${subject}</p>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-weight: 600; color: var(--gray-600); font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">Message</label>
                    <div style="background: var(--gray-50); padding: 1.5rem; border-radius: 12px; border: 2px solid var(--gray-200); white-space: pre-wrap; line-height: 1.6;">${message}</div>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button class="btn-primary" onclick="window.location.href='mailto:${email}'" style="flex: 1;">
                        <i class="fas fa-reply"></i> Reply via Email
                    </button>
                    <button class="action-btn btn-delete" onclick="this.closest('.modal').remove()" style="flex: 1;">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Mark as read
    updateContactStatus(id, 'read');

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

async function deleteContactSubmission(id) {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;

    try {
        const { error } = await window.supabaseClient
            .from('contact_submissions')
            .delete()
            .eq('id', id);

        if (error) throw error;

        showNotification('Contact submission deleted successfully', 'success');
        loadContactSubmissions();
        loadDashboardData();
    } catch (error) {
        console.error('Error deleting contact submission:', error);
        showNotification('Failed to delete contact submission', 'error');
    }
}

// Notification helper
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.admin-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `admin-notification admin-notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--gradient-success)' : 'var(--gradient-danger)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        min-width: 300px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
if (!document.getElementById('notification-animations')) {
    const style = document.createElement('style');
    style.id = 'notification-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// Doctor Profile
// ===================================

async function loadDoctorProfile() {
    try {
        // Check if Supabase client is initialized
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data: profile, error } = await window.supabaseClient
            .from('doctor_profile')
            .select('*')
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

        if (profile) {
            document.getElementById('doctorName').value = profile.name || '';
            document.getElementById('specialty').value = profile.specialty || '';
            document.getElementById('qualifications').value = profile.qualifications || '';
            document.getElementById('biography').value = profile.biography || '';
            document.getElementById('experienceYears').value = profile.experience_years || '';
            document.getElementById('photoUrl').value = profile.photo_url || '';
            document.getElementById('socialFacebook').value = profile.social_facebook || '';
            document.getElementById('socialInstagram').value = profile.social_instagram || '';
            document.getElementById('socialTiktok').value = profile.social_tiktok || '';
            document.getElementById('socialWhatsapp').value = profile.social_whatsapp || '';
        }
    } catch (error) {
        console.error('Error loading doctor profile:', error);
    }
}

document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('doctorName').value,
        specialty: document.getElementById('specialty').value,
        qualifications: document.getElementById('qualifications').value,
        biography: document.getElementById('biography').value,
        experience_years: parseInt(document.getElementById('experienceYears').value) || 0,
        photo_url: document.getElementById('photoUrl').value,
        social_facebook: document.getElementById('socialFacebook').value,
        social_instagram: document.getElementById('socialInstagram').value,
        social_tiktok: document.getElementById('socialTiktok').value,
        social_whatsapp: document.getElementById('socialWhatsapp').value
    };

    try {
        // Check if profile exists
        const { data: existing, error: fetchError } = await window.supabaseClient
            .from('doctor_profile')
            .select('*')
            .single();

        if (existing) {
            // Update existing profile
            const { error } = await window.supabaseClient
                .from('doctor_profile')
                .update(formData)
                .eq('id', existing.id);

            if (error) throw error;
        } else {
            // Insert new profile
            const { error } = await window.supabaseClient
                .from('doctor_profile')
                .insert([formData]);

            if (error) throw error;
        }

        showNotification('Doctor profile updated successfully', 'success');
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Failed to update profile', 'error');
    }
});

// ===================================
// Settings
// ===================================

async function loadSettings() {
    // Settings loading logic here
    console.log('Settings loaded');
}

document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    alert('Settings saved successfully');
});

// ===================================
// Initialize
// ===================================

// Filter button handlers for appointments
document.addEventListener('DOMContentLoaded', () => {
    // Appointments filter buttons
    const appointmentFilters = document.querySelectorAll('#appointments .filter-btn');
    appointmentFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            appointmentFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Load filtered data
            const filter = btn.dataset.filter;
            loadAppointments(filter);
        });
    });

    // Contact submissions filter buttons
    const contactFilters = document.querySelectorAll('#contact .filter-btn');
    contactFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            contactFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Load filtered data
            const filter = btn.dataset.filter;
            loadContactSubmissions(filter);
        });
    });
});

if (checkAuth()) {
    showDashboard();
} else {
    showLoginScreen();
}