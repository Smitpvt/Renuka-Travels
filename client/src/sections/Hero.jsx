import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  ShieldCheck,
  Users,
  Award,
  Shield,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BookingForm from './BookingForm';

// === FUTURE VIDEO INTEGRATION ===========================================
// To integrate a background video in the future:
// 1. Place your video file in the project (e.g., under src/videos/)
// 2. Uncomment the import line below and update the file path if necessary
// 3. Assign HERO_VIDEO_PATH to the imported video (e.g., const HERO_VIDEO_PATH = video;)
// =========================================================================
// import video from '../videos/Video_project.mp4';
const HERO_VIDEO_PATH = null; 

const HERO_FALLBACK_IMAGE = '/images/renuka_fleet.png'; // Fallback background image

const statsData = [
  {
    value: '24+',
    label: 'Years Experience',
    Icon: Award,
  },
  {
    value: '15+',
    label: 'Vehicles',
    Icon: Users,
  },
  {
    value: '50+',
    label: 'Corporate Clients',
    Icon: Shield,
  },
  {
    value: '24/7',
    label: 'Support System',
    Icon: ShieldCheck,
  },
];

function HeroCounter({ value, trigger, duration = 1.5 }) {
  const [count, setCount] = useState(0);

  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : '';

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const end = target;
    const step = Math.max(Math.ceil(end / 30), 1);
    const intervalTime = Math.max(Math.floor((duration * 1000) / (end / step)), 20);

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [trigger, target, duration]);

  return <span>{trigger ? count : 0}{suffix}</span>;
}

export default function Hero() {
  const isDarkMode = !!HERO_VIDEO_PATH;
  const [startCount, setStartCount] = useState(false);
  const statsContainerRef = useRef(null);

  useEffect(() => {
    const el = statsContainerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.unobserve(el);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(el);

    return () => {
      if (el) {
        observer.unobserve(el);
        observer.disconnect();
      }
    };
  }, []);

  return (
    <section className={`relative min-h-[90vh] flex items-center pt-32 pb-16 overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      
      {/* Cinematic Full-Screen Background Video */}
      {isDarkMode && (
        <video
          src={HERO_VIDEO_PATH}
          autoPlay
          loop
          muted
          playsInline
          poster={HERO_FALLBACK_IMAGE}
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={(e) => {
            console.warn("Background video failed to load.");
          }}
        />
      )}

      {/* Subtle Dark Overlay (only active in video dark mode) */}
      {isDarkMode && (
        <div className="absolute inset-0 bg-[#0F172A]/55 pointer-events-none z-10"></div>
      )}

      {/* Background Blur Shapes */}
      {isDarkMode ? (
        <>
          <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl z-10 pointer-events-none"></div>
          <div className="absolute left-10 bottom-10 w-80 h-80 bg-slate-900/40 rounded-full blur-3xl z-10 pointer-events-none"></div>
        </>
      ) : (
        <>
          <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl z-10 pointer-events-none"></div>
          <div className="absolute left-10 bottom-10 w-80 h-80 bg-slate-200/50 rounded-full blur-3xl z-10 pointer-events-none"></div>
        </>
      )}

      <div className="max-w-[1280px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 space-y-7"
        >
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 px-4 py-2 rounded-full text-[11px] font-bold tracking-wider text-[#F97316] uppercase">
            <ShieldCheck size={14} />
            <span>Trusted Tours & Travels Since 2002</span>
          </div>

          <div>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight transition-colors duration-300 ${isDarkMode ? 'text-white drop-shadow-md' : 'text-[#1E293B]'}`}>
              Premium Travel &
              <br />
              <span className="text-[#F97316]">
                Comfortable Journeys
              </span>
            </h1>

            <p className={`mt-5 text-sm md:text-base leading-relaxed max-w-xl transition-colors duration-300 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              From customized holiday packages and corporate transportation
              to school excursions and group tours, we provide safe,
              reliable, and comfortable travel experiences across Maharashtra.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 min-[340px]:grid-cols-2 gap-3 w-full max-w-sm mx-auto md:flex md:flex-wrap md:justify-start md:gap-4 md:w-auto md:mx-0">
            <motion.a
              href="#book-now"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#F97316] text-white px-4 py-2.5 md:px-8 md:py-3.5 rounded-full font-semibold text-xs md:text-sm shadow-md hover:bg-orange-600 transition-all flex items-center justify-center gap-1.5 md:gap-2 w-full md:w-auto min-h-[44px] md:min-h-0"
            >
              Book Your Ride
              <ChevronRight size={16} />
            </motion.a>

            <Link to="/packages" className="w-full md:w-auto">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white border border-slate-200 px-4 py-2.5 md:px-8 md:py-3.5 rounded-full font-semibold text-xs md:text-sm text-[#1E293B] hover:bg-slate-50 shadow-sm transition-all w-full md:w-auto min-h-[44px] md:min-h-0 flex items-center justify-center text-center"
              >
                Explore Packages
              </motion.button>
            </Link>
          </div>

          {/* Stats */}
          <div ref={statsContainerRef} className={`grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t transition-colors duration-300 ${isDarkMode ? 'border-slate-800/30' : 'border-slate-200'}`}>
            {statsData.map((stat, idx) => {
              const Icon = stat.Icon;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-[#F97316] mb-3">
                    <Icon size={20} />
                  </div>

                  <div className="text-xl font-extrabold text-[#1E293B]">
                    <HeroCounter value={stat.value} trigger={startCount} />
                  </div>

                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Content: Booking Form */}
        <div id="book-now" className="lg:col-span-5 w-full flex justify-center z-10 scroll-mt-24">
          <BookingForm isNested={true} />
        </div>

      </div>
    </section>
  );
}