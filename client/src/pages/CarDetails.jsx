import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Wind, 
  ChevronRight, 
  ChevronDown,
  Check, 
  Phone, 
  ShieldAlert,
  Sliders,
  Calendar,
  Compass,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../services/api';
import { WHATSAPP_NUMBER } from '../constants/contact';
import StructuredData from '../components/StructuredData';
import {
  generateWebPageSchema,
  generateVehicleSchema,
  generateBreadcrumbSchema
} from '../utils/schemaGenerator';

export default function CarDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [relatedVehicles, setRelatedVehicles] = useState([]);
  const [callbackData, setCallbackData] = useState({
    name: '',
    phone: '',
    date: ''
  });

  const origin = window.location.origin;
  const url = window.location.href;

  const webpageSchema = vehicle
    ? generateWebPageSchema(
        'ItemPage',
        url,
        `${vehicle.name.trim()} Rental | Renuka Travels`,
        vehicle.description || `Rent premium ${vehicle.name.trim()} from Renuka Travels. Comfort, safety, and transparent pricing.`
      )
    : null;

  const vehicleSchema = vehicle
    ? generateVehicleSchema(vehicle, origin)
    : null;

  const breadcrumbSchema = vehicle
    ? generateBreadcrumbSchema([
        { name: 'Home', item: `${origin}/` },
        { name: 'Vehicles', item: `${origin}/cars` },
        { name: vehicle.name.trim(), item: url }
      ])
    : null;

  const schemas = [webpageSchema, vehicleSchema, breadcrumbSchema].filter(Boolean);

  const fetchVehicleDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getVehicle(slug);
      setVehicle(data.vehicle);
      setMainImage(data.vehicle?.image || '');

      // Load related vehicles of same type preferred
      const fleetData = await api.getVehicles();
      if (fleetData && fleetData.vehicles) {
        const currentType = data.vehicle?.type;
        const otherVehicles = fleetData.vehicles.filter(v => v.slug !== slug);
        
        // Sort other vehicles: same type first
        const sortedRelated = [...otherVehicles].sort((a, b) => {
          if (a.type === currentType && b.type !== currentType) return -1;
          if (a.type !== currentType && b.type === currentType) return 1;
          return 0;
        });
        
        setRelatedVehicles(sortedRelated.slice(0, 3));
      }
    } catch (err) {
      setError(err.message || 'Unable to load vehicle details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleDetails();
  }, [slug]);

  const handleCallbackSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = callbackData.date
      ? new Date(callbackData.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Not specified";

    const message = `Hello Renuka Tours & Travels,

I have submitted a callback request through your website.

Customer Details
Name: ${callbackData.name}
Phone: ${callbackData.phone}

Trip Details
Travel Date: ${formattedDate}
Vehicle Type: ${vehicle.name}

Kindly contact me with the quotation and availability at your earliest convenience.

Thank you.`;

    // Save inquiry to backend database in background
    try {
      await api.submitInquiry({
        name: callbackData.name,
        phone: callbackData.phone,
        pickup: 'Vehicle Details Page Callback',
        destination: vehicle.name,
        vehicleType: vehicle.name,
        date: callbackData.date || new Date().toISOString(),
        tripType: 'One Way',
        notes: `Callback request for Vehicle: ${vehicle.name}. Required Date: ${formattedDate}`
      });
    } catch (err) {
      console.warn('Inquiry background save failed:', err);
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    setCallbackData({ name: '', phone: '', date: '' });
  };

  const handleWhatsAppInquiry = async () => {
    const message = `Hello Renuka Tours & Travels,

I would like to enquire about the following vehicle.

Vehicle: ${vehicle.name}

Kindly share the quotation, availability, and booking process.

Thank you.`;

    // Save inquiry to backend database in background
    try {
      await api.submitInquiry({
        name: 'WhatsApp Lead User',
        phone: 'WhatsApp Button Clicked',
        pickup: 'Vehicle Details Link',
        destination: vehicle.name,
        vehicleType: vehicle.name,
        date: new Date().toISOString(),
        tripType: 'One Way',
        notes: `Direct inquiry for Vehicle: ${vehicle.name} (Category: ${vehicle.type}, Seats: ${vehicle.seats})`
      });
    } catch (err) {
      console.warn('Inquiry background save failed:', err);
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased animate-pulse">
        <Navbar />
        <div className="flex-grow pt-32 px-6 max-w-[1280px] mx-auto w-full space-y-8">
          <div className="h-[40vh] bg-slate-200 rounded-3xl w-full"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-20 bg-slate-200 rounded-3xl w-full"></div>
              <div className="h-40 bg-slate-200 rounded-3xl w-full"></div>
            </div>
            <div className="lg:col-span-4 h-80 bg-slate-200 rounded-3xl w-full"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center space-y-4 pt-32">
          <AlertCircle className="text-red-500" size={48} />
          <h2 className="text-3xl font-extrabold font-headings text-[#1E293B]">Vehicle Loading Failed</h2>
          <p className="text-sm text-slate-500 max-w-sm">{error || "We couldn't find the vehicle you were looking for."}</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/cars')}
              className="px-6 py-2.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-full hover:bg-slate-300 transition-colors shadow-sm"
            >
              Back to Catalog
            </button>
            <button
              onClick={fetchVehicleDetails}
              className="px-6 py-2.5 bg-[#F97316] text-white text-xs font-bold rounded-full hover:bg-orange-600 transition-colors shadow-md flex items-center gap-1"
            >
              <RefreshCw size={12} />
              <span>Retry</span>
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] antialiased">
      <StructuredData data={schemas} />
      <Navbar />

      {/* Main Details Grid */}
      <section className="pt-28 md:pt-36 pb-12 md:pb-20 max-w-[1280px] mx-auto px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="text-xs text-slate-400 mb-8 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#F97316]">Home</Link>
          <span>/</span>
          <Link to="/cars" className="hover:text-[#F97316]">Fleet</Link>
          <span>/</span>
          <span className="text-[#1E293B] font-medium">{vehicle.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Side: Large Gallery & Specification tables */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Gallery Component */}
            <div className="space-y-4">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-white border border-slate-150 shadow-md">
                <img
                  src={mainImage}
                  alt={vehicle.name}
                  className="w-full h-full object-cover transition-all duration-300"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&fit=crop'; }}
                />
                <div className="absolute top-4 left-4 bg-orange-50/90 backdrop-blur-md text-[#F97316] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {vehicle.type}
                </div>
              </div>

              {/* Thumbnails list */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {[vehicle.image, ...(vehicle.gallery || [])].filter(Boolean).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 bg-slate-100 flex-shrink-0 transition-all ${
                      mainImage === img ? 'border-[#F97316] scale-95 shadow-sm' : 'border-slate-200 hover:border-orange-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${vehicle.name} Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=150&fit=crop'; }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications Table */}
            {vehicle.specifications && Object.values(vehicle.specifications).some(Boolean) && (
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/55 shadow-sm space-y-4">
                <h2 className="text-lg font-bold font-headings text-[#1E293B] flex items-center gap-2">
                  <Sliders size={18} className="text-[#F97316]" />
                  <span>Vehicle Specifications</span>
                </h2>
                
                <div className="divide-y divide-slate-100 text-xs">
                  {vehicle.specifications.capacity && (
                    <div className="py-3 flex justify-between gap-4">
                      <span className="text-slate-400 font-medium">Capacity</span>
                      <span className="font-bold text-[#1E293B]">{vehicle.specifications.capacity}</span>
                    </div>
                  )}
                  {vehicle.specifications.luggage && (
                    <div className="py-3 flex justify-between gap-4">
                      <span className="text-slate-400 font-medium">Luggage</span>
                      <span className="font-bold text-[#1E293B]">{vehicle.specifications.luggage}</span>
                    </div>
                  )}
                  {vehicle.specifications.engine && (
                    <div className="py-3 flex justify-between gap-4">
                      <span className="text-slate-400 font-medium">Engine</span>
                      <span className="font-bold text-[#1E293B]">{vehicle.specifications.engine}</span>
                    </div>
                  )}
                  {vehicle.specifications.comfort && (
                    <div className="py-3 flex justify-between gap-4">
                      <span className="text-slate-400 font-medium">Comfort</span>
                      <span className="font-bold text-[#1E293B]">{vehicle.specifications.comfort}</span>
                    </div>
                  )}
                  {vehicle.specifications.airConditioning && (
                    <div className="py-3 flex justify-between gap-4">
                      <span className="text-slate-400 font-medium">Air Conditioning</span>
                      <span className="font-bold text-[#1E293B]">{vehicle.specifications.airConditioning}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Seating configuration information */}
            {vehicle.cabinDescription && (
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/55 shadow-sm space-y-4">
                <h2 className="text-lg font-bold font-headings text-[#1E293B] flex items-center gap-2">
                  <Users size={18} className="text-[#F97316]" />
                  <span>Seating & Cabin Layout</span>
                </h2>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  {vehicle.cabinDescription}
                </p>
                {vehicle.amenities && vehicle.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {vehicle.amenities.map((item, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-semibold text-slate-600">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Side: Specifications, Amenities, CTAs */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Header info card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/55 shadow-lg space-y-6">
              
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-extrabold font-headings text-[#1E293B] leading-tight">
                  {vehicle.name}
                </h1>
                
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 bg-orange-50 text-[#F97316] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    <Users size={10} /> {vehicle.seats}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    <Wind size={10} /> {vehicle.ac ? "AC Equipped" : "Non AC Option"}
                  </span>
                </div>
              </div>

              {/* Flexible Pricing labels instead of hardcoding numbers */}
              <div className="bg-[#FFF7ED]/55 p-4 rounded-2xl border border-orange-100 text-xs space-y-3">
                <span className="block text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                  {vehicle.pricing?.label || "Pricing Rate"}
                </span>
                
                {vehicle.pricing?.type === 'custom' ? (
                  <p className="text-sm font-bold text-[#F97316]">Custom Quote Available</p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[#F97316] font-bold text-sm">
                      <span>Non AC Rate:</span>
                      <span>₹{vehicle.pricing?.nonAc} / KM</span>
                    </div>
                    <div className="flex justify-between items-center text-[#F97316] font-bold text-sm">
                      <span>AC Rate:</span>
                      <span>₹{vehicle.pricing?.ac} / KM</span>
                    </div>
                    
                    <div className="border-t border-orange-100/60 pt-2 space-y-1 text-slate-500 text-[10px] font-light">
                      {(vehicle.pricing?.permit > 0 || vehicle.pricing?.minimumKm > 0) && (
                        <div className="flex justify-between">
                          <span>Permit:</span>
                          <span className="font-semibold text-[#1E293B]">{vehicle.pricing.permit !== undefined ? vehicle.pricing.permit : vehicle.pricing.minimumKm}</span>
                        </div>
                      )}
                      {vehicle.pricing?.driverAllowance > 0 && (
                        <div className="flex justify-between">
                          <span>Driver Allowance:</span>
                          <span className="font-semibold text-[#1E293B]">₹{vehicle.pricing.driverAllowance} / Day</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Toll Fees:</span>
                        <span className="font-semibold text-[#1E293B]">{vehicle.pricing?.tollIncluded ? 'Included' : 'Exclusions Apply'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Parking Fees:</span>
                        <span className="font-semibold text-[#1E293B]">{vehicle.pricing?.parkingIncluded ? 'Included' : 'Exclusions Apply'}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {vehicle.pricing?.description && (
                  <p className="text-[10px] text-slate-500 font-light border-t border-orange-100/50 pt-2 leading-relaxed">
                    {vehicle.pricing.description}
                  </p>
                )}
              </div>

              <p className="text-xs text-slate-500 font-light leading-relaxed">
                {vehicle.description}
              </p>

              {/* Amenities Grid */}
              {vehicle.amenities && vehicle.amenities.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">On-Board Amenities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {vehicle.amenities.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center text-xs text-slate-600 font-light">
                        <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center text-[#F97316] text-[10px] font-bold flex-shrink-0">✓</div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <button
                  onClick={handleWhatsAppInquiry}
                  className="w-full py-3.5 rounded-full bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <FaWhatsapp size={14} />
                  <span>Inquire on WhatsApp</span>
                </button>
              </div>

              {/* Callback Form */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider text-center">Get a Callback Quote</h4>
                <form onSubmit={handleCallbackSubmit} className="space-y-4">
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={callbackData.name}
                      onChange={(e) => setCallbackData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all min-h-[44px]"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={callbackData.phone}
                      onChange={(e) => setCallbackData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all min-h-[44px]"
                    />
                  </div>

                  {vehicle.ac && (
                    <div className="space-y-1 text-left">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Preference</label>
                      <div className="relative">
                        <select
                          className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all min-h-[44px] appearance-none"
                          name="preference"
                          required
                        >
                          <option value="ac">Air Conditioned (AC)</option>
                          <option value="nonac">Non Air Conditioned (Non-AC)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Travel Date</label>
                    <input
                      type="date"
                      required
                      value={callbackData.date}
                      onChange={(e) => setCallbackData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all min-h-[44px]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 rounded-2xl bg-[#F97316] hover:bg-orange-600 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
                  >
                    <Phone size={12} />
                    <span>Request Callback Quote</span>
                  </button>
                </form>
              </div>

            </div>

          </div>

        </div>

        {/* Related Vehicles Section */}
        {relatedVehicles.length > 0 && (
          <div className="py-20 border-t border-slate-200/50 mt-10">
            <div className="mb-10 text-center max-w-sm mx-auto">
              <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest font-headings">More Fleet Options</span>
              <h2 className="text-2xl font-bold font-headings text-[#1E293B] mt-1">Related Vehicles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedVehicles.map((relVehicle) => (
                <motion.div
                  key={relVehicle.slug}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/55 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="h-44 relative bg-slate-100">
                    <img
                      src={relVehicle.image}
                      alt={relVehicle.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&fit=crop'; }}
                    />
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {relVehicle.type}
                      </span>
                      <h3 className="text-sm font-bold text-[#1E293B] font-headings mt-1 line-clamp-1">{relVehicle.name}</h3>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs font-bold text-[#F97316]">{relVehicle.seats} seater</span>
                      <Link
                        to={`/cars/${relVehicle.slug}`}
                        className="flex items-center gap-0.5 text-xs font-bold text-[#1E293B] hover:text-[#F97316] transition-colors"
                      >
                        <span>View</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </section>

      <Footer />
    </div>
  );
}
