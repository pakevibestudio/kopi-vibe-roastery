// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartModal = document.getElementById('cartModal');
const cartCount = document.querySelector('.cart-count');
const navCart = document.querySelector('.nav-cart');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    if (totalItems === 0) {
        cartCount.style.display = 'none';
    } else {
        cartCount.style.display = 'flex';
    }
}

// Add to cart
document.querySelectorAll('.btn-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const product = button.getAttribute('data-product');
        const price = parseInt(button.getAttribute('data-price'));
        
        const existingItem = cart.find(item => item.name === product);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: product,
                price: price,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        
        // Show feedback
        button.style.background = 'var(--burnt-orange)';
        button.innerHTML = '<i data-lucide="check"></i> Added!';
        lucide.createIcons();
        
        setTimeout(() => {
            button.style.background = '';
            button.innerHTML = '<i data-lucide="shopping-cart"></i> Add to Cart';
            lucide.createIcons();
        }, 1500);
    });
});

// Update cart display
function updateCartDisplay() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        cartTotal.textContent = 'Rp 0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')} × ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    lucide.createIcons();
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

// Open cart modal
if (navCart) {
    navCart.addEventListener('click', () => {
        updateCartDisplay();
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Close cart modal
if (closeCart) {
    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close modal when clicking outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Checkout button
const checkoutBtn = document.querySelector('.btn-checkout');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Thank you for your order!\n\nTotal: Rp ${total.toLocaleString('id-ID')}\n\nThis is a demo. In a real application, this would proceed to payment.`);
        
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Initialize cart on load
updateCartCount();

// Navbar scroll effect
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        navbar.style.background = 'rgba(245, 245, 220, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(26, 26, 26, 0.1)';
    } else {
        navbar.style.background = 'rgba(245, 245, 220, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScrollY = currentScrollY;
});

// Intersection Observer for fade-in animations
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

// Observe bean cards
document.querySelectorAll('.bean-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe experience section
const experienceSection = document.querySelector('.experience-content');
if (experienceSection) {
    experienceSection.style.opacity = '0';
    experienceSection.style.transform = 'translateX(30px)';
    experienceSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(experienceSection);
}

// Horizontal scroll for beans on mobile (optional enhancement)
let isDown = false;
let startX;
let scrollLeft;
const beansScroll = document.getElementById('beansScroll');

if (beansScroll && window.innerWidth <= 768) {
    beansScroll.addEventListener('mousedown', (e) => {
        isDown = true;
        beansScroll.style.cursor = 'grabbing';
        startX = e.pageX - beansScroll.offsetLeft;
        scrollLeft = beansScroll.scrollLeft;
    });

    beansScroll.addEventListener('mouseleave', () => {
        isDown = false;
        beansScroll.style.cursor = 'grab';
    });

    beansScroll.addEventListener('mouseup', () => {
        isDown = false;
        beansScroll.style.cursor = 'grab';
    });

    beansScroll.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - beansScroll.offsetLeft;
        const walk = (x - startX) * 2;
        beansScroll.scrollLeft = scrollLeft - walk;
    });
}

// Ensure icons are recreated after cart updates
setTimeout(() => {
    lucide.createIcons();
}, 100);

