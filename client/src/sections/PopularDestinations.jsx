import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export function DestinationCard({ pkg }) {
  const [priceType, setPriceType] = useState('ac');
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      <div className="h-[200px] relative overflow-hidden bg-slate-50">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&fit=crop'; }}
        />
        <span className="absolute top-4 left-4 bg-[#F97316] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          {pkg.category}
        </span>
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between gap-5">
        <div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-[#F97316]" /> {pkg.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} className="text-[#F97316]" /> {pkg.category}
            </span>
          </div>
          <h3 className="text-lg font-bold font-headings text-[#1E293B] mb-2 hover:text-[#F97316] transition-colors">
            {pkg.title}
          </h3>

          {/* Quick Highlights list (Max 2 for layout compactness) */}
          <ul className="space-y-1 text-xs text-slate-500 font-light mb-2">
            {Array.isArray(pkg.highlights) && pkg.highlights.slice(0, 2).map((hl, idx) => (
              <li key={idx} className="flex gap-1.5 items-start">
                <span className="text-[#F97316] font-bold text-xs mt-0.5">•</span>
                <span>{hl}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-2">
              Package Price
            </span>

            {pkg.pricing?.customQuote ? (
              <span className="text-base font-extrabold text-[#F97316] block mt-1">
                Custom Quote
              </span>
            ) : (
              <>
                {pkg.pricing?.nonAc ? (
                  <div className="flex items-center bg-slate-100 rounded-full p-1 mb-2 w-fit">
                    <button
                      onClick={() => setPriceType('ac')}
                      className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${
                        priceType === 'ac' ? 'bg-[#F97316] text-white' : 'text-slate-500'
                      }`}
                    >
                      AC
                    </button>
                    <button
                      onClick={() => setPriceType('nonac')}
                      className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${
                        priceType === 'nonac' ? 'bg-[#F97316] text-white' : 'text-slate-500'
                      }`}
                    >
                      Non AC
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                    AC Package Rate
                  </div>
                )}

                <span className="text-base font-extrabold text-[#F97316]">
                  {priceType === 'ac'
                    ? (pkg.pricing?.ac ? `₹${pkg.pricing.ac.toLocaleString('en-IN')}` : 'Custom Quote')
                    : (pkg.pricing?.nonAc ? `₹${pkg.pricing.nonAc.toLocaleString('en-IN')}` : 'Custom Quote')}
                </span>
              </>
            )}
          </div>

          <Link
            to={`/packages/${pkg.slug}`}
            className="px-4 py-2 bg-[#F97316] border border-[#F97316] text-white text-[11px] font-bold rounded-full hover:bg-transparent hover:text-[#F97316] transition-all duration-300 flex items-center gap-1"
          >
            <span>View Details</span>
            <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function PopularDestinations() {
  const [dbPackages, setDbPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Filter only active & non-deleted packages
  const activePackages = dbPackages.filter(p => p.active && !p.isDeleted);
  // Show featured if they exist, otherwise show latest
  const featured = activePackages.filter(p => p.featured);
  const displayPackages = featured.length > 0 ? featured : activePackages;
  const featuredPackages = displayPackages.slice(0, 3);

  return (
    <section className="py-20 max-w-[1280px] mx-auto px-6">

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
        <div>
          <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">Featured Tours</span>
          <h2 className="text-3xl md:text-4xl font-bold font-headings text-[#1E293B] mt-1">
            Popular Destinations
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-xl font-light">
            Curated weekend getaways and scenic tours across Maharashtra, designed for maximum comfort and relaxation.
          </p>
        </div>

        <Link
          to="/packages"
          className="flex items-center gap-1 px-5 py-2.5 rounded-full border border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white text-xs font-bold transition-all duration-300 flex-shrink-0"
        >
          <span>View All Packages</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-200/55 p-6 flex flex-col justify-between h-[450px] animate-pulse">
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
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/60 shadow-sm max-w-xl mx-auto px-6 space-y-4">
          <AlertCircle className="mx-auto text-red-500" size={40} />
          <h3 className="text-sm font-bold font-headings text-slate-800">Connection Failed</h3>
          <p className="text-xs text-slate-500 font-light leading-relaxed">{error}</p>
          <button
            onClick={fetchPackages}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F97316] text-white text-xs font-bold rounded-full hover:bg-orange-600 transition-colors shadow-md"
          >
            <RefreshCw size={12} className="animate-spin-once" />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : featuredPackages.length > 0 ? (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          transition={{ staggerChildren: 0.15 }}
          className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-none pb-4 -mx-6 px-6 md:mx-0 md:px-0"
        >
          {featuredPackages.map((pkg) => (
            <div key={pkg.slug} className="w-[82vw] sm:w-[350px] md:w-auto flex-shrink-0 snap-start">
              <DestinationCard pkg={pkg} />
            </div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
          <p className="text-xs text-slate-500 font-light">No packages available at the moment.</p>
        </div>
      )}
    </section>
  );
}
