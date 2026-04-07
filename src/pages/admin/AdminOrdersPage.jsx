import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  ArrowLeft,
  LogOut,
  Clock,
  Search,
  Filter,
  Eye,
  ChevronDown,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Timer,
} from 'lucide-react';

import { fetchOrders, updateOrderStatus } from '@/lib/supabaseClient';

const statusConfig = {
  Delivered: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
  Shipped: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Truck },
  Processing: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Timer },
  Pending: { color: 'bg-gray-500/10 text-gray-400 border-gray-500/20', icon: Package },
  Cancelled: { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle },
};

const allStatuses = ['All', 'Delivered', 'Shipped', 'Processing', 'Pending', 'Cancelled'];

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) { navigate('/admin', { replace: true }); return; }
    try { setAdmin(JSON.parse(session)); } catch { navigate('/admin', { replace: true }); }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin');
  };

  const updateStatus = async (orderId, newStatus) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
      loadOrders(); // revert on failure
    }
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      (o.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.customer_email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const summaryStats = {
    total: orders.length,
    delivered: orders.filter((o) => o.status === 'Delivered').length,
    shipped: orders.filter((o) => o.status === 'Shipped').length,
    processing: orders.filter((o) => o.status === 'Processing').length,
    pending: orders.filter((o) => o.status === 'Pending').length,
  };

  if (!admin) return null;

  return (
    <>
      <Helmet><title>Orders - VRUDHAM Admin</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-gray-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/admin/dashboard')} className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold tracking-tight">
                Orders <span className="text-gray-500 font-normal">/ Manage</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all">
                <LogOut className="w-4 h-4" /><span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Summary mini-stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {[
              { label: 'Total', value: summaryStats.total, color: 'from-gray-600 to-gray-700' },
              { label: 'Delivered', value: summaryStats.delivered, color: 'from-emerald-500 to-emerald-600' },
              { label: 'Shipped', value: summaryStats.shipped, color: 'from-blue-500 to-blue-600' },
              { label: 'Processing', value: summaryStats.processing, color: 'from-amber-500 to-amber-600' },
              { label: 'Pending', value: summaryStats.pending, color: 'from-gray-500 to-gray-600' },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-center gap-3"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-xs font-bold text-white`}>
                  {s.value}
                </div>
                <span className="text-sm text-gray-400">{s.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by order ID, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {allStatuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    statusFilter === s
                      ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                      : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-left border-b border-white/[0.06]">
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium hidden sm:table-cell">Items</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium hidden md:table-cell">Date</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, i) => {
                    const cfg = statusConfig[order.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <React.Fragment key={order.id}>
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        >
                          <td className="px-6 py-4 font-medium text-white">{order.id.slice(0, 8)}</td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-white">{order.customer_name}</p>
                              <p className="text-xs text-gray-500">{order.customer_email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-300 hidden sm:table-cell">{order.item_count}</td>
                          <td className="px-6 py-4 text-white font-medium">₹{order.total}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white transition-all">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </motion.tr>
                        {expandedOrder === order.id && (
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <td colSpan={7} className="px-6 py-4 bg-white/[0.01]">
                              <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                                <div className="space-y-1 text-sm">
                                  <p className="text-gray-400">
                                    <span className="text-gray-500">Address:</span>{' '}
                                    <span className="text-gray-300">{order.address}</span>
                                  </p>
                                  <p className="text-gray-400">
                                    <span className="text-gray-500">Placed:</span>{' '}
                                    <span className="text-gray-300">{new Date(order.created_at).toLocaleString()}</span>
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500 mr-2">Update status:</span>
                                  {['Processing', 'Shipped', 'Delivered'].map((s) => (
                                    <button
                                      key={s}
                                      onClick={(e) => { e.stopPropagation(); updateStatus(order.id, s); }}
                                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                                        order.status === s
                                          ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                                          : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                                      }`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No orders found</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminOrdersPage;
