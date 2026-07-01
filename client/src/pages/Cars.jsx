import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../services/api';
import SearchInput from '../components/SearchInput';
import { fuseSearch } from '../utils/search';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, HelpCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants/contact';
import StructuredData from '../components/StructuredData';
import {
  generateWebPageSchema,
  generateBreadcrumbSchema
} from '../utils/schemaGenerator';

const categoryTabs = [
  { id: 'all', label: 'All Vehicles' },
  { id: 'Cars', label: 'Cars (Ertiga/Classic/Premium)' },
  { id: 'Mini Buses', label: 'Mini Buses (17-26 Seater)' },
  { id: 'Luxury Buses', label: 'Luxury Buses (35-50 Seater)' }
];

export default function Cars() {
  const origin = window.location.origin;
  const url = window.location.href;

  const webpageSchema = generateWebPageSchema(
    'CollectionPage',
    url,
    'Our Premium Fleet | Renuka Travels | Premium Travel & Car Rentals Maharashtra',
    'Choose from our premium range of Sedans, SUVs, Tempo Travellers, and Luxury Buses designed for comfort and safety.'
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: `${origin}/` },
    { name: 'Vehicles', item: url }
  ]);

  const schemas = [webpageSchema, breadcrumbSchema];

  const [selectedTab, setSelectedTab] = useState('all');
  const [dbVehicles, setDbVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL query parameter synchronization
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [debouncedQuery, setDebouncedQuery] = useState(searchParam);

  // Sync state when URL updates (e.g. back/forward button clicks)
  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  // Debounce search query to prevent lag on heavy list updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleQueryChange = (newQuery, shouldReplace = true) => {
    setSearchQuery(newQuery);
    if (newQuery) {
      setSearchParams({ search: newQuery }, { replace: shouldReplace });
    } else {
      setSearchParams({}, { replace: shouldReplace });
    }
  };

  const handleCommit = (query) => {
    if (query) {
      setSearchParams({ search: query }, { replace: false });
    } else {
      setSearchParams({}, { replace: false });
    }
  };

  const fetchVehicles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getVehicles();
      setDbVehicles(data.vehicles || []);
    } catch (err) {
      setError(err.message || 'Unable to connect to service. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Filter vehicles using search query ranking and then by category
  const searchFiltered = debouncedQuery
    ? fuseSearch(dbVehicles, debouncedQuery, ['name', 'type', 'seats', 'fuelType', 'ac', 'amenities', 'description'], 'name')
    : dbVehicles;

  const filteredVehicles = searchFiltered.filter((v) => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'Cars') return v.type === 'SUV / Cars';
    if (selectedTab === 'Mini Buses') return v.type === 'Mini Bus';
    if (selectedTab === 'Luxury Buses') return v.type === 'Luxury Bus';
    return true;
  });

  const handleRequestQuote = async (vName) => {
    const message = `Hello Renuka Tours & Travels,

I would like to enquire about the following vehicle.

Vehicle: ${vName}

Kindly share the quotation, availability, and booking process.

Thank you.`;

    // Save inquiry to backend database in background
    try {
      await api.submitInquiry({
        name: 'Quote Request User',
        phone: 'WhatsApp Link Clicked',
        pickup: 'Fleet List Page',
        destination: vName,
        vehicleType: vName,
        date: new Date().toISOString(),
        tripType: 'One Way',
        notes: `Quote request for vehicle: ${vName}`
      });
    } catch (err) {
      console.warn('Inquiry background save failed:', err);
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] antialiased">
      <StructuredData data={schemas} />
      <Navbar />

      {/* Fleet Hero Banner */}
      <section className="relative pt-40 pb-20 bg-[#1E293B] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img
            src="/images/renuka_fleet.png"
            alt="Renuka Fleet"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent"></div>

        <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">Our Collection</span>
            <h1 className="text-4xl md:text-5xl font-extrabold font-headings">Our Premium Fleet</h1>
            <p className="text-sm md:text-base text-slate-300 font-light max-w-xl mx-auto leading-relaxed">
              Choose from our premium range of Sedans, SUVs, Tempo Travellers, and Luxury Buses designed for comfort and safety.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Segmented Category Filters */}
      <section className="py-6 max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-lg md:max-w-4xl lg:max-w-5xl mx-auto">
          {categoryTabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center justify-center text-center w-full min-h-[48px] px-4 py-3 rounded-full text-xs font-bold transition-all duration-300 ${
                selectedTab === tab.id
                  ? 'bg-[#F97316] text-white shadow-md'
                  : 'bg-white text-[#1E293B] border border-slate-200 hover:bg-orange-50'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="pb-24 max-w-[1280px] mx-auto px-6">
        <SearchInput
          value={searchQuery}
          onQueryChange={handleQueryChange}
          onCommit={handleCommit}
          placeholder="Search vehicles by name, type, seats, fuel, AC/Non-AC..."
          data={dbVehicles}
          searchFields={['name', 'type', 'seats', 'fuelType', 'ac', 'amenities', 'description']}
          primaryKey="name"
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-200/55 shadow-sm p-6 flex flex-col justify-between h-[400px] animate-pulse">
                <div className="h-[200px] bg-slate-200 rounded-2xl mb-4 w-full"></div>
                <div className="space-y-3 flex-grow">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded-full w-full mt-4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/60 shadow-sm max-w-xl mx-auto px-6 space-y-4">
            <AlertCircle className="mx-auto text-red-500" size={48} />
            <h3 className="text-lg font-bold font-headings text-slate-800">Connection Failed</h3>
            <p className="text-sm text-slate-500 font-light leading-relaxed">{error}</p>
            <button
              onClick={fetchVehicles}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F97316] text-white text-xs font-bold rounded-full hover:bg-orange-600 transition-colors shadow-md"
            >
              <RefreshCw size={12} className="animate-spin-once" />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : filteredVehicles.length > 0 ? (
          <motion.div
            key={selectedTab}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredVehicles.map((vehicle) => (
              <motion.div
                key={vehicle.slug}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/55 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image */}
                <div className="h-[200px] relative overflow-hidden bg-slate-100">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&fit=crop'; }}
                  />
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-wrap gap-1.5 justify-end">
                    <span className="bg-[#1E293B]/85 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {vehicle.seats} Seats
                    </span>
                    <span className="bg-[#F97316]/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {vehicle.ac ? "AC" : "Non-AC"}
                    </span>
                    {vehicle.fuelType && (
                      <span className="bg-slate-700/85 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {vehicle.fuelType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between gap-5">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#F97316]">
                      {vehicle.type}
                    </span>
                    <h3 className="text-lg font-bold font-headings text-[#1E293B] mt-1 mb-2">
                      {vehicle.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-light leading-relaxed mb-4 line-clamp-2">
                      {vehicle.description}
                    </p>

                    {/* Dynamic Pricing Info */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Estimated Pricing:</span>
                      <span className="font-bold text-[#F97316] text-right">
                        {vehicle.pricing?.type === 'custom' ? (
                          <span>Custom Quote</span>
                        ) : (
                          <span className="block text-[11px] leading-tight">
                            {vehicle.pricing?.nonAc > 0 && <span className="block">Non AC: ₹{vehicle.pricing.nonAc}/KM</span>}
                            {vehicle.pricing?.ac > 0 && <span className="block">AC: ₹{vehicle.pricing.ac}/KM</span>}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Buttons Layout */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleRequestQuote(vehicle.name)}
                      className="py-2.5 rounded-full border border-[#F97316] text-[#F97316] hover:bg-[#F97316]/10 text-xs font-bold transition-all duration-300 text-center shadow-sm"
                    >
                      Request Quote
                    </button>

                    <Link
                      to={`/cars/${vehicle.slug}`}
                      className="py-2.5 rounded-full bg-[#F97316] text-white hover:bg-orange-600 text-xs font-bold transition-all duration-300 text-center flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
                    >
                      <span>View Details</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          debouncedQuery ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm max-w-md mx-auto space-y-4">
              <AlertCircle className="mx-auto text-slate-400" size={48} />
              <h3 className="text-lg font-bold font-headings text-slate-800">No vehicles found.</h3>
              <p className="text-xs text-slate-500 font-light max-w-xs mx-auto leading-relaxed">
                We couldn't find any vehicles matching "{debouncedQuery}". Try checking your spelling or clear the search.
              </p>
              <button
                onClick={() => handleQueryChange('', false)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F97316] text-white text-xs font-bold rounded-full hover:bg-orange-600 transition-colors shadow-md"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm animate-fade-in">
              <p className="text-sm text-slate-500 font-light">No vehicles listed under this category.</p>
            </div>
          )
        )}
      </section>

      <Footer />
    </div>
  );
}