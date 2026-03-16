// Supabase Form Handler
// Handles contact form and booking form submissions

// Contact Form Handler
async function handleContactForm(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    // Get form data
    const formData = {
        name: form.querySelector('#contactName').value,
        email: form.querySelector('#contactEmail').value,
        phone: form.querySelector('#contactPhone').value,
        subject: form.querySelector('#contactSubject').value,
        message: form.querySelector('#contactMessage').value,
        created_at: new Date().toISOString()
    };

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
        // Insert data into Supabase
        const { data, error } = await window.supabaseClient
            .from('contact_submissions')
            .insert([formData]);

        if (error) throw error;

        // Success message
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        form.reset();

    } catch (error) {
        console.error('Error submitting contact form:', error);
        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

// Booking Form Handler
async function handleBookingForm(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    // Get form data
    const formData = {
        name: form.querySelector('#bookingName').value,
        email: form.querySelector('#bookingEmail').value,
        phone: form.querySelector('#bookingPhone').value,
        service: form.querySelector('#bookingService').value,
        date: form.querySelector('#bookingDate').value,
        time: form.querySelector('#bookingTime').value,
        message: form.querySelector('#bookingMessage')?.value || '',
        status: 'pending',
        created_at: new Date().toISOString()
    };

    console.log('Booking form data:', formData);

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Booking...';

    try {
        // Insert data into Supabase
        const { data, error } = await window.supabaseClient
            .from('bookings')
            .insert([formData])
            .select();

        console.log('Supabase response:', { data, error });

        if (error) {
            console.error('Supabase error details:', error);
            throw error;
        }

        // Success message
        showNotification('Appointment booked successfully! We will contact you soon to confirm.', 'success');
        form.reset();

    } catch (error) {
        console.error('Error submitting booking form:', error);
        showNotification(`Error: ${error.message || 'Sorry, there was an error booking your appointment. Please try again.'}`, 'error');
    } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

// Notification Helper
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#E57373'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
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

// Initialize form handlers when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Contact form
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Booking form
    const bookingForm = document.querySelector('#bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingForm);
    }
});
