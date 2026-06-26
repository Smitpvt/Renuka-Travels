import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if admin is logged in on page refresh
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      if (data && data.success) {
        setAdmin(data.admin);
      } else {
        // Token invalid/expired
        localStorage.removeItem('admin_token');
      }
    } catch (err) {
      console.warn('Auth check validation failed:', err.message);
      // Don't clear token on network failure, only on explicit authentication rejection
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (email, password) => {
    const data = await api.login(email, password);
    if (data && data.success) {
      localStorage.setItem('admin_token', data.token);
      setAdmin(data.admin);
      return data.admin;
    }
    throw new Error('Invalid response from server');
  };

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
