// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
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

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.about-card, .program-card, .event-card, .testimonial-card, .involvement-card');
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Form submission handlers
function submitWorkshopForm(formData) {
    // In a real application, you would send this to your backend
    console.log('Workshop Form Data:', formData);
    
    // For now, we'll show a success message and send an email alert
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Workshop booking request submitted successfully! We will contact you within 24 hours.'
            });
        }, 1000);
    });
}

function submitCommunityForm(formData) {
    console.log('Community Form Data:', formData);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Welcome to the FutureOS community! Check your email for next steps.'
            });
        }, 1000);
    });
}

function submitAmbassadorForm(formData) {
    console.log('Ambassador Form Data:', formData);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Brand Ambassador application submitted! We will review and contact you soon.'
            });
        }, 1000);
    });
}

// Show loading state
function showFormLoading(form) {
    form.classList.add('form-loading');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
}

// Hide loading state
function hideFormLoading(form) {
    form.classList.remove('form-loading');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    // Reset button text based on form type
    if (form.id === 'workshopForm') {
        submitBtn.textContent = 'Submit Request';
    } else if (form.id === 'communityForm') {
        submitBtn.textContent = 'Join Community';
    } else if (form.id === 'ambassadorForm') {
        submitBtn.textContent = 'Submit Application';
    }
}

// Show success/error message
function showMessage(form, message, isSuccess = true) {
    // Remove existing messages
    const existingMessage = form.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = isSuccess ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    // Insert at the beginning of the form
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Legacy functions (kept for backward compatibility)
function bookWorkshop(workshopType) {
    openModal('workshopModal');
}

function applyAmbassador() {
    openModal('ambassadorModal');
}

function registerEvent(eventName) {
    openModal('workshopModal');
}

// Form handling (if forms are added later)
function handleFormSubmit(event) {
    event.preventDefault();
    // Add form submission logic here
    alert('Thank you for your interest! We will get back to you soon.');
}

// Contact form modal (can be enhanced later)
function openContactModal() {
    // Add modal functionality here
    console.log('Contact modal would open here');
}

// Add click handlers for CTA buttons
document.addEventListener('DOMContentLoaded', function() {
    // Book workshop buttons
    document.querySelectorAll('a[href="#contact"]').forEach(button => {
        if (button.textContent.includes('Book') || button.textContent.includes('Workshop')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                openModal('workshopModal');
            });
        }
    });

    // Join community buttons
    document.querySelectorAll('a[href="#contact"], a[href="#get-involved"]').forEach(button => {
        if (button.textContent.includes('Join') && button.textContent.includes('Community')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                openModal('communityModal');
            });
        }
    });

    // Campus ambassador buttons
    document.querySelectorAll('a[href="#get-involved"], a[href="#contact"]').forEach(button => {
        if (button.textContent.includes('Ambassador') || button.textContent.includes('Become')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                openModal('ambassadorModal');
            });
        }
    });

    // Event registration buttons
    document.querySelectorAll('.event-card .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const eventTitle = this.closest('.event-card').querySelector('h3').textContent;
            if (button.textContent.includes('Apply')) {
                openModal('ambassadorModal');
            } else {
                openModal('workshopModal');
            }
        });
    });

    // Close modal when clicking the X button
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            closeModal(modalId);
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });

    // Handle form submissions
    document.getElementById('workshopForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        showFormLoading(this);
        
        try {
            const result = await submitWorkshopForm(data);
            hideFormLoading(this);
            
            if (result.success) {
                showMessage(this, result.message, true);
                this.reset();
                setTimeout(() => closeModal('workshopModal'), 2000);
            } else {
                showMessage(this, result.message, false);
            }
        } catch (error) {
            hideFormLoading(this);
            showMessage(this, 'An error occurred. Please try again.', false);
        }
    });

    document.getElementById('communityForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Handle checkbox values for interests
        const interests = Array.from(this.querySelectorAll('input[name="interests"]:checked'))
            .map(cb => cb.value);
        data.interests = interests;
        
        showFormLoading(this);
        
        try {
            const result = await submitCommunityForm(data);
            hideFormLoading(this);
            
            if (result.success) {
                showMessage(this, result.message, true);
                this.reset();
                setTimeout(() => closeModal('communityModal'), 2000);
            } else {
                showMessage(this, result.message, false);
            }
        } catch (error) {
            hideFormLoading(this);
            showMessage(this, 'An error occurred. Please try again.', false);
        }
    });

    document.getElementById('ambassadorForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        showFormLoading(this);
        
        try {
            const result = await submitAmbassadorForm(data);
            hideFormLoading(this);
            
            if (result.success) {
                showMessage(this, result.message, true);
                this.reset();
                setTimeout(() => closeModal('ambassadorModal'), 2000);
            } else {
                showMessage(this, result.message, false);
            }
        } catch (error) {
            hideFormLoading(this);
            showMessage(this, 'An error occurred. Please try again.', false);
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
});

// Add loading animation for the page
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Parallax effect for hero section (subtle)
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Counter animation for statistics (can be added later)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Typing effect for hero subtitle (optional enhancement)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize any additional features
document.addEventListener('DOMContentLoaded', function() {
    // Add any initialization code here
    console.log('FUTUREOS website loaded successfully!');
    
    // Optional: Add typing effect to hero subtitle
    // const heroSubtitle = document.querySelector('.hero-subtitle');
    // if (heroSubtitle) {
    //     const originalText = heroSubtitle.textContent;
    //     typeWriter(heroSubtitle, originalText, 30);
    // }
});

// Back to top functionality (can be added later)
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.textContent = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #6366f1;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
        } else {
            backToTop.style.opacity = '0';
        }
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', createBackToTopButton);

// Add ripple effect to buttons (optional enhancement)
function addRippleEffect() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add CSS for ripple animation
const rippleCSS = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize ripple effect
document.addEventListener('DOMContentLoaded', addRippleEffect);
