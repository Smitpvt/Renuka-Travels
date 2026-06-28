import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { WHATSAPP_NUMBER, DEFAULT_WHATSAPP_MESSAGE } from '../constants/contact';

export default function FloatingWhatsApp({ visible = true }) {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`;

  return (
    <div
      className={`fixed z-50 flex flex-col items-center md:bottom-6 md:right-6 bottom-5 right-5 transition-all duration-500 ${
        visible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      {/* Self-contained CSS keyframes for entrance animation */}
      <style>{`
        @keyframes whatsapp-fade-in {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-whatsapp-entrance {
          animation: whatsapp-fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Permanent Label (Desktop Only) */}
      <div className="hidden md:block bg-white text-slate-800 text-sm font-medium px-4 py-2 rounded-full shadow-md border border-slate-100 mb-2 select-none text-center">
        Chat with us
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-[54px] h-[54px] md:w-[60px] md:h-[60px] rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 animate-whatsapp-entrance"
      >
        <FaWhatsapp className="text-white text-[28px] md:text-[30px]" />
      </a>
    </div>
  );
}
