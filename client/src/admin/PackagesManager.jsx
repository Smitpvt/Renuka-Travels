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
  ToggleLeft, 
  ToggleRight, 
  Check, 
  X, 
  Loader2,
  Trash
} from 'lucide-react';

export default function PackagesManager() {
  const [packages, setPackages] = useState([]);
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
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Weekend Trips');
  const [duration, setDuration] = useState('');
  const [desc, setDesc] = useState('');
  const [acPrice, setAcPrice] = useState('');
  const [nonAcPrice, setNonAcPrice] = useState('');
  const [tollIncluded, setTollIncluded] = useState(false);
  const [customQuote, setCustomQuote] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [highlights, setHighlights] = useState(['']);
  
  // Image Upload States
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [galleryItems, setGalleryItems] = useState([]);

  const { showToast } = useToast();

  const loadPackages = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminPackages(search, page, limit);
      setPackages(data.packages || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (err) {
      showToast(err.message || 'Failed to load packages.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, [page, limit]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadPackages();
  };

  const resetForm = () => {
    setTitle('');
    setCategory('Weekend Trips');
    setDuration('');
    setDesc('');
    setAcPrice('');
    setNonAcPrice('');
    setTollIncluded(false);
    setCustomQuote(false);
    setFeatured(false);
    setActive(true);
    setHighlights(['']);
    setImageFile(null);
    setImagePreview('');
    setGalleryItems([]);
    setSelectedId(null);
  };

  const openAddModal = () => {
    resetForm();
    setFormType('add');
    setIsFormOpen(true);
  };

  const openEditModal = (pkg) => {
    resetForm();
    setFormType('edit');
    setSelectedId(pkg._id);
    setTitle(pkg.title);
    setCategory(pkg.category);
    setDuration(pkg.duration);
    setDesc(pkg.desc);
    setAcPrice(pkg.pricing?.ac || '');
    setNonAcPrice(pkg.pricing?.nonAc || '');
    setTollIncluded(pkg.pricing?.tollIncluded || false);
    setCustomQuote(pkg.pricing?.customQuote || false);
    setFeatured(pkg.featured || false);
    setActive(pkg.active !== false);
    setHighlights(pkg.highlights && pkg.highlights.length > 0 ? pkg.highlights : ['']);
    setImagePreview(pkg.image);
    
    // Normalize gallery entries (supports string array and object array)
    const normalizedGallery = (pkg.gallery || []).map((item, idx) => {
      if (typeof item === 'object' && item !== null) {
        return {
          id: `exist-${idx}-${Math.random()}`,
          file: null,
          url: item.image,
          title: item.title || '',
          isExisting: true
        };
      }
      return {
        id: `exist-${idx}-${Math.random()}`,
        file: null,
        url: item,
        title: '',
        isExisting: true
      };
    });
    setGalleryItems(normalizedGallery);
    setIsFormOpen(true);
  };

  // Dynamic Highlight bullet additions
  const handleHighlightChange = (index, value) => {
    const updated = [...highlights];
    updated[index] = value;
    setHighlights(updated);
  };

  const addHighlightField = () => {
    setHighlights([...highlights, '']);
  };

  const removeHighlightField = (index) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  // Main Image selection preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addGalleryItem = () => {
    setGalleryItems((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}-${Math.random()}`,
        file: null,
        url: '',
        title: '',
        isExisting: false
      }
    ]);
  };

  const handleItemFileChange = (id, file) => {
    if (!file) return;
    setGalleryItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, file, url: URL.createObjectURL(file) }
          : item
      )
    );
  };

  const handleItemTitleChange = (id, title) => {
    setGalleryItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, title } : item
      )
    );
  };

  const removeGalleryItem = (id) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('duration', duration);
      formData.append('desc', desc);
      formData.append('featured', featured);
      formData.append('active', active);
      
      const pricingObj = {
        ac: acPrice ? Number(acPrice) : undefined,
        nonAc: nonAcPrice ? Number(nonAcPrice) : undefined,
        tollIncluded,
        customQuote
      };
      formData.append('pricing', JSON.stringify(pricingObj));

      // filter out empty highlights
      const cleanHighlights = highlights.map(h => h.trim()).filter(Boolean);
      formData.append('highlights', JSON.stringify(cleanHighlights));

      // Append files
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // Build gallery structure and new files list
      const newGalleryFiles = [];
      const galleryStructure = [];

      galleryItems.forEach(item => {
        if (item.file) {
          galleryStructure.push({
            fileIndex: newGalleryFiles.length,
            title: item.title || ''
          });
          newGalleryFiles.push(item.file);
        } else if (item.isExisting && item.url) {
          galleryStructure.push({
            image: item.url,
            title: item.title || ''
          });
        }
      });

      formData.append('galleryStructure', JSON.stringify(galleryStructure));
      if (newGalleryFiles.length > 0) {
        newGalleryFiles.forEach(file => {
          formData.append('gallery', file);
        });
      }

      if (formType === 'edit') {
        await api.updatePackage(selectedId, formData);
        showToast('Package updated successfully!', 'success');
      } else {
        await api.createPackage(formData);
        showToast('Package created successfully!', 'success');
      }

      setIsFormOpen(false);
      loadPackages();
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
      await api.deletePackage(deleteId);
      showToast('Package deleted successfully.', 'success');
      setIsDeleteOpen(false);
      loadPackages();
    } catch (err) {
      showToast(err.message || 'Failed to delete package.', 'error');
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
              placeholder="Search packages by title or category..."
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
          <span>Add Package</span>
        </button>
      </div>

      {/* 2. Main Catalog Table */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-[#F97316] w-6 h-6" />
              <span className="ml-2.5 text-xs text-slate-500 font-bold">Fetching packages...</span>
            </div>
          ) : packages.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <th className="px-6 py-3.5 w-16">Image</th>
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Duration</th>
                  <th className="px-6 py-3.5">AC Price</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#1E293B]">
                {packages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-3">
                      <img 
                        src={pkg.image} 
                        alt="" 
                        className="w-12 h-10 object-cover rounded-xl border border-slate-100 bg-slate-50"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&fit=crop'; }}
                      />
                    </td>
                    <td className="px-6 py-4 font-bold">{pkg.title}</td>
                    <td className="px-6 py-4 font-light">{pkg.category}</td>
                    <td className="px-6 py-4 font-light">{pkg.duration}</td>
                    <td className="px-6 py-4 font-bold text-[#F97316]">
                      {pkg.pricing?.customQuote 
                        ? 'Custom Quote' 
                        : (pkg.pricing?.ac ? `₹${pkg.pricing.ac.toLocaleString('en-IN')}` : 'N/A')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        pkg.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {pkg.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(pkg)}
                          className="p-2 text-slate-400 hover:text-[#F97316] hover:bg-orange-50 rounded-xl transition-all"
                          title="Edit details"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm(pkg._id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete package"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-20 text-slate-400 font-light">
              No packages found. Add a package to get started!
            </div>
          )}
        </div>

        {/* Paginated Footer */}
        {packages.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
            {/* Rows limit selection */}
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2.5 py-1 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#F97316] text-xs bg-white font-bold"
              >
                {[10, 25, 50, 100].map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-1.5 border border-slate-200 rounded-xl hover:bg-orange-50 hover:text-[#F97316] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-bold text-xs">Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 border border-slate-200 rounded-xl hover:bg-orange-50 hover:text-[#F97316] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Add/Edit modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-6 z-[999]">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl flex flex-col animate-slide-up relative">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-[#1E293B] transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold font-headings text-[#1E293B] mb-6">
              {formType === 'add' ? 'Create Tour Package' : 'Edit Tour Package'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Package Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Mahabaleshwar Weekend Tour"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  >
                    <option value="Weekend Trips">Weekend Trips</option>
                    <option value="Pilgrimage">Pilgrimage</option>
                    <option value="Family Tours">Family Tours</option>
                    <option value="Corporate Tours">Corporate Tours</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 2 Nights / 3 Days"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  />
                </div>

                <div className="flex items-center gap-6 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs select-none">
                    <input 
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="accent-[#F97316] w-4 h-4 rounded"
                    />
                    <span>Featured Package</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs select-none">
                    <input 
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="accent-[#F97316] w-4 h-4 rounded"
                    />
                    <span>Active (Visible Publicly)</span>
                  </label>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">Pricing Configuration</h4>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs select-none">
                    <input 
                      type="checkbox"
                      checked={customQuote}
                      onChange={(e) => setCustomQuote(e.target.checked)}
                      className="accent-[#F97316] w-4 h-4 rounded"
                    />
                    <span>Custom Quote Only</span>
                  </label>
                </div>

                {!customQuote && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">AC Rate (₹)</label>
                      <input
                        type="number"
                        required={!customQuote}
                        value={acPrice}
                        onChange={(e) => setAcPrice(e.target.value)}
                        placeholder="e.g. 15000"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Non-AC Rate (₹) (Optional)</label>
                      <input
                        type="number"
                        value={nonAcPrice}
                        onChange={(e) => setNonAcPrice(e.target.value)}
                        placeholder="e.g. 13000"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                      />
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs select-none mt-2">
                  <input 
                    type="checkbox"
                    checked={tollIncluded}
                    onChange={(e) => setTollIncluded(e.target.checked)}
                    className="accent-[#F97316] w-4 h-4 rounded"
                  />
                  <span>Toll Charges and permits included in this price</span>
                </label>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Package Description</label>
                <textarea
                  required
                  rows="4"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Summarize the tour overview, itinerary, sights..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                ></textarea>
              </div>

              {/* Bullet highlights */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Highlights / Itinerary Bullet Points</label>
                  <button
                    type="button"
                    onClick={addHighlightField}
                    className="text-xs text-[#F97316] font-bold hover:text-orange-600"
                  >
                    + Add Point
                  </button>
                </div>
                <div className="space-y-2">
                  {highlights.map((hl, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={hl}
                        onChange={(e) => handleHighlightChange(idx, e.target.value)}
                        placeholder="e.g. Shirdi Temple VIP Darshan"
                        className="flex-grow px-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#F97316] outline-none"
                      />
                      {highlights.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHighlightField(idx)}
                          className="p-2 text-slate-400 hover:text-rose-500"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Image upload */}
              <div className="grid grid-cols-1 gap-6">
                
                {/* Main Package Image */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Main Cover Image</label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-20 h-16 object-cover rounded-xl border border-slate-200" 
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      required={formType === 'add'}
                      onChange={handleImageChange}
                      className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#F97316] file:cursor-pointer hover:file:bg-orange-100"
                    />
                  </div>
                </div>

                {/* Gallery Images with Editable Spot Names */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Destination Gallery (Editable Spot Names)</label>
                  </div>
                  
                  <div className="space-y-3">
                    {galleryItems.map((item, idx) => (
                      <div key={item.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-3 relative group">
                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeGalleryItem(item.id)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"
                          title="Remove Spot"
                        >
                          <Trash size={16} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pr-6">
                          {/* Image Upload/Preview */}
                          <div className="md:col-span-6 flex items-center gap-3">
                            <div className="w-16 h-12 border border-slate-200 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                              {item.url ? (
                                <img src={item.url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[10px] text-slate-400">No Image</span>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleItemFileChange(item.id, e.target.files[0])}
                                className="block w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-orange-50 file:text-[#F97316] file:cursor-pointer hover:file:bg-orange-100"
                              />
                            </div>
                          </div>

                          {/* Spot Name */}
                          <div className="md:col-span-6 space-y-1">
                            <input
                              type="text"
                              placeholder="Spot Name (e.g. Murud Beach)"
                              value={item.title}
                              onChange={(e) => handleItemTitleChange(item.id, e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-1 focus:ring-[#F97316]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addGalleryItem}
                    className="py-2 px-4 rounded-xl border border-dashed border-[#F97316] text-[#F97316] hover:bg-orange-50/50 text-xs font-bold transition-all duration-300 flex items-center gap-1.5"
                  >
                    <span>+ Add Another Spot</span>
                  </button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2.5 border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitLoading}
                  className="px-6 py-2.5 bg-[#F97316] text-white hover:bg-orange-600 rounded-full text-xs font-bold transition-all shadow-md disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none flex items-center gap-1.5"
                >
                  {isSubmitLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      <span>Saving Package...</span>
                    </>
                  ) : (
                    <span>Save Package</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-6 z-[999]">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 animate-scale-up relative">
            <h3 className="text-sm font-bold font-headings text-[#1E293B]">Confirm Deletion</h3>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              Are you sure you want to delete this tour package? This will mark it as soft-deleted and prevent it from appearing on the website or catalog tables.
            </p>
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                className="px-4 py-2 bg-rose-500 text-white hover:bg-rose-600 rounded-full text-xs font-bold shadow-md"
              >
                Delete Package
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
