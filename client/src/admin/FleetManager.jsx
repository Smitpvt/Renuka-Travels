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
  Loader2,
  X
} from 'lucide-react';

export default function FleetManager() {
  const [vehicles, setVehicles] = useState([]);
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
  const [seats, setSeats] = useState('');
  const [type, setType] = useState('SUV / Cars');
  const [ac, setAc] = useState(true);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [fuelType, setFuelType] = useState('Diesel');
  const [status, setStatus] = useState('Available');
  const [active, setActive] = useState(true);
  const [description, setDescription] = useState('');

  // Extended fields for database-driven page
  const [cabinDescription, setCabinDescription] = useState('');
  const [pricingType, setPricingType] = useState('per_km');
  const [pricingAc, setPricingAc] = useState('');
  const [pricingNonAc, setPricingNonAc] = useState('');
  const [pricingLabel, setPricingLabel] = useState('Per KM');
  const [pricingDescription, setPricingDescription] = useState('');
  const [pricingMinimumKm, setPricingMinimumKm] = useState('300');
  const [pricingDriverAllowance, setPricingDriverAllowance] = useState('500');
  const [pricingTollIncluded, setPricingTollIncluded] = useState(false);
  const [pricingParkingIncluded, setPricingParkingIncluded] = useState(false);

  const [specCapacity, setSpecCapacity] = useState('');
  const [specLuggage, setSpecLuggage] = useState('');
  const [specEngine, setSpecEngine] = useState('');
  const [specComfort, setSpecComfort] = useState('');
  const [specAirConditioning, setSpecAirConditioning] = useState('');

  const [amenitiesInput, setAmenitiesInput] = useState('');
  
  // Image Upload States
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  const { showToast } = useToast();

  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminVehicles(search, page, limit);
      setVehicles(data.vehicles || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (err) {
      showToast(err.message || 'Failed to load fleet.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, [page, limit]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadVehicles();
  };

  const resetForm = () => {
    setName('');
    setSeats('');
    setType('SUV / Cars');
    setAc(true);
    setRegistrationNumber('');
    setFuelType('Diesel');
    setStatus('Available');
    setActive(true);
    setDescription('');
    setImageFile(null);
    setImagePreview('');
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGallery([]);
    setSelectedId(null);

    setCabinDescription('');
    setPricingType('per_km');
    setPricingAc('');
    setPricingNonAc('');
    setPricingLabel('Per KM');
    setPricingDescription('');
    setPricingMinimumKm('300');
    setPricingDriverAllowance('500');
    setPricingTollIncluded(false);
    setPricingParkingIncluded(false);
    setSpecCapacity('');
    setSpecLuggage('');
    setSpecEngine('');
    setSpecComfort('');
    setSpecAirConditioning('');
    setAmenitiesInput('');
  };

  const openAddModal = () => {
    resetForm();
    setFormType('add');
    setIsFormOpen(true);
  };

  const openEditModal = (vehicle) => {
    resetForm();
    setFormType('edit');
    setSelectedId(vehicle._id);
    setName(vehicle.name);
    setSeats(vehicle.seats);
    setType(vehicle.type);
    setAc(vehicle.ac);
    setRegistrationNumber(vehicle.registrationNumber || '');
    setFuelType(vehicle.fuelType);
    setStatus(vehicle.status);
    setActive(vehicle.active !== false);
    setDescription(vehicle.description);
    setImagePreview(vehicle.image);
    setExistingGallery(vehicle.gallery || []);

    setCabinDescription(vehicle.cabinDescription || '');
    setPricingType(vehicle.pricing?.type || 'per_km');
    setPricingAc(vehicle.pricing?.ac !== undefined ? vehicle.pricing.ac : '');
    setPricingNonAc(vehicle.pricing?.nonAc !== undefined ? vehicle.pricing.nonAc : '');
    setPricingLabel(vehicle.pricing?.label || 'Per KM');
    setPricingDescription(vehicle.pricing?.description || '');
    setPricingMinimumKm(vehicle.pricing?.minimumKm !== undefined ? vehicle.pricing.minimumKm : '300');
    setPricingDriverAllowance(vehicle.pricing?.driverAllowance !== undefined ? vehicle.pricing.driverAllowance : '500');
    setPricingTollIncluded(!!vehicle.pricing?.tollIncluded);
    setPricingParkingIncluded(!!vehicle.pricing?.parkingIncluded);

    setSpecCapacity(vehicle.specifications?.capacity || '');
    setSpecLuggage(vehicle.specifications?.luggage || '');
    setSpecEngine(vehicle.specifications?.engine || '');
    setSpecComfort(vehicle.specifications?.comfort || '');
    setSpecAirConditioning(vehicle.specifications?.airConditioning || '');

    setAmenitiesInput(vehicle.amenities ? vehicle.amenities.join(', ') : '');
    setIsFormOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setGalleryFiles(files);
      setGalleryPreviews(files.map(f => URL.createObjectURL(f)));
    }
  };

  const removeExistingGalleryImage = (urlToRemove) => {
    setExistingGallery(existingGallery.filter(url => url !== urlToRemove));
  };

  const makeExistingCover = (url) => {
    setImageFile(null);
    setImagePreview(url);
    showToast('Cover image updated from gallery item.', 'success');
  };

  const makeNewCover = (idx) => {
    const file = galleryFiles[idx];
    if (file) {
      setImageFile(file);
      setImagePreview(galleryPreviews[idx]);
      showToast('Cover image updated from new upload.', 'success');
    }
  };

  const moveExistingLeft = (idx) => {
    if (idx === 0) return;
    const list = [...existingGallery];
    const item = list[idx];
    list.splice(idx, 1);
    list.splice(idx - 1, 0, item);
    setExistingGallery(list);
  };

  const moveExistingRight = (idx) => {
    if (idx === existingGallery.length - 1) return;
    const list = [...existingGallery];
    const item = list[idx];
    list.splice(idx, 1);
    list.splice(idx + 1, 0, item);
    setExistingGallery(list);
  };

  const moveNewLeft = (idx) => {
    if (idx === 0) return;
    const files = [...galleryFiles];
    const previews = [...galleryPreviews];
    
    const file = files[idx];
    files.splice(idx, 1);
    files.splice(idx - 1, 0, file);
    
    const preview = previews[idx];
    previews.splice(idx, 1);
    previews.splice(idx - 1, 0, preview);
    
    setGalleryFiles(files);
    setGalleryPreviews(previews);
  };

  const moveNewRight = (idx) => {
    if (idx === galleryPreviews.length - 1) return;
    const files = [...galleryFiles];
    const previews = [...galleryPreviews];
    
    const file = files[idx];
    files.splice(idx, 1);
    files.splice(idx + 1, 0, file);
    
    const preview = previews[idx];
    previews.splice(idx, 1);
    previews.splice(idx + 1, 0, preview);
    
    setGalleryFiles(files);
    setGalleryPreviews(previews);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('seats', seats);
      formData.append('type', type);
      formData.append('ac', ac);
      formData.append('registrationNumber', registrationNumber);
      formData.append('fuelType', fuelType);
      formData.append('status', status);
      formData.append('active', active);
      formData.append('description', description);

      formData.append('cabinDescription', cabinDescription);
      formData.append('pricing', JSON.stringify({
        type: pricingType,
        ac: pricingAc ? Number(pricingAc) : 0,
        nonAc: pricingNonAc ? Number(pricingNonAc) : 0,
        label: pricingLabel,
        description: pricingDescription,
        minimumKm: pricingMinimumKm ? Number(pricingMinimumKm) : 300,
        driverAllowance: pricingDriverAllowance ? Number(pricingDriverAllowance) : 500,
        tollIncluded: pricingTollIncluded,
        parkingIncluded: pricingParkingIncluded
      }));
      formData.append('specifications', JSON.stringify({
        capacity: specCapacity,
        luggage: specLuggage,
        engine: specEngine,
        comfort: specComfort,
        airConditioning: specAirConditioning
      }));
      
      const amenitiesArray = amenitiesInput
        .split(',')
        .map(x => x.trim())
        .filter(x => x.length > 0);
      formData.append('amenities', JSON.stringify(amenitiesArray));

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imagePreview && (imagePreview.startsWith('http') || imagePreview.startsWith('/'))) {
        formData.append('image', imagePreview);
      }

      if (galleryFiles.length > 0) {
        galleryFiles.forEach(file => {
          formData.append('gallery', file);
        });
      }

      if (formType === 'edit') {
        formData.append('existingGallery', JSON.stringify(existingGallery));
        await api.updateVehicle(selectedId, formData);
        showToast('Vehicle details updated successfully.', 'success');
      } else {
        await api.createVehicle(formData);
        showToast('Vehicle registered in fleet successfully.', 'success');
      }

      setIsFormOpen(false);
      loadVehicles();
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
      await api.deleteVehicle(deleteId);
      showToast('Vehicle removed from active fleet.', 'success');
      setIsDeleteOpen(false);
      loadVehicles();
    } catch (err) {
      showToast(err.message || 'Failed to delete vehicle.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search vehicles by name, type, fuel or plate..."
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
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Fleet Table */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-[#F97316] w-6 h-6" />
              <span className="ml-2.5 text-xs text-slate-500 font-bold">Loading vehicles list...</span>
            </div>
          ) : vehicles.length > 0 ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <th className="px-6 py-3.5 w-16">Image</th>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Capacity</th>
                  <th className="px-6 py-3.5">Fuel</th>
                  <th className="px-6 py-3.5">Operational Status</th>
                  <th className="px-6 py-3.5">Listing Status</th>
                  <th className="px-6 py-3.5 w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[#1E293B]">
                {vehicles.map((vh) => (
                  <tr key={vh._id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-3">
                      <img 
                        src={vh.image} 
                        alt="" 
                        className="w-12 h-10 object-cover rounded-xl border border-slate-100 bg-slate-50"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=150&fit=crop'; }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold leading-tight">{vh.name}</p>
                      {vh.registrationNumber && <span className="text-[9px] text-slate-400 uppercase tracking-wide">{vh.registrationNumber}</span>}
                    </td>
                    <td className="px-6 py-4 font-light">{vh.type}</td>
                    <td className="px-6 py-4 font-light">{vh.seats} Seats ({vh.ac ? 'AC' : 'Non-AC'})</td>
                    <td className="px-6 py-4 font-light">{vh.fuelType}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        vh.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        vh.status === 'Booked' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {vh.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        vh.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {vh.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(vh)}
                          className="p-2 text-slate-400 hover:text-[#F97316] hover:bg-orange-50 rounded-xl transition-all"
                          title="Edit vehicle"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm(vh._id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Remove vehicle"
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
              No vehicles registered. Add a vehicle to get started!
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {vehicles.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
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

      {/* Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-6 z-[999]">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl flex flex-col animate-slide-up relative">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-[#1E293B] transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold font-headings text-[#1E293B] mb-6">
              {formType === 'add' ? 'Register Fleet Vehicle' : 'Edit Vehicle Details'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle Name / Brand</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Toyota Innova Crysta"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  >
                    <option value="SUV / Cars">SUV / Cars</option>
                    <option value="Mini Bus">Mini Bus</option>
                    <option value="Luxury Bus">Luxury Bus</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Seating Capacity</label>
                  <input
                    type="number"
                    required
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    placeholder="e.g. 7"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Registration Number (Optional)</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. MH 12 PQ 5678"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Operational Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs select-none">
                  <input 
                    type="checkbox"
                    checked={ac}
                    onChange={(e) => setAc(e.target.checked)}
                    className="accent-[#F97316] w-4 h-4 rounded"
                  />
                  <span>Air Conditioning (AC)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs select-none">
                  <input 
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="accent-[#F97316] w-4 h-4 rounded"
                  />
                  <span>Active (Display on site)</span>
                </label>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">General Description</label>
                <textarea
                  required
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Spacious cabin, clean seat covers, large boot space for family luggage..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                ></textarea>
              </div>

              {/* Seating & Cabin Layout */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Cabin Description (Seating & Cabin Layout)</label>
                <textarea
                  required
                  rows="2"
                  value={cabinDescription}
                  onChange={(e) => setCabinDescription(e.target.value)}
                  placeholder="Description of seating config, legroom, adjustability..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                ></textarea>
              </div>

              {/* Pricing Section */}
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">Pricing Configuration</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Pricing Type</label>
                    <select
                      value={pricingType}
                      onChange={(e) => setPricingType(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                    >
                      <option value="per_km">Per KM Rates</option>
                      <option value="custom">Custom Quote</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Pricing Label</label>
                    <input
                      type="text"
                      required
                      value={pricingLabel}
                      onChange={(e) => setPricingLabel(e.target.value)}
                      placeholder="e.g. Per KM"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                    />
                  </div>
                </div>

                {pricingType === 'per_km' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">AC Price (₹ per KM)</label>
                      <input
                        type="number"
                        required={pricingType === 'per_km'}
                        value={pricingAc}
                        onChange={(e) => setPricingAc(e.target.value)}
                        placeholder="e.g. 24"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs bg-white focus:ring-2 focus:ring-[#F97316] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Non-AC Price (₹ per KM)</label>
                      <input
                        type="number"
                        required={pricingType === 'per_km'}
                        value={pricingNonAc}
                        onChange={(e) => setPricingNonAc(e.target.value)}
                        placeholder="e.g. 22"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs bg-white focus:ring-2 focus:ring-[#F97316] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Minimum KM Limit</label>
                      <input
                        type="number"
                        value={pricingMinimumKm}
                        onChange={(e) => setPricingMinimumKm(e.target.value)}
                        placeholder="e.g. 300"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs bg-white focus:ring-2 focus:ring-[#F97316] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Driver Allowance (₹ per Day)</label>
                      <input
                        type="number"
                        value={pricingDriverAllowance}
                        onChange={(e) => setPricingDriverAllowance(e.target.value)}
                        placeholder="e.g. 500"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs bg-white focus:ring-2 focus:ring-[#F97316] outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs select-none">
                        <input 
                          type="checkbox"
                          checked={pricingTollIncluded}
                          onChange={(e) => setPricingTollIncluded(e.target.checked)}
                          className="accent-[#F97316] w-4 h-4 rounded"
                        />
                        <span>Toll Charges Included</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs select-none">
                        <input 
                          type="checkbox"
                          checked={pricingParkingIncluded}
                          onChange={(e) => setPricingParkingIncluded(e.target.checked)}
                          className="accent-[#F97316] w-4 h-4 rounded"
                        />
                        <span>Parking Charges Included</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Pricing Card Description / Notes</label>
                  <input
                    type="text"
                    value={pricingDescription}
                    onChange={(e) => setPricingDescription(e.target.value)}
                    placeholder="Rates are variable based on duration..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                  />
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">Technical Specifications</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity Specification</label>
                    <input
                      type="text"
                      required
                      value={specCapacity}
                      onChange={(e) => setSpecCapacity(e.target.value)}
                      placeholder="e.g. 7 Passengers + 1 Driver"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Luggage Capacity Specification</label>
                    <input
                      type="text"
                      required
                      value={specLuggage}
                      onChange={(e) => setSpecLuggage(e.target.value)}
                      placeholder="e.g. 3 Medium Bags"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Engine Specification</label>
                    <input
                      type="text"
                      required
                      value={specEngine}
                      onChange={(e) => setSpecEngine(e.target.value)}
                      placeholder="e.g. 2.5L Turbo Diesel"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Comfort Specification</label>
                    <input
                      type="text"
                      required
                      value={specComfort}
                      onChange={(e) => setSpecComfort(e.target.value)}
                      placeholder="e.g. Reclining Second Row Captain Seats"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Air Conditioning Specification</label>
                    <input
                      type="text"
                      required
                      value={specAirConditioning}
                      onChange={(e) => setSpecAirConditioning(e.target.value)}
                      placeholder="e.g. Dual Zone climate cooling vents"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities / Feature Chips */}
              <div className="space-y-1.5 border-t border-slate-100 pt-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">On-Board Amenities (Comma separated list)</label>
                <input
                  type="text"
                  required
                  value={amenitiesInput}
                  onChange={(e) => setAmenitiesInput(e.target.value)}
                  placeholder="e.g. Captain Seats, GPS Tracking, Sound System, Ambient Lighting"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-[#F97316] outline-none"
                />
              </div>

              {/* Photo upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-4">
                {/* Cover Image */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Main Cover Image</label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-20 h-16 object-cover rounded-xl border border-slate-200 bg-slate-50" 
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

                {/* Gallery Images */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Add Gallery Images (Multiple)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#F97316] file:cursor-pointer hover:file:bg-orange-100"
                  />
                </div>
              </div>

              {/* Gallery Preview / Edit */}
              {(existingGallery.length > 0 || galleryPreviews.length > 0) && (
                <div className="space-y-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Manage Gallery & Order (★ sets cover image)</span>
                  
                  <div className="flex flex-wrap gap-4">
                    {/* Existing Gallery Images */}
                    {existingGallery.map((url, idx) => (
                      <div key={`exist-${idx}`} className="flex flex-col items-center p-1.5 border border-slate-200 rounded-2xl bg-white w-28 space-y-1">
                        <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-slate-50">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex justify-between w-full px-1 text-slate-500 text-[10px]">
                          <button type="button" onClick={() => moveExistingLeft(idx)} disabled={idx === 0} className="hover:text-[#F97316] disabled:opacity-30">
                            &larr;
                          </button>
                          <button type="button" onClick={() => makeExistingCover(url)} className="hover:text-[#F97316] font-bold" title="Make Cover">
                            ★
                          </button>
                          <button type="button" onClick={() => removeExistingGalleryImage(url)} className="hover:text-rose-500 font-bold" title="Remove">
                            &times;
                          </button>
                          <button type="button" onClick={() => moveExistingRight(idx)} disabled={idx === existingGallery.length - 1} className="hover:text-[#F97316] disabled:opacity-30">
                            &rarr;
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* New Selected Gallery Images */}
                    {galleryPreviews.map((preview, idx) => (
                      <div key={`new-${idx}`} className="flex flex-col items-center p-1.5 border border-[#F97316]/30 rounded-2xl bg-white w-28 space-y-1">
                        <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-slate-50">
                          <img src={preview} alt="" className="w-full h-full object-cover" />
                          <div className="absolute top-0.5 right-0.5 bg-[#F97316] text-white text-[7px] px-1 rounded font-bold uppercase">New</div>
                        </div>
                        <div className="flex justify-between w-full px-1 text-slate-500 text-[10px]">
                          <button type="button" onClick={() => moveNewLeft(idx)} disabled={idx === 0} className="hover:text-[#F97316] disabled:opacity-30">
                            &larr;
                          </button>
                          <button type="button" onClick={() => makeNewCover(idx)} className="hover:text-[#F97316] font-bold" title="Make Cover">
                            ★
                          </button>
                          <button type="button" onClick={() => {
                            setGalleryFiles(galleryFiles.filter((_, i) => i !== idx));
                            setGalleryPreviews(galleryPreviews.filter((_, i) => i !== idx));
                          }} className="hover:text-rose-500 font-bold" title="Remove">
                            &times;
                          </button>
                          <button type="button" onClick={() => moveNewRight(idx)} disabled={idx === galleryPreviews.length - 1} className="hover:text-[#F97316] disabled:opacity-30">
                            &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
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
                      <span>Saving vehicle...</span>
                    </>
                  ) : (
                    <span>Save Vehicle</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-6 z-[999]">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 animate-scale-up relative">
            <h3 className="text-sm font-bold font-headings text-[#1E293B]">Confirm Deletion</h3>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              Are you sure you want to remove this vehicle from active records? This will soft-delete the fleet item, removing it from both public directories and admin tables.
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
                Delete Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
