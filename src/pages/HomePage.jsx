import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { products as staticProducts, collections, heroImage } from '@/data/products';
import { fetchProducts } from '@/lib/supabaseClient';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(data => setProductsList(data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const featuredProducts = [...productsList]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 6);

  const collectionsWithCount = collections.map((collection) => {
    const count = productsList.filter((product) =>
      product.collections?.some(
        (item) => item?.toLowerCase().trim() === collection.title.toLowerCase().trim()
      )
    ).length;

    return {
      ...collection,
      count,
    };
  });

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast({
        title: 'Success!',
        description: 'Thank you for subscribing to our newsletter.',
      });
      setEmail('');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        <title>VRUDHAM - Premium Fashion Store</title>
        <meta name="description" content="Discover premium fashion for the modern individual at VRUDHAM. Shop timeless pieces crafted with quality and style." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImage})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center text-white px-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Elevate Your Style
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Premium fashion for the modern individual
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </section>

        {/* Featured Collections */}
        <section className="py-20 px-6 bg-[#F5F1E8]">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Featured Collections</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Curated selections for every style and occasion
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {collectionsWithCount.map((collection, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Link
                    to={`/shop?collection=${encodeURIComponent(collection.title)}`}
                    className="group block relative overflow-hidden rounded-lg aspect-square"
                  >
                    <img
                      src={collection.image}
                      alt={collection.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                      <p className="text-sm text-gray-200 mb-3">{collection.description}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-300 mb-4">
                        {collection.count} product{collection.count === 1 ? '' : 's'}
                      </p>
                      <span className="text-sm font-semibold group-hover:underline">
                        Explore →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">New Arrivals</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover the latest additions to our collection
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="aspect-square bg-white/5 rounded-lg animate-pulse" />
                ))
              ) : featuredProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <Link
                    to={`/product/${product.id}`}
                    className="group block"
                  >
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
                    <h3 className="font-semibold mb-1">{product.name}</h3>
                    <p className="text-gray-600">₹{product.price}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center mt-12">
              <Link
                to="/shop"
                className="inline-flex items-center px-8 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default HomePage;