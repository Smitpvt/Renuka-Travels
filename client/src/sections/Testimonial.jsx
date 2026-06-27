import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function Testimonial() {
  const [list, setList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getTestimonials();
      setList(data.testimonials || []);
      setCurrentIndex(0);
    } catch (err) {
      setError(err.message || 'Unable to connect to service. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (isHovered || list.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [currentIndex, isHovered, list]);

  const handlePrev = () => {
    if (list.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? list.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (list.length === 0) return;
    setCurrentIndex((prev) => (prev === list.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">Reviews</span>
          <h2 className="text-3xl md:text-4xl font-bold font-headings text-[#1E293B] mt-1 mb-3">
            Customer Testimonials
          </h2>
          <p className="text-sm text-[#1E293B]/70">
            Read what our families, corporate coordinators, and partners say about our premium travels.
          </p>
        </div>

        {/* Carousel Container */}
        {isLoading ? (
          <div className="relative max-w-3xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100/60 animate-pulse h-64 flex items-center justify-center">
            <div className="space-y-4 w-full">
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        ) : error ? (
          <div className="relative max-w-3xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100/60 text-center space-y-4">
            <AlertCircle className="mx-auto text-red-500" size={36} />
            <h4 className="font-bold text-[#1E293B]">Reviews Offline</h4>
            <p className="text-xs text-slate-500 font-light">{error}</p>
            <button
              onClick={fetchTestimonials}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#F97316] text-white text-[10px] font-bold rounded-full hover:bg-orange-600 transition-colors shadow-sm"
            >
              <RefreshCw size={10} />
              <span>Retry</span>
            </button>
          </div>
        ) : list.length > 0 ? (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative max-w-3xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100/60"
          >
            <Quote className="absolute right-8 top-8 w-12 h-12 text-[#F97316]/5 pointer-events-none" />

            {/* Slide Anim */}
            <div className="relative min-h-[210px] sm:min-h-[150px] md:min-h-[130px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="w-full space-y-4"
                >
                  <div className="flex space-x-1 text-[#F97316]">
                    {[...Array(list[currentIndex].rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>

                  <p className="text-sm md:text-base text-[#1E293B]/80 font-light italic leading-relaxed">
                    "{list[currentIndex].review}"
                  </p>

                  <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-[#F97316]/10 text-[#F97316] flex items-center justify-center font-bold font-headings text-sm uppercase">
                      {list[currentIndex].name[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1E293B]">{list[currentIndex].name}</h4>
                      <span className="text-[10px] text-slate-500 font-light">Verified Customer</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            {list.length > 1 && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md hover:bg-orange-50 text-[#1E293B] hover:text-[#F97316] flex items-center justify-center transition-all duration-300"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {/* Dots */}
                <div className="flex gap-1.5 px-2">
                  {list.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentIndex === idx ? 'bg-[#F97316] w-5' : 'bg-slate-300'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md hover:bg-orange-50 text-[#1E293B] hover:text-[#F97316] flex items-center justify-center transition-all duration-300"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
            <p className="text-sm text-slate-500 font-light">No customer testimonials available yet.</p>
          </div>
        )}

      </div>
    </section>
  );
}
