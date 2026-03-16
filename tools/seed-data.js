// Seed Database with Placeholder Content
// Run this to populate the database with sample data

const {
    initializeDatabase,
    Services,
    Testimonials,
    BlogPosts,
    DoctorProfile,
    SiteSettings
} = require('../backend/models/database');

// Initialize database first
initializeDatabase();

// Sample Services
const sampleServices = [
    {
        name: 'Acne Treatment',
        slug: 'acne-treatment',
        description: 'Comprehensive acne treatment using advanced medical techniques and personalized care plans.',
        icon: '💊',
        imageUrl: '/images/services/acne.jpg',
        price: '$150 - $300',
        duration: '45 minutes',
        visible: 1,
        sortOrder: 1
    },
    {
        name: 'Anti-Aging Treatments',
        slug: 'anti-aging',
        description: 'Advanced anti-aging solutions including Botox, fillers, and skin rejuvenation treatments.',
        icon: '✨',
        imageUrl: '/images/services/anti-aging.jpg',
        price: '$200 - $500',
        duration: '60 minutes',
        visible: 1,
        sortOrder: 2
    },
    {
        name: 'Chemical Peels',
        slug: 'chemical-peels',
        description: 'Professional chemical peels to improve skin texture, tone, and overall appearance.',
        icon: '🧪',
        imageUrl: '/images/services/peels.jpg',
        price: '$180 - $350',
        duration: '30 minutes',
        visible: 1,
        sortOrder: 3
    },
    {
        name: 'Laser Hair Removal',
        slug: 'laser-hair-removal',
        description: 'Safe and effective laser hair removal for all skin types with long-lasting results.',
        icon: '⚡',
        imageUrl: '/images/services/laser.jpg',
        price: '$100 - $400',
        duration: '30-90 minutes',
        visible: 1,
        sortOrder: 4
    },
    {
        name: 'Skin Cancer Screening',
        slug: 'skin-cancer-screening',
        description: 'Comprehensive skin cancer screening and early detection services.',
        icon: '🔬',
        imageUrl: '/images/services/screening.jpg',
        price: '$120',
        duration: '30 minutes',
        visible: 1,
        sortOrder: 5
    },
    {
        name: 'Microneedling',
        slug: 'microneedling',
        description: 'Collagen induction therapy to improve skin texture, scars, and fine lines.',
        icon: '💉',
        imageUrl: '/images/services/microneedling.jpg',
        price: '$250 - $400',
        duration: '60 minutes',
        visible: 1,
        sortOrder: 6
    }
];

// Sample Testimonials
const sampleTestimonials = [
    {
        patientName: 'Sarah Johnson',
        treatment: 'Acne Treatment',
        rating: 5,
        testimonialText: 'Dr. Anum completely transformed my skin! After years of struggling with acne, her personalized treatment plan gave me the clear skin I always dreamed of.',
        visible: 1,
        sortOrder: 1
    },
    {
        patientName: 'Emily Rodriguez',
        treatment: 'Anti-Aging Treatment',
        rating: 5,
        testimonialText: 'The results are amazing! Dr. Anum is incredibly skilled and made me feel comfortable throughout the entire process. I look 10 years younger!',
        visible: 1,
        sortOrder: 2
    },
    {
        patientName: 'Michael Chen',
        treatment: 'Laser Hair Removal',
        rating: 5,
        testimonialText: 'Professional, efficient, and effective. The laser hair removal treatment exceeded my expectations. Highly recommend Dr. Anum!',
        visible: 1,
        sortOrder: 3
    },
    {
        patientName: 'Jessica Williams',
        treatment: 'Chemical Peel',
        rating: 5,
        testimonialText: 'My skin has never looked better! The chemical peel was gentle yet effective. Dr. Anum explained everything clearly and the results are fantastic.',
        visible: 1,
        sortOrder: 4
    }
];

// Sample Blog Posts
const sampleBlogPosts = [
    {
        title: '10 Essential Skincare Tips for Healthy, Glowing Skin',
        slug: '10-skincare-tips-healthy-glowing-skin',
        content: `Achieving healthy, glowing skin doesn't have to be complicated. Here are 10 essential tips that will transform your skincare routine:

1. **Cleanse Twice Daily**: Morning and night cleansing removes dirt, oil, and impurities.

2. **Use Sunscreen Every Day**: SPF 30+ protects against UV damage and premature aging.

3. **Stay Hydrated**: Drink at least 8 glasses of water daily for plump, healthy skin.

4. **Moisturize Regularly**: Lock in hydration with a quality moisturizer suited to your skin type.

5. **Exfoliate Weekly**: Remove dead skin cells to reveal brighter, smoother skin.

6. **Get Enough Sleep**: 7-9 hours of sleep allows skin to repair and regenerate.

7. **Eat a Balanced Diet**: Fruits, vegetables, and omega-3s nourish skin from within.

8. **Manage Stress**: High stress levels can trigger breakouts and skin issues.

9. **Avoid Touching Your Face**: Reduces bacteria transfer and prevents breakouts.

10. **See a Dermatologist**: Professional guidance ensures optimal skin health.

Follow these tips consistently for the best results!`,
        excerpt: 'Discover the top 10 skincare tips that will help you achieve healthy, radiant skin naturally.',
        featuredImage: '/images/blog/skincare-tips.jpg',
        category: 'Skin Care',
        tags: 'skincare, beauty, health tips, glowing skin',
        author: 'Dr. Anum',
        status: 'published',
        metaTitle: '10 Essential Skincare Tips for Healthy Skin | Dr. Anum',
        metaDescription: 'Learn the top 10 skincare tips from dermatologist Dr. Anum for achieving healthy, glowing skin naturally.',
        publishedAt: new Date().toISOString()
    },
    {
        title: 'Understanding Acne: Causes, Treatments, and Prevention',
        slug: 'understanding-acne-causes-treatments-prevention',
        content: `Acne is one of the most common skin conditions, affecting millions of people worldwide. Understanding its causes and treatments is the first step to clear skin.

## What Causes Acne?

Acne develops when hair follicles become clogged with oil and dead skin cells. Several factors contribute:

- **Hormonal Changes**: Puberty, menstruation, and pregnancy can trigger acne
- **Excess Oil Production**: Overactive sebaceous glands
- **Bacteria**: P. acnes bacteria can cause inflammation
- **Diet**: High-glycemic foods and dairy may worsen acne
- **Stress**: Increases cortisol, which can trigger breakouts

## Treatment Options

### Over-the-Counter Treatments
- Benzoyl peroxide
- Salicylic acid
- Retinoids

### Professional Treatments
- Prescription medications
- Chemical peels
- Laser therapy
- Extraction procedures

## Prevention Tips

1. Cleanse gently twice daily
2. Use non-comedogenic products
3. Avoid touching your face
4. Change pillowcases regularly
5. Manage stress levels

If you're struggling with acne, consult a dermatologist for personalized treatment.`,
        excerpt: 'A comprehensive guide to understanding acne, its causes, effective treatments, and prevention strategies.',
        featuredImage: '/images/blog/acne-guide.jpg',
        category: 'Treatments',
        tags: 'acne, skincare, dermatology, treatment',
        author: 'Dr. Anum',
        status: 'published',
        metaTitle: 'Understanding Acne: Complete Guide | Dr. Anum',
        metaDescription: 'Learn about acne causes, professional treatments, and prevention tips from board-certified dermatologist Dr. Anum.',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        title: 'The Benefits of Chemical Peels for Skin Rejuvenation',
        slug: 'benefits-chemical-peels-skin-rejuvenation',
        content: `Chemical peels are one of the most effective treatments for skin rejuvenation. Here's everything you need to know about this popular procedure.

## What Are Chemical Peels?

Chemical peels use specialized solutions to remove damaged outer layers of skin, revealing fresher, healthier skin underneath.

## Types of Chemical Peels

### Superficial Peels
- Mild acids (AHA, BHA)
- Minimal downtime
- Treats fine lines and uneven tone

### Medium Peels
- TCA (trichloroacetic acid)
- Moderate downtime
- Treats wrinkles, acne scars, pigmentation

### Deep Peels
- Phenol
- Significant downtime
- Dramatic results for severe damage

## Benefits

1. **Reduces Fine Lines**: Smooths wrinkles and crow's feet
2. **Improves Texture**: Creates smoother, softer skin
3. **Fades Hyperpigmentation**: Evens out skin tone
4. **Treats Acne Scars**: Minimizes scarring
5. **Boosts Collagen**: Stimulates natural production

## What to Expect

- Consultation to determine the right peel
- Preparation with skincare products
- The procedure (15-60 minutes)
- Recovery period (varies by peel type)
- Visible results within days to weeks

Chemical peels are safe when performed by a qualified dermatologist. Schedule a consultation to see if they're right for you!`,
        excerpt: 'Discover how chemical peels can rejuvenate your skin, reduce signs of aging, and improve overall skin texture.',
        featuredImage: '/images/blog/chemical-peels.jpg',
        category: 'Treatments',
        tags: 'chemical peels, skin rejuvenation, anti-aging, dermatology',
        author: 'Dr. Anum',
        status: 'published',
        metaTitle: 'Chemical Peels Benefits & Guide | Dr. Anum',
        metaDescription: 'Learn about the benefits of chemical peels for skin rejuvenation from expert dermatologist Dr. Anum.',
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    }
];

// Doctor Profile
const doctorProfile = {
    name: 'Dr. Anum',
    specialty: 'Board-Certified Dermatologist',
    qualifications: 'MD, FAAD, Board Certified in Dermatology',
    biography: 'Dr. Anum is a board-certified dermatologist with over 10 years of experience in medical and cosmetic dermatology. She is passionate about helping patients achieve healthy, beautiful skin through personalized treatment plans and the latest dermatological advances.',
    photoUrl: '/images/doctor/dr-anum.jpg',
    certifications: 'American Board of Dermatology, American Academy of Dermatology',
    experienceYears: 10,
    socialFacebook: 'https://facebook.com/dranum',
    socialInstagram: 'https://instagram.com/dranum',
    socialTiktok: 'https://tiktok.com/@dranum',
    socialWhatsapp: '+15551234567'
};

// Seed the database
console.log('Seeding database with sample data...\n');

// Add Services
console.log('Adding services...');
sampleServices.forEach((service, index) => {
    Services.create(service, (err) => {
        if (err) console.error(`Error adding service ${index + 1}:`, err.message);
        else console.log(`✓ Added service: ${service.name}`);
    });
});

// Add Testimonials
setTimeout(() => {
    console.log('\nAdding testimonials...');
    sampleTestimonials.forEach((testimonial, index) => {
        Testimonials.create(testimonial, (err) => {
            if (err) console.error(`Error adding testimonial ${index + 1}:`, err.message);
            else console.log(`✓ Added testimonial from: ${testimonial.patientName}`);
        });
    });
}, 500);

// Add Blog Posts
setTimeout(() => {
    console.log('\nAdding blog posts...');
    sampleBlogPosts.forEach((post, index) => {
        BlogPosts.create(post, (err) => {
            if (err) console.error(`Error adding blog post ${index + 1}:`, err.message);
            else console.log(`✓ Added blog post: ${post.title}`);
        });
    });
}, 1000);

// Add Doctor Profile
setTimeout(() => {
    console.log('\nAdding doctor profile...');
    DoctorProfile.update(doctorProfile, (err) => {
        if (err) console.error('Error adding doctor profile:', err.message);
        else console.log('✓ Added doctor profile');
    });
}, 1500);

// Add Site Settings
setTimeout(() => {
    console.log('\nAdding site settings...');
    const settings = [
        { key: 'site_name', value: 'Dr. Anum - Premium Dermatology' },
        { key: 'site_description', value: 'Professional dermatology services with personalized care' },
        { key: 'primary_color', value: '#D4A574' },
        { key: 'accent_color', value: '#C9A882' }
    ];

    settings.forEach(setting => {
        SiteSettings.set(setting.key, setting.value, (err) => {
            if (err) console.error(`Error adding setting ${setting.key}:`, err.message);
            else console.log(`✓ Added setting: ${setting.key}`);
        });
    });

    setTimeout(() => {
        console.log('\n✅ Database seeding completed!');
        console.log('\nYou can now:');
        console.log('1. Start the server: npm start');
        console.log('2. Login to admin panel: http://localhost:3000/admin');
        console.log('3. Credentials: admin / admin123\n');
        process.exit(0);
    }, 500);
}, 2000);
