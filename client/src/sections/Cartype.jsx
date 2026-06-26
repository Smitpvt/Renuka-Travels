import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import miniBusImage from '../assets/Minibus.jpeg';
import luxBusImage from '../assets/Bus.jpeg';
import SUVImage from '../assets/Car.jpeg';

const fleetCategories = [
  {
    name: "SUV / Cars",
    seats: "4-7 Seats",
    image: SUVImage,
    desc: "Premium Sedans and SUVs like Innova Crysta, ideal for airport drops, corporate travel, executive trips, and family tours.",
    features: ["Individually AC Controlled", "Captain Seating Options", "Sanitized Cabins", "Experienced Drivers"]
  },
  {
    name: "Mini Bus",
    seats: "17-26 Seats",
    image: miniBusImage,
    desc: "Spacious Tempo Travellers and medium coaches, perfect for wedding guest logistics, family outings, and corporate outings.",
    features: ["Roof Blowers AC", "Pushback Reclining Seats", "LCD Screens & Music", "Overhead Luggage Racks"]
  },
  {
    name: "Luxury Bus",
    seats: "35-55 Seats",
    image: luxBusImage,
    desc: "High-capacity luxury coaches with premium suspension, engineered for large groups, schools, and pilgrimage tours.",
    features: ["Climate Control AC", "Air Suspension System", "Under-Bus Cargo Hold", "PA Mic System Included"]
  }
];

export default function Cartype() {
  return (
    <section id="fleet-preview" className="py-20 bg-slate-50 scroll-mt-24 px-6 border-y border-slate-100">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">Our Fleet</span>
            <h2 className="text-3xl md:text-4xl font-bold font-headings text-[#1E293B] mt-1">
              Vehicle Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl font-light">
              From premium personal SUVs to spacious vans and high-capacity luxury buses, find the perfect travel category.
            </p>
          </div>

          <Link
            to="/cars"
            className="flex items-center gap-1 px-5 py-2.5 rounded-full bg-[#F97316] border border-[#F97316] text-white hover:bg-transparent hover:text-[#F97316] text-xs font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span>View All Vehicles</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fleetCategories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/55 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-[220px] overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&fit=crop'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>
                  <span className="absolute top-4 right-4 bg-[#1E293B]/80 backdrop-blur-md text-white text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
                    {cat.seats}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold font-headings text-[#1E293B] mb-2">{cat.name}</h3>
                  <p className="text-xs text-slate-500 font-light leading-relaxed mb-4">{cat.desc}</p>
                  
                  {/* Category Features list */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {cat.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center text-[10px] text-[#1E293B]/70 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] mr-2"></span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0">
                <Link
                  to="/cars"
                  className="w-full flex items-center justify-center gap-1.5 border border-slate-200 hover:border-[#F97316] hover:text-[#F97316] text-[#1E293B] font-bold py-3 rounded-2xl text-xs transition-all duration-300 shadow-sm"
                >
                  <span>Browse Category</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
