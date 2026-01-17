/* ============================================
   Ankersten Consult AS - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initContactForm();
    initAnimations();
});

/* ============================================
   Mobile Menu
   ============================================ */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        // Update ARIA
        const isExpanded = this.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ============================================
   Header Scroll Effect
   ============================================ */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* ============================================
   Smooth Scroll for Anchor Links
   ============================================ */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update URL without jumping
            history.pushState(null, null, href);
        });
    });
}

/* ============================================
   Contact Form Handler
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const successMessage = document.getElementById('form-success');
    const errorMessage = document.getElementById('form-error');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Hide any previous messages
        if (successMessage) successMessage.classList.remove('show');
        if (errorMessage) errorMessage.classList.remove('show');

        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            inquiryType: formData.get('inquiryType'),
            description: formData.get('description'),
            source: formData.get('source')
        };

        // Basic validation
        if (!data.name || !data.email || !data.phone || !data.description) {
            showError('Vennligst fyll ut alle obligatoriske felt.');
            return;
        }

        // Email validation
        if (!isValidEmail(data.email)) {
            showError('Vennligst oppgi en gyldig e-postadresse.');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sender...</span>';
        submitBtn.disabled = true;

        try {
            // Send form data via Resend API
            // Note: In production, this should go through a backend endpoint
            // For demo purposes, we'll simulate a successful submission

            // Simulated API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In production, use:
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            //
            // if (!response.ok) throw new Error('Server error');

            // Success
            showSuccess();
            form.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            showError('Beklager, noe gikk galt. Vennligst prøv igjen eller kontakt oss direkte.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    function showSuccess() {
        if (successMessage) {
            successMessage.classList.add('show');
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.add('show');
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

/* ============================================
   Scroll Animations
   ============================================ */
function initAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) return;

    const animatedElements = document.querySelectorAll('.service-category, .benefit-card, .value-card, .cabin-service-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/* ============================================
   Utility Functions
   ============================================ */

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for frequent events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================
   Click to Call (Mobile)
   ============================================ */
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
        // Track phone clicks if analytics is available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'Contact',
                'event_label': 'Phone Click'
            });
        }
    });
});

/* ============================================
   Form Input Enhancements
   ============================================ */
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    // Add floating label effect
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });

    // Check for autofilled values
    if (input.value) {
        input.parentElement.classList.add('focused');
    }
});
