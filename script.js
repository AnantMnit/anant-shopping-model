// 1. Back to Top functionality
const backToTop = document.querySelector('.foot-panel-1');
if (backToTop) {
    backToTop.style.cursor = 'pointer';
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 2. Toggle language flag and text
const navLanguage = document.querySelector('.nav-language');
if (navLanguage) {
    navLanguage.style.cursor = 'pointer';
    navLanguage.addEventListener('click', () => {
        const flagImg = navLanguage.querySelector('img');
        const langText = navLanguage.querySelector('p');
        if (flagImg && langText) {
            if (langText.textContent === 'EN') {
                flagImg.src = 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg';
                langText.textContent = 'IN';
            } else {
                flagImg.src = 'england_flag.webp';
                langText.textContent = 'EN';
            }
        }
    });
}

// 3. Alert on Cart click
const navCart = document.querySelector('.nav-cart');
if (navCart) {
    navCart.style.cursor = 'pointer';
    navCart.removeEventListener('click', openCartModal);
    navCart.addEventListener('click', openCartModal);
}

// 4. Make hero message link open Amazon India
const heroMsgLink = document.querySelector('.hero-msg a');
if (heroMsgLink) {
    heroMsgLink.style.cursor = 'pointer';
    heroMsgLink.addEventListener('click', () => {
        window.open('https://www.amazon.in', '_blank');
    });
}

// Hero Image Slider Functionality
const slides = document.querySelectorAll('.hero-slide');
const leftArrow = document.querySelector('.hero-arrow.left');
const rightArrow = document.querySelector('.hero-arrow.right');
const dots = document.querySelectorAll('.hero-dot');
const heroSection = document.querySelector('.hero-section');
let currentSlide = 0;
let autoSlideInterval;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 3000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

if (leftArrow && rightArrow && slides.length > 0) {
    leftArrow.addEventListener('click', () => {
        prevSlide();
    });
    rightArrow.addEventListener('click', () => {
        nextSlide();
    });
}

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        currentSlide = i;
        showSlide(currentSlide);
    });
});

if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoSlide);
    heroSection.addEventListener('mouseleave', startAutoSlide);
}

showSlide(currentSlide);
startAutoSlide();

// Add to Cart Functionality
let cartCount = 0;
let cartItems = [];

// Add a cart count badge if not present
if (navCart && !navCart.querySelector('.cart-count')) {
    const cartBadge = document.createElement('span');
    cartBadge.className = 'cart-count';
    cartBadge.textContent = '0';
    navCart.appendChild(cartBadge);
}
function updateCartCount() {
    const cartBadge = document.querySelector('.cart-count');
    const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
    if (cartBadge) cartBadge.textContent = totalCount;
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'show';
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 2000);
}

const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
addToCartBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        const box = btn.closest('.box-content');
        const productName = box ? box.querySelector('h2, H2').textContent : `Product ${i+1}`;
        // Check if product already in cart
        const existing = cartItems.find(item => item.name === productName);
        if (existing) {
            existing.qty++;
        } else {
            cartItems.push({ name: productName, qty: 1 });
        }
        updateCartCount();
        showToast('Item added to cart');
    });
});

// Cart Modal Functionality
const cartModal = document.getElementById('cartModal');
const cartModalClose = document.querySelector('.cart-modal-close');
const cartItemsList = document.querySelector('.cart-items-list');

function openCartModal() {
    if (cartModal) {
        cartModal.style.display = 'flex';
        renderCartItems();
    }
}
function closeCartModal() {
    if (cartModal) cartModal.style.display = 'none';
}
function renderCartItems() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';
    if (cartItems.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Your cart is empty.';
        cartItemsList.appendChild(li);
    } else {
        cartItems.forEach((item, i) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="cart-item-name">${item.name}</span>
                <button class="qty-btn decrease-qty" data-index="${i}" title="Decrease">-</button>
                <span class="cart-item-qty">${item.qty}</span>
                <button class="qty-btn increase-qty" data-index="${i}" title="Increase">+</button>
                <button class="remove-cart-item" data-index="${i}" title="Remove">&times;</button>
            `;
            cartItemsList.appendChild(li);
        });
        // Add event listeners for quantity buttons
        const increaseBtns = cartItemsList.querySelectorAll('.increase-qty');
        const decreaseBtns = cartItemsList.querySelectorAll('.decrease-qty');
        increaseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                cartItems[idx].qty++;
                updateCartCount();
                renderCartItems();
            });
        });
        decreaseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                cartItems[idx].qty--;
                if (cartItems[idx].qty <= 0) {
                    cartItems.splice(idx, 1);
                }
                updateCartCount();
                renderCartItems();
            });
        });
        // Add remove event listeners
        const removeBtns = cartItemsList.querySelectorAll('.remove-cart-item');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                cartItems.splice(idx, 1);
                updateCartCount();
                renderCartItems();
            });
        });
    }
}
if (navCart) {
    navCart.addEventListener('click', openCartModal);
}
if (cartModalClose) {
    cartModalClose.addEventListener('click', closeCartModal);
}
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        closeCartModal();
    }
}); 