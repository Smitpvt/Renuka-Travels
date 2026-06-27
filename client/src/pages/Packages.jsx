import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTA from '../sections/CTA';
import SearchInput from '../components/SearchInput';
import { fuseSearch } from '../utils/search';
import { Calendar, Users, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

const categories = ['All', 'Weekend Trips', 'Pilgrimage', 'Family Tours', 'Corporate Tours'];

export default function Packages() {
  const [selectedCat, setSelectedCat] = useState('All');
  const [priceType, setPriceType] = useState("ac");
  const [dbPackages, setDbPackages] = useState([]);
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

  const fetchPackages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getPackages();
      setDbPackages(data.packages || []);
    } catch (err) {
      setError(err.message || 'Unable to connect to service. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Filter packages using search query ranking and then by category
  const searchFiltered = debouncedQuery
    ? fuseSearch(dbPackages, debouncedQuery, ['title', 'category', 'duration', 'desc', 'highlights', 'destination'], 'title')
    : dbPackages;

  const filteredPackages = selectedCat === 'All'
    ? searchFiltered
    : searchFiltered.filter(p => p.category === selectedCat);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] antialiased">
      <Navbar />


      {/* Packages Hero */}
      <section className="relative pt-40 pb-20 bg-[#1E293B] text-white overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/maharashtra_landscape.png"
            alt="Scenic Maharashtra Travel Catalog"
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
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">Our Catalog</span>
            <h1 className="text-4xl md:text-5xl font-extrabold font-headings">Tour Packages</h1>
            <p className="text-sm md:text-base text-slate-300 font-light max-w-xl mx-auto leading-relaxed">
              Explore our curated travel solutions designed to provide ultimate passenger comfort across Maharashtra's finest sites.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-10 max-w-[1280px] mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCat(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${selectedCat === cat
                  ? 'bg-[#F97316] text-white shadow-md'
                  : 'bg-white text-[#1E293B] border border-slate-200 hover:bg-orange-50'
                }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Packages Grid */}
      <section className="pb-24 max-w-[1280px] mx-auto px-6">
        <SearchInput
          value={searchQuery}
          onQueryChange={handleQueryChange}
          onCommit={handleCommit}
          placeholder="Search packages by title, category, duration, highlights..."
          data={dbPackages}
          searchFields={['title', 'category', 'duration', 'desc', 'highlights', 'destination']}
          primaryKey="title"
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-200/55 shadow-sm p-6 flex flex-col justify-between h-[480px] animate-pulse">
                <div className="h-[220px] bg-slate-200 rounded-2xl mb-4 w-full"></div>
                <div className="space-y-3 flex-grow">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
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
              onClick={fetchPackages}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F97316] text-white text-xs font-bold rounded-full hover:bg-orange-600 transition-colors shadow-md"
            >
              <RefreshCw size={12} className="animate-spin-once" />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : filteredPackages.length > 0 ? (
          <motion.div
            key={selectedCat}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPackages.map((pkg) => (
              <motion.div
                key={pkg.slug}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/55 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image */}
                <div className="h-[220px] relative overflow-hidden bg-slate-50">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&fit=crop'; }}
                  />
                  {pkg.featured && (
                    <span className="absolute top-4 left-4 bg-[#F97316] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      Featured
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 flex-grow flex flex-col justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-[#F97316]" /> {pkg.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} className="text-[#F97316]" /> {pkg.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold font-headings text-[#1E293B] mb-2">{pkg.title}</h3>
                    <p className="text-xs text-slate-500 font-light leading-relaxed mb-4">{pkg.desc}</p>

                    {/* Quick highlights */}
                    <ul className="space-y-1.5 text-xs text-slate-500 font-light mt-3">
                      {Array.isArray(pkg.highlights) && pkg.highlights.slice(0, 3).map((hl, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <span className="text-[#F97316] font-bold text-xs mt-0.5">•</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing and Link */}
                  <div className="space-y-3">
                    {pkg.pricing?.customQuote ? (
                      <div className="space-y-1.5">
                        <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest">Price</span>
                        <div>
                          <span className="text-base font-extrabold text-[#F97316]">Custom Quote</span>
                          <p className="text-xs text-slate-500 font-light mt-0.5">Contact For Best Price</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest">Starting From</span>
                        <div>
                          <span className="text-base font-extrabold text-[#F97316]">
                            {priceType === 'ac'
                              ? (pkg.pricing?.ac ? `₹${pkg.pricing.ac.toLocaleString('en-IN')}` : 'Custom Quote')
                              : (pkg.pricing?.nonAc ? `₹${pkg.pricing.nonAc.toLocaleString('en-IN')}` : 'Custom Quote')}
                          </span>
                          {!pkg.pricing?.tollIncluded && (
                            <p className="text-[9px] text-slate-500 mt-1">+ Toll Charges Extra</p>
                          )}
                        </div>
                        {pkg.pricing?.nonAc && (
                          <div className="flex items-center bg-slate-100 rounded-full p-1 w-fit">
                            <button
                              onClick={() => setPriceType('ac')}
                              className={`px-2.5 py-1 text-[9px] font-bold rounded-full transition-all ${
                                priceType === 'ac' ? 'bg-[#F97316] text-white' : 'text-slate-500'
                              }`}
                            >
                              AC
                            </button>
                            <button
                              onClick={() => setPriceType('nonac')}
                              className={`px-2.5 py-1 text-[9px] font-bold rounded-full transition-all ${
                                priceType === 'nonac' ? 'bg-[#F97316] text-white' : 'text-slate-500'
                              }`}
                            >
                              Non AC
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    <Link
                      to={`/packages/${pkg.slug}`}
                      className="w-full px-5 py-2.5 bg-[#F97316] border border-[#F97316] text-white text-xs font-bold rounded-full hover:bg-transparent hover:text-[#F97316] transition-all duration-300 flex items-center justify-center gap-1"
                    >
                      <span>View Details</span>
                      <ChevronRight size={12} />
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
              <h3 className="text-lg font-bold font-headings text-slate-800">No packages found.</h3>
              <p className="text-xs text-slate-500 font-light max-w-xs mx-auto leading-relaxed">
                We couldn't find any packages matching "{debouncedQuery}". Try checking your spelling or clear the search.
              </p>
              <button
                onClick={() => handleQueryChange('', false)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F97316] text-white text-xs font-bold rounded-full hover:bg-orange-600 transition-colors shadow-md"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
              <p className="text-sm text-slate-500 font-light">No packages found for this category.</p>
            </div>
          )
        )}
      </section>

      <CTA />
      <Footer />
    </div>
  );
}
