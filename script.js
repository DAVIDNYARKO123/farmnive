// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll - Tesla style
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
}, { passive: true });

// Tesla-style smooth fade-in animations with Intersection Observer
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections for animation
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    fadeInObserver.observe(section);
});

// Counter animation for achievement numbers
function animateCounter(element, target, suffix = '', prefix = '', duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = prefix + target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = prefix + Math.floor(current) + suffix;
        }
    }, 16);
}

// Trigger counter animation when achievement section is visible
const achievementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.achievement-item h3');
            counters.forEach(counter => {
                const text = counter.textContent.trim();

                // Check for $100K format
                if (text.includes('$') && text.includes('K')) {
                    const number = parseInt(text.replace(/\D/g, ''));
                    counter.textContent = '$0K';
                    setTimeout(() => {
                        animateCounter(counter, number, 'K', '$');
                    }, 200);
                }
                // Check for other numbers
                else {
                    const match = text.match(/\d+/);
                    if (match) {
                        const number = parseInt(match[0]);
                        counter.textContent = '0';
                        setTimeout(() => {
                            animateCounter(counter, number);
                            setTimeout(() => {
                                counter.textContent = text;
                            }, 2000);
                        }, 200);
                    }
                }
            });
            achievementObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const achievementSection = document.querySelector('.achievement');
if (achievementSection) {
    achievementObserver.observe(achievementSection);
}

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, { passive: true });

// Subtle parallax effect for hero background - Tesla style
const hero = document.querySelector('.hero');
if (hero) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.5;
                // Only apply parallax on desktop
                if (window.innerWidth > 768) {
                    hero.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Staggered animation for cards
const animateCards = () => {
    const cardSections = {
        '.tech-card': document.querySelectorAll('.tech-card'),
        '.team-card': document.querySelectorAll('.team-card'),
        '.achievement-item': document.querySelectorAll('.achievement-item')
    };

    Object.values(cardSections).forEach(cards => {
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        });
    });

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    Object.values(cardSections).forEach(cards => {
        cards.forEach(card => cardObserver.observe(card));
    });
};

// Initialize card animations
animateCards();

// Lazy loading for better performance
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Smooth performance optimization
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

console.log('FarmNive - Tesla-style design loaded successfully!');
