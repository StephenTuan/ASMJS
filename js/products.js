// Dữ liệu sản phẩm
const products = [
    {
        id: 1,
        name: 'Laptop Gaming Asus ROG Strix G15',
        price: 25990000,
        image: 'images/sp.jpg',
        images: ['images/sp.jpg', 'images/sp.jpg'],
        description: 'Laptop gaming hiệu năng cao với card đồ họa RTX 3060.',
        category: 'laptop',
        specifications: {
            cpu: 'AMD Ryzen 7 5800H',
            ram: '16GB DDR4 3200MHz',
            storage: '512GB NVMe SSD',
            display: '15.6 inch FHD IPS 144Hz',
            gpu: 'NVIDIA GeForce RTX 3060 6GB',
            battery: '4-cell, 90WHr',
            weight: '2.3 kg'
        }
    },
    {
        id: 2,
        name: "Điện thoại iPhone 14 Pro",
        price: 27990000,
        image: "images/sp.jpg",
        description: "Điện thoại cao cấp với chip A16 Bionic, camera 48MP, màn hình Dynamic Island",
        category: "smartphone",
        specifications: {
            processor: "A16 Bionic",
            ram: "6GB",
            storage: "256GB",
            display: "6.1 inch Super Retina XDR",
            camera: "48MP + 12MP + 12MP",
            battery: "3200mAh",
            weight: "206g"
        },
        images: [
            "images/sp.jpg",
            "images/sp.jpg",
            "images/sp.jpg"
        ]
    },
    {
        id: 3,
        name: "Laptop MacBook Air M2",
        price: 32990000,
        image: "images/sp.jpg",
        description: "Laptop mỏng nhẹ với chip M2, màn hình Liquid Retina, thời lượng pin lên đến 18 giờ",
        category: "laptop",
        specifications: {
            processor: "Apple M2",
            ram: "8GB",
            storage: "256GB SSD",
            display: "13.6 inch Liquid Retina",
            graphics: "Apple M2 GPU 8 nhân",
            battery: "52.6WHr",
            weight: "1.24 kg"
        },
        images: [
            "images/sp.jpg",
            "images/sp.jpg",
            "images/sp.jpg"
        ]
    },
    {
        id: 4,
        name: "Điện thoại Samsung Galaxy S23 Ultra",
        price: 25990000,
        image: "images/sp.jpg",
        description: "Điện thoại cao cấp với camera 200MP, bút S-Pen, màn hình Dynamic AMOLED 2X",
        category: "smartphone",
        specifications: {
            processor: "Snapdragon 8 Gen 2",
            ram: "12GB",
            storage: "256GB",
            display: "6.8 inch Dynamic AMOLED 2X",
            camera: "200MP + 12MP + 10MP + 10MP",
            battery: "5000mAh",
            weight: "233g"
        },
        images: [
            "images/sp.jpg",
            "images/sp.jpg",
            "images/sp.jpg"
        ]
    },
    {
        id: 5,
        name: "Tai nghe Apple AirPods Pro 2",
        price: 6790000,
        image: "images/sp.jpg",
        description: "Tai nghe không dây với chống ồn chủ động, âm thanh không gian, chip H2",
        category: "accessories",
        specifications: {
            chip: "H2",
            battery: "6 giờ nghe (ANC bật)",
            charging: "Sạc không dây MagSafe",
            connectivity: "Bluetooth 5.3",
            features: "Chống ồn chủ động, Âm thanh không gian",
            waterResistant: "IPX4",
            weight: "5.3g (mỗi tai nghe)"
        },
        images: [
            "images/sp.jpg",
            "images/sp.jpg",
            "images/sp.jpg"
        ]
    },
    {
        id: 6,
        name: "Laptop Asus ROG Zephyrus G14",
        price: 35990000,
        image: "images/sp.jpg",
        description: "Laptop gaming mỏng nhẹ với AMD Ryzen 9, NVIDIA RTX 3060, màn hình 14 inch 144Hz",
        category: "laptop",
        specifications: {
            processor: "AMD Ryzen 9 6900HS",
            ram: "16GB DDR5",
            storage: "1TB SSD",
            display: "14 inch QHD 144Hz",
            graphics: "NVIDIA GeForce RTX 3060 6GB",
            battery: "76WHr",
            weight: "1.65 kg"
        },
        images: [
            "images/sp.jpg",
            "images/sp.jpg",
            "images/sp.jpg"
        ]
    },
    {
        id: 7,
        name: "Điện thoại Google Pixel 7 Pro",
        price: 19990000,
        image: "images/sp.jpg",
        description: "Điện thoại với camera hàng đầu, chip Google Tensor G2, màn hình LTPO OLED 120Hz",
        category: "smartphone",
        specifications: {
            processor: "Google Tensor G2",
            ram: "12GB",
            storage: "128GB",
            display: "6.7 inch LTPO OLED 120Hz",
            camera: "50MP + 48MP + 12MP",
            battery: "5000mAh",
            weight: "212g"
        },
        images: [
            "images/sp.jpg",
            "images/sp.jpg",
            "images/sp.jpg"
        ]
    },
    {
        id: 8,
        name: "Chuột gaming Logitech G Pro X Superlight",
        price: 2990000,
        image: "images/sp.jpg",
        description: "Chuột gaming không dây siêu nhẹ chỉ 63g, cảm biến HERO 25K, thời lượng pin 70 giờ",
        category: "accessories",
        specifications: {
            sensor: "HERO 25K",
            dpi: "100-25,600 DPI",
            buttons: "5 nút lập trình được",
            battery: "70 giờ",
            connectivity: "LIGHTSPEED Wireless",
            weight: "63g"
        },
        images: [
            "images/sp.jpg",
            "images/sp.jpg",
            "images/sp.jpg"
        ]
    }
];

// Hàm định dạng giá tiền
function formatCurrency(price) {
    return price.toLocaleString('vi-VN') + ' ₫';
}

// Hàm lấy sản phẩm theo ID
function getProductById(productId) {
    return products.find(product => product.id === parseInt(productId));
}

// Hàm lấy sản phẩm theo danh mục
function getProductsByCategory(category) {
    if (category === 'all') {
        return products;
    }
    return products.filter(product => product.category === category);
}

// Hàm lấy các sản phẩm liên quan (cùng danh mục, trừ sản phẩm hiện tại)
function getRelatedProducts(productId, limit = 4) {
    const currentProduct = getProductById(productId);
    if (!currentProduct) return [];
    
    return products
        .filter(product => product.category === currentProduct.category && product.id !== currentProduct.id)
        .slice(0, limit);
}

// Hàm sắp xếp sản phẩm
function sortProducts(productsList, sortType) {
    const sortedProducts = [...productsList];
    
    switch (sortType) {
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            // Mặc định không sắp xếp
            break;
    }
    
    return sortedProducts;
}

