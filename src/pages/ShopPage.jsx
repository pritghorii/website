import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { products as staticProducts } from '@/data/products';
import { fetchProducts } from '@/lib/supabaseClient';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const collectionParam = searchParams.get('collection');
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts();
        setProductsList(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const updatePriceBounds = () => {
      if (!productsList.length) return;
      const highestPrice = Math.max(...productsList.map((product) => product.price || 0));
      setMaxPrice(highestPrice || 10000);
      setPriceRange([0, highestPrice || 10000]);
    };

    updatePriceBounds();
  }, [productsList]);

  useEffect(() => {
    applyFilters();
  }, [productsList, collectionParam, priceRange, sortBy]);

  const applyFilters = () => {
    let filtered = [...productsList];

    // Collection filter
    if (collectionParam) {
      const normalizedCollection = collectionParam.toLowerCase().trim();
      filtered = filtered.filter((p) =>
        p.collections?.some(
          (collection) => collection?.toLowerCase().trim() === normalizedCollection
        )
      );
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
        filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
    }

    setFilteredProducts(filtered);
  };

  const FilterSidebar = () => (
    <div className="space-y-8">


      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={maxPrice}
            step={50}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
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

  return (
    <>
      <Helmet>
        <title>Shop - VRUDHAM</title>
        <meta name="description" content="Browse our collection of premium fashion at VRUDHAM. Find the perfect pieces to elevate your wardrobe." />
      </Helmet>

      <div className="min-h-screen py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              {collectionParam ? `${collectionParam} Collection` : 'Shop All'}
            </h1>
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
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No products found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setPriceRange([0, 300]);
                      setSearchParams({});
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
                          <h3 className="font-semibold mb-1">{product.name}</h3>
                          <p className="text-gray-600">₹{product.price}</p>
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