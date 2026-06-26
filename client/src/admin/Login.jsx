import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Lock, Mail, Loader2, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await login(email, password);
      showToast('Logged in successfully! Welcome back.', 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
      showToast(err.message || 'Incorrect email or password.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] text-[#1E293B] font-sans flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background blobs resembling public site layout patterns */}
      <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-[#8D4F0B]/10 blur-3xl"></div>
      <div className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full bg-[#D68A45]/5 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-orange-100 relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F97316] text-white flex items-center justify-center mx-auto shadow-md">
            <Compass size={24} />
          </div>
          <h1 className="text-2xl font-bold font-headings text-[#1E293B]">
            Renuka Travels
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Admin Portal Login
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-2xl flex items-center gap-2"
          >
            <Lock size={14} className="flex-shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@renukatravels.com"
                className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all text-[#1E293B] placeholder-slate-400"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all text-[#1E293B] placeholder-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-[#1E293B] transition-colors"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#F97316] text-white py-3.5 rounded-2xl text-sm font-bold shadow-md hover:bg-orange-600 hover:shadow-lg disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Logging In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
