import React, { useEffect, useRef } from 'react';
import { X, Send, Calendar, MapPin, User, Phone, Car } from 'lucide-react';

export default function QuoteModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Close modal on Escape press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      // Focus first input
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Trap focus inside modal
  useEffect(() => {
    const handleFocusTrap = (e) => {
      if (!modalRef.current) return;
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleFocusTrap);
    }
    return () => {
      window.removeEventListener('keydown', handleFocusTrap);
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    alert(`Thank you, ${data.name}! Your quote request for a trip to ${data.destination} has been submitted. Our team will contact you at ${data.phone} within 15 minutes.`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241915]/60 backdrop-blur-sm transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-[#F2E4DE] w-full max-w-[550px] rounded-2xl shadow-xl overflow-hidden border border-[#e2d0c8] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-[#8D4F0B] px-6 py-5 flex items-center justify-between text-white">
          <div>
            <h2 id="modal-title" className="text-xl font-bold font-headings">
              Request a Free Quote
            </h2>
            <p className="text-xs text-[#F2E4DE]/80 mt-1">
              Provide your details and we will contact you in 15 minutes!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close quote modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-[#241915] mb-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#53634F]">
                  <User size={16} />
                </span>
                <input
                  ref={firstInputRef}
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="John Doe"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#e2d0c8] rounded-xl text-[#241915] placeholder-[#241915]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#8D4F0B] focus:border-[#8D4F0B]"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-[#241915] mb-1">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#53634F]">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#e2d0c8] rounded-xl text-[#241915] placeholder-[#241915]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#8D4F0B] focus:border-[#8D4F0B]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pickup */}
            <div>
              <label htmlFor="pickup" className="block text-xs font-semibold text-[#241915] mb-1">
                Pickup Location
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#53634F]">
                  <MapPin size={16} />
                </span>
                <input
                  type="text"
                  name="pickup"
                  id="pickup"
                  required
                  placeholder="e.g. Pune Airport / City"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#e2d0c8] rounded-xl text-[#241915] placeholder-[#241915]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#8D4F0B] focus:border-[#8D4F0B]"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label htmlFor="destination" className="block text-xs font-semibold text-[#241915] mb-1">
                Destination
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#53634F]">
                  <MapPin size={16} />
                </span>
                <input
                  type="text"
                  name="destination"
                  id="destination"
                  required
                  placeholder="e.g. Mahabaleshwar"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#e2d0c8] rounded-xl text-[#241915] placeholder-[#241915]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#8D4F0B] focus:border-[#8D4F0B]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label htmlFor="travel-date" className="block text-xs font-semibold text-[#241915] mb-1">
                Travel Date
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#53634F]">
                  <Calendar size={16} />
                </span>
                <input
                  type="date"
                  name="date"
                  id="travel-date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#e2d0c8] rounded-xl text-[#241915] text-sm focus:outline-none focus:ring-2 focus:ring-[#8D4F0B] focus:border-[#8D4F0B]"
                />
              </div>
            </div>

            {/* Vehicle Type */}
            <div>
              <label htmlFor="vehicle" className="block text-xs font-semibold text-[#241915] mb-1">
                Preferred Vehicle
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#53634F]">
                  <Car size={16} />
                </span>
                <select
                  name="vehicle"
                  id="vehicle"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#e2d0c8] rounded-xl text-[#241915] text-sm focus:outline-none focus:ring-2 focus:ring-[#8D4F0B] focus:border-[#8D4F0B] appearance-none"
                >
                  <option value="sedan">4 Seater Sedan</option>
                  <option value="suv">7 Seater SUV (Ertiga/Innova)</option>
                  <option value="tempo">17 Seater Tempo Traveller</option>
                  <option value="minibus">26 Seater Mini Bus</option>
                  <option value="bus">45+ Seater Luxury Coach</option>
                </select>
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#241915]/60">
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="notes" className="block text-xs font-semibold text-[#241915] mb-1">
              Special Instructions (Optional)
            </label>
            <textarea
              name="notes"
              id="notes"
              rows="3"
              placeholder="Tell us about round trip requirements, multi-day tours, stops, etc..."
              className="w-full px-3 py-2 bg-white border border-[#e2d0c8] rounded-xl text-[#241915] placeholder-[#241915]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#8D4F0B] focus:border-[#8D4F0B]"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#D68A45] hover:bg-[#8D4F0B] text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#8D4F0B]"
          >
            <Send size={16} />
            <span>Send Request</span>
          </button>
        </form>
      </div>
    </div>
  );
}
