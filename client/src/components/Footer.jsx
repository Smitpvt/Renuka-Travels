import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { OFFICE_PHONE, OFFICE_EMAIL, OFFICE_ADDRESS, GOOGLE_MAPS_EMBED_URL } from '../constants/contact';

const socialLinks = [
  {
    label: 'Facebook',
    path: '#',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    label: 'Instagram',
    path: 'https://www.instagram.com/renukatoursandtravels.in?igsh=aWNrcWk3dnUyNHY1',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.008 3.81.055.97.044 1.5.206 1.85.342.462.18.792.394 1.14.743.349.349.562.678.743 1.14.136.35.298.88.342 1.85.047 1.026.055 1.38.055 3.81s-.008 2.784-.055 3.81c-.044.97-.206 1.5-.342 1.85-.18.462-.394.792-.743 1.14-.349.349-.678.562-1.14.743-.35.136-.88.298-1.85.342-1.026.047-1.38.055-3.81.055s-2.784-.008-3.81-.055c-.97-.044-1.5-.206-1.85-.342-.462-.18-.792-.394-1.14-.743-.349-.349-.562-.678-.743-1.14-.136-.35-.298-.88-.342-1.85C2.008 15.026 2 14.67 2 12.315s.008-2.784.055-3.81c.044-.97.206-1.5.342-1.85.18-.462.394-.792.743-1.14.349-.349.678-.562 1.14-.743.35-.136.88-.298 1.85-.342 1.026-.047 1.38-.055 3.81-.055zm-1.1-1.995C8.89 0 8.486.008 7.377.055c-1.108.05-1.864.226-2.527.484-.685.266-1.266.622-1.844 1.201-.58.578-.936 1.16-1.201 1.844-.258.663-.434 1.419-.484 2.527C.008 7.377 0 8.89 0 11.185c0 2.296.008 2.7 0 3.81.05 1.108.226 1.864.484 2.527.266.685.622 1.266 1.201 1.844.578.58 1.16.936 1.844 1.201.663.258 1.419.434 2.527.484 1.108.047 1.512.055 3.81.055 2.296 0 2.704-.008 3.81-.055 1.108-.05 1.864-.226 2.527-.484.685-.266 1.266-.622 1.844-1.201.578-.578.936-1.16 1.201-1.844.258-.663.434-1.419.484-2.527.047-1.108.055-1.512.055-3.81 0-2.296-.008-2.704-.055-3.81-.05-1.108-.226-1.864-.484-2.527-.266-.685-.622-1.266-1.201-1.844-.578-.578-1.16-.936-1.844-1.201-.663-.258-1.419-.434-2.527-.484C15.486.008 15.078 0 12.784 0h-1.568zm0 5.442a5.742 5.742 0 100 11.484 5.742 5.742 0 000-11.484zm0 9.484a3.742 3.742 0 110-7.484 3.742 3.742 0 010 7.484zm5.666-9.742a1.353 1.353 0 100-2.706 1.353 1.353 0 000 2.706z" clipRule="evenodd" />
      </svg>
    )
  }
]

export default function Footer() {
  return (
    <footer className="w-full max-w-full min-w-0 bg-gradient-to-b from-[#0F172A] to-[#070A13] text-white/90 pt-12 md:pt-20 pb-8 md:pb-10 border-t border-slate-800/60 relative overflow-hidden">
      <div className="w-full max-w-[1280px] mx-auto px-6 flex flex-col md:grid md:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/5">
        
        {/* About & Socials */}
        <div className="w-full md:col-span-6 lg:col-span-3 space-y-5 min-w-0 max-w-full">
          <Link to="/" className="text-xl font-extrabold font-headings text-[#F97316] tracking-tight block">
            Renuka Travels
          </Link>
          <p className="text-xs text-slate-400 leading-[1.7] font-light w-full max-w-full break-words [overflow-wrap:anywhere] md:max-w-none">
            Delivering safe, comfortable, and dependable travel experiences through customized tours and professional transportation services since 2002.
          </p>
          <div className="flex space-x-3 pt-2">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.path}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-350 hover:bg-[#F97316] hover:border-[#F97316] hover:text-white hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-sm"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="w-full md:col-span-6 lg:col-span-3 space-y-4 min-w-0 max-w-full">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#F97316] font-headings">Quick Links</h3>
          <ul className="space-y-2.5 text-xs text-slate-400 font-light">
            {['Home', 'Travel Packages', 'Our Fleet', 'About Us', 'Contact Support'].map((label, i) => {
              const paths = ['/', '/packages', '/cars', '/about', '/contact'];
              return (
                <li key={i}>
                  <Link 
                    to={paths[i]} 
                    className="hover:text-[#F97316] hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="w-full md:col-span-6 lg:col-span-3 space-y-4 min-w-0 max-w-full">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#F97316] font-headings">Contact</h3>
          <ul className="space-y-3.5 text-xs text-slate-400 font-light">
            <li className="flex items-start gap-2.5 min-w-0 w-full">
              <Phone size={14} className="text-[#F97316] mt-0.5 flex-shrink-0" />
              <div className="min-w-0 w-full break-words">
                <a href={`tel:${OFFICE_PHONE.replace(/\s+/g, '')}`} className="hover:text-[#F97316] transition-colors">
                  {OFFICE_PHONE}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-2.5 min-w-0 w-full">
              <Mail size={14} className="text-[#F97316] mt-0.5 flex-shrink-0" />
              <div className="min-w-0 w-full break-all">
                <a href={`mailto:${OFFICE_EMAIL}`} className="hover:text-[#F97316] transition-colors">
                  {OFFICE_EMAIL}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-2.5 min-w-0 w-full">
              <MapPin size={16} className="text-[#F97316] mt-0.5 flex-shrink-0" />
              <div className="min-w-0 w-full break-words leading-relaxed">
                <span>{OFFICE_ADDRESS}</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Location Map Column */}
        <div className="w-full md:col-span-6 lg:col-span-3 space-y-4 min-w-0 max-w-full">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#F97316] font-headings">Our Location</h3>
          <div className="relative w-full h-[230px] md:h-auto md:aspect-video overflow-hidden rounded-2xl border border-white/10 shadow-lg group mt-2">
            <iframe
              title="Renuka Travels Office Location"
              src={GOOGLE_MAPS_EMBED_URL}
              className="w-full h-[230px] md:absolute md:inset-0 md:h-full md:w-full group-hover:scale-[1.03] transition-transform duration-500 rounded-2xl"
              style={{ border: 0, filter: 'grayscale(0.08) contrast(1.05)' }}
              loading="lazy"
              allowFullScreen=""
            />
          </div>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="w-full max-w-[1280px] mx-auto px-6 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 font-light gap-4">
        <p className="text-center md:text-left leading-relaxed w-full md:w-auto max-w-full break-words [overflow-wrap:anywhere]">
          © 2026 Renuka Travels. All rights reserved. Designed for Luxury Travel.
        </p>
        <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 w-full md:w-auto max-w-full min-w-0">
          <a href="#" className="hover:text-slate-350 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-350 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-350 transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
