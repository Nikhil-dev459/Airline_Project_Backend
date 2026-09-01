import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNotification } from './NotificationContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signin'); // 'signin' or 'signup'
  const { notifySuccess, notifyError, notifyInfo } = useNotification();

  // Verify auth on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const res = await api.isAuthenticated();
      if (res.success && res.data) {
        const userData = typeof res.data === 'object' ? res.data : { id: res.data, email: 'passenger@aeroluxe.com' };
        setUser(userData);
        setIsAuthenticated(true);
        const adminStatus = await api.checkIsAdmin(userData.id || 1);
        setIsAdmin(!!adminStatus);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.signIn(email, password);
      if (res.success) {
        const userData = res.user || { id: 1, email };
        setUser(userData);
        setIsAuthenticated(true);
        const adminStatus = await api.checkIsAdmin(userData.id || 1);
        setIsAdmin(!!adminStatus);
        notifySuccess('Welcome back!', `Signed in as ${email}`);
        setIsAuthModalOpen(false);
        return { success: true };
      } else {
        notifyError('Sign In Failed', res.message || 'Invalid credentials');
        return { success: false, message: res.message };
      }
    } catch (err) {
      notifyError('Sign In Error', err.response?.data?.message || err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.signUp(email, password);
      if (res.success) {
        notifySuccess('Account Created!', 'Please sign in with your new credentials');
        setAuthModalTab('signin');
        return { success: true };
      } else {
        notifyError('Registration Failed', res.message || 'Could not register account');
        return { success: false, message: res.message };
      }
    } catch (err) {
      notifyError('Registration Error', err.response?.data?.message || err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('aeroluxe_token');
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    notifyInfo('Signed Out', 'You have been successfully logged out');
  };

  const openAuthModal = (tab = 'signin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isAdmin,
      loading,
      login,
      register,
      logout,
      isAuthModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal,
      setAuthModalTab
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
