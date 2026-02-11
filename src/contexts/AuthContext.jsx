import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if using Supabase or localStorage
    if (isSupabaseConfigured()) {
      initializeSupabaseAuth();
    } else {
      initializeLocalStorageAuth();
    }
  }, []);

  const initializeSupabaseAuth = async () => {
    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null);
        }
      );

      setLoading(false);

      return () => {
        subscription?.unsubscribe();
      };
    } catch (error) {
      console.error('Auth initialization error:', error);
      setLoading(false);
    }
  };

  const initializeLocalStorageAuth = () => {
    // Check localStorage for existing session
    const storedUser = localStorage.getItem('ecommerce_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setLoading(false);
  };

  const signUp = async (email, password) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } else {
      // localStorage fallback
      const users = JSON.parse(localStorage.getItem('ecommerce_users') || '[]');
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        throw new Error('User already exists');
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        password, // In production, this would be hashed
        created_at: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('ecommerce_users', JSON.stringify(users));

      const userSession = { id: newUser.id, email: newUser.email };
      setUser(userSession);
      localStorage.setItem('ecommerce_user', JSON.stringify(userSession));

      return { user: userSession };
    }
  };

  const signIn = async (email, password) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } else {
      // localStorage fallback
      const users = JSON.parse(localStorage.getItem('ecommerce_users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      const userSession = { id: foundUser.id, email: foundUser.email };
      setUser(userSession);
      localStorage.setItem('ecommerce_user', JSON.stringify(userSession));

      return { user: userSession };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } else {
      // localStorage fallback
      localStorage.removeItem('ecommerce_user');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};