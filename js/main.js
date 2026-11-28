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
    overlay.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><button class="lightbox-arrow lb-prev" aria-label="Previous">&#8249;</button><button class="lightbox-arrow lb-next" aria-label="Next">&#8250;</button><img>';
    document.body.appendChild(overlay);
    var lbImg = overlay.querySelector('img');
    var lbPrev = overlay.querySelector('.lb-prev');
    var lbNext = overlay.querySelector('.lb-next');
    var images = [];
    var lbIndex = 0;

    var close = function() { overlay.classList.remove('active'); setTimeout(function(){ overlay.style.display='none'; }, 250); };

    function showImage(i) {
        lbIndex = (i + images.length) % images.length;
        lbImg.src = images[lbIndex].src;
        lbImg.alt = images[lbIndex].alt;
    }

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) close();
    });
    overlay.querySelector('.lightbox-close').addEventListener('click', close);
    lbPrev.addEventListener('click', function(e) { e.stopPropagation(); showImage(lbIndex - 1); });
    lbNext.addEventListener('click', function(e) { e.stopPropagation(); showImage(lbIndex + 1); });
    lbImg.addEventListener('click', function(e) { e.stopPropagation(); });

    function collectImages() {
        images = [];
        document.querySelectorAll('.project-slider .slider-slide:not([data-clone]) img, .case-study-section img').forEach(function(img) {
            images.push(img);
        });
    }

    function openLightbox(img) {
        collectImages();
        lbIndex = images.indexOf(img);
        if (lbIndex < 0) lbIndex = 0;
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        var hasMultiple = images.length > 1;
        lbPrev.style.display = hasMultiple ? '' : 'none';
        lbNext.style.display = hasMultiple ? '' : 'none';
        overlay.style.display = 'flex';
        requestAnimationFrame(function(){ overlay.classList.add('active'); });
    }

    document.querySelectorAll('.case-study-section img').forEach(function(img) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function() { openLightbox(this); });
    });

    window._openLightbox = openLightbox;

    document.addEventListener('keydown', function(e) {
        if (overlay.style.display !== 'flex') return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') showImage(lbIndex - 1);
        if (e.key === 'ArrowRight') showImage(lbIndex + 1);
    });
})();

// Project Image Slider
document.querySelectorAll('.project-slider').forEach(function(slider) {
    var track = slider.querySelector('.slider-track');
    var slides = Array.from(slider.querySelectorAll('.slider-slide'));
    var prevBtn = slider.querySelector('.slider-arrow.prev');
    var nextBtn = slider.querySelector('.slider-arrow.next');
    var total = slides.length;
    var current = 0;
    var moving = false;

    var firstClone = slides[0].cloneNode(true);
    var lastClone = slides[total - 1].cloneNode(true);
    firstClone.setAttribute('data-clone', 'true');
    lastClone.setAttribute('data-clone', 'true');
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    slides.forEach(function(slide) {
        var img = slide.querySelector('img');
        if (img) {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function() {
                if (window._openLightbox) window._openLightbox(this);
            });
        }
    });

    var offset = 1;
    track.style.transition = 'none';
    track.style.transform = 'translateX(-' + (offset * 100) + '%)';

    function updateHeight() {
        var allSlides = track.querySelectorAll('.slider-slide');
        var img = allSlides[current + offset].querySelector('img');
        if (img && img.offsetHeight) {
            slider.style.height = img.offsetHeight + 'px';
        }
    }

    function goTo(index) {
        if (moving) return;
        moving = true;
        current = index;
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        track.style.transform = 'translateX(-' + ((current + offset) * 100) + '%)';
        updateHeight();
    }

    track.addEventListener('transitionend', function() {
        if (current >= total) {
            current = 0;
            track.style.transition = 'none';
            track.style.transform = 'translateX(-' + (offset * 100) + '%)';
        } else if (current < 0) {
            current = total - 1;
            track.style.transition = 'none';
            track.style.transform = 'translateX(-' + ((current + offset) * 100) + '%)';
        }
        moving = false;
    });

    prevBtn.addEventListener('click', function() { goTo(current - 1); });
    nextBtn.addEventListener('click', function() { goTo(current + 1); });

    var startX = 0;
    slider.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', function(e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
    });

    var firstImg = slides[0].querySelector('img');
    if (firstImg.complete) { updateHeight(); }
    else { firstImg.addEventListener('load', updateHeight); }
    window.addEventListener('resize', updateHeight);
});

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
