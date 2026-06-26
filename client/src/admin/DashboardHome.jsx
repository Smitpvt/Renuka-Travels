import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Map, 
  ToggleRight, 
  Car, 
  MailWarning, 
  CalendarDays,
  ChevronRight,
  Loader2,
  Phone
} from 'lucide-react';

export default function DashboardHome({ setActiveTab }) {
  const [stats, setStats] = useState({
    totalPackages: 0,
    activePackages: 0,
    totalVehicles: 0,
    pendingInquiries: 0,
    todaysInquiries: 0
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatsAndRecent = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch Packages stats
      const packagesData = await api.getAdminPackages('', 1, 9999);
      const pkgs = packagesData.packages || [];
      const totalPkgs = pkgs.length;
      const activePkgs = pkgs.filter(p => p.active).length;

      // 2. Fetch Fleet stats
      const fleetData = await api.getAdminVehicles('', 1, 9999);
      const totalFleet = (fleetData.vehicles || []).length;

      // 3. Fetch Inquiries stats
      const inquiriesData = await api.getAdminInquiries('', 'All', 1, 9999);
      const inqs = inquiriesData.inquiries || [];
      const pendingInqs = inqs.filter(i => i.status === 'Pending').length;

      // Calculate today's inquiries
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayInqs = inqs.filter(i => new Date(i.createdAt) >= today).length;

      setStats({
        totalPackages: totalPkgs,
        activePackages: activePkgs,
        totalVehicles: totalFleet,
        pendingInquiries: pendingInqs,
        todaysInquiries: todayInqs
      });

      // Keep only first 5 for the recent list table
      setRecentInquiries(inqs.slice(0, 5));
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard stats.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndRecent();
  }, []);

  const cardConfig = [
    { key: 'totalPackages', label: 'Total Packages', val: stats.totalPackages, color: 'text-blue-500 bg-blue-50 border-blue-100', icon: Map },
    { key: 'activePackages', label: 'Active Packages', val: stats.activePackages, color: 'text-[#F97316] bg-orange-50 border-orange-100', icon: ToggleRight },
    { key: 'totalVehicles', label: 'Total Vehicles', val: stats.totalVehicles, color: 'text-indigo-500 bg-indigo-50 border-indigo-100', icon: Car },
    { key: 'pendingInquiries', label: 'Pending Inquiries', val: stats.pendingInquiries, color: 'text-rose-500 bg-rose-50 border-rose-100', icon: MailWarning },
    { key: 'todaysInquiries', label: 'Today\'s Inquiries', val: stats.todaysInquiries, color: 'text-emerald-500 bg-emerald-50 border-emerald-100', icon: CalendarDays }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#F97316] w-8 h-8" />
        <span className="ml-2.5 text-xs text-slate-500 font-bold">Loading dashboard metrics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-200/55 rounded-3xl p-8 max-w-md mx-auto text-center space-y-4 shadow-sm">
        <p className="text-sm text-red-500 font-bold">Error: {error}</p>
        <button 
          onClick={fetchStatsAndRecent}
          className="px-5 py-2.5 bg-[#F97316] text-white text-xs font-bold rounded-full hover:bg-orange-600 transition-colors shadow-md"
        >
          Retry Load
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {cardConfig.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.key}
              className={`bg-white border rounded-3xl p-5 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:scale-102`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${card.color}`}>
                <Icon size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{card.label}</span>
                <p className="text-xl font-bold text-[#1E293B] mt-0.5">{card.val}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent inquiries list */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#1E293B] text-sm font-headings">Recent Booking Inquiries</h3>
            <p className="text-[11px] text-slate-400 font-light mt-0.5">The most recent trip requests submitted by website visitors.</p>
          </div>
          <button 
            onClick={() => setActiveTab('inquiries')}
            className="text-xs font-bold text-[#F97316] hover:text-orange-600 flex items-center gap-0.5 transition-colors"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          {recentInquiries.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Phone</th>
                  <th className="px-6 py-3.5">Destination</th>
                  <th className="px-6 py-3.5">Travel Date</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#1E293B]">
                {recentInquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold">{inq.name}</td>
                    <td className="px-6 py-4 font-light">{inq.phone}</td>
                    <td className="px-6 py-4 font-light truncate max-w-[160px]">{inq.destination}</td>
                    <td className="px-6 py-4 font-light">
                      {new Date(inq.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inq.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        inq.status === 'Contacted' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {inq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16 text-slate-400 font-light">
              No recent booking inquiries found.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
