import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  BarChart3,
  ArrowLeft,
  LogOut,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
  ArrowUpRight,
} from 'lucide-react';
import { fetchProducts, fetchOrders, fetchCustomers } from '@/lib/supabaseClient';

const monthlyData = [
  { month: 'Oct', revenue: 68000, orders: 142 },
  { month: 'Nov', revenue: 82000, orders: 178 },
  { month: 'Dec', revenue: 115000, orders: 245 },
  { month: 'Jan', revenue: 95000, orders: 201 },
  { month: 'Feb', revenue: 104000, orders: 218 },
  { month: 'Mar', revenue: 124500, orders: 248 },
];

const topCategories = [
  { name: 'Essentials', percentage: 42, revenue: '₹52,290', color: 'from-indigo-500 to-blue-500' },
  { name: 'Outerwear', percentage: 28, revenue: '₹34,860', color: 'from-purple-500 to-pink-500' },
  { name: 'Accessories', percentage: 18, revenue: '₹22,410', color: 'from-amber-500 to-orange-500' },
  { name: 'Limited Edition', percentage: 12, revenue: '₹14,940', color: 'from-emerald-500 to-teal-500' },
];

const trafficSources = [
  { source: 'Direct', visits: '3,421', percent: 35 },
  { source: 'Google Search', visits: '2,856', percent: 29 },
  { source: 'Social Media', visits: '1,962', percent: 20 },
  { source: 'Referral', visits: '1,078', percent: 11 },
  { source: 'Email', visits: '489', percent: 5 },
];

const AdminAnalyticsPage = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({ revenue: 0, orders: 0, customers: 0, avgValue: 0 });
  const [revenueData, setRevenueData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [productsData, ordersData, customersData] = await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchCustomers()
      ]);

      const totalRevenue = ordersData.reduce((acc, o) => acc + (parseFloat(o.total) || 0), 0);
      const totalOrders = ordersData.length;
      const totalCustomers = customersData.length;
      const avgValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      setStats({
        revenue: totalRevenue,
        orders: totalOrders,
        customers: totalCustomers,
        avgValue: avgValue
      });

      // Simple category breakdown from products
      const cats = {};
      productsData.forEach(p => {
        const cat = p.collections?.[0] || 'Uncategorized';
        cats[cat] = (cats[cat] || 0) + 1;
      });
      const catList = Object.entries(cats).map(([name, count]) => ({
        name,
        percentage: Math.round((count / productsData.length) * 100),
        revenue: '₹' + (totalRevenue * (count / productsData.length) / 10).toFixed(0) + 'K', // Estimated
        color: name === 'Essentials' ? 'from-indigo-500 to-blue-500' : 'from-purple-500 to-pink-500'
      }));
      setCategories(catList);

      setLoading(false);
    } catch (err) {
      console.error('Analytics load error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) { navigate('/admin', { replace: true }); return; }
    try { setAdmin(JSON.parse(session)); } catch { navigate('/admin', { replace: true }); }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin');
  };

  if (!admin) return null;

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <>
      <Helmet><title>Analytics - VRUDHAM Admin</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-gray-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/admin/dashboard')} className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold tracking-tight">
                Analytics <span className="text-gray-500 font-normal">/ Overview</span>
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
          {/* Highlight Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: DollarSign, label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, change: '+18.2%', up: true, color: 'from-emerald-500 to-emerald-600' },
              { icon: ShoppingCart, label: 'Total Orders', value: stats.orders.toString(), change: '+12.5%', up: true, color: 'from-blue-500 to-blue-600' },
              { icon: Users, label: 'Total Customers', value: stats.customers.toString(), change: '+6.8%', up: true, color: 'from-purple-500 to-purple-600' },
              { icon: Eye, label: 'Avg. Order', value: `₹${stats.avgValue.toFixed(0)}`, change: '-2.1%', up: false, color: 'from-amber-500 to-orange-600' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                    stat.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-0.5">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  Monthly Revenue
                </h3>
                <span className="text-xs text-gray-500 px-3 py-1 rounded-full bg-white/[0.05]">Last 6 months</span>
              </div>
              <div className="flex items-end gap-3 h-52">
                {monthlyData.map((d, i) => {
                  const height = (d.revenue / maxRevenue) * 100;
                  return (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 relative group cursor-pointer hover:from-indigo-500 hover:to-indigo-300 transition-colors"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 px-2 py-1 rounded-lg">
                          ₹{(d.revenue / 1000).toFixed(0)}K
                        </div>
                      </motion.div>
                      <span className="text-xs text-gray-500">{d.month}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-purple-400" />
                Top Categories
              </h3>
              <div className="space-y-5">
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{cat.revenue}</span>
                        <span className="text-xs font-semibold text-gray-300">{cat.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percentage}%` }}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Traffic Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
          >
            <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                Traffic Sources
              </h3>
              <span className="text-xs text-gray-500 px-3 py-1 rounded-full bg-white/[0.05]">This month</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-left border-b border-white/[0.04]">
                    <th className="px-6 py-3 font-medium">Source</th>
                    <th className="px-6 py-3 font-medium">Visits</th>
                    <th className="px-6 py-3 font-medium">Share</th>
                    <th className="px-6 py-3 font-medium w-1/3">Distribution</th>
                  </tr>
                </thead>
                <tbody>
                  {trafficSources.map((src, i) => (
                    <motion.tr
                      key={src.source}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.06 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-white">{src.source}</td>
                      <td className="px-6 py-4 text-gray-300">{src.visits}</td>
                      <td className="px-6 py-4 text-gray-300">{src.percent}%</td>
                      <td className="px-6 py-4">
                        <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${src.percent}%` }}
                            transition={{ delay: 0.9 + i * 0.08, duration: 0.6 }}
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default AdminAnalyticsPage;
