import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Loader2,
  Star
} from 'lucide-react';

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Form Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState('add'); // 'add' or 'edit'
  const [selectedId, setSelectedId] = useState(null);

  // Delete Confirmation Modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const { showToast } = useToast();

  const loadTestimonials = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminTestimonials(search, page, limit);
      setTestimonials(data.testimonials || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (err) {
      showToast(err.message || 'Failed to load testimonials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, [page, limit]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadTestimonials();
  };

  const resetForm = () => {
    setName('');
    setRating(5);
    setReview('');
    setSelectedId(null);
  };

  const openAddModal = () => {
    resetForm();
    setFormType('add');
    setIsFormOpen(true);
  };

  const openEditModal = (testimonial) => {
    resetForm();
    setFormType('edit');
    setSelectedId(testimonial._id);
    setName(testimonial.name);
    setRating(testimonial.rating);
    setReview(testimonial.review);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    try {
      const payload = {
        name,
        rating: Number(rating),
        review
      };

      if (formType === 'edit') {
        await api.updateTestimonial(selectedId, payload);
        showToast('Testimonial updated successfully!', 'success');
      } else {
        await api.createTestimonial(payload);
        showToast('Testimonial created successfully!', 'success');
      }

      setIsFormOpen(false);
      loadTestimonials();
    } catch (err) {
      showToast(err.message || 'Form submission failed.', 'error');
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
      await api.deleteTestimonial(deleteId);
      showToast('Testimonial deleted successfully.', 'success');
      setIsDeleteOpen(false);
      loadTestimonials();
    } catch (err) {
      showToast(err.message || 'Failed to delete testimonial.', 'error');
    }
  };

  // Helper to render star ratings
  const renderStars = (num) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={i < num ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} 
          />
        ))}
      </div>
    );
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
              placeholder="Search testimonials by name or review text..."
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
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* 2. Testimonials Table */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-[#F97316] w-6 h-6" />
              <span className="ml-2.5 text-xs text-slate-500 font-bold">Fetching testimonials...</span>
            </div>
          ) : testimonials.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Rating</th>
                  <th className="px-6 py-3.5">Review</th>
                  <th className="px-6 py-3.5">Date Created</th>
                  <th className="px-6 py-3.5 w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#1E293B]">
                {testimonials.map((test) => (
                  <tr key={test._id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {test.name}
                    </td>
                    <td className="px-6 py-4">
                      {renderStars(test.rating)}
                    </td>
                    <td className="px-6 py-4 max-w-md truncate text-slate-500">
                      {test.review}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium">
                      {new Date(test.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(test)}
                          className="p-1.5 text-slate-400 hover:text-[#F97316] hover:bg-orange-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm(test._id)}
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
              <span className="text-slate-400 text-xs font-bold block">No testimonials found</span>
              <p className="text-[11px] text-slate-400">Try creating a new testimonial or modifying your search query.</p>
            </div>
          )}
        </div>

        {/* Table Footer (Pagination Controls) */}
        {!isLoading && testimonials.length > 0 && (
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
                Showing <span className="font-bold text-slate-700">{(page - 1) * limit + 1}</span> - <span className="font-bold text-slate-700">{Math.min(page * limit, total)}</span> of <span className="font-bold text-slate-700">{total}</span> testimonials
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

      {/* 3. Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                {formType === 'add' ? 'Create Testimonial' : 'Edit Testimonial'}
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
              
              {/* Customer Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Renuka Sharma"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                />
              </div>

              {/* Rating Star Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Rating Selection</label>
                <div className="flex gap-2 items-center bg-slate-50 border border-slate-100 rounded-2xl p-3">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform active:scale-95 p-1"
                      >
                        <Star 
                          size={24} 
                          className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 hover:text-amber-200'}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-500 ml-auto mr-1 uppercase">
                    {rating} Star{rating > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Review / Feedback Description</label>
                <textarea
                  required
                  rows="5"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Describe customer's experience, tour highlights, and service satisfaction..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                ></textarea>
              </div>

              {/* Modal Actions */}
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
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>{formType === 'add' ? 'Create' : 'Save'}</span>
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
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Delete Testimonial?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete this customer feedback? This action will hide the testimonial from public and list displays.
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
