import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Mail,
  User,
  Calendar,
  Eye,
  Trash2,
  X,
  ArrowLeft,
  LayoutDashboard,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { fetchContactMessages, updateContactMessageStatus, deleteContactMessage } from '@/lib/supabaseClient';

const AdminMessagesPage = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) { navigate('/admin', { replace: true }); return; }
    try { setAdmin(JSON.parse(session)); } catch { navigate('/admin', { replace: true }); }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadMessages = async () => {
    try {
      const data = await fetchContactMessages();
      setMessages(data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin');
  };

  const handleMarkAsRead = async (id) => {
    try {
      await updateContactMessageStatus(id, 'read');
      await loadMessages();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContactMessage(id);
      await loadMessages();
      setDeleteConfirm(null);
      setSelectedMessage(null);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  if (!admin) return null;

  return (
    <>
      <Helmet>
        <title>Contact Messages - VRUDHAM Admin</title>
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
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold tracking-tight">
                Messages <span className="text-gray-500 font-normal">/ Contact</span>
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
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-6 h-6 text-blue-400" />
                <h3 className="font-semibold">Total Messages</h3>
              </div>
              <p className="text-3xl font-bold">{messages.length}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6 text-orange-400" />
                <h3 className="font-semibold">Unread</h3>
              </div>
              <p className="text-3xl font-bold">{unreadCount}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="font-semibold">Read</h3>
              </div>
              <p className="text-3xl font-bold">{messages.length - unreadCount}</p>
            </div>
          </div>

          {/* Messages List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Messages List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">All Messages</h2>
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm mt-1">Contact messages will appear here.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                      message.status === 'unread'
                        ? 'border-orange-500/50 bg-orange-500/5'
                        : 'border-white/10 bg-white/[0.03]'
                    } hover:border-white/20`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{message.name}</h3>
                          <p className="text-sm text-gray-400">{message.email}</p>
                        </div>
                      </div>
                      {message.status === 'unread' && (
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      )}
                    </div>
                    <h4 className="font-medium mb-2">{message.subject}</h4>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">{message.message}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                      <span>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Message Detail */}
            <div className="lg:sticky lg:top-24">
              {selectedMessage ? (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{selectedMessage.name}</h3>
                        <p className="text-gray-400">{selectedMessage.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {selectedMessage.status === 'unread' && (
                        <button
                          onClick={() => handleMarkAsRead(selectedMessage.id)}
                          className="flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(selectedMessage.id)}
                        className="flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xl font-semibold mb-2">{selectedMessage.subject}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedMessage.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span>{new Date(selectedMessage.created_at).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>

                  <div className="bg-white/[0.05] rounded-lg p-4">
                    <h5 className="font-medium mb-2">Message:</h5>
                    <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-lg font-semibold mb-2">Select a message</h3>
                  <p className="text-gray-400">Click on a message from the list to view its details.</p>
                </div>
              )}
            </div>
          </div>
        </main>

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
                <h3 className="text-lg font-bold mb-2">Delete Message?</h3>
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

export default AdminMessagesPage;