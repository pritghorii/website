import { createClient } from '@supabase/supabase-js';
import { products as staticProducts, getProductById as getStaticProductById } from '@/data/products';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// ── Products ──────────────────────────────────────────

// ── localStorage helpers (used when Supabase is not configured) ──
const LS_PRODUCTS_KEY = 'ls_products';
const getLsProducts = () => JSON.parse(localStorage.getItem(LS_PRODUCTS_KEY) || '[]');
const setLsProducts = (arr) => localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(arr));

export const fetchProducts = async () => {
  // Fall back to static data + localStorage additions if Supabase is not configured
  if (!supabase) {
    const lsProds = getLsProducts();
    const tombstones = new Set(JSON.parse(localStorage.getItem('ls_deleted_products') || '[]'));
    const staticIds = new Set(staticProducts.map(p => p.id));
    const extra = lsProds.filter(p => !staticIds.has(p.id) && !tombstones.has(p.id));
    // Build merged list: ls overrides for existing ids, filter deleted
    const merged = staticProducts
      .filter(p => !tombstones.has(p.id))
      .map(p => {
        const override = lsProds.find(l => l.id === p.id);
        return override || p;
      });
    return [...merged, ...extra];
  }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data && data.length > 0 ? data : staticProducts;
  } catch {
    return staticProducts;
  }
};

export const fetchProductById = async (id) => {
  // Fall back to static data + localStorage if Supabase is not configured
  if (!supabase) {
    const staticProd = getStaticProductById(id);
    if (staticProd) return staticProd;
    
    const lsProds = getLsProducts();
    return lsProds.find(p => p.id === id) || null;
  }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data || getStaticProductById(id) || null;
  } catch {
    const staticProd = getStaticProductById(id);
    if (staticProd) return staticProd;
    
    const lsProds = getLsProducts();
    return lsProds.find(p => p.id === id) || null;
  }
};

export const createProduct = async (product) => {
  if (!supabase) {
    const newProduct = {
      ...product,
      id: 'ls_' + Date.now().toString(36),
      created_at: new Date().toISOString(),
    };
    const prods = getLsProducts();
    prods.push(newProduct);
    setLsProducts(prods);
    return newProduct;
  }
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateProduct = async (id, updates) => {
  if (!supabase) {
    const prods = getLsProducts();
    const idx = prods.findIndex(p => p.id === id);
    if (idx !== -1) {
      prods[idx] = { ...prods[idx], ...updates };
    } else {
      // It's a static product being edited — store override in ls
      const staticId = staticProducts.find(p => p.id === id);
      if (staticId) prods.push({ ...staticId, ...updates });
    }
    setLsProducts(prods);
    return prods.find(p => p.id === id) || updates;
  }
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteProduct = async (id) => {
  if (!supabase) {
    const prods = getLsProducts();
    setLsProducts(prods.filter(p => p.id !== id));
    // For static products, mark as deleted with a tombstone
    const tombstones = JSON.parse(localStorage.getItem('ls_deleted_products') || '[]');
    if (!tombstones.includes(id)) tombstones.push(id);
    localStorage.setItem('ls_deleted_products', JSON.stringify(tombstones));
    return;
  }
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
};

// ── Orders ────────────────────────────────────────────

export const fetchOrders = async () => {
  if (!supabase) return JSON.parse(localStorage.getItem('ls_orders') || '[]');
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const updateOrderStatus = async (id, status) => {
  if (!supabase) {
    const orders = JSON.parse(localStorage.getItem('ls_orders') || '[]');
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) orders[idx].status = status;
    localStorage.setItem('ls_orders', JSON.stringify(orders));
    return orders[idx] || {};
  }
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const createOrder = async (order) => {
  if (!supabase) {
    const newOrder = { ...order, id: 'ord_' + Date.now().toString(36), created_at: new Date().toISOString() };
    const orders = JSON.parse(localStorage.getItem('ls_orders') || '[]');
    orders.unshift(newOrder);
    localStorage.setItem('ls_orders', JSON.stringify(orders));
    return newOrder;
  }
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ── Customers ─────────────────────────────────────────

export const fetchCustomers = async () => {
  if (!supabase) return JSON.parse(localStorage.getItem('ls_customers') || '[]');
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

// ── Cart ──────────────────────────────────────────────

export const fetchCartItems = async (userId) => {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
};

export const addCartItem = async (userId, productId, quantity, size, color) => {
  const { data, error } = await supabase
    .from('cart_items')
    .insert([{ user_id: userId, product_id: productId, quantity, size, color }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateCartItem = async (id, quantity) => {
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const removeCartItem = async (id) => {
  const { error } = await supabase.from('cart_items').delete().eq('id', id);
  if (error) throw error;
};