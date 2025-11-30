
        // Cart data
        let cart = [];
        let cartCount = 0;
        let deliveryAddress = null;

        // DOM Elements
        const categoryCards = document.querySelectorAll('.category-card');
        const categoryPages = document.querySelectorAll('.category-page');
        const backButtons = document.querySelectorAll('.back-button');
        const cartIcon = document.getElementById('cart-icon');
        const cartSidebar = document.getElementById('cart-sidebar');
        const closeCart = document.getElementById('close-cart');
        const cartItems = document.getElementById('cart-items');
        const emptyCart = document.getElementById('empty-cart');
        const cartTotal = document.getElementById('cart-total');
        const totalAmount = document.getElementById('total-amount');
        const checkoutBtn = document.getElementById('checkout-btn');
        const overlay = document.getElementById('overlay');
        const cartCountElement = document.querySelector('.cart-count');
        
        // Location modal elements
        const locationBtn = document.getElementById('location-btn');
        const locationModal = document.getElementById('location-modal');
        const closeLocationModal = document.getElementById('close-location-modal');
        const cancelLocation = document.getElementById('cancel-location');
        const saveLocation = document.getElementById('save-location');
        const locationText = document.getElementById('location-text');
        
        // Checkout modal elements
        const checkoutModal = document.getElementById('checkout-modal');
        const closeCheckoutModal = document.getElementById('close-checkout-modal');
        const cancelCheckout = document.getElementById('cancel-checkout');
        const placeOrder = document.getElementById('place-order');
        const deliveryAddressDisplay = document.getElementById('delivery-address-display');
        const changeAddressBtn = document.getElementById('change-address-btn');
        const paymentOptions = document.querySelectorAll('.payment-option');
        const cardDetails = document.getElementById('card-details');
        const upiDetails = document.getElementById('upi-details');
        
        // Success modal elements
        const successModal = document.getElementById('success-modal');
        const successOk = document.getElementById('success-ok');

        // Event Listeners
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                showCategoryPage(category);
            });
        });

        backButtons.forEach(button => {
            button.addEventListener('click', () => {
                hideAllCategoryPages();
            });
        });

        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
        });

        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });

        overlay.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
            locationModal.classList.remove('active');
            checkoutModal.classList.remove('active');
            successModal.classList.remove('active');
        });

        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            
            cartSidebar.classList.remove('active');
            showCheckoutModal();
        });

        // Location modal events
        locationBtn.addEventListener('click', () => {
            showLocationModal();
        });

        closeLocationModal.addEventListener('click', () => {
            locationModal.classList.remove('active');
            overlay.classList.remove('active');
        });

        cancelLocation.addEventListener('click', () => {
            locationModal.classList.remove('active');
            overlay.classList.remove('active');
        });

        saveLocation.addEventListener('click', () => {
            saveDeliveryAddress();
        });

        // Checkout modal events
        closeCheckoutModal.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
            overlay.classList.remove('active');
        });

        cancelCheckout.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
            overlay.classList.remove('active');
        });

        changeAddressBtn.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
            showLocationModal();
        });

        placeOrder.addEventListener('click', () => {
            placeOrderHandler();
        });

        // Payment option selection
        paymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                paymentOptions.forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Show/hide payment details
                const method = option.getAttribute('data-method');
                cardDetails.classList.remove('active');
                upiDetails.classList.remove('active');
                
                if (method === 'card') {
                    cardDetails.classList.add('active');
                } else if (method === 'upi') {
                    upiDetails.classList.add('active');
                }
            });
        });

        // Success modal events
        successOk.addEventListener('click', () => {
            successModal.classList.remove('active');
            overlay.classList.remove('active');
            cart = [];
            updateCart();
        });

        // Add event listeners to all Add to Cart buttons
        document.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('add-to-cart-btn')) {
                const id = e.target.getAttribute('data-id');
                const name = e.target.getAttribute('data-name');
                const price = parseInt(e.target.getAttribute('data-price'));
                const image = e.target.getAttribute('data-image');
                
                addToCart(id, name, price, image);
            }
        });

        // Functions
        function showCategoryPage(category) {
            hideAllCategoryPages();
            const categoryPage = document.getElementById(`${category}-page`);
            if (categoryPage) {
                categoryPage.classList.add('active');
                categoryPage.scrollIntoView({ behavior: 'smooth' });
            }
        }

        function hideAllCategoryPages() {
            categoryPages.forEach(page => {
                page.classList.remove('active');
            });
        }

        function addToCart(id, name, price, image) {
            // Check if item already in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: id,
                    name: name,
                    price: price,
                    image: image,
                    quantity: 1
                });
            }
            
            updateCart();
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.textContent = `${name} added to cart!`;
            successMsg.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 1001;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(successMsg);
            
            setTimeout(() => {
                document.body.removeChild(successMsg);
            }, 2000);
        }

        function updateCart() {
            // Update cart count
            cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = cartCount;
            
            // Update cart items
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                emptyCart.style.display = 'block';
                cartTotal.style.display = 'none';
                checkoutBtn.style.display = 'none';
                return;
            }
            
            emptyCart.style.display = 'none';
            cartTotal.style.display = 'flex';
            checkoutBtn.style.display = 'block';
            
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-price">₹${item.price}</p>
                        <div class="cart-item-controls">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
            
            // Update total
            totalAmount.textContent = `₹${total}`;
            
            // Add event listeners to cart controls
            const decreaseButtons = document.querySelectorAll('.decrease');
            const increaseButtons = document.querySelectorAll('.increase');
            const removeButtons = document.querySelectorAll('.remove-item');
            
            decreaseButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const itemId = e.target.getAttribute('data-id');
                    decreaseQuantity(itemId);
                });
            });
            
            increaseButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const itemId = e.target.getAttribute('data-id');
                    increaseQuantity(itemId);
                });
            });
            
            removeButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const itemId = e.target.getAttribute('data-id');
                    removeFromCart(itemId);
                });
            });
        }

        function decreaseQuantity(itemId) {
            const item = cart.find(item => item.id === itemId);
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    removeFromCart(itemId);
                    return;
                }
                updateCart();
            }
        }

        function increaseQuantity(itemId) {
            const item = cart.find(item => item.id === itemId);
            if (item) {
                item.quantity += 1;
                updateCart();
            }
        }

        function removeFromCart(itemId) {
            cart = cart.filter(item => item.id !== itemId);
            updateCart();
        }

        function showLocationModal() {
            locationModal.classList.add('active');
            overlay.classList.add('active');
        }

        function saveDeliveryAddress() {
            const fullName = document.getElementById('full-name').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const pincode = document.getElementById('pincode').value;
            
            if (!fullName || !phone || !address || !city || !pincode) {
                alert('Please fill all the fields');
                return;
            }
            
            deliveryAddress = {
                fullName,
                phone,
                address,
                city,
                pincode
            };
            
            locationText.textContent = `${address.substring(0, 30)}...`;
            locationModal.classList.remove('active');
            overlay.classList.remove('active');
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.textContent = 'Address saved successfully!';
            successMsg.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 1001;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(successMsg);
            
            setTimeout(() => {
                document.body.removeChild(successMsg);
            }, 2000);
        }

        function showCheckoutModal() {
            if (!deliveryAddress) {
                alert('Please add a delivery address first');
                showLocationModal();
                return;
            }
            
            // Update delivery address display
            deliveryAddressDisplay.textContent = 
                `${deliveryAddress.fullName}, ${deliveryAddress.address}, ${deliveryAddress.city} - ${deliveryAddress.pincode}`;
            
            checkoutModal.classList.add('active');
            overlay.classList.add('active');
        }

        function placeOrderHandler() {
            // Get selected payment method
            const selectedPayment = document.querySelector('input[name="payment"]:checked');
            
            if (!selectedPayment) {
                alert('Please select a payment method');
                return;
            }
            
            const paymentMethod = selectedPayment.value;
            
            // Validate payment details if needed
            if (paymentMethod === 'card') {
                const cardNumber = document.getElementById('card-number').value;
                const expiry = document.getElementById('expiry').value;
                const cvv = document.getElementById('cvv').value;
                const cardName = document.getElementById('card-name').value;
                
                if (!cardNumber || !expiry || !cvv || !cardName) {
                    alert('Please fill all card details');
                    return;
                }
            } else if (paymentMethod === 'upi') {
                const upiId = document.getElementById('upi-id').value;
                
                if (!upiId) {
                    alert('Please enter UPI ID');
                    return;
                }
            }
            
            // Close checkout modal and show success
            checkoutModal.classList.remove('active');
            successModal.classList.add('active');
        }
