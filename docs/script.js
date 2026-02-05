// Constants
const MOBILE_BREAKPOINT = 768;

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initCodeTabs();
    initFaqAccordion();
    initSmoothScroll();
    initNavbarScroll();
    initScrollAnimations();
    logWelcomeMessage();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Close mobile menu when clicking a link
    const navLinkItems = document.querySelectorAll('.nav-links a');
    navLinkItems.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= MOBILE_BREAKPOINT) {
                navLinks.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            }
        });
    });
}

// Code Tabs
function initCodeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const codePanels = document.querySelectorAll('.code-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all buttons and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            codePanels.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// FAQ Accordion
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar background on scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.9)';
        }
    });
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    // Respect user preferences for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards, use case cards, etc.
    const animatedElements = document.querySelectorAll('.feature-card, .use-case-card, .lang-card, .step, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// Console welcome message
function logWelcomeMessage() {
    console.log('%c🧩 CKB Script IPC', 'color: #6366f1; font-size: 24px; font-weight: bold;');
    console.log('%cBuilding block communication for CKB scripts', 'color: #94a3b8; font-size: 14px;');
    console.log('%cGitHub: https://github.com/gpBlockchain/ckb-script-ipc', 'color: #0ea5e9;');
}
