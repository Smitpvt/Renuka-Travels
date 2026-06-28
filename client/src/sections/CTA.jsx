import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

import { WHATSAPP_NUMBER, OFFICE_PHONE } from '../constants/contact';

export default function CTA() {
  const whatsappMessage = `Hello Renuka Tours & Travels,

I would like to request a quotation for my upcoming trip.

Please provide the best available quotation along with the vehicle options.

Thank you.`;

  return (
    <section className="py-16 md:py-24 max-w-[1280px] mx-auto px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-gradient-to-br from-slate-900 via-[#0B0F19] to-slate-900 rounded-[32px] p-8 md:p-14 lg:p-16 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 border border-slate-800/80 overflow-hidden relative"
      >
        {/* Subtle Luxury Glowing Blobs */}
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-[#F97316]/8 blur-[100px] pointer-events-none"></div>
        <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-orange-500/4 blur-[100px] pointer-events-none"></div>

        <div className="space-y-4 max-w-xl text-center lg:text-left relative z-10">
          <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest block">
            Start Planning
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-extrabold font-headings tracking-tight leading-tight">
            Ready For Your Next Journey?
          </h2>
          <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed">
            Get an instant custom quotation for any route, duration, or vehicle specification. Call us or message us on WhatsApp for rapid, professional booking assistance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center relative z-10 flex-shrink-0">
          <motion.a
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#F97316] hover:bg-orange-600 text-white px-8 py-3.5 rounded-full font-bold text-xs flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20"
          >
            <FaWhatsapp size={14} />
            <span>WhatsApp Us</span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href={`tel:${OFFICE_PHONE.replace(/\s+/g, '')}`}
            className="bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20 px-8 py-3.5 rounded-full font-bold text-xs flex items-center justify-center space-x-2 transition-all duration-300 shadow-sm"
          >
            <Phone size={14} />
            <span>Call Support</span>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
