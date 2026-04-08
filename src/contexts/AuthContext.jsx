import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, createCustomer, fetchCustomerByUserId } from '@/lib/supabaseClient';

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
    let cleanup;

    const init = async () => {
      if (isSupabaseConfigured()) {
        cleanup = await initializeSupabaseAuth();
      } else {
        initializeLocalStorageAuth();
      }
    };

    init();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, []);

  const loadUserProfile = async (sessionUser) => {
    if (!sessionUser?.id) return null;

    try {
      const customer = await fetchCustomerByUserId(sessionUser.id);
      if (!customer) return null;
      return {
        id: sessionUser.id,
        email: sessionUser.email,
        name: customer.name,
      };
    } catch (error) {
      console.error('Error loading customer profile:', error);
      return {
        id: sessionUser.id,
        email: sessionUser.email,
      };
    }
  };

  const initializeSupabaseAuth = async () => {
    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const enrichedUser = await loadUserProfile(session.user);
        setUser(enrichedUser);
      } else {
        setUser(null);
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            const enrichedUser = await loadUserProfile(session.user);
            setUser(enrichedUser);
          } else {
            setUser(null);
          }
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

  const signUp = async (name, email, password) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      const userId = data?.user?.id ?? null;
      if (userId) {
        const customer = await createCustomer({
          user_id: userId,
          name,
          email,
        });

        if (!customer?.id) {
          await supabase.auth.signOut();
          throw new Error('Unable to save account details. Please try again.');
        }
      }

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
        name,
        created_at: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('ecommerce_users', JSON.stringify(users));

      await createCustomer({
        user_id: newUser.id,
        name,
        email,
      });

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

      const authUser = data?.user ?? data?.session?.user;
      if (!authUser?.id) {
        throw new Error('Login failed. Please try again.');
      }

      const customer = await fetchCustomerByUserId(authUser.id);
      if (!customer) {
        await supabase.auth.signOut();
        throw new Error('No account found. Please sign up first.');
      }

      const userSession = {
        id: authUser.id,
        email: authUser.email,
        name: customer.name,
      };
      setUser(userSession);

      return { user: userSession };
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

  const signInWithGoogle = async () => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
      return data;
    } else {
      return _mockSocialLogin('google');
    }
  };

  const signInWithFacebook = async () => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
      return data;
    } else {
      return _mockSocialLogin('facebook');
    }
  };

  // Internal helper: creates a demo user for the given provider and persists to localStorage.
  // Returns a Promise so callers can await it and navigate only after state is flushed.
  const _mockSocialLogin = (provider) => {
    return new Promise((resolve) => {
      const stored = JSON.parse(localStorage.getItem('ecommerce_users') || '[]');
      const providerEmail = `demo.${provider}@vrudham.local`;

      // Re-use existing mock account for this provider so the user stays consistent
      let existing = stored.find(u => u.provider === provider);

      if (!existing) {
        existing = {
          id: `${provider}_${Date.now().toString(36)}`,
          email: providerEmail,
          provider,
          name: provider === 'google' ? 'Google User' : 'Facebook User',
          avatar: provider === 'google'
            ? 'https://lh3.googleusercontent.com/a/default-user=s96-c'
            : 'https://graph.facebook.com/me/picture?type=square',
          created_at: new Date().toISOString(),
        };
        stored.push(existing);
        localStorage.setItem('ecommerce_users', JSON.stringify(stored));
      }

      const session = {
        id: existing.id,
        email: existing.email,
        name: existing.name,
        provider: existing.provider,
        avatar: existing.avatar,
      };

      localStorage.setItem('ecommerce_user', JSON.stringify(session));
      setUser(session);
      resolve({ user: session });
    });
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
    signInWithGoogle,
    signInWithFacebook,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};