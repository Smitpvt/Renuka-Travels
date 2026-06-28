import React from 'react';
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-7 h-7 md:w-8 md:h-8 fill-current"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L32 503l138.2-36.2c32.5 17.5 68.8 26.8 105.8 26.8 122.4 0 222-99.6 222-222 0-59.3-25.2-115-67.1-157.9zM223.9 474c-33.1 0-65.6-8.9-93.9-25.7l-6.7-4-82 21.5 21.9-79.9-4.4-7c-18.4-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
      </a>
    </div>
  );
}
