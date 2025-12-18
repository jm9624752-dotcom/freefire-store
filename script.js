// Products data
const products = [
    {
        id: 1,
        name: "Sensibilidade Pro Player",
        description: "Configuração profissional para melhor mira",
        price: 5.00,
        icon: "fas fa-crosshairs"
    },
    {
        id: 2,
        name: "Config Headshot",
        description: "Sensibilidade otimizada para tiros na cabeça",
        price: 10.00,
        icon: "fas fa-bullseye"
    }
];

// Cart functionality
let cart = [];

// Load products on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartUI();
});

// Load products into the grid
function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-icon">
                <i class="${product.icon}"></i>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Adicionar ao Carrinho
            </button>
        `;
        productGrid.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification('Produto adicionado ao carrinho!');
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showNotification('Produto removido do carrinho!');
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Quantidade: ${item.quantity}</p>
                    <div class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    Remover
                </button>
            </div>
        `).join('');
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2).replace('.', ',');
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

// Scroll to products section
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsList = cart.map(item => `${item.name} (${item.quantity}x)`).join(', ');
    
    // Create message for Instagram
    const message = `🎮 Olá! Gostaria de comprar:\n\n${itemsList}\n\n💰 Total: R$ ${total.toFixed(2).replace('.', ',')}\n\n📱 Aguardo instruções para pagamento!`;
    
    // Copy message to clipboard
    copyToClipboard(message);
    
    // Open Instagram profile
    const instagramUrl = 'https://www.instagram.com/conticontaplus?igsh=MTVxc2QxN2hzN2J0cw==';
    window.open(instagramUrl, '_blank');
    
    // Show message modal
    showMessageModal(message);
    
    // Clear cart after checkout
    cart = [];
    updateCartUI();
    toggleCart();
}

// Send contact message
function sendMessage(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;
    
    // Create contact message
    const contactMessage = `📩 Olá! Meu nome é ${name}\n📧 Email: ${email}\n\n💬 Mensagem: ${message}`;
    
    // Copy message to clipboard
    copyToClipboard(contactMessage);
    
    // Open Instagram profile
    const instagramUrl = 'https://www.instagram.com/conticontaplus?igsh=MTVxc2QxN2hzN2J0cw==';
    window.open(instagramUrl, '_blank');
    
    // Show message modal
    showMessageModal(contactMessage);
    
    // Reset form
    form.reset();
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ff4757' : '#2ed573'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
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
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Close cart when clicking outside
document.addEventListener('click', function(event) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (!cartSidebar.contains(event.target) && !cartIcon.contains(event.target)) {
        cartSidebar.classList.remove('open');
    }
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.9)';
    }
});

// Add loading animation to products
function animateProducts() {
    const productCards = document.querySelectorAll('.product-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    });
    
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
}

// Copy to clipboard function
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Mensagem copiada! Cole no Instagram', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

// Fallback copy function
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Mensagem copiada! Cole no Instagram', 'success');
    } catch (err) {
        showNotification('Copie a mensagem manualmente', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Show message modal
function showMessageModal(message) {
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    
    modalContent.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: #333;">📱 Mensagem Copiada!</h3>
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; text-align: left; font-family: monospace; white-space: pre-wrap; border: 1px solid #dee2e6;">${message}</div>
        <p style="margin-bottom: 1.5rem; color: #666;">Cole esta mensagem no Instagram que acabou de abrir!</p>
        <button onclick="closeModal()" style="background: #ff6b35; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 1rem;">Entendi!</button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Store modal reference for closing
    window.currentModal = modal;
}

// Close modal function
function closeModal() {
    if (window.currentModal) {
        document.body.removeChild(window.currentModal);
        window.currentModal = null;
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(animateProducts, 500);
});