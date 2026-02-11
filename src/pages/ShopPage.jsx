import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, selectedCategory, priceRange, sortBy]);

  const loadProducts = () => {
    setLoading(true);
    const storedProducts = [
        {
          id: '1',
          name: 'Classic White T-Shirt',
          description: 'Essential organic cotton tee with premium fit',
          price: 59,
          category: 'Tops',
          images: ['https://res.cloudinary.com/dssrbwsum/image/upload/v1770794362/main-sample.png'],
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
          images: ['https://res.cloudinary.com/dssrbwsum/image/upload/v1770795219/IMG_7092_z3o26o.jpg'],
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
          images: ['https://res.cloudinary.com/dssrbwsum/image/upload/v1770795219/IMG_7092_z3o26o.jpg'],
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
          images: ['https://images.unsplash.com/photo-1469301749421-01a2285f55c7'],
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
          images: ['https://images.unsplash.com/photo-1632065509860-4fbcfc89ed7c'],
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
          images: ['https://images.unsplash.com/photo-1583932387999-dcc7fb40bc40'],
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
          images: ['https://images.unsplash.com/photo-1544745342-2cc3cbce0066'],
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
          images: ['https://images.unsplash.com/photo-1693397136884-91bae40e96ae'],
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
          images: ['https://images.unsplash.com/photo-1641236210747-48bc43e4517f'],
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
          images: ['https://images.unsplash.com/photo-1583932387999-dcc7fb40bc40'],
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
          images: ['https://images.unsplash.com/photo-1583932387999-dcc7fb40bc40'],
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
          images: ['https://images.unsplash.com/photo-1693397136884-91bae40e96ae'],
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
          images: ['https://images.unsplash.com/photo-1693397136884-91bae40e96ae'],
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
          images: ['https://images.unsplash.com/photo-1693397136884-91bae40e96ae'],
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
          images: ['https://images.unsplash.com/photo-1693397136884-91bae40e96ae'],
          sizes: ['One Size'],
          colors: ['Black', 'Navy'],
          stock: 25,
        },
      ];
    setProducts(storedProducts);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Price range filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        // Already in newest order
        break;
    }

    setFilteredProducts(filtered);
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-4">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                selectedCategory === category
                  ? 'bg-black text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={300}
            step={10}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shop - MINIMAL</title>
        <meta name="description" content="Browse our collection of premium minimalist fashion. Find the perfect pieces to elevate your wardrobe." />
      </Helmet>

      <div className="min-h-screen py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Shop All</h1>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>

                {/* Sort */}
                <div className="flex-1 sm:flex-none sm:w-48">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar />
              </div>
            </aside>

            {/* Mobile Filter Modal */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)}>
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white h-full w-80 max-w-full p-6 overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <FilterSidebar />
                </motion.div>
              </div>
            )}

            {/* Product Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No products found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setPriceRange([0, 300]);
                    }}
                    className="text-black underline hover:no-underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product) => (
                    <motion.div key={product.id} variants={itemVariants}>
                      <Link to={`/product/${product.id}`} className="group block">
                        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <button className="opacity-0 group-hover:opacity-100 bg-white text-black px-6 py-2 rounded font-semibold transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                              Quick View
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                          <h3 className="font-semibold mb-1">{product.name}</h3>
                          <p className="text-gray-600">${product.price}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopPage;