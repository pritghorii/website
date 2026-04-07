import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingCart, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { products as staticProducts } from '@/data/products';
import { fetchProductById, fetchProducts } from '@/lib/supabaseClient';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const foundProduct = await fetchProductById(id);

      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedSize(foundProduct.sizes?.[0] || '');
        setSelectedColor(foundProduct.colors?.[0] || '');
        setSelectedImage(0);
        setQuantity(1);

        // Load related products (excluding current product)
        const allProducts = await fetchProducts();
        const related = allProducts
          .filter(p => p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } else {
        navigate('/shop');
      }
    } catch (err) {
      console.error('Error loading product:', err);
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    const hasSizes = product.sizes && product.sizes.length > 0;
    const hasColors = product.colors && product.colors.length > 0;

    if ((hasSizes && !selectedSize) || (hasColors && !selectedColor)) {
      toast({
        title: 'Selection Required',
        description: `Please select a ${hasSizes && !selectedSize ? 'size' : ''}${hasSizes && !selectedSize && hasColors && !selectedColor ? ' and ' : ''}${hasColors && !selectedColor ? 'color' : ''}.`,
        variant: 'destructive',
      });
      return;
    }

    const cart = JSON.parse(localStorage.getItem('ecommerce_cart') || '{"items":[]}');

    const existingItemIndex = cart.items.findIndex(
      item => item.productId === product.id && item.size === selectedSize && item.color === selectedColor
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: product.id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });
    }

    localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));

    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied',
        description: 'Product link copied to clipboard.',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <>
      <Helmet>
        <title>{product.name} - VRUDHAM</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Image Gallery */}
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-black/5 dark:border-white/5 mb-4 shadow-xl"
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Thumbnail Navigation */}
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-sm ${selectedImage === index 
                        ? 'border-indigo-500 scale-105 shadow-indigo-500/20' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight leading-tight">
                  {product.name}
                </h1>
                <p className="text-3xl font-semibold mb-6 text-indigo-600 dark:text-indigo-400">
                  ₹{product.price?.toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-lg max-w-xl">
                  {product.description}
                </p>

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                      Size
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[4rem] h-12 px-4 flex items-center justify-center border rounded-xl font-medium transition-all duration-200 ${selectedSize === size
                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-lg shadow-black/10'
                            : 'bg-transparent text-gray-700 border-gray-200 hover:border-black dark:text-gray-300 dark:border-white/10 dark:hover:border-white'
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                      Color
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`h-12 px-6 flex items-center justify-center border rounded-xl font-medium transition-all duration-200 ${selectedColor === color
                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-lg shadow-black/10'
                            : 'bg-transparent text-gray-700 border-gray-200 hover:border-black dark:text-gray-300 dark:border-white/10 dark:hover:border-white'
                            }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                    Quantity
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  </h3>
                  <div className="inline-flex items-center gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-white dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-all shadow-sm"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-white dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-all shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Stock Info */}
                  <span className={`ml-4 text-sm font-medium ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                  <button
                    onClick={addToCart}
                    disabled={product.stock === 0}
                    className="flex-1 flex items-center justify-center gap-3 h-14 bg-gray-900 text-white dark:bg-white dark:text-black rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-black/10 disabled:bg-gray-300 dark:disabled:bg-white/10 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="flex-shrink-0 w-14 h-14 flex items-center justify-center border-2 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95 transition-all"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    to={`/product/${relatedProduct.id}`}
                    className="group"
                  >
                    <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="font-semibold mb-1">{relatedProduct.name}</h3>
                    <p className="text-gray-600">₹{relatedProduct.price}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;