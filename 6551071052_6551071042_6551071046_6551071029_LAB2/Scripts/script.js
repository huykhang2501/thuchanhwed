// ============================================
// HEADER SCROLL BEHAVIOR - Hide/Show on Scroll
// ============================================

(function() {
    'use strict';
    
    const header = document.querySelector('.header');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    let lastScrollTop = 0;
    let scrollThreshold = 100;
    let ticking = false;
    
    if (!header) return;
    
    // Add padding to body
    document.body.classList.add('has-fixed-header');
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show/hide scroll to top button
        if (scrollTop > 300) {
            scrollToTopBtn?.classList.add('show');
        } else {
            scrollToTopBtn?.classList.remove('show');
        }
        
        // Add scrolled class for styling
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header when scrolling down, show when scrolling up
        if (scrollTop > scrollThreshold) {
            if (scrollTop > lastScrollTop) {
                // Scrolling down - hide header
                header.classList.add('hidden');
            } else {
                // Scrolling up - show header
                header.classList.remove('hidden');
            }
        } else {
            // Near top - always show
            header.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });
    
    // Initial check
    updateHeader();
})();

if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        // Show header when clicking scroll to top
        const header = document.querySelector('.header');
        if (header) {
            header.classList.remove('hidden');
        }
    });
}

// ============================================
// PRODUCT TABS - Switch between categories
// ============================================

(function() {
    'use strict';
    
    const tabs = document.querySelectorAll('.product-tabs .tab');
    const productsGrid = document.getElementById('productsGrid');
    let productCards = document.querySelectorAll('.product-card');
    let isTransitioning = false;
    
    if (!tabs.length || !productsGrid) return;
    
    // Category mapping
    const categoryMap = {
        'Tires & Wheels': 'tires-wheels',
        'Headlight': 'headlight',
        'Automotive Rims': 'automotive-rims'
    };
    
    // Function to show products by category with animation
    function showCategory(category, delay = 0) {
        setTimeout(() => {
            let visibleCount = 0;
            
            productCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category');
                
                if (cardCategory === category) {
                    card.style.display = 'block';
                    // Stagger animation for each card
                    card.style.animationDelay = `${index * 0.1}s`;
                    card.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                    card.style.animation = '';
                }
            });
            
            // If no products found, show message
            if (visibleCount === 0) {
                console.warn(`No products found for category: ${category}`);
            }
            
            isTransitioning = false;
        }, delay);
    }
    
    // Tab click handlers
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Prevent multiple clicks during transition
            if (isTransitioning) return;
            
            isTransitioning = true;
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Get category from tab text
            const tabText = tab.textContent.trim();
            const category = categoryMap[tabText];
            
            if (category) {
                // Fade out current products
                productsGrid.style.opacity = '0';
                productsGrid.style.transform = 'translateY(20px)';
                productsGrid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                
                // After fade out, show new category
                setTimeout(() => {
                    showCategory(category, 0);
                    
                    // Fade in new products
                    productsGrid.style.opacity = '1';
                    productsGrid.style.transform = 'translateY(0)';
                }, 300);
            } else {
                isTransitioning = false;
            }
        });
    });
    
    // Initialize - show first category (Tires & Wheels)
    function initializeProducts() {
        const firstTab = tabs[0];
        if (firstTab) {
            const firstCategory = categoryMap[firstTab.textContent.trim()];
            if (firstCategory) {
                // Show first category products immediately
                productCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory === firstCategory) {
                        card.style.display = 'block';
                        card.style.opacity = '1';
                    } else {
                        card.style.display = 'none';
                        card.style.opacity = '0';
                    }
                });
                
                productsGrid.style.opacity = '1';
                productsGrid.style.transform = 'translateY(0)';
            }
        }
    }
    
    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeProducts);
    } else {
        initializeProducts();
    }
})();

// Favorite Toggle with Counter
let wishlistCount = 0;
const wishlistBadge = document.querySelector('.wishlist .badge');

const favoriteIcons = document.querySelectorAll('.product-favorite i');
favoriteIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.stopPropagation();
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#e74c3c';
            wishlistCount++;
            if (wishlistBadge) {
                wishlistBadge.textContent = wishlistCount;
                wishlistBadge.style.animation = 'pulse 0.5s';
            }
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.style.color = '#999';
            wishlistCount = Math.max(0, wishlistCount - 1);
            if (wishlistBadge) {
                wishlistBadge.textContent = wishlistCount;
            }
        }
    });
});

// Add to Cart Animation with Counter
let cartCount = 0;
const cartBadge = document.querySelector('.cart .badge');

const addToCartBtns = document.querySelectorAll('.add-to-cart');
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const originalText = btn.textContent;
        btn.textContent = 'ADDED!';
        btn.style.background = '#27ae60';
        cartCount++;
        if (cartBadge) {
            cartBadge.textContent = cartCount;
            cartBadge.style.animation = 'pulse 0.5s';
        }
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '#000';
        }, 2000);
    });
});

// Quick Add to Cart for Product Cards
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    const quickAddBtn = document.createElement('button');
    quickAddBtn.className = 'quick-add-btn';
    quickAddBtn.innerHTML = '<i class="fas fa-shopping-cart"></i>';
    quickAddBtn.style.display = 'none';
    
    card.addEventListener('mouseenter', () => {
        quickAddBtn.style.display = 'flex';
        const img = card.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1.05)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        quickAddBtn.style.display = 'none';
        const img = card.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1)';
        }
    });
    
    quickAddBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cartCount++;
        if (cartBadge) {
            cartBadge.textContent = cartCount;
            cartBadge.style.animation = 'pulse 0.5s';
        }
        quickAddBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            quickAddBtn.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        }, 1000);
    });
    
    card.style.position = 'relative';
    card.appendChild(quickAddBtn);
});

// Countdown Timer
function updateCountdown() {
    const countdownItems = document.querySelectorAll('.countdown-item');
    if (countdownItems.length === 0) return;
    
    // Set target date (7 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    targetDate.setHours(23, 59, 59, 999);
    
    setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        
        if (distance < 0) {
            countdownItems.forEach(item => {
                item.querySelector('.countdown-number').textContent = '00';
            });
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (countdownItems[0]) {
            countdownItems[0].querySelector('.countdown-number').textContent = 
                days.toString().padStart(2, '0');
        }
        if (countdownItems[1]) {
            countdownItems[1].querySelector('.countdown-number').textContent = 
                hours.toString().padStart(2, '0');
        }
        if (countdownItems[2]) {
            countdownItems[2].querySelector('.countdown-number').textContent = 
                minutes.toString().padStart(2, '0');
        }
        if (countdownItems[3]) {
            countdownItems[3].querySelector('.countdown-number').textContent = 
                seconds.toString().padStart(2, '0');
        }
    }, 1000);
}

// Smooth Scroll for Anchor Links
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

// Newsletter Form with Validation
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (email && validateEmail(email)) {
            // Show success message
            const button = newsletterForm.querySelector('button');
            const originalText = button.textContent;
            button.textContent = 'SUBSCRIBED!';
            button.style.background = '#27ae60';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '#e74c3c';
                emailInput.value = '';
            }, 2000);
        } else {
            emailInput.style.borderColor = '#e74c3c';
            setTimeout(() => {
                emailInput.style.borderColor = '#ddd';
            }, 2000);
        }
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Search Functionality
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-input');

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
        performSearch();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
        // Highlight matching products
        const productTitles = document.querySelectorAll('.product-card h4');
        productTitles.forEach(title => {
            if (title.textContent.toLowerCase().includes(query.toLowerCase())) {
                title.parentElement.style.border = '2px solid #e74c3c';
                title.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                    title.parentElement.style.border = '1px solid #eee';
                }, 3000);
            }
        });
    }
}

// Category Item Click Handler
const categoryItems = document.querySelectorAll('.category-item');
categoryItems.forEach(item => {
    item.addEventListener('click', () => {
        const categoryName = item.querySelector('span').textContent;
        // Filter products by category (simplified)
        console.log('Selected category:', categoryName);
    });
});

// Categories Dropdown Menu Toggle
const browseCategoriesBtn = document.querySelector('.browse-categories');
const categoriesMenu = document.getElementById('categoriesMenu');

console.log('Browse Btn:', browseCategoriesBtn);
console.log('Categories Menu:', categoriesMenu);

if (browseCategoriesBtn && categoriesMenu) {
    browseCategoriesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Button clicked!');
        console.log('Menu show class before:', categoriesMenu.classList.contains('show'));
        categoriesMenu.classList.toggle('show');
        browseCategoriesBtn.classList.toggle('active');
        console.log('Menu show class after:', categoriesMenu.classList.contains('show'));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!categoriesMenu.contains(e.target) && !browseCategoriesBtn.contains(e.target)) {
            categoriesMenu.classList.remove('show');
            browseCategoriesBtn.classList.remove('active');
        }
    });

    // Prevent menu from closing when clicking inside
    categoriesMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
} else {
    console.warn('Menu elements not found!');
}

// ============================================
// HEADER NAVIGATION - Clean and Perfect Logic
// ============================================

(function() {
    'use strict';
    
    const dropdownParents = document.querySelectorAll('.main-nav .has-dropdown');
    const navLinks = document.querySelectorAll('.main-nav > ul > li > a');
    const dropdownLinks = document.querySelectorAll('.main-nav .dropdown-menu a');
    let closeTimeouts = new Map();
    
    // Initialize dropdowns
    dropdownParents.forEach(parent => {
        closeTimeouts.set(parent, null);
    });
    
    // Function to close all dropdowns except one
    function closeAllDropdowns(except = null) {
        dropdownParents.forEach(parent => {
            if (parent !== except) {
                parent.classList.remove('active');
                const timeout = closeTimeouts.get(parent);
                if (timeout) {
                    clearTimeout(timeout);
                    closeTimeouts.set(parent, null);
                }
            }
        });
    }
    
    // Function to schedule dropdown close
    function scheduleClose(parent, delay = 400) {
        const existingTimeout = closeTimeouts.get(parent);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }
        
        const timeout = setTimeout(() => {
            // Check if mouse is still over parent or dropdown
            const dropdown = parent.querySelector('.dropdown-menu');
            const isHovering = parent.matches(':hover') || (dropdown && dropdown.matches(':hover'));
            
            if (!isHovering) {
                parent.classList.remove('active');
            }
            closeTimeouts.set(parent, null);
        }, delay);
        
        closeTimeouts.set(parent, timeout);
    }
    
    // Function to cancel scheduled close
    function cancelClose(parent) {
        const timeout = closeTimeouts.get(parent);
        if (timeout) {
            clearTimeout(timeout);
            closeTimeouts.set(parent, null);
        }
    }
    
    // Desktop: Hover behavior
    if (window.innerWidth > 768) {
        dropdownParents.forEach(parent => {
            const dropdown = parent.querySelector('.dropdown-menu');
            const parentLink = parent.querySelector('> a');
            
            if (!dropdown) return;
            
            // Mouse enter parent - open dropdown
            parent.addEventListener('mouseenter', () => {
                cancelClose(parent);
                closeAllDropdowns(parent);
                parent.classList.add('active');
            });
            
            // Mouse enter dropdown - keep open
            dropdown.addEventListener('mouseenter', () => {
                cancelClose(parent);
                parent.classList.add('active');
            });
            
            // Mouse leave parent - schedule close with longer delay
            parent.addEventListener('mouseleave', (e) => {
                const relatedTarget = e.relatedTarget;
                // If moving to dropdown or bridge, don't close
                if (relatedTarget && (dropdown.contains(relatedTarget) || relatedTarget === parent.querySelector('::before'))) {
                    return;
                }
                scheduleClose(parent, 400);
            });
            
            // Mouse leave dropdown - schedule close with longer delay
            dropdown.addEventListener('mouseleave', (e) => {
                const relatedTarget = e.relatedTarget;
                // If moving back to parent, don't close
                if (relatedTarget && parent.contains(relatedTarget)) {
                    return;
                }
                scheduleClose(parent, 400);
            });
            
            // Click parent link - toggle dropdown
            if (parentLink) {
                parentLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (parent.classList.contains('active')) {
                        parent.classList.remove('active');
                    } else {
                        closeAllDropdowns(parent);
                        parent.classList.add('active');
                    }
                });
            }
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            const isClickInsideNav = e.target.closest('.main-nav');
            if (!isClickInsideNav) {
                closeAllDropdowns();
            }
        });
    }
    
    // Mobile: Click behavior
    else {
        dropdownParents.forEach(parent => {
            const parentLink = parent.querySelector('> a');
            
            if (parentLink) {
                parentLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Close other dropdowns
                    closeAllDropdowns(parent);
                    // Toggle current dropdown
                    parent.classList.toggle('active');
                });
            }
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            const isClickInsideNav = e.target.closest('.main-nav');
            if (!isClickInsideNav) {
                closeAllDropdowns();
            }
        });
    }
    
    // Handle HOME link
    navLinks.forEach(link => {
        const linkText = link.textContent.trim().toUpperCase();
        const parentLi = link.parentElement;
        
        // Skip dropdown parents
        if (parentLi.classList.contains('has-dropdown')) {
            return;
        }
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (linkText.includes('HOME')) {
                const homeSection = document.getElementById('home');
                if (homeSection) {
                    homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Handle dropdown menu links - OPTIMIZED FOR EASY CLICKING
    dropdownLinks.forEach(link => {
        // Ensure pointer events work
        link.style.pointerEvents = 'auto';
        link.style.cursor = 'pointer';
        link.style.position = 'relative';
        link.style.zIndex = '1002';
        
        // Prevent dropdown from closing when clicking
        link.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            const parent = link.closest('.has-dropdown');
            if (parent) {
                cancelClose(parent);
                parent.classList.add('active');
            }
        });
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const linkText = link.textContent.trim();
            const parent = link.closest('.has-dropdown');
            
            // Visual feedback
            const originalBg = window.getComputedStyle(link).backgroundColor;
            const originalColor = window.getComputedStyle(link).color;
            
            link.style.background = '#e74c3c';
            link.style.color = 'white';
            
            setTimeout(() => {
                link.style.background = originalBg;
                link.style.color = originalColor;
            }, 300);
            
            // Show notification
            if (typeof showNotification === 'function') {
                showNotification(`Navigating to: ${linkText}`);
            } else {
                console.log(`Navigating to: ${linkText}`);
            }
            
            // Close dropdown after click with delay
            setTimeout(() => {
                if (parent) {
                    parent.classList.remove('active');
                }
            }, 400);
        });
        
        // Keep dropdown open when hovering over link
        link.addEventListener('mouseenter', () => {
            const parent = link.closest('.has-dropdown');
            if (parent) {
                cancelClose(parent);
                parent.classList.add('active');
            }
        });
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Close all dropdowns on resize
            closeAllDropdowns();
        }, 250);
    });
    
})();

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth > 768) {
        const isClickInsideNav = e.target.closest('.main-nav');
        if (!isClickInsideNav) {
            dropdownParents.forEach(item => {
                item.classList.remove('active');
            });
        }
    }
});

// Function to show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'menu-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-size: 14px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notification
const style = document.createElement('style');
style.textContent += `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    console.log('AUTOMIZE website loaded');
    
    // Initialize countdown
    updateCountdown();
    
    // Add transition styles to images
    const images = document.querySelectorAll('.product-card img, .news-card img');
    images.forEach(img => {
        img.style.transition = 'transform 0.3s ease';
    });
    
    // Animate on scroll
    const animateElements = document.querySelectorAll('.product-card, .category-card, .service-card, .testimonial-card, .news-card');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Add pulse animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        .quick-add-btn {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #e74c3c;
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .quick-add-btn:hover {
            background: #c0392b;
            transform: translate(-50%, -50%) scale(1.1);
        }
        .quick-add-btn i {
            font-size: 18px;
        }
    `;
    document.head.appendChild(style);
});

// Window resize handler
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const categoriesSidebar = document.querySelector('.categories-sidebar');
        if (categoriesSidebar) {
            categoriesSidebar.classList.remove('mobile-open');
        }
    }
});
