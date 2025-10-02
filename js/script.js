// Đợi cho DOM được tải hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo giỏ hàng từ localStorage hoặc tạo mới nếu chưa có
    initializeCart();
    
    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateCartCount();
    
    // Xác định trang hiện tại và gọi hàm tương ứng
    const currentPage = getCurrentPage();
    loadPageContent(currentPage);
});

// Hàm xác định trang hiện tại
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    if (page === '' || page === 'index.html') {
        return 'home';
    } else if (page === 'products.html') {
        return 'products';
    } else if (page === 'product-detail.html') {
        return 'product-detail';
    } else if (page === 'cart.html') {
        return 'cart';
    } else if (page === 'contact.html') {
        return 'contact';
    }
    
    return 'home'; // Mặc định là trang chủ
}

// Hàm tải nội dung tương ứng với từng trang
function loadPageContent(page) {
    switch (page) {
        case 'home':
            loadFeaturedProducts();
            break;
        case 'products':
            loadAllProducts();
            setupProductFilters();
            break;
        case 'product-detail':
            loadProductDetail();
            setupProductDetailEvents();
            break;
        case 'cart':
            loadCartItems();
            break;
        case 'contact':
            setupContactForm();
            initializeMap();
            break;
    }
}

// Hàm tải sản phẩm nổi bật cho trang chủ
function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (!featuredProductsContainer) return;
    
    // Lấy 4 sản phẩm đầu tiên làm sản phẩm nổi bật
    const featuredProducts = products.slice(0, 4);
    
    featuredProductsContainer.innerHTML = '';
    
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        featuredProductsContainer.appendChild(productCard);
    });
}

// Hàm tải tất cả sản phẩm cho trang sản phẩm
function loadAllProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    // Lấy tham số danh mục từ URL nếu có
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    // Lọc sản phẩm theo danh mục nếu có tham số
    let filteredProducts = categoryParam ? getProductsByCategory(categoryParam) : products;
    
    // Cập nhật bộ lọc danh mục nếu có tham số
    if (categoryParam) {
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.value = categoryParam;
        }
    }
    
    renderProducts(filteredProducts, productsContainer);
}

// Hàm thiết lập bộ lọc sản phẩm
function setupProductFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
}

// Hàm lọc và sắp xếp sản phẩm
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const productsContainer = document.getElementById('products-container');
    
    if (!categoryFilter || !sortFilter || !productsContainer) return;
    
    const category = categoryFilter.value;
    const sortType = sortFilter.value;
    
    // Lọc sản phẩm theo danh mục
    let filteredProducts = getProductsByCategory(category);
    
    // Sắp xếp sản phẩm
    filteredProducts = sortProducts(filteredProducts, sortType);
    
    // Hiển thị sản phẩm đã lọc và sắp xếp
    renderProducts(filteredProducts, productsContainer);
}

// Hàm tạo thẻ sản phẩm
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    productCard.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">${formatCurrency(product.price)}</div>
            <div class="product-description">${product.description}</div>
            <a href="product-detail.html?id=${product.id}" class="btn">Xem chi tiết</a>
        </div>
    `;
    
    // Thêm hiệu ứng hover
    productCard.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    });
    
    productCard.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    });
    
    // Thêm sự kiện click để chuyển đến trang chi tiết
    productCard.addEventListener('click', function(e) {
        if (!e.target.classList.contains('btn')) {
            window.location.href = `product-detail.html?id=${product.id}`;
        }
    });
    
    return productCard;
}

// Hàm hiển thị danh sách sản phẩm
function renderProducts(productsList, container) {
    container.innerHTML = '';
    
    if (productsList.length === 0) {
        container.innerHTML = '<p class="no-products">Không tìm thấy sản phẩm nào.</p>';
        return;
    }
    
    productsList.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Hàm tải chi tiết sản phẩm
function loadProductDetail() {
    const productDetailContainer = document.getElementById('product-detail-container');
    const productDescription = document.getElementById('product-description');
    const productSpecifications = document.getElementById('product-specifications');
    const relatedProductsContainer = document.getElementById('related-products');
    const productName = document.getElementById('product-name');
    
    if (!productDetailContainer) return;
    
    // Lấy ID sản phẩm từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        productDetailContainer.innerHTML = '<p>Không tìm thấy sản phẩm.</p>';
        return;
    }
    
    // Lấy thông tin sản phẩm
    const product = getProductById(parseInt(productId));
    
    if (!product) {
        productDetailContainer.innerHTML = '<p>Không tìm thấy sản phẩm.</p>';
        return;
    }
    
    // Cập nhật tiêu đề trang
    document.title = `${product.name} - TechStore`;
    
    // Cập nhật tên sản phẩm trong breadcrumb
    if (productName) {
        productName.textContent = product.name;
    }
    
    // Hiển thị chi tiết sản phẩm
    productDetailContainer.innerHTML = `
        <div class="product-images">
            <div class="main-image">
                <img src="${product.image}" alt="${product.name}" id="main-product-image">
            </div>
            <div class="thumbnail-images">
                <div class="thumbnail active" data-image="${product.image}">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                ${product.images ? product.images.map((img, index) => `
                    <div class="thumbnail" data-image="${img}">
                        <img src="${img}" alt="${product.name} ${index + 1}">
                    </div>
                `).join('') : ''}
            </div>
        </div>
        <div class="product-info-detail">
            <h2>${product.name}</h2>
            <div class="product-price-detail">${formatCurrency(product.price)}</div>
            <div class="product-description-detail">${product.description}</div>
            <div class="product-actions">
                <div class="quantity">
                    <button id="decrease-quantity">-</button>
                    <input type="number" id="product-quantity" value="1" min="1" max="10">
                    <button id="increase-quantity">+</button>
                </div>
                <button class="btn btn-primary" id="add-to-cart-btn">Thêm vào giỏ hàng</button>
            </div>
        </div>
    `;
    
    // Hiển thị mô tả sản phẩm
    if (productDescription) {
        productDescription.innerHTML = `<p>${product.description}</p>`;
    }
    
    // Hiển thị thông số kỹ thuật
    if (productSpecifications && product.specifications) {
        let specsHTML = '<table class="specs-table">';
        
        for (const [key, value] of Object.entries(product.specifications)) {
            specsHTML += `
                <tr>
                    <td>${formatSpecName(key)}</td>
                    <td>${value}</td>
                </tr>
            `;
        }
        
        specsHTML += '</table>';
        productSpecifications.innerHTML = specsHTML;
    }
    
    // Hiển thị sản phẩm liên quan
    if (relatedProductsContainer) {
        const relatedProducts = getRelatedProducts(productId);
        
        relatedProductsContainer.innerHTML = '';
        
        relatedProducts.forEach(product => {
            const productCard = createProductCard(product);
            relatedProductsContainer.appendChild(productCard);
        });
    }
}

// Hàm thiết lập sự kiện cho trang chi tiết sản phẩm
function setupProductDetailEvents() {
    // Xử lý sự kiện khi click vào thumbnail
    document.addEventListener('click', function(e) {
        if (e.target.closest('.thumbnail')) {
            const thumbnail = e.target.closest('.thumbnail');
            const mainImage = document.getElementById('main-product-image');
            const thumbnails = document.querySelectorAll('.thumbnail');
            
            // Cập nhật ảnh chính
            if (mainImage) {
                mainImage.src = thumbnail.dataset.image;
            }
            
            // Cập nhật trạng thái active cho thumbnail
            thumbnails.forEach(thumb => {
                thumb.classList.remove('active');
            });
            thumbnail.classList.add('active');
        }
    });
    
    // Xử lý sự kiện khi click vào nút tăng/giảm số lượng
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    const quantityInput = document.getElementById('product-quantity');
    
    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
            }
        });
    }
    
    // Xử lý sự kiện khi click vào nút thêm vào giỏ hàng
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = parseInt(urlParams.get('id'));
            const quantity = parseInt(quantityInput.value);
            
            addToCart(productId, quantity);
            
            // Hiển thị thông báo
            alert('Đã thêm sản phẩm vào giỏ hàng!');
            
            // Cập nhật số lượng sản phẩm trong giỏ hàng
            updateCartCount();
        });
    }
    
    // Xử lý sự kiện khi click vào tab
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Cập nhật trạng thái active cho tab button
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Cập nhật trạng thái active cho tab pane
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Hàm định dạng tên thông số kỹ thuật
function formatSpecName(key) {
    // Chuyển đổi camelCase thành từng từ riêng biệt và viết hoa chữ cái đầu
    return key
        .replace(/([A-Z])/g, ' $1') // Thêm khoảng trắng trước chữ cái viết hoa
        .replace(/^./, str => str.toUpperCase()); // Viết hoa chữ cái đầu tiên
}

// Hàm khởi tạo giỏ hàng
function initializeCart() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(productId, quantity = 1) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = getProductById(productId);
    
    if (!product) return;
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Hàm tải các sản phẩm trong giỏ hàng
function loadCartItems() {
    const cartContainer = document.getElementById('cart-container');
    const cartSummary = document.getElementById('cart-summary');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!cartContainer || !cartSummary) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <p>Giỏ hàng của bạn đang trống.</p>
                <a href="products.html" class="btn">Tiếp tục mua sắm</a>
            </div>
        `;
        cartSummary.innerHTML = '';
        
        if (checkoutBtn) {
            checkoutBtn.style.display = 'none';
        }
        
        return;
    }
    
    // Hiển thị các sản phẩm trong giỏ hàng
    let cartHTML = '';
    
    cart.forEach(item => {
        cartHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatCurrency(item.price)}</div>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="10" class="item-quantity">
                    <button class="increase-quantity">+</button>
                </div>
                <div class="cart-item-remove">
                    <i class="fas fa-trash-alt"></i>
                </div>
            </div>
        `;
    });
    
    cartContainer.innerHTML = cartHTML;
    
    // Hiển thị tổng giá trị giỏ hàng
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 30000 : 0; // Phí vận chuyển
    const total = subtotal + shipping;
    
    cartSummary.innerHTML = `
        <h3>Tổng giỏ hàng</h3>
        <div class="summary-row">
            <span>Tạm tính:</span>
            <span>${formatCurrency(subtotal)}</span>
        </div>
        <div class="summary-row">
            <span>Phí vận chuyển:</span>
            <span>${formatCurrency(shipping)}</span>
        </div>
        <div class="summary-row total">
            <span>Tổng cộng:</span>
            <span>${formatCurrency(total)}</span>
        </div>
    `;
    
    // Thiết lập sự kiện cho các nút trong giỏ hàng
    setupCartEvents();
}

// Hàm thiết lập sự kiện cho giỏ hàng
function setupCartEvents() {
    // Xử lý sự kiện khi click vào nút tăng/giảm số lượng
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const productId = parseInt(cartItem.dataset.id);
            const quantityInput = cartItem.querySelector('.item-quantity');
            const currentValue = parseInt(quantityInput.value);
            
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                updateCartItemQuantity(productId, currentValue - 1);
            }
        });
    });
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const productId = parseInt(cartItem.dataset.id);
            const quantityInput = cartItem.querySelector('.item-quantity');
            const currentValue = parseInt(quantityInput.value);
            
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
                updateCartItemQuantity(productId, currentValue + 1);
            }
        });
    });
    
    // Xử lý sự kiện khi thay đổi số lượng trực tiếp
    document.querySelectorAll('.item-quantity').forEach(input => {
        input.addEventListener('change', function() {
            const cartItem = this.closest('.cart-item');
            const productId = parseInt(cartItem.dataset.id);
            const newValue = parseInt(this.value);
            
            if (newValue < 1) {
                this.value = 1;
                updateCartItemQuantity(productId, 1);
            } else if (newValue > 10) {
                this.value = 10;
                updateCartItemQuantity(productId, 10);
            } else {
                updateCartItemQuantity(productId, newValue);
            }
        });
    });
    
    // Xử lý sự kiện khi click vào nút xóa sản phẩm
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const productId = parseInt(cartItem.dataset.id);
            
            removeCartItem(productId);
        });
    });
}

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartItemQuantity(productId, newQuantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Cập nhật lại giỏ hàng
        loadCartItems();
        updateCartCount();
    }
}

// Hàm xóa sản phẩm khỏi giỏ hàng
function removeCartItem(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const newCart = cart.filter(item => item.id !== productId);
    
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Cập nhật lại giỏ hàng
    loadCartItems();
    updateCartCount();
}

// Hàm thiết lập form liên hệ
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    // Thiết lập chức năng camera
    setupCamera();
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Lấy giá trị từ form
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const attachment = document.getElementById('attachment').files[0];
        
        // Kiểm tra dữ liệu
        let isValid = true;
        
        // Kiểm tra tên
        if (name.trim() === '') {
            showError('name-error', 'Vui lòng nhập họ và tên');
            isValid = false;
        } else {
            showError('name-error', '');
        }
        
        // Kiểm tra email
        if (email.trim() === '') {
            showError('email-error', 'Vui lòng nhập email');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email-error', 'Email không hợp lệ');
            isValid = false;
        } else {
            showError('email-error', '');
        }
        
        // Kiểm tra số điện thoại
        if (phone.trim() === '') {
            showError('phone-error', 'Vui lòng nhập số điện thoại');
            isValid = false;
        } else if (!isValidPhone(phone)) {
            showError('phone-error', 'Số điện thoại không hợp lệ');
            isValid = false;
        } else {
            showError('phone-error', '');
        }
        
        // Kiểm tra tin nhắn
        if (message.trim() === '') {
            showError('message-error', 'Vui lòng nhập tin nhắn');
            isValid = false;
        } else {
            showError('message-error', '');
        }
        
        // Kiểm tra file đính kèm nếu có
        if (attachment) {
            const fileSize = attachment.size / 1024 / 1024; // Kích thước tính bằng MB
            const fileType = attachment.type;
            
            if (fileSize > 5) {
                alert('Kích thước file không được vượt quá 5MB');
                isValid = false;
            }
            
            if (!['image/jpeg', 'image/png', 'application/pdf'].includes(fileType)) {
                alert('Chỉ chấp nhận file JPG, PNG hoặc PDF');
                isValid = false;
            }
        }
        
        // Nếu dữ liệu hợp lệ, gửi form
        if (isValid) {
            // Trong thực tế, đây là nơi gửi dữ liệu đến server
            // Nhưng trong bài tập này, chúng ta chỉ hiển thị thông báo
            alert('Cảm ơn bạn đã liên hệ với chúng tôi! Chúng tôi sẽ phản hồi sớm nhất có thể.');
            contactForm.reset();
            
            // Reset camera preview
            const photoPreview = document.getElementById('photo-preview');
            if (photoPreview) {
                photoPreview.innerHTML = '';
            }
            
            // Reset camera buttons
            const startCameraBtn = document.getElementById('start-camera');
            const takePhotoBtn = document.getElementById('take-photo');
            const retakePhotoBtn = document.getElementById('retake-photo');
            
            if (startCameraBtn && takePhotoBtn && retakePhotoBtn) {
                startCameraBtn.style.display = 'inline-block';
                takePhotoBtn.style.display = 'none';
                retakePhotoBtn.style.display = 'none';
                takePhotoBtn.disabled = true;
            }
            
            // Tắt camera nếu đang mở
            const video = document.getElementById('camera');
            if (video && video.srcObject) {
                const tracks = video.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                video.srcObject = null;
                video.style.display = 'none';
            }
        }
    });
}

// Hàm thiết lập chức năng camera
function setupCamera() {
    const startCameraBtn = document.getElementById('start-camera');
    const takePhotoBtn = document.getElementById('take-photo');
    const retakePhotoBtn = document.getElementById('retake-photo');
    const video = document.getElementById('camera');
    const canvas = document.getElementById('canvas');
    const photoPreview = document.getElementById('photo-preview');
    
    if (!startCameraBtn || !takePhotoBtn || !retakePhotoBtn || !video || !canvas || !photoPreview) return;
    
    // Kiểm tra hỗ trợ camera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        startCameraBtn.textContent = 'Camera không được hỗ trợ';
        startCameraBtn.disabled = true;
        return;
    }
    
    // Sự kiện khi click vào nút mở camera
    startCameraBtn.addEventListener('click', function() {
        // Yêu cầu quyền truy cập camera
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                // Hiển thị video từ camera
                video.srcObject = stream;
                video.style.display = 'block';
                video.play();
                
                // Cập nhật trạng thái nút
                startCameraBtn.style.display = 'none';
                takePhotoBtn.style.display = 'inline-block';
                takePhotoBtn.disabled = false;
            })
            .catch(function(error) {
                console.error('Lỗi khi truy cập camera:', error);
                alert('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
            });
    });
    
    // Sự kiện khi click vào nút chụp ảnh
    takePhotoBtn.addEventListener('click', function() {
        // Vẽ hình ảnh từ video lên canvas
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Chuyển đổi canvas thành URL hình ảnh
        const imageUrl = canvas.toDataURL('image/png');
        
        // Hiển thị hình ảnh đã chụp
        photoPreview.innerHTML = `<img src="${imageUrl}" alt="Ảnh đã chụp" class="captured-photo">`;
        
        // Cập nhật trạng thái nút
        takePhotoBtn.style.display = 'none';
        retakePhotoBtn.style.display = 'inline-block';
        
        // Tắt camera
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.style.display = 'none';
    });
    
    // Sự kiện khi click vào nút chụp lại
    retakePhotoBtn.addEventListener('click', function() {
        // Xóa hình ảnh đã chụp
        photoPreview.innerHTML = '';
        
        // Cập nhật trạng thái nút
        retakePhotoBtn.style.display = 'none';
        startCameraBtn.style.display = 'inline-block';
    });
}

// Hàm hiển thị lỗi
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Hàm kiểm tra email hợp lệ
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Hàm kiểm tra số điện thoại hợp lệ
function isValidPhone(phone) {
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    return phoneRegex.test(phone);
}

// Hàm khởi tạo bản đồ
function initializeMap() {
    // Trong thực tế, đây là nơi khởi tạo bản đồ với API như Google Maps
    // Nhưng trong bài tập này, chúng ta chỉ hiển thị hình ảnh tĩnh
    
    // Nếu muốn sử dụng Geolocation API
    const mapContainer = document.getElementById('map');
    
    if (mapContainer && navigator.geolocation) {
        // Hiển thị vị trí người dùng
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            // Hiển thị thông báo
            const locationInfo = document.createElement('div');
            locationInfo.className = 'location-info';
            locationInfo.innerHTML = `
                <p>Vị trí của bạn:</p>
                <p>Vĩ độ: ${latitude}</p>
                <p>Kinh độ: ${longitude}</p>
            `;
            
            mapContainer.appendChild(locationInfo);
        }, function(error) {
            console.error('Lỗi khi lấy vị trí:', error);
        });
    }
}