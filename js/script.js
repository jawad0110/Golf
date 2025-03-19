// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Testimonials Data
const testimonials = [
    {
        name: "أحمد محمد",
        comment: "تجربة رائعة في منتجع الجولف الفاخر. الملاعب عالمية المستوى والخدمة ممتازة.",
        rating: 5
    },
    {
        name: "سارة عبدالله",
        comment: "قضيت أجمل عطلة مع عائلتي. المرافق متكاملة والطعام شهي.",
        rating: 5
    },
    {
        name: "خالد العمري",
        comment: "منتجع راقي بكل المقاييس. سأعود قريباً بالتأكيد.",
        rating: 5
    }
];

// Render Testimonials
const testimonialsSlider = document.querySelector('.testimonials-slider');
if (testimonialsSlider) {
    testimonials.forEach(testimonial => {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'testimonial-card';
        testimonialCard.innerHTML = `
            <div class="rating">
                ${'★'.repeat(testimonial.rating)}
            </div>
            <p class="comment">${testimonial.comment}</p>
            <p class="name">- ${testimonial.name}</p>
        `;
        testimonialsSlider.appendChild(testimonialCard);
    });
}

// Scroll Animation
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .package-card, .testimonial-card');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Header Scroll Effect
const header = document.querySelector('.main-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
}); 