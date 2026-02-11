import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    setLoading(true);
    const cart = JSON.parse(localStorage.getItem('ecommerce_cart') || '{"items":[]}');
    const products = [
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

    const itemsWithDetails = cart.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product,
      };
    });

    setCartItems(itemsWithDetails);
    setLoading(false);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;

    const cart = JSON.parse(localStorage.getItem('ecommerce_cart') || '{"items":[]}');
    cart.items[index].quantity = newQuantity;
    localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    loadCart();
  };

  const removeItem = (index) => {
    const cart = JSON.parse(localStorage.getItem('ecommerce_cart') || '{"items":[]}');
    cart.items.splice(index, 1);
    localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    loadCart();

    toast({
      title: 'Item Removed',
      description: 'The item has been removed from your cart.',
    });
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    // Create order
    const orders = JSON.parse(localStorage.getItem('ecommerce_orders') || '[]');
    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      items: cartItems,
      total: totalWithTax,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    localStorage.setItem('ecommerce_orders', JSON.stringify(orders));

    // Clear cart
    localStorage.setItem('ecommerce_cart', JSON.stringify({ items: [] }));
    window.dispatchEvent(new Event('cartUpdated'));

    toast({
      title: 'Order Placed!',
      description: 'Your order has been successfully placed.',
    });

    navigate('/account');
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.08;
  const totalWithTax = subtotal + shipping + tax;

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
        <title>Shopping Cart - MINIMAL</title>
        <meta name="description" content="Review your shopping cart and proceed to checkout." />
      </Helmet>

      <div className="min-h-screen py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-24 w-24 mx-auto mb-4 text-gray-300" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Link
                to="/shop"
                className="inline-block px-8 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                    <Link to={`/product/${item.product.id}`} className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </Link>

                    <div className="flex-1">
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="font-semibold mb-1 hover:underline">{item.product.name}</h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-2">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="font-semibold">${item.product.price}</p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (8%)</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total</span>
                        <span className="font-bold">${totalWithTax.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full px-8 py-3 bg-black text-white rounded font-semibold hover:bg-gray-800 transition-colors mb-3"
                  >
                    Proceed to Checkout
                  </button>

                  <Link
                    to="/shop"
                    className="block text-center text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;