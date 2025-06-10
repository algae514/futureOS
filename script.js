// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  const header = document.querySelector('header');
  if (header) {
    header.style.background = window.scrollY > 100
      ? 'rgba(255, 255, 255, 0.98)'
      : 'rgba(255, 255, 255, 0.95)';
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// Intersection Observer for animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
  const animateElements = document.querySelectorAll('.about-card, .program-card, .event-card, .testimonial-card, .involvement-card');
  animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
});

// Back to top button
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
    backToTop.style.opacity = window.pageYOffset > 300 ? '1' : '0';
  });
}
document.addEventListener('DOMContentLoaded', createBackToTopButton);

// Ripple effect
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
      setTimeout(() => ripple.remove(), 600);
    });
  });
}
const rippleCSS = `
  @keyframes ripple { to { transform: scale(4); opacity: 0; } }
`;
const rippleStyle = document.createElement('style');
rippleStyle.textContent = rippleCSS;
document.head.appendChild(rippleStyle);
document.addEventListener('DOMContentLoaded', addRippleEffect);

// Registration form submission
const scriptURL = 'https://script.google.com/macros/s/AKfycbwdNG_LvacS9-V0Swg1ZiPBbssKG7w4hiO5IlTfdS7Sxhaao-qwzFKbvL-GgpmmBXv1OA/exec';
document.addEventListener('DOMContentLoaded', function() {
  const registrationForm = document.getElementById('registrationForm');
  if (registrationForm) {
    registrationForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const submitBtn = this.querySelector('.btn-register');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
      this.classList.add('form-loading');

      const existingMessages = this.querySelectorAll('.success-message, .error-message');
      existingMessages.forEach(msg => msg.remove());

      try {
        const formData = new FormData(this);
        formData.append('timestamp', new Date().toISOString());
        await fetch(scriptURL, { method: 'POST', body: formData, mode: 'no-cors' });
        showMessage(this, '✅ Registration successful! We will contact you soon.', true);
        this.reset();
        this.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (error) {
        console.error('Error:', error);
        showMessage(this, '✅ Registration submitted! We will contact you soon.', true);
        this.reset();
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        this.classList.remove('form-loading');
      }
    });

    // Real-time form validation
    const formInputs = registrationForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
      input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
          this.style.borderColor = '#ef4444';
        } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
          this.style.borderColor = '#ef4444';
        } else if (this.type === 'tel' && this.value && !isValidPhone(this.value)) {
          this.style.borderColor = '#ef4444';
        } else {
          this.style.borderColor = '#10b981';
        }
      });
      input.addEventListener('focus', function() {
        this.style.borderColor = '#667eea';
      });
    });
  }
});

// Show form success/error message
function showMessage(form, message, isSuccess = true) {
  const messageDiv = document.createElement('div');
  messageDiv.className = isSuccess ? 'success-message' : 'error-message';
  messageDiv.textContent = message;
  const formHeader = form.querySelector('.form-header');
  formHeader.insertAdjacentElement('afterend', messageDiv);
  setTimeout(() => { if (messageDiv.parentNode) { messageDiv.remove(); } }, 8000);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Expert section scroll functionality
function scrollExperts(direction) {
  const expertsGrid = document.querySelector('.experts-grid');
  if (!expertsGrid) return;
  
  const scrollAmount = 300;
  const currentScroll = expertsGrid.scrollLeft;
  
  if (direction === 'left') {
    expertsGrid.scrollTo({
      left: currentScroll - scrollAmount,
      behavior: 'smooth'
    });
  } else {
    expertsGrid.scrollTo({
      left: currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  }
}

// Make scrollExperts function globally available
window.scrollExperts = scrollExperts;

// Final page load indicator
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
  console.log('FUTUREOS website loaded successfully!');
});