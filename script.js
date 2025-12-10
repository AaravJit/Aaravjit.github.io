// Scroll-triggered animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all scroll-fade elements
document.querySelectorAll('.scroll-fade').forEach(el => {
    observer.observe(el);
});

// Stagger animation for skill groups
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 150);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-stagger').forEach(el => {
    skillObserver.observe(el);
});

// Smooth scroll behavior
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

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.getElementById('hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - scrolled / 500;
    }
});

// Add hover effects to cards
document.querySelectorAll('.about-card, .education-card, .contact-card, .project-card, .hobby-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.4s ease';
    });
});

// Animate numbers/counters (if needed in future)
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Add entrance animation delay to timeline items
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`;
});

// Enhanced hover effects
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(10px)';
        this.style.boxShadow = '0 5px 15px rgba(255, 69, 0, 0.3)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
        this.style.boxShadow = 'none';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Resume dropdown functionality
function toggleResume() {
    const viewer = document.getElementById('resumeViewer');
    const arrow = document.querySelector('.dropdown-arrow');
    const isHidden = viewer.style.display === 'none';
    
    if (isHidden) {
        viewer.style.display = 'block';
        arrow.textContent = '▼';
        arrow.style.transform = 'rotate(0deg)';
    } else {
        viewer.style.display = 'none';
        arrow.textContent = '▶';
        arrow.style.transform = 'rotate(0deg)';
    }
}

// Initialize resume as collapsed
document.addEventListener('DOMContentLoaded', () => {
    const viewer = document.getElementById('resumeViewer');
    if (viewer) {
        viewer.style.display = 'none';
    }
});
