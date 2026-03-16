// Dr. Anum - Main JavaScript
// Handles all frontend interactions and animations

// ===================================
// Navigation Scroll Effect
// ===================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===================================
// Mobile Menu Toggle
// ===================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Animate hamburger icon
    const spans = mobileMenuToggle.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('active')
        ? 'rotate(45deg) translateY(8px)'
        : 'rotate(0) translateY(0)';
    spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('active')
        ? 'rotate(-45deg) translateY(-8px)'
        : 'rotate(0) translateY(0)';
});

// Close mobile menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'rotate(0) translateY(0)';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'rotate(0) translateY(0)';
    });
});

// ===================================
// Smooth Scroll Navigation
// ===================================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function scrollToBooking() {
    scrollToSection('booking');
}

// Add smooth scroll to all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// ===================================
// Testimonials Carousel
// ===================================
let currentTestimonial = 0;
const testimonialTrack = document.getElementById('testimonialTrack');
const testimonialCards = testimonialTrack ? testimonialTrack.querySelectorAll('.testimonial-card') : [];
const totalTestimonials = testimonialCards.length;

function updateTestimonialPosition() {
    if (testimonialTrack) {
        testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
    }
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    updateTestimonialPosition();
}

function previousTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
    updateTestimonialPosition();
}

// Auto-rotate testimonials every 5 seconds
if (testimonialTrack) {
    setInterval(nextTestimonial, 5000);
}

// ===================================
// FAQ Accordion
// ===================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all FAQ items
        faqItems.forEach(faq => {
            faq.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===================================
// Booking Form Validation & Submission
// ===================================
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            fullName: document.getElementById('fullName')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            email: document.getElementById('email')?.value || '',
            date: document.getElementById('date')?.value || '',
            time: document.getElementById('time')?.value || '',
            service: document.getElementById('service')?.value || '',
            message: document.getElementById('message')?.value || ''
        };

        // Validate date is not in the past
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            alert('Please select a future date for your appointment.');
            return;
        }

        // Show loading state
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Booking...';
        submitBtn.disabled = true;

        try {
            // Send booking request to backend
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Appointment booked successfully! We will contact you shortly to confirm.');
                bookingForm.reset();
            } else {
                throw new Error('Booking failed');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Sorry, there was an error booking your appointment. Please try again or call us directly.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===================================
// Contact Form Submission
// ===================================
const contactForms = document.querySelectorAll('form');

contactForms.forEach(form => {
    if (form.id !== 'bookingForm') {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: form.querySelector('input[type="text"]').value,
                email: form.querySelector('input[type="email"]').value,
                message: form.querySelector('textarea').value
            };

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Message sent successfully! We will get back to you soon.');
                    form.reset();
                } else {
                    throw new Error('Message failed');
                }
            } catch (error) {
                console.error('Contact error:', error);
                alert('Sorry, there was an error sending your message. Please try again or email us directly.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// ===================================
// Scroll Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all service cards and sections
document.querySelectorAll('.service-card, .testimonial-card, .credential-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// Set minimum date for booking
// ===================================
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
}

// ===================================
// Active Navigation Link Highlight
// ===================================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ===================================
// Initialize on page load
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dr. Anum website loaded successfully');

    // Add fade-in animation to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        setTimeout(() => {
            hero.style.transition = 'opacity 1s ease';
            hero.style.opacity = '1';
        }, 100);
    }
});

// ===================================
// Utility Functions
// ===================================

// Format phone number as user types
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);

        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }

        e.target.value = value;
    });
}

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add real-time email validation
const emailInputs = document.querySelectorAll('input[type="email"]');
emailInputs.forEach(input => {
    input.addEventListener('blur', (e) => {
        if (e.target.value && !isValidEmail(e.target.value)) {
            e.target.style.borderColor = 'var(--color-error)';
            alert('Please enter a valid email address');
        } else {
            e.target.style.borderColor = 'var(--color-border)';
        }
    });
});

console.log('All scripts initialized successfully');

// ===================================
// Service Modal System
// ===================================

const serviceData = {
    'Medical Dermatology': {
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        subtitle: 'Comprehensive Medical Skin Care',
        overview: 'Our medical dermatology services provide expert diagnosis and treatment for a wide range of skin conditions. Using evidence-based approaches and the latest medical advances, we help patients achieve healthy, comfortable skin.',
        benefits: [
            'Expert diagnosis of complex skin conditions',
            'Personalized treatment plans',
            'Management of chronic skin diseases',
            'Prevention and early detection of skin cancer',
            'Treatment of infections and inflammatory conditions'
        ],
        expect: 'Your visit begins with a thorough skin examination and medical history review. Dr. Anum will discuss your concerns, provide a diagnosis, and create a customized treatment plan. Follow-up appointments ensure optimal results.',
        duration: 'Initial consultation: 45-60 minutes. Treatment duration varies by condition. Most patients see improvement within 4-8 weeks with consistent care.'
    },
    'Acne & Scar Treatment': {
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        subtitle: 'Clear Skin, Renewed Confidence',
        overview: 'Advanced acne treatment combining medical-grade products, professional procedures, and lifestyle guidance to clear active breakouts and minimize scarring. We address the root causes for long-term results.',
        benefits: [
            'Reduces active acne and prevents new breakouts',
            'Minimizes acne scars and hyperpigmentation',
            'Improves skin texture and tone',
            'Reduces inflammation and redness',
            'Prevents future scarring'
        ],
        expect: 'Treatment may include prescription medications, chemical peels, laser therapy, or microneedling depending on severity. We create a comprehensive skincare routine tailored to your skin type.',
        duration: 'Treatment sessions: 30-60 minutes. Visible improvement typically within 6-12 weeks. Scar reduction requires 3-6 months of consistent treatment.'
    },
    'Anti-Aging & Botox': {
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20v-6M6 20V10M18 20V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        subtitle: 'Restore Your Youthful Radiance',
        overview: 'Non-surgical anti-aging treatments including Botox, dermal fillers, and skin rejuvenation procedures. We use FDA-approved products and advanced techniques to achieve natural-looking results.',
        benefits: [
            'Reduces fine lines and wrinkles',
            'Lifts and contours facial features',
            'Restores volume loss',
            'Prevents new wrinkle formation',
            'Natural, refreshed appearance'
        ],
        expect: 'Consultation includes facial analysis and treatment planning. Botox injections take 10-15 minutes with minimal discomfort. No downtime required. You can return to normal activities immediately.',
        duration: 'Treatment: 15-30 minutes. Results visible in 3-7 days. Botox lasts 3-4 months. Fillers last 6-18 months depending on product used.'
    },
    'Laser Skin Resurfacing': {
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M12 1v6m0 6v6M23 12h-6m-6 0H1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
        subtitle: 'Advanced Laser Technology',
        overview: 'State-of-the-art laser treatments for skin rejuvenation, pigmentation correction, and texture improvement. Our advanced laser systems safely and effectively address multiple skin concerns.',
        benefits: [
            'Reduces sun damage and age spots',
            'Improves skin texture and tone',
            'Minimizes pore size',
            'Stimulates collagen production',
            'Treats vascular lesions and redness'
        ],
        expect: 'Skin is cleansed and numbing cream applied. Laser treatment takes 20-45 minutes. Mild redness and warmth are normal. Protective skincare provided for optimal healing.',
        duration: 'Session: 30-60 minutes. Multiple sessions recommended (3-5 treatments). Results improve progressively. Full results visible in 3-6 months.'
    },
    'Hair Loss Treatment (PRP)': {
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M12 14v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
        subtitle: 'Natural Hair Restoration',
        overview: 'Platelet-Rich Plasma (PRP) therapy uses your body\'s own growth factors to stimulate hair follicles and promote natural hair regrowth. Safe, effective, and minimally invasive.',
        benefits: [
            'Stimulates natural hair growth',
            'Increases hair thickness and density',
            'Reduces hair shedding',
            'Improves scalp health',
            'No surgery or synthetic products'
        ],
        expect: 'Blood is drawn and processed to concentrate platelets. PRP is injected into treatment areas using fine needles. Mild discomfort managed with numbing. No downtime required.',
        duration: 'Treatment: 60-90 minutes. Series of 3-4 sessions spaced 4-6 weeks apart. Initial results in 3-4 months. Optimal results at 6-12 months.'
    },
    'Chemical Peels': {
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" stroke="currentColor" stroke-width="2"/><path d="M12.5 16.5c2.5 0 4.5 -1.5 4.5 -3.5s-2 -3.5 -4.5 -3.5s-4.5 1.5 -4.5 3.5s2 3.5 4.5 3.5z" stroke="currentColor" stroke-width="2"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" stroke="currentColor" stroke-width="2"/></svg>',
        subtitle: 'Professional Skin Renewal',
        overview: 'Medical-grade chemical peels exfoliate damaged outer layers to reveal fresh, healthy skin. Customized formulations address specific concerns from acne to aging.',
        benefits: [
            'Improves skin texture and tone',
            'Reduces fine lines and wrinkles',
            'Treats acne and prevents breakouts',
            'Fades hyperpigmentation and sun damage',
            'Brightens and refreshes complexion'
        ],
        expect: 'Skin is cleansed and peel solution applied. Mild tingling sensation is normal. Peel is neutralized after appropriate time. Post-peel care instructions provided for optimal results.',
        duration: 'Treatment: 30-45 minutes. Peeling occurs 3-7 days post-treatment. Results visible after healing. Series of 3-6 peels recommended for best results.'
    },
    'Skin Whitening & Brightening': {
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/></svg>',
        subtitle: 'Luminous, Even-Toned Skin',
        overview: 'Safe, effective treatments to even skin tone, reduce hyperpigmentation, and enhance natural radiance. We use medical-grade products and advanced techniques for beautiful, glowing skin.',
        benefits: [
            'Evens skin tone and reduces dark spots',
            'Fades melasma and sun damage',
            'Brightens dull complexion',
            'Improves overall skin radiance',
            'Safe for all skin types'
        ],
        expect: 'Comprehensive skin analysis followed by customized treatment plan. May include topical treatments, chemical peels, or laser therapy. Home care regimen provided.',
        duration: 'Treatment sessions: 30-60 minutes. Gradual improvement over 8-12 weeks. Maintenance treatments recommended for lasting results.'
    },
    'Cosmetic Fillers': {
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        subtitle: 'Natural Volume Restoration',
        overview: 'FDA-approved dermal fillers to restore volume, enhance contours, and create natural-looking facial rejuvenation. Expert injection techniques ensure beautiful, balanced results.',
        benefits: [
            'Restores lost facial volume',
            'Enhances lips and cheeks',
            'Smooths deep lines and folds',
            'Improves facial contours',
            'Immediate, natural-looking results'
        ],
        expect: 'Facial assessment and treatment planning. Strategic injections using fine needles. Minimal discomfort with numbing. Immediate results with no downtime.',
        duration: 'Treatment: 30-45 minutes. Results immediate and improve over 2 weeks. Duration: 6-18 months depending on filler type and area treated.'
    },
    'Mole & Lesion Removal': {
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M11 8v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 11h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
        subtitle: 'Safe, Professional Removal',
        overview: 'Expert removal of moles, skin tags, and benign lesions using advanced techniques. All procedures performed with precision to minimize scarring and ensure optimal cosmetic results.',
        benefits: [
            'Safe removal of unwanted lesions',
            'Minimal scarring with expert technique',
            'Pathology testing when needed',
            'Quick, comfortable procedures',
            'Improved appearance and confidence'
        ],
        expect: 'Lesion examination and treatment planning. Local anesthesia for comfort. Removal using appropriate technique (excision, laser, or cryotherapy). Wound care instructions provided.',
        duration: 'Procedure: 15-30 minutes per lesion. Healing: 1-2 weeks. Pathology results (if needed): 7-10 days. Minimal downtime.'
    },
    'Customized Skincare Plans': {
        icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="2"/><path d="M9 12h6m-6 4h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
        subtitle: 'Personalized Skincare Solutions',
        overview: 'Comprehensive skin analysis and customized skincare regimen designed specifically for your skin type, concerns, and goals. Medical-grade products and professional guidance for optimal results.',
        benefits: [
            'Personalized product recommendations',
            'Addresses specific skin concerns',
            'Professional-grade formulations',
            'Ongoing support and adjustments',
            'Maximizes treatment results'
        ],
        expect: 'Detailed skin analysis including type, concerns, and goals. Customized product regimen with usage instructions. Follow-up consultations to assess progress and adjust as needed.',
        duration: 'Initial consultation: 45 minutes. Results visible in 4-8 weeks. Regular follow-ups every 3 months to optimize regimen.'
    }
};

function openServiceModal(serviceName) {
    const modal = document.getElementById('serviceModal');
    const data = serviceData[serviceName];

    if (!data) return;

    // Populate modal content
    document.getElementById('modalIcon').innerHTML = data.icon;
    document.getElementById('modalTitle').textContent = serviceName;
    document.getElementById('modalSubtitle').textContent = data.subtitle;
    document.getElementById('modalOverview').textContent = data.overview;
    document.getElementById('modalExpect').textContent = data.expect;
    document.getElementById('modalDuration').textContent = data.duration;

    // Populate benefits list
    const benefitsList = document.getElementById('modalBenefits');
    benefitsList.innerHTML = '';
    data.benefits.forEach(benefit => {
        const li = document.createElement('li');
        li.textContent = benefit;
        benefitsList.appendChild(li);
    });

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal when clicking overlay
document.querySelector('.modal-overlay')?.addEventListener('click', closeServiceModal);

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeServiceModal();
    }
});

// Add click handlers to all service "Learn More" links
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const title = card.querySelector('h4')?.textContent;
        const learnMoreLink = card.querySelector('.service-link');

        if (learnMoreLink && title && serviceData[title]) {
            learnMoreLink.addEventListener('click', (e) => {
                e.preventDefault();
                openServiceModal(title);
            });
        }
    });
});