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
        title: 'Lahenga',
        description: 'Premium Bridal Lahenga',
        image:
            'https://res.cloudinary.com/dssrbwsum/image/upload/v1775675159/KA-5032_Wine-3_zoom_oeebft.jpg',
    },
    {
        title: 'Shervani',
        description: 'Premium Grooms Sherwani',
        image:
            'https://res.cloudinary.com/dssrbwsum/image/upload/v1775678232/embroidered-hand-and-thread-work-art-silk-sherwani-mens-wear-in-cream-277490-1000x1375_of1bnt.webp',
    },
    {
        title: 'Jodhpuri',
        description: 'Royal Jodhpuri Suit',
        image:
            'https://res.cloudinary.com/dssrbwsum/image/upload/v1775675242/beige-rayon-jodhpuri-suit-for-men-with-zardosi-embroidery-sg333500-1_hztirx.jpg',
    },
    {
        title: 'Westren',
        description: 'Classic westren Dress',
        image:
            'https://res.cloudinary.com/dssrbwsum/image/upload/v1775675324/Maggie-Sottero-Verina-Ballgown-Wedding-Dress-26MK465A01-PROMO10-IV002-Uncropped_2x_q8xbri.webp',
    },
    

];

export const products = [
    {
        id: '1',
        name: 'Classic White T-Shirt',
        description: 'Essential organic cotton tee with premium fit',
        price: 59,

        images: [
            'https://i.pinimg.com/564x/21/ec/10/21ec10b27844f441f427460556299acf.jpg',
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Black', 'Beige'],
        colors: ['White', 'Black', 'Beige'],
        stock: 1,
        collections: ['Essentials'],
    },
    {
        id: '2',
        name: 'Minimalist Black Jacket',
        description: 'Sleek lightweight jacket for any occasion',
        price: 249,

        images: [
            'https://res.cloudinary.com/dssrbwsum/image/upload/v1770795219/IMG_7092_z3o26o.jpg',
            'https://images.unsplash.com/photo-1551028919-ac66c5f801f9?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1548126466-4470dfd3a209?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1545959570-a925d2a68881?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy'],
        colors: ['Black', 'Navy'],
        stock: 30,
        collections: ['Outerwear', 'Essentials'],
    },
    {
        id: '3',
        name: 'Beige Trench Coat',
        description: 'Timeless double-breasted design',
        price: 299,

        images: [
            'https://res.cloudinary.com/dssrbwsum/image/upload/v1770795219/IMG_7092_z3o26o.jpg',
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1588099768531-a72d4a198538?w=800&auto=format&fit=crop&q=80',
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

        images: [
            'https://images.unsplash.com/photo-1469301749421-01a2285f55c7?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Navy', 'Black', 'Beige'],
        colors: ['Navy', 'Black', 'Beige'],
        stock: 40,
        collections: ['Essentials'],
    },
    {
        id: '5',
        name: 'Premium White Hoodie',
        description: 'Heavyweight cotton blend comfort',
        price: 119,

        images: [
            'https://images.unsplash.com/photo-1632065509860-4fbcfc89ed7c?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1520975661189-8bd99db363cc?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Black', 'Beige'],
        colors: ['White', 'Black', 'Beige'],
        stock: 45,
        collections: ['Essentials'],
    },
    {
        id: '6',
        name: 'Essential Black Pants',
        description: 'Tailored fit for modern elegance',
        price: 129,

        images: [
            'https://images.unsplash.com/photo-1583932387999-dcc7fb40bc40?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1542272617-0858607c22f7?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Black', 'Navy'],
        colors: ['Black', 'Navy'],
        stock: 35,
        collections: ['Essentials'],
    },
    {
        id: '7',
        name: 'Camel Overcoat',
        description: 'Luxurious wool blend outerwear',
        price: 259,

        images: [
            'https://images.unsplash.com/photo-1544745342-2cc3cbce0066?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Beige', 'Black'],
        colors: ['Beige', 'Black'],
        stock: 20,
        collections: ['Outerwear', 'Limited Edition'],
    },
    {
        id: '8',
        name: 'Structured Blazer',
        description: 'Sharp silhouette for professional settings',
        price: 279,

        images: [
            'https://images.unsplash.com/photo-1693397136884-91bae40e96ae?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1598532163257-5260172e4b2d?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy'],
        colors: ['Black', 'Navy'],
        stock: 28,
        collections: ['Outerwear', 'Essentials'],
    },
    {
        id: '9',
        name: 'Essential Black T-Shirt',
        description: 'Wardrobe staple in premium cotton',
        price: 59,

        images: [
            'https://images.unsplash.com/photo-1641236210747-48bc43e4517f?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'White', 'Navy'],
        colors: ['Black', 'White', 'Navy'],
        stock: 60,
        collections: ['Essentials'],
    },
    {
        id: '10',
        name: 'Relaxed Fit Chinos',
        description: 'Comfortable everyday trousers',
        price: 99,

        images: [
            'https://images.unsplash.com/photo-1583932387999-dcc7fb40bc40?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1604176354204-9268737828fa?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1542272617-0858607c22f7?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Beige', 'Navy', 'Black'],
        colors: ['Beige', 'Navy', 'Black'],
        stock: 42,
        collections: ['Essentials'],
    },
    {
        id: '11',
        name: 'Wide Leg Pants',
        description: 'Contemporary silhouette with comfort',
        price: 119,

        images: [
            'https://images.unsplash.com/photo-1583932387999-dcc7fb40bc40?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1604176354204-9268737828fa?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1542272617-0858607c22f7?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Black', 'Beige'],
        colors: ['Black', 'Beige'],
        stock: 33,
        collections: ['Limited Edition'],
    },
    {
        id: '12',
        name: 'Leather Crossbody Bag',
        description: 'Handcrafted Italian leather',
        price: 159,

        images: [
            'https://images.unsplash.com/photo-1693397136884-91bae40e96ae?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1590874103328-eac65a683c11?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['One Size'],
        colors: ['Black', 'Beige'],
        colors: ['Black', 'Beige'],
        stock: 18,
        collections: ['Accessories', 'Limited Edition'],
    },
    {
        id: '13',
        name: 'Structured Tote',
        description: 'Spacious leather carryall',
        price: 189,

        images: [
            'https://images.unsplash.com/photo-1693397136884-91bae40e96ae?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1590874103328-eac65a683c11?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['One Size'],
        colors: ['Black', 'Beige'],
        colors: ['Black', 'Beige'],
        stock: 22,
        collections: ['Accessories'],
    },
    {
        id: '14',
        name: 'Minimalist Backpack',
        description: 'Modern functionality meets style',
        price: 179,

        images: [
            'https://images.unsplash.com/photo-1693397136884-91bae40e96ae?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&auto=format&fit=crop&q=80',
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

        images: [
            'https://images.unsplash.com/photo-1693397136884-91bae40e96ae?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&auto=format&fit=crop&q=80',
        ],
        sizes: ['One Size'],
        colors: ['Black', 'Navy'],
        stock: 25,
    },
];

// Helper: find a single product by ID
export const getProductById = (id) => products.find((p) => p.id === id);


