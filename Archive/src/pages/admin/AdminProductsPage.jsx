import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  ArrowLeft,
  LayoutDashboard,
  LogOut,
  Clock,
  Save,
  ImagePlus,
} from 'lucide-react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/lib/supabaseClient';

const AdminProductsPage = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = {
    name: '',
    description: '',
    price: '',
    category: '',
    sizes: '',
    colors: '',
    stock: '',
    images: [''],
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) { navigate('/admin', { replace: true }); return; }
    try { setAdmin(JSON.parse(session)); } catch { navigate('/admin', { replace: true }); }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProductList(data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin');
  };

  const openAdd = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.collections?.[0] || '',
      sizes: (product.sizes || []).join(', '),
      colors: (product.colors || []).join(', '),
      stock: (product.stock || 0).toString(),
      images: product.images?.length ? product.images : [''],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const newProduct = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      images: formData.images.filter(Boolean),
      sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: formData.colors.split(',').map((c) => c.trim()).filter(Boolean),
      stock: parseInt(formData.stock) || 0,
      collections: formData.category ? [formData.category] : [],
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, newProduct);
      } else {
        await createProduct(newProduct);
      }
      await loadProducts();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      await loadProducts();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const filtered = productList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!admin) return null;

  return (
    <>
      <Helmet>
        <title>Manage Products - VRUDHAM Admin</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-gray-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/admin/dashboard')} className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold tracking-tight">
                Products <span className="text-gray-500 font-normal">/ Manage</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-white/20 transition-all group"
              >
                <div className="aspect-square bg-gray-800 overflow-hidden">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-white">₹{product.price?.toLocaleString()}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => openEdit(product)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-white/[0.06] hover:bg-white/[0.12] text-gray-300 hover:text-white transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product.id)}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">Try a different search or add a new product.</p>
            </div>
          )}
        </main>

        {/* Add / Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-gray-900 shadow-2xl"
              >
                <div className="sticky top-0 z-10 bg-gray-900 border-b border-white/[0.06] p-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      placeholder="e.g. Premium Black Hoodie"
                    />
                  </div>
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                      placeholder="Short product description"
                    />
                  </div>
                  {/* Price & Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Price (₹)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        placeholder="299"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Stock</label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        placeholder="50"
                      />
                    </div>
                  </div>
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    >
                      <option value="" className="bg-gray-900">Select category</option>
                      <option value="Essentials" className="bg-gray-900">Essentials</option>
                      <option value="Outerwear" className="bg-gray-900">Outerwear</option>
                      <option value="Accessories" className="bg-gray-900">Accessories</option>
                      <option value="Limited Edition" className="bg-gray-900">Limited Edition</option>
                    </select>
                  </div>
                  {/* Sizes & Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center justify-between">
                        Sizes
                        <span className="text-[10px] text-gray-500 font-normal uppercase tracking-wider">Comma sep.</span>
                      </label>
                      <input
                        type="text"
                        value={formData.sizes}
                        onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                        placeholder="e.g. S, M, L"
                      />
                      <p className="text-[10px] text-gray-500 mt-1.5 ml-1 italic">Leave blank for "One Size"</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center justify-between">
                        Colors
                        <span className="text-[10px] text-gray-500 font-normal uppercase tracking-wider">Comma sep.</span>
                      </label>
                      <input
                        type="text"
                        value={formData.colors}
                        onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                        placeholder="e.g. Black, Navy"
                      />
                      <p className="text-[10px] text-gray-500 mt-1.5 ml-1 italic">Leave blank if no colors</p>
                    </div>
                  </div>
                  {/* Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Image URLs</label>
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={img}
                          onChange={(e) => {
                            const imgs = [...formData.images];
                            imgs[idx] = e.target.value;
                            setFormData({ ...formData, images: imgs });
                          }}
                          className="flex-1 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                          placeholder="https://..."
                        />
                        {formData.images.length > 1 && (
                          <button
                            onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                      className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 mt-1 transition-colors"
                    >
                      <ImagePlus className="w-3.5 h-3.5" />
                      Add another image
                    </button>
                  </div>
                </div>
                <div className="sticky bottom-0 bg-gray-900 border-t border-white/[0.06] p-6 flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/[0.06] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!formData.name || !formData.price}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {editingProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl border border-white/10 bg-gray-900 p-6 text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <Trash2 className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Delete Product?</h3>
                <p className="text-sm text-gray-400 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/[0.06] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AdminProductsPage;
