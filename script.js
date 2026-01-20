// AquaSave - Water Conservation Education Platform
// Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initCalculator();
    initTips();
    initChecklist();
    initScrollEffects();
    initContactForm();
});

// ==========================================
// Navigation
// ==========================================
function initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// Water Usage Calculator
// ==========================================
function initCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    
    calculateBtn.addEventListener('click', calculateWaterUsage);

    // Also calculate on input change for real-time feedback
    const inputs = document.querySelectorAll('.calculator-form input');
    inputs.forEach(input => {
        input.addEventListener('change', calculateWaterUsage);
    });
}

function calculateWaterUsage() {
    // Get input values
    const household = parseInt(document.getElementById('household').value) || 1;
    const showers = parseFloat(document.getElementById('showers').value) || 0;
    const showerDuration = parseFloat(document.getElementById('showerDuration').value) || 8;
    const baths = parseFloat(document.getElementById('baths').value) || 0;
    const flushes = parseFloat(document.getElementById('flushes').value) || 0;
    const toiletType = document.getElementById('toiletType').value;
    const brushing = parseFloat(document.getElementById('brushing').value) || 0;
    const dishwasher = parseFloat(document.getElementById('dishwasher').value) || 0;
    const handwashDishes = parseFloat(document.getElementById('handwashDishes').value) || 0;
    const laundry = parseFloat(document.getElementById('laundry').value) || 0;
    const machineType = document.getElementById('machineType').value;
    const watering = parseFloat(document.getElementById('watering').value) || 0;

    // Water usage rates (in litres)
    const showerLitresPerMin = 9; // modern showerhead
    const bathLitres = 135;
    const flushLitres = toiletType === 'modern' ? 6 : (toiletType === 'dual' ? 4 : 13);
    const brushingLitres = 7.5;
    const dishwasherLitres = 22;
    const handwashLitresPerMin = 9;
    const laundryLitres = machineType === 'front' ? 60 : (machineType === 'top' ? 120 : 80);
    const wateringLitres = 15; // hose, per min

    // Calculate daily usage (per household)
    const dailyShowers = household * showers * showerDuration * showerLitresPerMin;
    const dailyBaths = household * (baths / 7) * bathLitres;
    const dailyFlushes = household * flushes * flushLitres;
    const dailyBrushing = household * brushing * brushingLitres;
    const dailyDishwasher = (dishwasher / 7) * dishwasherLitres;
    const dailyHandwashDishes = handwashDishes * handwashLitresPerMin;
    const dailyLaundry = (laundry / 7) * laundryLitres;
    const dailyWatering = (watering / 7) * wateringLitres;

    const dailyTotal = dailyShowers + dailyBaths + dailyFlushes + 
                       dailyBrushing + dailyDishwasher + dailyHandwashDishes + dailyLaundry + dailyWatering;
    const monthlyTotal = dailyTotal * 30;
    const yearlyTotal = dailyTotal * 365;

    // Update display with animation
    animateNumber('dailyUsage', dailyTotal);
    animateNumber('monthlyUsage', monthlyTotal);
    animateNumber('yearlyUsage', yearlyTotal);

    // Generate personalized comparison/feedback
    generateComparison(dailyTotal, {
        showers: dailyShowers,
        baths: dailyBaths,
        flushes: dailyFlushes,
        brushing: dailyBrushing,
        dishwasher: dailyDishwasher,
        handwashDishes: dailyHandwashDishes,
        laundry: dailyLaundry,
        watering: dailyWatering
    });
}

function animateNumber(elementId, targetValue) {
    const element = document.getElementById(elementId);
    const startValue = 0;
    const duration = 1000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeOutQuart(progress);
        const currentValue = Math.round(startValue + (targetValue - startValue) * easeProgress);
        
        element.textContent = currentValue.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

function generateComparison(dailyTotal, breakdown) {
    const comparisonDiv = document.getElementById('comparison');
    const avgUsage = 135; // Average daily water usage in litres (India/Global)
    
    let message = '';
    let className = '';

    if (dailyTotal < avgUsage * 0.7) {
        className = 'good';
        message = `<strong>🌟 Excellent!</strong> You use ${Math.round(dailyTotal)} litres daily, which is ${Math.round((1 - dailyTotal/avgUsage) * 100)}% below the average of ${avgUsage} litres. Keep up the great work!`;
    } else if (dailyTotal < avgUsage) {
        className = 'good';
        message = `<strong>👍 Good job!</strong> At ${Math.round(dailyTotal)} litres daily, you're using ${Math.round((1 - dailyTotal/avgUsage) * 100)}% less water than average.`;
    } else if (dailyTotal < avgUsage * 1.3) {
        className = 'warning';
        message = `<strong>📊 About Average:</strong> You use ${Math.round(dailyTotal)} litres daily, which is close to the average of ${avgUsage} litres. Check out our tips to reduce your usage!`;
    } else {
        className = 'warning';
        message = `<strong>⚠️ Room for Improvement:</strong> At ${Math.round(dailyTotal)} litres daily, you're using ${Math.round((dailyTotal/avgUsage - 1) * 100)}% more than average. Small changes can make a big difference!`;
    }

    // Add specific tips based on highest usage
    const maxCategory = Object.entries(breakdown).reduce((a, b) => a[1] > b[1] ? a : b);
    const tips = {
        showers: 'Try reducing shower time by 2 minutes or installing a low-flow showerhead.',
        baths: 'Consider switching some baths to quick showers to save water.',
        flushes: 'Check for toilet leaks and consider a dual-flush toilet.',
        brushing: 'Turn off the tap while brushing teeth to save up to 15 litres per day.',
        dishwasher: 'Make sure to only run full loads in your dishwasher.',
        laundry: 'Wait for full loads and consider a high-efficiency washer.',
        watering: 'Water early morning and use mulch to reduce garden water needs.'
    };

    if (breakdown[maxCategory[0]] > 0) {
        message += `<br><br><strong>💡 Tip:</strong> Your highest usage is from <em>${maxCategory[0]}</em>. ${tips[maxCategory[0]]}`;
    }

    comparisonDiv.innerHTML = `<p>${message}</p>`;
    comparisonDiv.className = `result-comparison ${className}`;
}

// ==========================================
// Conservation Tips Tabs
// ==========================================
function initTips() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tipPanels = document.querySelectorAll('.tip-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tipPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// ==========================================
// Conservation Checklist
// ==========================================
function initChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    
    // Load saved state from localStorage
    loadChecklistState();

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateProgress();
            saveChecklistState();
        });
    });

    // Initial progress update
    updateProgress();
}

function updateProgress() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const progressCircle = document.getElementById('progressCircle');
    const progressPercent = document.getElementById('progressPercent');
    const potentialSavings = document.getElementById('potentialSavings');

    let checkedCount = 0;
    let totalSavings = 0;

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkedCount++;
            const savings = parseInt(checkbox.closest('.checklist-item').getAttribute('data-savings')) || 0;
            totalSavings += savings;
        }
    });

    const totalItems = checkboxes.length;
    const percentage = Math.round((checkedCount / totalItems) * 100);

    // Update progress circle
    const circumference = 2 * Math.PI * 65; // r = 65
    const offset = circumference - (percentage / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;

    // Update percentage text with animation
    animateNumber('progressPercent', percentage);

    // Update potential savings
    potentialSavings.textContent = totalSavings.toLocaleString() + ' litres';
}

function saveChecklistState() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const state = {};
    
    checkboxes.forEach(checkbox => {
        state[checkbox.id] = checkbox.checked;
    });

    localStorage.setItem('aquasave-checklist', JSON.stringify(state));
}

function loadChecklistState() {
    const savedState = localStorage.getItem('aquasave-checklist');
    
    if (savedState) {
        const state = JSON.parse(savedState);
        
        Object.keys(state).forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = state[id];
            }
        });
    }
}

// ==========================================
// Scroll Effects
// ==========================================
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.fact-card, .tip-item, .resource-card, .checklist-item');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .fact-card.visible, .tip-item.visible, .resource-card.visible, .checklist-item.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// Contact Form
// ==========================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const messageInput = document.getElementById('contactMessage');
    const charCount = document.getElementById('charCount');

    if (!contactForm) return;

    // Character counter for message
    if (messageInput && charCount) {
        messageInput.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }

    // Real-time field validation
    const fields = {
        contactName: { validator: (val) => val.trim().length >= 2, errorMsg: 'Name must be at least 2 characters' },
        contactEmail: { validator: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), errorMsg: 'Please enter a valid email' },
        contactPhone: { validator: (val) => !val || /^[\d\s\-\+\(\)]+$/.test(val), errorMsg: 'Please enter a valid phone number' },
        contactSubject: { validator: (val) => val !== '', errorMsg: 'Please select a subject' },
        contactMessage: { validator: (val) => val.trim().length >= 10, errorMsg: 'Message must be at least 10 characters' }
    };

    Object.entries(fields).forEach(([fieldId, { validator, errorMsg }]) => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                validateField(this, validator, errorMsg, fieldId);
            });
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this, validator, errorMsg, fieldId);
                }
            });
        }
    });

    // (Removed submit handler for Formspree integration)

    // Add input animations
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

function validateField(field, validator, errorMsg, fieldId) {
    const value = field.value.trim();
    if (!validator(value)) {
        showFieldError(field, fieldId, errorMsg);
    } else {
        clearFieldError(field, fieldId);
    }
}

function showFieldError(field, fieldId, errorMsg) {
    field.classList.add('error');
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = errorMsg;
        errorElement.style.display = 'block';
    }
}

function clearFieldError(field, fieldId) {
    field.classList.remove('error');
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function clearAllErrors() {
    document.querySelectorAll('.contact-form .error').forEach(field => {
        field.classList.remove('error');
    });
    document.querySelectorAll('.form-error').forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
}

function showFormStatus(type, message) {
    const formStatus = document.getElementById('formStatus');
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
    
    // Scroll to status message
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ==========================================
// Utility Functions
// ==========================================

// Debounce function for performance
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

// Format large numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Add active state to nav links based on scroll position
window.addEventListener('scroll', debounce(() => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, 100));

// ==========================================
// Additional Interactivity
// ==========================================

// Add water drop cursor effect on hero section
const hero = document.querySelector('.hero');
if (hero) {
    hero.addEventListener('mousemove', debounce((e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create subtle ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: rgba(144, 224, 239, 0.3);
            border-radius: 50%;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%) scale(0);
            animation: rippleExpand 1s ease-out forwards;
        `;
        hero.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 1000);
    }, 50));

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleExpand {
            to {
                transform: translate(-50%, -50%) scale(10);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Console message for developers
console.log('%c💧 AquaSave - Water Conservation Platform', 'font-size: 20px; color: #0077b6; font-weight: bold;');
console.log('%cEvery drop counts! Thank you for caring about water conservation.', 'font-size: 14px; color: #48cae4;');
