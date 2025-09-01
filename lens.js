        // Global variables
        let cartCount = 0;
        let favorites = [];
        let cartItems = [];
        let cartTotal = 0;

        // Product data with prices
        const products = {
            'canon-1200d': { name: 'Canon EOS 1200D DSLR Camera', price: 24999, image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop' },
            'canon-3000d': { name: 'Canon EOS 3000D DSLR Camera', price: 28999, image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop' },
            'canon-600d': { name: 'Canon EOS 600D DSLR Camera', price: 34999, image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop' },
            'canon-700d': { name: 'Canon EOS 700D DSLR Camera', price: 39999, image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop' },
            'canon-5d-mark3': { name: 'Canon EOS 5D Mark III DSLR Camera', price: 89999, image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop' },
            'canon-5d-mark4': { name: 'Canon EOS 5D Mark IV DSLR Camera', price: 129999, image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop' }
        };

        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
        });

        function initializeApp() {
            // Initialize loading animations
            setTimeout(() => {
                const loadingElements = document.querySelectorAll('.loading');
                loadingElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.classList.add('loaded');
                    }, index * 100);
                });
            }, 300);

            // Initialize WhatsApp button
            const whatsappBtn = document.querySelector('.whatsapp-btn');
            whatsappBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openWhatsApp();
            });



            // Initialize intersection observer for scroll animations
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

            // Observe product cards
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                observer.observe(card);
            });

            // Load saved favorites from localStorage
            const savedFavorites = localStorage.getItem('favorites');
            if (savedFavorites) {
                favorites = JSON.parse(savedFavorites);
                updateFavoriteIcons();
            }

            // Load saved cart from localStorage
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                const cartData = JSON.parse(savedCart);
                cartItems = cartData.items || [];
                cartCount = cartData.count || 0;
                cartTotal = cartData.total || 0;
                updateCartUI();
            }

            console.log('SS Electronics website initialized successfully!');
        }

        // Mobile menu toggle
        function toggleMenu() {
            const nav = document.querySelector('nav');
            const menuIcon = document.querySelector('.menu-toggle i');
            
            nav.classList.toggle('active');
            
            if (nav.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        }

        // Toggle favorite
        function toggleFavorite(element) {
            const heartIcon = element.querySelector('i');
            const productCard = element.closest('.product-card');
            const productId = productCard.dataset.product;
            
            heartIcon.classList.toggle('far');
            heartIcon.classList.toggle('fas');
            element.classList.toggle('active');
            
            // Update favorites array
            const index = favorites.indexOf(productId);
            if (index === -1) {
                favorites.push(productId);
                showNotification('Added to favorites', 'success');
            } else {
                favorites.splice(index, 1);
                showNotification('Removed from favorites', 'success');
            }
            
            // Save to localStorage
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }

        // Update favorite icons based on saved favorites
        function updateFavoriteIcons() {
            const favoriteIcons = document.querySelectorAll('.favorite-icon');
            favoriteIcons.forEach(icon => {
                const productCard = icon.closest('.product-card');
                const productId = productCard.dataset.product;
                const heartIcon = icon.querySelector('i');
                
                if (favorites.includes(productId)) {
                    heartIcon.classList.remove('far');
                    heartIcon.classList.add('fas');
                    icon.classList.add('active');
                } else {
                    heartIcon.classList.add('far');
                    heartIcon.classList.remove('fas');
                    icon.classList.remove('active');
                }
            });
        }

        // Shop Now button
        function shopNow(button) {
            const productCard = button.closest('.product-card');
            const productId = productCard.dataset.product;
            const product = products[productId];
            
            // Add to cart
            addToCart(productId, product.name, product.price, product.image);
            
            // Show notification
            showNotification('Added to cart', 'success');
            
            // Animate cart
            const cartElement = document.querySelector('.cart');
            cartElement.classList.add('bounce');
            setTimeout(() => {
                cartElement.classList.remove('bounce');
            }, 300);
        }

        // Book Repair button
        function bookRepair(button) {
            const productCard = button.closest('.product-card');
            const productId = productCard.dataset.product;
            const product = products[productId];
            
            showNotification('Repair booking requested for ' + product.name, 'success');
            
            // Open WhatsApp for repair booking
            openWhatsApp('Hi, I would like to book a repair for ' + product.name);
        }

        // Add to cart
        function addToCart(productId, name, price, image) {
            // Check if product already in cart
            const existingItemIndex = cartItems.findIndex(item => item.id === productId);
            
            if (existingItemIndex !== -1) {
                // Increase quantity if already in cart
                cartItems[existingItemIndex].quantity += 1;
            } else {
                // Add new item to cart
                cartItems.push({
                    id: productId,
                    name: name,
                    price: price,
                    image: image,
                    quantity: 1
                });
            }
            
            // Update cart count and total
            cartCount += 1;
            cartTotal += price;
            
            // Update UI
            updateCartUI();
            
            // Save to localStorage
            saveCartToStorage();
        }

        // Update cart UI
        function updateCartUI() {
            const cartCountElement = document.querySelector('.cart-count');
            const cartItemsElement = document.querySelector('.cart-items');
            const cartTotalElement = document.querySelector('.cart-total span:last-child');
            const checkoutBtn = document.querySelector('.checkout-btn');
            const emptyCartElement = document.querySelector('.empty-cart');
            
            // Update cart count
            if (cartCount > 0) {
                cartCountElement.textContent = cartCount;
                cartCountElement.style.display = 'flex';
            } else {
                cartCountElement.style.display = 'none';
            }
            
            // Update cart items
            if (cartItems.length > 0) {
                emptyCartElement.style.display = 'none';
                
                // Generate cart items HTML
                let cartItemsHTML = '';
                cartItems.forEach(item => {
                    cartItemsHTML += `
                        <div class="cart-item" data-product="${item.id}">
                            <div class="cart-item-image">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="cart-item-details">
                                <div class="cart-item-name">${item.name}</div>
                                <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                                <div class="cart-item-actions">
                                    <div class="quantity-control">
                                        <button class="quantity-btn" onclick="decreaseQuantity('${item.id}')">-</button>
                                        <span class="quantity">${item.quantity}</span>
                                        <button class="quantity-btn" onclick="increaseQuantity('${item.id}')">+</button>
                                    </div>
                                    <button class="remove-item" onclick="removeFromCart('${item.id}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                cartItemsElement.innerHTML = cartItemsHTML;
            } else {
                emptyCartElement.style.display = 'block';
                cartItemsElement.innerHTML = '';
            }
            
            // Update total
            cartTotalElement.textContent = `₹${cartTotal.toLocaleString()}`;
            
            // Enable/disable checkout button
            checkoutBtn.disabled = cartItems.length === 0;
        }

        // Increase item quantity
        function increaseQuantity(productId) {
            const itemIndex = cartItems.findIndex(item => item.id === productId);
            if (itemIndex !== -1) {
                const item = cartItems[itemIndex];
                item.quantity += 1;
                cartCount += 1;
                cartTotal += item.price;
                
                updateCartUI();
                saveCartToStorage();
            }
        }

        // Decrease item quantity
        function decreaseQuantity(productId) {
            const itemIndex = cartItems.findIndex(item => item.id === productId);
            if (itemIndex !== -1) {
                const item = cartItems[itemIndex];
                if (item.quantity > 1) {
                    item.quantity -= 1;
                    cartCount -= 1;
                    cartTotal -= item.price;
                } else {
                    removeFromCart(productId);
                    return;
                }
                
                updateCartUI();
                saveCartToStorage();
            }
        }

        // Remove from cart
        function removeFromCart(productId) {
            const itemIndex = cartItems.findIndex(item => item.id === productId);
            if (itemIndex !== -1) {
                const item = cartItems[itemIndex];
                cartCount -= item.quantity;
                cartTotal -= item.price * item.quantity;
                
                cartItems.splice(itemIndex, 1);
                
                updateCartUI();
                saveCartToStorage();
                
                showNotification('Removed from cart', 'success');
            }
        }

        // Save cart to localStorage
        function saveCartToStorage() {
            localStorage.setItem('cart', JSON.stringify({
                items: cartItems,
                count: cartCount,
                total: cartTotal
            }));
        }

        // Open cart
        function openCart() {
            document.querySelector('.cart-modal').classList.add('active');
            document.querySelector('.overlay').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Close cart
        function closeCart() {
            document.querySelector('.cart-modal').classList.remove('active');
            document.querySelector('.overlay').classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Open WhatsApp
        function openWhatsApp(message = 'Hi, I am interested in your camera products.') {
            const phoneNumber = '919876543210'; // Replace with your WhatsApp number
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        }

        // Show notification
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification ${type}`;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Initialize checkout process
        function checkout() {
            if (cartItems.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }
            
            // In a real application, this would redirect to a checkout page
            // For this demo, we'll just show a confirmation
            showNotification('Proceeding to checkout', 'success');
            
            // Close cart
            closeCart();
            
            // Simulate order processing
            setTimeout(() => {
                // Clear cart
                cartItems = [];
                cartCount = 0;
                cartTotal = 0;
                updateCartUI();
                saveCartToStorage();
                
                showNotification('Order placed successfully!', 'success');
            }, 2000);
        }

        // Add event listener to checkout button
        document.querySelector('.checkout-btn').addEventListener('click', checkout);