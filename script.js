// ==================== CERTIFICATE MODAL FUNCTIONS ==================== //

let currentCertificateIndex = 0;
const certificates = [];
let touchStartX = 0;
let touchEndX = 0;

const pdfMapping = {
    'certificates/ryla_certificate.jpg': 'certificates/ryla_certificate.pdf',
    'certificates/ml_stanford_certificate.jpg': 'certificates/ml_stanford_certificate.pdf',
    'certificates/python_certificate.jpg': 'certificates/python_codechef_certificate.pdf',
    'certificates/sql_hackerrank_certificate.jpg': 'certificates/sql_hackerrank_certificate.pdf',
    'certificates/kotlin_edge_certificate.jpg': 'certificates/kotlin_edge_certificate.pdf'
};

// Added mappings for newly added certificates
pdfMapping['certificates/RYLA.jpg'] = 'certificates/RYLA.pdf';
pdfMapping['certificates/EDGE_Database.jpg'] = 'certificates/EDGE_Database.pdf';
pdfMapping['certificates/EDGE_Mobile_App_Development.jpg'] = 'certificates/EDGE_Mobile_App_Development.pdf';

function getCertificateFileName(path) {
    try {
        return new URL(path, window.location.href).pathname.split('/').pop();
    } catch (error) {
        return path.split('/').pop();
    }
}

function initCertificates() {
    const images = document.querySelectorAll('.cert-image');
    images.forEach(img => {
        certificates.push(img.src);
    });
}

function openModal(img) {
    const modal = document.getElementById('certificateModal');
    const modalImage = document.getElementById('modalImage');
    
    // Find current index
    currentCertificateIndex = certificates.indexOf(img.src);
    
    modalImage.src = img.src;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
}

function closeModal() {
    const modal = document.getElementById('certificateModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    document.body.style.touchAction = 'auto';
}

function changeImage(direction) {
    currentCertificateIndex += direction;
    
    // Loop around
    if (currentCertificateIndex >= certificates.length) {
        currentCertificateIndex = 0;
    } else if (currentCertificateIndex < 0) {
        currentCertificateIndex = certificates.length - 1;
    }
    
    const modalImage = document.getElementById('modalImage');
    modalImage.style.animation = 'none';
    
    setTimeout(() => {
        modalImage.src = certificates[currentCertificateIndex];
        modalImage.style.animation = 'zoomIn 0.3s ease';
    }, 10);
}

function downloadCertificate() {
    const currentImageSrc = certificates[currentCertificateIndex];
    const certificateFileName = getCertificateFileName(currentImageSrc);
    const pdfUrl = pdfMapping[currentImageSrc] || pdfMapping[`certificates/${certificateFileName}`] || `certificates/${certificateFileName.replace(/\.(jpg|jpeg|png|webp)$/i, '.pdf')}`;
    
    if (pdfUrl) {
        // Create a link element and trigger download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = pdfUrl.split('/').pop(); // Get filename from path
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('PDF file not found for this certificate');
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('certificateModal');
    if (modal.classList.contains('show')) {
        if (event.key === 'Escape') {
            closeModal();
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            changeImage(-1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            changeImage(1);
        }
    }
});

// Touch gesture support for swiping
document.addEventListener('touchstart', function(event) {
    const modal = document.getElementById('certificateModal');
    if (modal.classList.contains('show')) {
        touchStartX = event.changedTouches[0].screenX;
    }
}, false);

document.addEventListener('touchend', function(event) {
    const modal = document.getElementById('certificateModal');
    if (modal.classList.contains('show')) {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    }
}, false);

function handleSwipe() {
    const threshold = 50; // Minimum swipe distance
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            // Swiped left - show next image
            changeImage(1);
        } else {
            // Swiped right - show previous image
            changeImage(-1);
        }
    }
}

// Close modal on background click
document.addEventListener('click', function(event) {
    const modal = document.getElementById('certificateModal');
    const modalContent = document.querySelector('.modal-content');
    if (event.target === modal && modalContent && !modalContent.contains(event.target)) {
        closeModal();
    }
});

// ==================== SCROLL ANIMATIONS ==================== //

document.addEventListener('DOMContentLoaded', function() {
    // Initialize certificates modal
    initCertificates();
    
    const certificatesSection = document.querySelector('.certificates-section');

    // ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'none';
                setTimeout(() => {
                    entry.target.style.animation = '';
                }, 10);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards for animation
    document.querySelectorAll('.experience-card, .project-card, .skill-tag').forEach(el => {
        observer.observe(el);
    });

    // ==================== CERTIFICATE CAROUSEL ====================
    const certificateItems = document.querySelectorAll('.certificate-item');
    let currentCertIndex = 0;

    function rotateCertificates() {
        certificateItems.forEach((item, index) => {
            item.style.opacity = index === currentCertIndex ? '1' : '0.5';
            item.style.transform = index === currentCertIndex ? 'scale(1)' : 'scale(0.95)';
            item.style.transition = 'all 0.3s ease';
        });

        currentCertIndex = (currentCertIndex + 1) % certificateItems.length;
    }

    // Optional: Auto-rotate certificates every 5 seconds
    // setInterval(rotateCertificates, 5000);

    // ==================== SMOOTH SCROLL FOR NAVIGATION ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ==================== NAVBAR HIDE ON SCROLL ====================
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 80) {
            // Scrolling Down - Hide navbar
            navbar.style.transform = 'translateY(-100%)';
            navbar.style.transition = 'transform 0.3s ease';
        } else {
            // Scrolling Up - Show navbar
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // ==================== CONTACT FORM HANDLING ====================
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;

            // Simple validation
            if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
                alert('Please fill in all fields');
                return;
            }

            // Create mailto link
            const mailtoLink = `mailto:nafismbstu@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            window.location.href = mailtoLink;

            // Reset form
            this.reset();
            alert('Thank you for reaching out! Your default email client will open.');
        });
    }

    // ==================== CERTIFICATE SCROLL ANIMATION ====================
    const certificatesWrapper = document.querySelector('.certificates-wrapper');
    if (certificatesWrapper) {
        let isScrolling = false;

        certificatesWrapper.addEventListener('scroll', function() {
            if (!isScrolling) {
                isScrolling = true;
                
                // Add animation to visible certificates
                const scrollLeft = certificatesWrapper.scrollLeft;
                const wrapperWidth = certificatesWrapper.offsetWidth;

                certificateItems.forEach(item => {
                    const itemLeft = item.offsetLeft;
                    const itemWidth = item.offsetWidth;
                    
                    // Check if item is in viewport
                    if (itemLeft >= scrollLeft - itemWidth && itemLeft <= scrollLeft + wrapperWidth) {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    } else {
                        item.style.opacity = '0.6';
                        item.style.transform = 'scale(0.95)';
                    }
                });

                setTimeout(() => {
                    isScrolling = false;
                }, 100);
            }
        });
    }

    // ==================== STAGGERED ANIMATIONS ====================
    function staggerAnimationOnScroll(selector, delay = 100) {
        const elements = document.querySelectorAll(selector);
        const observerForStagger = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * delay);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observerForStagger.observe(el);
        });
    }

    staggerAnimationOnScroll('.experience-card', 100);
    staggerAnimationOnScroll('.project-card', 100);
    staggerAnimationOnScroll('.stat-box', 100);

    // ==================== MOUSE PARALLAX EFFECT ====================
    // ==================== ACTIVE NAVIGATION LINK ====================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.style.borderBottomColor = 'var(--accent-color)';
                link.style.color = 'var(--accent-color)';
            } else {
                link.style.borderBottomColor = 'transparent';
                link.style.color = 'var(--light-text)';
            }
        });
    });

    // ==================== TYPING ANIMATION FOR ELEMENTS ====================
    function typeAnimation(element, text, speed = 50) {
        let index = 0;
        element.textContent = '';

        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        }

        type();
    }

    // Optional: Add typing animation to heading on load
    const profileName = document.querySelector('.profile-name');
    if (profileName) {
        const nameText = profileName.textContent;
        profileName.textContent = '';
        typeAnimation(profileName, nameText, 100);
    }

    // ==================== RESPONSIVE CERTIFICATE CAROUSEL ====================
    function adjustCertificateView() {
        if (window.innerWidth <= 768) {
            // On mobile, show one certificate at a time
            certificateItems.forEach((item, index) => {
                if (index === 0) {
                    item.style.flex = '0 0 100%';
                }
            });
        } else if (window.innerWidth <= 1024) {
            // On tablet, show 2 certificates
            certificateItems.forEach((item) => {
                item.style.flex = '0 0 calc(50% - 1rem)';
            });
        } else {
            // On desktop, show 4 certificates
            certificateItems.forEach((item) => {
                item.style.flex = '0 0 calc(25% - 1.5rem)';
            });
        }
    }

    adjustCertificateView();
    window.addEventListener('resize', adjustCertificateView);

    // ==================== PAGE LOAD ANIMATION ====================
    window.addEventListener('load', function() {
        // Animate hero content on load
        const heroContainer = document.querySelector('.hero-container');
        if (heroContainer) {
            heroContainer.style.opacity = '1';
        }

        // Add loaded class to body
        document.body.classList.add('loaded');
    });

    // ==================== SCROLL TO TOP BUTTON ====================
    const scrollToTopBtn = document.createElement('div');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--accent-color), #ff6b6b);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 5px 20px rgba(233, 69, 96, 0.3);
        user-select: none;
    `;

    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.pointerEvents = 'auto';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.pointerEvents = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollToTopBtn.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.1)';
    });

    scrollToTopBtn.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
    });

    // ==================== CERTIFICATE PDF LINK TRACKING ====================
    const certButtons = document.querySelectorAll('.cert-button');
    certButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const certName = this.closest('.certificate-card').querySelector('h3').textContent;
            console.log(`Certificate clicked: ${certName}`);
        });
    });

    // ==================== NOTIFICATION SYSTEM ====================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 2rem;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ==================== SMOOTH LOADING STATE ====================
    document.addEventListener('beforeunload', function() {
        document.body.style.opacity = '0.8';
    });

    // ==================== CERTIFICATE LINK VALIDATION ====================
    certButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Check if file exists, if not show message
            if (href && href.includes('certificates/')) {
                console.log('Opening certificate:', href);
            }
        });
    });
});

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', function(e) {
    // Scroll certificates with arrow keys (if certificates section is focused)
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const certificatesWrapper = document.querySelector('.certificates-wrapper');
        if (certificatesWrapper) {
            const scrollAmount = 300;
            if (e.key === 'ArrowRight') {
                certificatesWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            } else {
                certificatesWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
        }
    }

    // Scroll to top with Home key
    if (e.key === 'Home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Scroll to bottom with End key
    if (e.key === 'End') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// ==================== PERFORMANCE OPTIMIZATION ====================
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => {
        img.style.opacity = '0.7';
        img.style.transition = 'opacity 0.3s ease';
        imageObserver.observe(img);
    });
}
