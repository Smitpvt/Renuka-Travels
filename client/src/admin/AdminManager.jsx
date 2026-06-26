import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Check, 
  X, 
  Loader2,
  Shield,
  ShieldAlert,
  Mail,
  UserPlus
} from 'lucide-react';

export default function AdminManager() {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Form Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');

  // Delete Confirmation Modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { admin: currentAdmin } = useAuth();
  const { showToast } = useToast();

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdmins(search, page, limit);
      setAdmins(data.admins || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (err) {
      showToast(err.message || 'Failed to load administrator accounts.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, [page, limit]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadAdmins();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('admin');
  };

  const openAddModal = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    try {
      const payload = {
        name,
        email: email.trim().toLowerCase(),
        password,
        role
      };

      await api.createAdmin(payload);
      showToast('Admin account registered successfully!', 'success');
      setIsFormOpen(false);
      loadAdmins();
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const triggerDeleteConfirm = (id) => {
    if (id === currentAdmin?._id) {
      showToast('You cannot delete your own admin account.', 'error');
      return;
    }
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      await api.deleteAdmin(deleteId);
      showToast('Admin account deleted successfully.', 'success');
      setIsDeleteOpen(false);
      loadAdmins();
    } catch (err) {
      showToast(err.message || 'Failed to delete administrator.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search admin users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />
          </div>
          <button 
            type="submit"
            className="px-5 py-2.5 bg-[#1E293B] hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-colors"
          >
            Search
          </button>
        </form>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-[#F97316] hover:bg-orange-600 text-white rounded-2xl text-xs font-bold transition-all shadow-md self-start md:self-auto"
        >
          <Plus size={16} />
          <span>Register Admin</span>
        </button>
      </div>

      {/* 2. Admin Accounts Table */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-[#F97316] w-6 h-6" />
              <span className="ml-2.5 text-xs text-slate-500 font-bold">Loading administrator accounts...</span>
            </div>
          ) : admins.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Email Address</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Date Created</th>
                  <th className="px-6 py-3.5 w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#1E293B]">
                {admins.map((adm) => (
                  <tr key={adm._id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold uppercase">
                        {adm.name[0]}
                      </div>
                      <span>{adm.name}</span>
                      {adm._id === currentAdmin?._id && (
                        <span className="ml-1.5 px-2 py-0.5 bg-orange-50 text-[#F97316] border border-orange-100 text-[9px] font-bold rounded-full">
                          You
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Mail size={13} className="text-slate-400" />
                        <span>{adm.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {adm.role === 'superadmin' ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-bold">
                          <ShieldAlert size={12} />
                          <span>Super Admin</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold">
                          <Shield size={12} />
                          <span>Admin</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium">
                      {new Date(adm.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {adm._id !== currentAdmin?._id ? (
                          <button
                            onClick={() => triggerDeleteConfirm(adm._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Administrator"
                          >
                            <Trash2 size={15} />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic font-medium px-1.5">Protected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-20 space-y-2">
              <span className="text-slate-400 text-xs font-bold block">No admin accounts found</span>
              <p className="text-[11px] text-slate-400">Try modifying search tags or registering a new administrator.</p>
            </div>
          )}
        </div>

        {/* Table Footer (Pagination Controls) */}
        {!isLoading && admins.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Show Rows:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-[#F97316] outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-[11px] text-slate-400 ml-3">
                Showing <span className="font-bold text-slate-700">{(page - 1) * limit + 1}</span> - <span className="font-bold text-slate-700">{Math.min(page * limit, total)}</span> of <span className="font-bold text-slate-700">{total}</span> accounts
              </span>
            </div>

            <div className="flex gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    page === i + 1
                      ? 'bg-[#F97316] text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Register Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Register Administrator
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
              
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ramesh@renukatravels.com"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                />
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Access Control Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-[#F97316] outline-none"
                >
                  <option value="admin">Admin (Manage Content & Bookings)</option>
                  <option value="superadmin">Super Admin (All Permissions + Manage Admins)</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-2xl text-xs font-bold text-slate-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitLoading}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-[#F97316] hover:bg-orange-600 text-white rounded-2xl text-xs font-bold transition-all disabled:opacity-50"
                >
                  {isSubmitLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} />
                      <span>Register</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Revoke Admin Access?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete this administrator account? The user will immediately lose access to the admin panel dashboard.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
