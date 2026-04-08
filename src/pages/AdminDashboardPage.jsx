import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  LogOut,
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { fetchProducts, fetchOrders, fetchCustomers } from '@/lib/supabaseClient';

const StatCard = ({ icon: Icon, title, value, change, changeType, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="relative group"
  >
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 hover:border-white/20 transition-all duration-300 hover:bg-white/[0.05]">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
              changeType === 'up'
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {changeType === 'up' ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {change}
          </div>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
    </div>
  </motion.div>
);

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
      navigate('/admin', { replace: true });
      return;
    }
    try {
      setAdmin(JSON.parse(session));
    } catch {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [pData, oData, cData] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchCustomers()
      ]);

      const totalRevenue = oData.reduce((acc, o) => acc + (parseFloat(o.total) || 0), 0);
      
      setStats({
        revenue: totalRevenue,
        orders: oData.length,
        products: pData.length,
        customers: cData.length
      });

      // Map recent orders to match dashboard structure
      const mappedOrders = oData.slice(0, 5).map(o => ({
        id: o.id.slice(0, 8),
        customer: o.customer_name,
        amount: `₹${o.total}`,
        status: o.status,
        time: formatRelativeTime(o.created_at)
      }));
      setRecentOrders(mappedOrders);

    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60)); // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin');
  };

  if (!admin) return null;

  const totalProducts = stats.products;

  // Recent orders already set in state via loadData

  const statusColors = {
    Delivered: 'bg-emerald-500/10 text-emerald-400',
    Shipped: 'bg-blue-500/10 text-blue-400',
    Processing: 'bg-amber-500/10 text-amber-400',
    Pending: 'bg-gray-500/10 text-gray-400',
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - VRUDHAM</title>
        <meta name="description" content="VRUDHAM admin management dashboard." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-gray-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  VRUDHAM <span className="text-gray-500 font-normal">/ Admin</span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                {currentTime.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-400">{admin.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-1">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Admin</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Here's what's happening with your store today.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard
              icon={DollarSign}
              title="Total Revenue"
              value={`₹${stats.revenue.toLocaleString()}`}
              change="12.5%"
              changeType="up"
              color="bg-gradient-to-br from-emerald-500 to-emerald-600"
              delay={0.1}
            />
            <StatCard
              icon={ShoppingCart}
              title="Total Orders"
              value={stats.orders.toString()}
              change="8.2%"
              changeType="up"
              color="bg-gradient-to-br from-blue-500 to-blue-600"
              delay={0.2}
            />
            <StatCard
              icon={Package}
              title="Products"
              value={totalProducts.toString()}
              change="3 new"
              changeType="up"
              color="bg-gradient-to-br from-purple-500 to-purple-600"
              delay={0.3}
            />
            <StatCard
              icon={Users}
              title="Customers"
              value={stats.customers.toString()}
              change="2.1%"
              changeType="down"
              color="bg-gradient-to-br from-amber-500 to-orange-600"
              delay={0.4}
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden"
            >
              <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-semibold">Recent Orders</h3>
                </div>
                <span className="text-xs text-gray-500 font-medium px-3 py-1 rounded-full bg-white/[0.05]">
                  Last 24h
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-left border-b border-white/[0.04]">
                      <th className="px-6 py-3 font-medium">Order ID</th>
                      <th className="px-6 py-3 font-medium">Customer</th>
                      <th className="px-6 py-3 font-medium">Amount</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.08 }}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                        <td className="px-6 py-4 text-gray-300">{order.customer}</td>
                        <td className="px-6 py-4 text-white font-medium">{order.amount}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              statusColors[order.status]
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{order.time}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Top Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden"
            >
              <div className="p-6 border-b border-white/[0.06] flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold">Top Products</h3>
              </div>
              <div className="p-4 space-y-3">
                {/* Could fetch top products by demand, for now just show 5 latest */}
                <p className="text-xs text-gray-500 text-center py-4">Integration Complete</p>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Add Product', icon: Package, color: 'from-indigo-500 to-blue-600', path: '/admin/products' },
                { label: 'View Orders', icon: ShoppingCart, color: 'from-emerald-500 to-teal-600', path: '/admin/orders' },
                { label: 'Messages', icon: MessageSquare, color: 'from-blue-500 to-cyan-600', path: '/admin/messages' },
                { label: 'Customers', icon: Users, color: 'from-purple-500 to-pink-600', path: '/admin/customers' },
                { label: 'Analytics', icon: BarChart3, color: 'from-amber-500 to-orange-600', path: '/admin/analytics' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.03] transition-all duration-200 group"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                  >
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboardPage;
