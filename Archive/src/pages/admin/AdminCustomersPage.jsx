import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  Users,
  ArrowLeft,
  LogOut,
  Clock,
  Search,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  UserCheck,
  UserX,
} from 'lucide-react';

import { fetchCustomers } from '@/lib/supabaseClient';

const AdminCustomersPage = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) { navigate('/admin', { replace: true }); return; }
    try { setAdmin(JSON.parse(session)); } catch { navigate('/admin', { replace: true }); }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await fetchCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin');
  };

  const filtered = customers.filter((c) => {
    const matchesSearch =
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.city || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === 'Active').length;
  const totalSpent = '₹' + customers.reduce((acc, c) => acc + (parseFloat(c.total_spent) || 0), 0).toLocaleString();

  if (!admin) return null;

  return (
    <>
      <Helmet><title>Customers - VRUDHAM Admin</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-gray-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/admin/dashboard')} className="p-2 rounded-lg hover:bg-white/[0.06] transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold tracking-tight">
                Customers <span className="text-gray-500 font-normal">/ Overview</span>
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
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Customers', value: totalCustomers, icon: Users, color: 'from-purple-500 to-pink-600' },
              { label: 'Active', value: activeCustomers, icon: UserCheck, color: 'from-emerald-500 to-emerald-600' },
              { label: 'Total Revenue', value: totalSpent, icon: ShoppingBag, color: 'from-amber-500 to-orange-600' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{s.label}</p>
                  <p className="text-xl font-bold text-white">{s.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, email, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'Active', 'Inactive'].map((s) => (
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

          {/* Customer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((customer, i) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                      {customer.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{customer.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    customer.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-gray-500/10 text-gray-500'
                  }`}>
                    {customer.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-white/[0.03] p-2.5">
                    <p className="text-xs text-gray-500 mb-0.5">Orders</p>
                    <p className="text-sm font-semibold text-white">{customer.total_orders}</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-2.5">
                    <p className="text-xs text-gray-500 mb-0.5">Spent</p>
                    <p className="text-sm font-semibold text-white">₹{customer.total_spent}</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-2.5">
                    <p className="text-xs text-gray-500 mb-0.5">City</p>
                    <p className="text-sm font-semibold text-white truncate">{customer.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  Joined {new Date(customer.created_at).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">No customers found</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminCustomersPage;
