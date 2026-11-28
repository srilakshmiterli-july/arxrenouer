// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Close mobile nav on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
    }
});

// Portfolio Tabs
document.querySelectorAll('.portfolio-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.portfolio-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => { c.classList.remove('active'); c.style.display = ''; });
        tab.classList.add('active');
        const target = document.getElementById('tab-' + tab.dataset.tab);
        target.classList.add('active');
        target.style.display = 'block';
    });
});

// Project Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
            const categories = card.dataset.category || '';
            if (filter === 'all' || categories.includes(filter)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// Scroll Animations
const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.focus-card, .featured-item, .project-card, .value-card, .skill-item, .education-item, .step-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        const status = document.getElementById('formStatus');
        let valid = true;

        [name, email, message].forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#c44';
                valid = false;
            } else {
                field.style.borderColor = '';
            }
        });

        if (email.value && !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            email.style.borderColor = '#c44';
            valid = false;
        }

        if (valid) {
            const btn = contactForm.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Sending...';

            fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    contactForm.reset();
                    status.textContent = 'Thank you! We received your message and will be in touch soon.';
                    status.style.color = '#2C5F2D';
                } else {
                    status.textContent = 'Something went wrong. Please email us at hello@arxrenouer.com.';
                    status.style.color = '#c44';
                }
            }).catch(() => {
                status.textContent = 'Something went wrong. Please email us at hello@arxrenouer.com.';
                status.style.color = '#c44';
            }).finally(() => {
                btn.disabled = false;
                btn.textContent = 'Request a Consultation';
            });
        }
    });
}

// Lightbox
(function() {
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img>';
    document.body.appendChild(overlay);
    var lbImg = overlay.querySelector('img');
    var close = function() { overlay.classList.remove('active'); setTimeout(function(){ overlay.style.display='none'; }, 250); };
    overlay.addEventListener('click', close);
    document.querySelectorAll('.case-study-section img').forEach(function(img) {
        img.addEventListener('click', function() {
            lbImg.src = this.src;
            lbImg.alt = this.alt;
            overlay.style.display = 'flex';
            requestAnimationFrame(function(){ overlay.classList.add('active'); });
        });
    });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') close(); });
})();

// Navbar compact on scroll
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 80) {
            navbar.style.padding = '0.75rem 3rem';
        } else {
            navbar.style.padding = '';
        }
    }, { passive: true });
}
