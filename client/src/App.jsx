import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// Admin panel components & contexts
import Login from './admin/Login';
import DashboardLayout from './admin/DashboardLayout';
import ProtectedRoute from './admin/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

function WhatsAppWrapper() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) return null;

  return <FloatingWhatsApp />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <WhatsAppWrapper />
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:slug" element={<PackageDetails />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:slug" element={<CarDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Portal Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              } 
            />
            {/* Admin Redirect Rule */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}
