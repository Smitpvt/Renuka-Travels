import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  LayoutDashboard, 
  Map, 
  Car, 
  MessageSquare, 
  MailWarning, 
  UserCog, 
  LogOut, 
  Menu, 
  X,
  User
} from 'lucide-react';
import logo from '../logo/Logo-Photoroom.png';

// Subcomponents (we will create these next)
import DashboardHome from './DashboardHome';
import PackagesManager from './PackagesManager';
import FleetManager from './FleetManager';
import TestimonialsManager from './TestimonialsManager';
import InquiriesManager from './InquiriesManager';
import AdminManager from './AdminManager';

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { admin, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully. Have a nice day!', 'success');
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'packages', label: 'Packages', icon: Map },
    { id: 'fleet', label: 'Fleet', icon: Car },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'inquiries', label: 'Booking Inquiries', icon: MailWarning },
  ];

  // Only Super Admin can manage other admin credentials
  if (admin && admin.role === 'superadmin') {
    menuItems.push({ id: 'admins', label: 'Admins', icon: UserCog });
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome setActiveTab={setActiveTab} />;
      case 'packages':
        return <PackagesManager />;
      case 'fleet':
        return <FleetManager />;
      case 'testimonials':
        return <TestimonialsManager />;
      case 'inquiries':
        return <InquiriesManager />;
      case 'admins':
        return admin?.role === 'superadmin' ? <AdminManager /> : <DashboardHome setActiveTab={setActiveTab} />;
      default:
        return <DashboardHome setActiveTab={setActiveTab} />;
    }
  };

  const getTitle = () => {
    const item = menuItems.find(m => m.id === activeTab);
    return item ? item.label : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#1E293B] font-sans flex overflow-hidden">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1E293B] text-white flex-shrink-0 h-screen sticky top-0 shadow-xl z-20">
        {/* Brand */}
        <div className="h-16 px-6 border-b border-slate-700/50 flex items-center gap-3 bg-slate-900/40">
          <img
            src={logo}
            alt="Renuka Travels Logo"
            className="w-10 h-10 object-contain select-none"
          />
          <div>
            <h1 className="font-bold text-sm leading-tight font-headings tracking-wide">Renuka Travels</h1>
            <span className="text-[9px] text-[#F97316] uppercase font-bold tracking-widest leading-none block">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow py-6 px-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-[#F97316] text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/45'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-700/50 space-y-3 bg-slate-900/20">
          <div className="flex items-center gap-3 px-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs uppercase">
              {admin ? admin.name[0] : 'A'}
            </div>
            <div className="min-w-0 flex-grow">
              <p className="text-xs font-bold truncate text-slate-200 leading-tight">{admin?.name}</p>
              <span className="text-[10px] text-slate-500 capitalize leading-none block">{admin?.role}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Drawer Navigation Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <div 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/55 backdrop-blur-sm z-[999] duration-300"
            />
            {/* Drawer */}
            <div className="lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-[#1E293B] text-white z-[1000] flex flex-col shadow-2xl animate-slide-right">
              {/* Brand Header */}
              <div className="h-16 px-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <img
                    src={logo}
                    alt="Renuka Travels Logo"
                    className="w-10 h-10 object-contain select-none"
                  />
                  <div>
                    <h1 className="font-bold text-sm font-headings">Renuka Travels</h1>
                    <span className="text-[9px] text-[#F97316] uppercase font-bold tracking-widest leading-none block">Admin Panel</span>
                  </div>
                </div>
                <button onClick={() => setIsMobileOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="flex-grow py-6 px-4 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                        activeTab === item.id 
                          ? 'bg-[#F97316] text-white shadow-md' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Drawer footer info */}
              <div className="p-4 border-t border-slate-700/50 space-y-3 bg-slate-900/20">
                <div className="flex items-center gap-3 px-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs uppercase">
                    {admin ? admin.name[0] : 'A'}
                  </div>
                  <div className="min-w-0 flex-grow">
                    <p className="text-xs font-bold truncate text-slate-200 leading-tight">{admin?.name}</p>
                    <span className="text-[10px] text-slate-500 capitalize leading-none block">{admin?.role}</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 3. Main content area */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200/60 px-6 flex items-center justify-between flex-shrink-0 relative z-10 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Hamburger trigger */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden text-[#1E293B] hover:text-[#F97316] transition-colors"
            >
              <Menu size={22} />
            </button>
            <h2 className="text-lg font-bold font-headings text-[#1E293B] tracking-wide">
              {getTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile pill */}
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
              <div className="w-6 h-6 rounded-full bg-[#F97316] text-white flex items-center justify-center font-bold text-[10px] uppercase">
                {admin ? admin.name[0] : 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[10px] font-bold text-[#1E293B] leading-none">{admin?.name}</p>
                <span className="text-[8px] text-slate-400 capitalize font-medium">{admin?.role}</span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              title="Logout session"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-grow overflow-y-auto p-6 md:p-8 bg-slate-50">
          {renderContent()}
        </main>
      </div>

    </div>
  );
}
