import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Clock, Users, Car, Landmark, FileText } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants/contact';

export default function CustomPackageBuilder() {
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    duration: '',
    groupSize: '',
    vehicleType: 'SUV / Cars',
    budget: '',
    requirements: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const message = `Hello Renuka Tours & Travels,

I would like to request a quotation for my upcoming trip.

Customer Details
Name: ${formData.name}

Trip Details
Destination: ${formData.destination}
Duration: ${formData.duration}
Group Size: ${formData.groupSize}
Vehicle Type: ${formData.vehicleType}
Budget: ${formData.budget || 'Flexible'}
Special Requirements: ${formData.requirements || 'None specified'}

Please provide the best available quotation along with the vehicle options.

Thank you.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="custom-package" className="py-20 bg-white scroll-mt-24 px-6 border-t border-orange-50">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">Tailored Travel</span>
            <h2 className="text-3xl md:text-4xl font-bold font-headings text-[#1E293B] leading-tight">
              Create Your Own Package
            </h2>
            <p className="text-sm text-[#1E293B]/70 leading-relaxed font-light">
              Can't find a package that matches your exact travel plans? Design your own custom itinerary. Tell us where you want to go, who you are travelling with, and your preferred vehicle category.
            </p>
            <div className="space-y-4 pt-2">
              {[
                { title: 'Personalized Routing', desc: 'Visit multiple cities or make quick detours.' },
                { title: 'Any Group Size', desc: 'From small families to corporate retreats.' },
                { title: 'Budget Tailoring', desc: 'Flexible transport and hotel options.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-orange-100 text-[#F97316] flex items-center justify-center font-bold text-xs mt-0.5 flex-shrink-0">✓</div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1E293B]">{item.title}</h4>
                    <p className="text-xs text-[#1E293B]/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#F8FAFC] rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-lg"
            >
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1.5 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-all"
                    />
                  </div>

                  {/* Destination */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1.5 uppercase tracking-wider">Destination</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 text-[#F97316]" size={14} />
                      <input
                        type="text"
                        name="destination"
                        required
                        placeholder="e.g. Konkan Coastal Tour"
                        value={formData.destination}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-all"
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1.5 uppercase tracking-wider">Duration (Days)</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 text-[#F97316]" size={14} />
                      <input
                        type="text"
                        name="duration"
                        required
                        placeholder="e.g. 4 Days / 3 Nights"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-all"
                      />
                    </div>
                  </div>

                  {/* Group Size */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1.5 uppercase tracking-wider">Group Size (People)</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-2.5 text-[#F97316]" size={14} />
                      <input
                        type="text"
                        name="groupSize"
                        required
                        placeholder="e.g. 15 Adults, 2 Kids"
                        value={formData.groupSize}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-all"
                      />
                    </div>
                  </div>

                  {/* Vehicle Type */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1.5 uppercase tracking-wider">Vehicle Type</label>
                    <div className="relative">
                      <Car className="absolute left-3 top-2.5 text-[#F97316]" size={14} />
                      <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-all appearance-none"
                      >
                        <option value="SUV / Cars">SUV / Cars (4-7 Seats)</option>
                        <option value="Mini Bus">Mini Bus (17-26 Seats)</option>
                        <option value="Luxury Bus">Luxury Bus (35-55 Seats)</option>
                      </select>
                      <span className="absolute right-3 top-3 text-[10px] text-slate-400 pointer-events-none">▼</span>
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-1.5 uppercase tracking-wider">Estimated Budget (Optional)</label>
                    <div className="relative">
                      <Landmark className="absolute left-3 top-2.5 text-[#F97316]" size={14} />
                      <input
                        type="text"
                        name="budget"
                        placeholder="e.g. ₹40,000 Total"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requirements */}
                <div>
                  <label className="block text-xs font-bold text-[#1E293B] mb-1.5 uppercase tracking-wider">Special Requirements / Notes</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-2.5 text-[#F97316]" size={14} />
                    <textarea
                      name="requirements"
                      rows="3"
                      placeholder="e.g. Need hotel stay in MTDC, wheelchair-friendly vehicle, extra halts..."
                      value={formData.requirements}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-all"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01, y: -0.5 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full bg-[#F97316] text-white py-3.5 rounded-xl text-xs font-bold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send size={12} />
                  <span>Generate Customized WhatsApp Quote</span>
                </motion.button>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
