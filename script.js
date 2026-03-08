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

// Water ripple effect on hero section
class WaterRipple {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width = canvas.offsetWidth;
        this.height = canvas.height = canvas.offsetHeight;
        this.ripples = [];
        this.maxRipples = 3;

        this.setupCanvas();
        this.animate();
        this.addEventListeners();
    }

    setupCanvas() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
    }

    addEventListeners() {
        let lastX = null;
        let lastY = null;
        let frameId = null;

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Check if mouse has moved enough to create new ripple
            if (lastX === null || lastY === null ||
                Math.abs(x - lastX) > 20 || Math.abs(y - lastY) > 20) {

                if (frameId) {
                    cancelAnimationFrame(frameId);
                }

                frameId = requestAnimationFrame(() => {
                    this.addRipple(x, y, 0.7);
                    lastX = x;
                    lastY = y;
                });
            }
        });

        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.addRipple(x, y, 1.5);
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.width = this.canvas.width = this.canvas.offsetWidth;
            this.height = this.canvas.height = this.canvas.offsetHeight;
        });
    }

    addRipple(x, y, sizeMultiplier = 1) {
        this.ripples.push({
            x,
            y,
            radius: 0,
            maxRadius: 150 * sizeMultiplier,
            speed: 2,
            opacity: 1,
            decay: 0.015
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Update and draw ripples
        this.ripples = this.ripples.filter(ripple => {
            ripple.radius += ripple.speed;
            ripple.opacity -= ripple.decay;

            if (ripple.opacity > 0 && ripple.radius < ripple.maxRadius) {
                this.ctx.beginPath();
                this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity * 0.3})`;
                this.ctx.stroke();

                // Inner ripple for depth
                this.ctx.beginPath();
                this.ctx.arc(ripple.x, ripple.y, ripple.radius * 0.7, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity * 0.15})`;
                this.ctx.stroke();

                return true;
            }
            return false;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize water ripple effect for hero section
if (hero && window.innerWidth > 768) {
    const rippleCanvas = document.createElement('canvas');
    rippleCanvas.className = 'ripple-canvas';
    hero.appendChild(rippleCanvas);
    new WaterRipple(rippleCanvas);
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
