// ============================================================
// Centralized Product & Collection Data
// ============================================================
// All product data lives here as simple arrays.
// No database, no localStorage for product definitions.
// Import { products, collections, heroImage } wherever needed.
// ============================================================

export const heroImage =
    'https://res.cloudinary.com/dssrbwsum/image/upload/v1770795216/WhatsApp_Image_2026-02-10_at_21.47.09_iqoq6x.jpg';

export const collections = [
    {
        title: 'Essentials',
        description: 'Timeless pieces for everyday wear',
        image:
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    },
    {
        title: 'Outerwear',
        description: 'Premium jackets and coats',
        image:
            'https://images.unsplash.com/photo-1544745342-2cc3cbce0066?w=800&auto=format&fit=crop&q=80',
    },
    {
        title: 'Accessories',
        description: 'Complete your look',
        image:
            'https://res.cloudinary.com/dssrbwsum/image/upload/v1770795219/IMG_7092_z3o26o.jpg',
    },
    {
        title: 'Limited Edition',
        description: 'Exclusive seasonal pieces',
        image:
            'https://res.cloudinary.com/dssrbwsum/image/upload/v1770795219/IMG_7092_z3o26o.jpg',
    },
];

export const products = [
    {
        id: '1',
        name: 'Classic White T-Shirt',
        description: 'Essential organic cotton tee with premium fit',
        price: 59,
        category: 'Tops',
        images: [
            'https://res.cloudinary.com/dssrbwsum/image/upload/v1770794362/main-sample.png',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Black', 'Beige'],
        stock: 1,
    },
    {
        id: '2',
        name: 'Minimalist Black Jacket',
        description: 'Sleek lightweight jacket for any occasion',
        price: 249,
        category: 'Outerwear',
        images: [
            'https://res.cloudinary.com/dssrbwsum/image/upload/v1770795219/IMG_7092_z3o26o.jpg',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy'],
        stock: 30,
    },
    {
        id: '3',
        name: 'Beige Trench Coat',
        description: 'Timeless double-breasted design',
        price: 299,
        category: 'Outerwear',
        images: [
            'https://res.cloudinary.com/dssrbwsum/image/upload/v1770795219/IMG_7092_z3o26o.jpg',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Beige', 'Black'],
        stock: 25,
    },
    {
        id: '4',
        name: 'Navy Wool Sweater',
        description: 'Premium merino wool construction',
        price: 139,
        category: 'Tops',
        images: [
            'https://images.unsplash.com/photo-1469301749421-01a2285f55c7?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Navy', 'Black', 'Beige'],
        stock: 40,
    },
    {
        id: '5',
        name: 'Premium White Hoodie',
        description: 'Heavyweight cotton blend comfort',
        price: 119,
        category: 'Tops',
        images: [
            'https://images.unsplash.com/photo-1632065509860-4fbcfc89ed7c?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Black', 'Beige'],
        stock: 45,
    },
    {
        id: '6',
        name: 'Essential Black Pants',
        description: 'Tailored fit for modern elegance',
        price: 129,
        category: 'Bottoms',
        images: [
            'https://images.unsplash.com/photo-1583932387999-dcc7fb40bc40?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Black', 'Navy'],
        stock: 35,
    },
    {
        id: '7',
        name: 'Camel Overcoat',
        description: 'Luxurious wool blend outerwear',
        price: 259,
        category: 'Outerwear',
        images: [
            'https://images.unsplash.com/photo-1544745342-2cc3cbce0066?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Beige', 'Black'],
        stock: 20,
    },
    {
        id: '8',
        name: 'Structured Blazer',
        description: 'Sharp silhouette for professional settings',
        price: 279,
        category: 'Outerwear',
        images: [
            'https://images.unsplash.com/photo-1693397136884-91bae40e96ae?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy'],
        stock: 28,
    },
    {
        id: '9',
        name: 'Essential Black T-Shirt',
        description: 'Wardrobe staple in premium cotton',
        price: 59,
        category: 'Tops',
        images: [
            'https://images.unsplash.com/photo-1641236210747-48bc43e4517f?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'White', 'Navy'],
        stock: 60,
    },
    {
        id: '10',
        name: 'Relaxed Fit Chinos',
        description: 'Comfortable everyday trousers',
        price: 99,
        category: 'Bottoms',
        images: [
            'https://images.unsplash.com/photo-1583932387999-dcc7fb40bc40?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Beige', 'Navy', 'Black'],
        stock: 42,
    },
    {
        id: '11',
        name: 'Wide Leg Pants',
        description: 'Contemporary silhouette with comfort',
        price: 119,
        category: 'Bottoms',
        images: [
            'https://images.unsplash.com/photo-1583932387999-dcc7fb40bc40?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Black', 'Beige'],
        stock: 33,
    },
    {
        id: '12',
        name: 'Leather Crossbody Bag',
        description: 'Handcrafted Italian leather',
        price: 159,
        category: 'Accessories',
        images: [
            'https://images.unsplash.com/photo-1693397136884-91bae40e96ae?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['One Size'],
        colors: ['Black', 'Beige'],
        stock: 18,
    },
    {
        id: '13',
        name: 'Structured Tote',
        description: 'Spacious leather carryall',
        price: 189,
        category: 'Accessories',
        images: [
            'https://images.unsplash.com/photo-1693397136884-91bae40e96ae?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['One Size'],
        colors: ['Black', 'Beige'],
        stock: 22,
    },
    {
        id: '14',
        name: 'Minimalist Backpack',
        description: 'Modern functionality meets style',
        price: 179,
        category: 'Accessories',
        images: [
            'https://images.unsplash.com/photo-1693397136884-91bae40e96ae?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['One Size'],
        colors: ['Black', 'Navy'],
        stock: 25,
    },
    {
        id: '15',
        name: 'Minimalist test',
        description: 'Modern functionality meets style',
        price: 179,
        category: 'Accessories',
        images: [
            'https://images.unsplash.com/photo-1693397136884-91bae40e96ae?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['One Size'],
        colors: ['Black', 'Navy'],
        stock: 25,
    },
];

// Helper: find a single product by ID
export const getProductById = (id) => products.find((p) => p.id === id);

// Helper: get products by category
export const getProductsByCategory = (category) =>
    category === 'All'
        ? products
        : products.filter((p) => p.category === category);
