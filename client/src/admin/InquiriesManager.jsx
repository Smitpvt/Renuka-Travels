import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Trash2, 
  Check, 
  X, 
  Loader2, 
  User, 
  Calendar, 
  MapPin, 
  Phone,
  FileText,
  Clock,
  ExternalLink
} from 'lucide-react';

export default function InquiriesManager() {
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [adminsList, setAdminsList] = useState([]);

  // Modals
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Delete Modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Edit states within details modal
  const [editStatus, setEditStatus] = useState('Pending');
  const [editNotes, setEditNotes] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');

  const { admin } = useAuth();
  const { showToast } = useToast();

  const loadInquiries = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminInquiries(search, statusFilter, page, limit);
      setInquiries(data.inquiries || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (err) {
      showToast(err.message || 'Failed to load inquiries.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdmins = async () => {
    if (admin && admin.role === 'superadmin') {
      try {
        const data = await api.getAdmins('', 1, 100);
        setAdminsList(data.admins || []);
      } catch (err) {
        console.warn('Failed to load admins for assignments:', err.message);
      }
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [page, limit, statusFilter]);

  useEffect(() => {
    loadAdmins();
  }, [admin]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadInquiries();
  };

  const openDetailsModal = (inq) => {
    setSelectedInquiry(inq);
    setEditStatus(inq.status);
    setEditNotes(inq.notes || '');
    setEditAssignedTo(inq.assignedTo?._id || inq.assignedTo || '');
    setIsDetailsOpen(true);
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const payload = {
        status: editStatus,
        notes: editNotes,
        assignedTo: editAssignedTo || null
      };
      await api.updateInquiryStatus(selectedInquiry._id, payload);
      showToast('Booking inquiry updated successfully!', 'success');
      setIsDetailsOpen(false);
      loadInquiries();
    } catch (err) {
      showToast(err.message || 'Failed to update inquiry.', 'error');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const triggerDeleteConfirm = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      await api.deleteInquiry(deleteId);
      showToast('Inquiry deleted successfully.', 'success');
      setIsDeleteOpen(false);
      if (isDetailsOpen && selectedInquiry?._id === deleteId) {
        setIsDetailsOpen(false);
      }
      loadInquiries();
    } catch (err) {
      showToast(err.message || 'Failed to delete inquiry.', 'error');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Contacted':
        return 'bg-sky-50 text-sky-600 border border-sky-100';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-100';
    }
  };

  // Dynamic status tab classes
  const getTabClass = (status) => {
    return `px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
      statusFilter === status 
        ? 'bg-[#1E293B] text-white shadow-sm' 
        : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50'
    }`;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Filters Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, phone, locations..."
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

        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Pending', 'Contacted', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={getTabClass(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Inquiries Table */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-[#F97316] w-6 h-6" />
              <span className="ml-2.5 text-xs text-slate-500 font-bold">Fetching inquiries...</span>
            </div>
          ) : inquiries.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Contact Number</th>
                  <th className="px-6 py-3.5">Itinerary</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Vehicle Type</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Assigned To</th>
                  <th className="px-6 py-3.5 w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#1E293B]">
                {inquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {inq.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone size={13} className="text-slate-400" />
                        <span>{inq.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex flex-col gap-0.5 max-w-xs truncate">
                        <span className="font-semibold text-slate-700">{inq.tripType}</span>
                        <span>{inq.pickup} &rarr; {inq.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium">
                      {new Date(inq.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {inq.vehicleType}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeClass(inq.status)}`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {inq.assignedTo?.name ? (
                        <div className="flex items-center gap-1">
                          <User size={13} className="text-[#F97316]" />
                          <span className="font-bold text-slate-700">{inq.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDetailsModal(inq)}
                          className="p-1.5 text-slate-400 hover:text-[#F97316] hover:bg-orange-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm(inq._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-20 space-y-2">
              <span className="text-slate-400 text-xs font-bold block">No booking inquiries found</span>
              <p className="text-[11px] text-slate-400">Try modifying filters or your search query.</p>
            </div>
          )}
        </div>

        {/* Table Footer (Pagination) */}
        {!isLoading && inquiries.length > 0 && (
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
                Showing <span className="font-bold text-slate-700">{(page - 1) * limit + 1}</span> - <span className="font-bold text-slate-700">{Math.min(page * limit, total)}</span> of <span className="font-bold text-slate-700">{total}</span> inquiries
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

      {/* 3. Detail & Management Modal */}
      {isDetailsOpen && selectedInquiry && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusBadgeClass(selectedInquiry.status)}`}>
                  {selectedInquiry.status}
                </span>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Inquiry Details
                </h3>
              </div>
              <button 
                onClick={() => setIsDetailsOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleDetailsSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
              
              {/* Customer Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Contact detail card */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer Details</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Full Name</span>
                      <span className="text-xs font-bold text-slate-800">{selectedInquiry.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Phone / Mobile</span>
                      <a 
                        href={`tel:${selectedInquiry.phone}`} 
                        className="text-xs font-bold text-[#F97316] hover:underline flex items-center gap-1"
                      >
                        <span>{selectedInquiry.phone}</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Trip detail card */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trip Parameters</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium block">Trip Type</span>
                        <span className="text-xs font-bold text-slate-800">{selectedInquiry.tripType}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium block">Vehicle Spec</span>
                        <span className="text-xs font-bold text-slate-800">{selectedInquiry.vehicleType}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Travel Date</span>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        {new Date(selectedInquiry.date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Itinerary / Route */}
              <div className="p-4 bg-orange-50/40 border border-orange-100/50 rounded-2xl">
                <h4 className="text-[10px] font-bold text-[#F97316] uppercase tracking-wider mb-2.5">Travel Route</h4>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-500" />
                    <div>
                      <span className="text-[9px] text-slate-400 block font-medium">Pickup Location</span>
                      <span className="font-bold text-slate-700">{selectedInquiry.pickup}</span>
                    </div>
                  </div>
                  <div className="text-slate-400 font-bold text-lg flex-grow text-center">&rarr;</div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-rose-500" />
                    <div>
                      <span className="text-[9px] text-slate-400 block font-medium">Destination</span>
                      <span className="font-bold text-slate-700">{selectedInquiry.destination}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Administrative Updates Section */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">Internal Management</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status Dropdown */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Inquiry Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-[#F97316] outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted (In Progress)</option>
                      <option value="Completed">Completed (Booked)</option>
                    </select>
                  </div>

                  {/* Assignment Select (Super Admin Only) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Assign Handler</label>
                    {admin && admin.role === 'superadmin' ? (
                      <select
                        value={editAssignedTo}
                        onChange={(e) => setEditAssignedTo(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-[#F97316] outline-none"
                      >
                        <option value="">Unassigned (None)</option>
                        {adminsList.map((adm) => (
                          <option key={adm._id} value={adm._id}>
                            {adm.name} ({adm.role})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 font-medium">
                        {selectedInquiry.assignedTo?.name 
                          ? `${selectedInquiry.assignedTo.name} (Role: ${selectedInquiry.assignedTo.role || 'Admin'})` 
                          : 'Unassigned (Super admin can edit)'
                        }
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin-only internal Notes */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Internal Admin Notes</label>
                    <span className="text-[9px] text-slate-400 italic">Not visible to public website visitors</span>
                  </div>
                  <textarea
                    rows="3"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="e.g. Customer requested SUV instead of sedan. Called back, price confirmed at ₹15,000."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  ></textarea>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => triggerDeleteConfirm(selectedInquiry._id)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-100 rounded-2xl text-xs font-bold transition-all"
                >
                  <Trash2 size={14} />
                  <span>Delete Inquiry</span>
                </button>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDetailsOpen(false)}
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
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Delete Booking Inquiry?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete this customer inquiry? It will be soft-deleted and removed from the active lists.
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
