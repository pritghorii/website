import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Package, User, LogOut, Clock } from 'lucide-react';
import { fetchOrders } from '@/lib/supabaseClient';

const AccountPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const allOrders = await fetchOrders();
      // Filter by user email or ID depending on how they are stored
      const userOrders = allOrders.filter(order => 
        order.user_id === user.id || order.customer_email === user.email
      );
      setOrders(userOrders);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet>
        <title>My Account - VRUDHAM</title>
        <meta name="description" content="Manage your VRUDHAM account, view your orders and update your profile." />
      </Helmet>

      <div className="min-h-screen py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">My Account</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Account Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Account Info</h2>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Orders</h2>
              </div>
              <p className="text-3xl font-bold">{orders.length}</p>
              <p className="text-sm text-gray-600">Total orders placed</p>
            </div>

            {/* Logout Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <LogOut className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Sign Out</h2>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">Order History</h2>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600 mb-4">No orders yet</p>
                <a
                  href="/shop"
                  className="text-black font-semibold hover:underline"
                >
                  Start shopping
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-4 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                          <img
                            src={item.image || (item.product?.images?.[0])}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg shadow-sm"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Size: {item.size} | Color: {item.color}
                            </p>
                            <p className="text-sm font-medium text-indigo-600 mt-1">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                            <p className="text-xs text-gray-400">₹{item.price} / unit</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                      <span className="font-semibold text-gray-600">Total Amount</span>
                      <span className="text-2xl font-bold text-indigo-600">₹{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;