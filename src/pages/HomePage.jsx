import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    initializeProducts();
    loadProducts();
  }, []);

  const initializeProducts = () => {
    // const existingProducts = localStorage.getItem('ecommerce_products');
    
      const initialProducts = [
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
  };

  const loadProducts = () => {
    const storedProducts = JSON.parse(localStorage.getItem('ecommerce_products')) || initialProducts;
    setProducts(storedProducts.slice(0, 6));
  };

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

  const collections = [
    {
      title: 'Essentials',
      description: 'Timeless pieces for everyday wear',
      image: 'https://drive.google.com/thumbnail?id=165VDZyb24WB1BcPuGt_HiRWCz48TzmtS&sz=w1000',
    },
    {
      title: 'Outerwear',
      description: 'Premium jackets and coats',
      image: 'https://drive.google.com/thumbnail?id=1nW9oNAqckt7xrAayGyEEurBw5CWJ7Fzr&sz=w1000',
    },
    {
      title: 'Accessories',
      description: 'Complete your look',
      image: 'https://res.cloudinary.com/dssrbwsum/image/upload/v1770795219/IMG_7092_z3o26o.jpg',
    },
    {
      title: 'Limited Edition',
      description: 'Exclusive seasonal pieces',
      image: 'https://res.cloudinary.com/dssrbwsum/image/upload/v1770795219/IMG_7092_z3o26o.jpg',
    },
  ];

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
        <title>MINIMAL - Premium Minimalist Fashion</title>
        <meta name="description" content="Discover premium minimalist fashion for the modern individual. Shop timeless pieces crafted with quality and style." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://res.cloudinary.com/dssrbwsum/image/upload/v1770795216/WhatsApp_Image_2026-02-10_at_21.47.09_iqoq6x.jpg)',
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
              Premium minimalist fashion for the modern individual
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
              {collections.map((collection, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Link
                    to="/shop"
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
              {products.map((product) => (
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
                    <p className="text-gray-600">${product.price}</p>
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

        {/* Newsletter Section */}
        <section className="py-20 px-6 bg-black text-white">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
              <p className="text-gray-300 mb-8">
                Subscribe to our newsletter for exclusive offers and early access to new collections
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-white text-black rounded font-semibold hover:bg-gray-200 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;