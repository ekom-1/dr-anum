// Admin Dashboard - Supabase Data Management
// Handles fetching and displaying contact submissions and bookings

// Fetch and display contact submissions
async function loadContactSubmissions() {
    const container = document.querySelector('#contactSubmissionsContainer');
    if (!container) return;

    try {
        container.innerHTML = '<p>Loading contact submissions...</p>';

        // Check if Supabase client is initialized
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await window.supabaseClient
            .from('contact_submissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No contact submissions yet.</p>';
            return;
        }

        // Create table
        let html = `
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
                    <thead>
                        <tr style="background: var(--color-rose-gold); color: white;">
                            <th style="padding: 1rem; text-align: left;">Date</th>
                            <th style="padding: 1rem; text-align: left;">Name</th>
                            <th style="padding: 1rem; text-align: left;">Email</th>
                            <th style="padding: 1rem; text-align: left;">Phone</th>
                            <th style="padding: 1rem; text-align: left;">Subject</th>
                            <th style="padding: 1rem; text-align: left;">Message</th>
                            <th style="padding: 1rem; text-align: left;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        data.forEach(submission => {
            const date = new Date(submission.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            html += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 1rem;">${date}</td>
                    <td style="padding: 1rem;">${submission.name}</td>
                    <td style="padding: 1rem;"><a href="mailto:${submission.email}">${submission.email}</a></td>
                    <td style="padding: 1rem;">${submission.phone || 'N/A'}</td>
                    <td style="padding: 1rem;">${submission.subject}</td>
                    <td style="padding: 1rem; max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${submission.message}</td>
                    <td style="padding: 1rem;">
                        <button onclick="deleteContactSubmission('${submission.id}')" style="background: #E57373; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Delete</button>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;

    } catch (error) {
        console.error('Error loading contact submissions:', error);
        container.innerHTML = '<p style="color: red;">Error loading contact submissions. Please try again.</p>';
    }
}

// Fetch and display bookings
async function loadBookings() {
    const container = document.querySelector('#bookingsContainer');
    if (!container) return;

    try {
        container.innerHTML = '<p>Loading bookings...</p>';

        const { data, error } = await window.supabaseClient
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = '<p>No bookings yet.</p>';
            return;
        }

        // Create table
        let html = `
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
                    <thead>
                        <tr style="background: var(--color-rose-gold); color: white;">
                            <th style="padding: 1rem; text-align: left;">Date Created</th>
                            <th style="padding: 1rem; text-align: left;">Name</th>
                            <th style="padding: 1rem; text-align: left;">Email</th>
                            <th style="padding: 1rem; text-align: left;">Phone</th>
                            <th style="padding: 1rem; text-align: left;">Service</th>
                            <th style="padding: 1rem; text-align: left;">Appointment Date</th>
                            <th style="padding: 1rem; text-align: left;">Time</th>
                            <th style="padding: 1rem; text-align: left;">Status</th>
                            <th style="padding: 1rem; text-align: left;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        data.forEach(booking => {
            const dateCreated = new Date(booking.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const statusColor = booking.status === 'approved' ? '#4CAF50' :
                               booking.status === 'cancelled' ? '#E57373' : '#FFA726';

            html += `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 1rem;">${dateCreated}</td>
                    <td style="padding: 1rem;">${booking.name}</td>
                    <td style="padding: 1rem;"><a href="mailto:${booking.email}">${booking.email}</a></td>
                    <td style="padding: 1rem;">${booking.phone}</td>
                    <td style="padding: 1rem;">${booking.service}</td>
                    <td style="padding: 1rem;">${booking.date}</td>
                    <td style="padding: 1rem;">${booking.time}</td>
                    <td style="padding: 1rem;">
                        <span style="background: ${statusColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem;">
                            ${booking.status}
                        </span>
                    </td>
                    <td style="padding: 1rem;">
                        <select onchange="updateBookingStatus('${booking.id}', this.value)" style="padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; margin-right: 0.5rem;">
                            <option value="">Change Status</option>
                            <option value="approved">Approve</option>
                            <option value="cancelled">Cancel</option>
                            <option value="pending">Pending</option>
                        </select>
                        <button onclick="deleteBooking('${booking.id}')" style="background: #E57373; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Delete</button>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;

    } catch (error) {
        console.error('Error loading bookings:', error);
        container.innerHTML = '<p style="color: red;">Error loading bookings. Please try again.</p>';
    }
}

// Update booking status
async function updateBookingStatus(bookingId, newStatus) {
    if (!newStatus) return;

    try {
        const { error } = await window.supabaseClient
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', bookingId);

        if (error) throw error;

        showAdminNotification(`Booking status updated to ${newStatus}`, 'success');
        loadBookings(); // Reload the table

    } catch (error) {
        console.error('Error updating booking status:', error);
        showAdminNotification('Error updating booking status', 'error');
    }
}

// Delete contact submission
async function deleteContactSubmission(submissionId) {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;

    try {
        const { error } = await window.supabaseClient
            .from('contact_submissions')
            .delete()
            .eq('id', submissionId);

        if (error) throw error;

        showAdminNotification('Contact submission deleted successfully', 'success');
        loadContactSubmissions(); // Reload the table

    } catch (error) {
        console.error('Error deleting contact submission:', error);
        showAdminNotification('Error deleting contact submission', 'error');
    }
}

// Delete booking
async function deleteBooking(bookingId) {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
        const { error } = await window.supabaseClient
            .from('bookings')
            .delete()
            .eq('id', bookingId);

        if (error) throw error;

        showAdminNotification('Booking deleted successfully', 'success');
        loadBookings(); // Reload the table

    } catch (error) {
        console.error('Error deleting booking:', error);
        showAdminNotification('Error deleting booking', 'error');
    }
}

// Admin notification helper
function showAdminNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.admin-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `admin-notification admin-notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#E57373'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Make functions globally available
window.updateBookingStatus = updateBookingStatus;
window.deleteContactSubmission = deleteContactSubmission;
window.deleteBooking = deleteBooking;
window.loadContactSubmissions = loadContactSubmissions;
window.loadBookings = loadBookings;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load data if on admin page
    if (window.location.pathname.includes('admin')) {
        loadContactSubmissions();
        loadBookings();
    }
});
