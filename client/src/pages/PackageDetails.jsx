import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Award,
  Clock,
  Compass,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../services/api';
import { WHATSAPP_NUMBER } from '../constants/contact';
import Hero1 from '../heros/Hero1.jpg';
import Hero2 from '../heros/Hero2.jpg';
import Hero3 from '../heros/Hero3.jpg';

export default function PackageDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceType, setPriceType] = useState("ac");
  const [relatedPackages, setRelatedPackages] = useState([]);
  const [callbackData, setCallbackData] = useState({
    name: '',
    phone: '',
    date: ''
  });

  const fetchPackage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getPackage(slug);
      setPkg(data.package);

      // Load related packages
      const listData = await api.getPackages();
      if (listData && listData.packages) {
        setRelatedPackages(listData.packages.filter(p => p.slug !== slug).slice(0, 3));
      }
    } catch (err) {
      setError(err.message || 'Unable to load package. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackage();
  }, [slug]);

  const heroImages = {
    "Weekend Trips": Hero1,
    "Beach Destinations": Hero2,
    "Pilgrimage": Hero3,
  };

  const heroImage = pkg ? (heroImages[pkg.category] || Hero1) : Hero1;

  const handleCallbackSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = callbackData.date
      ? new Date(callbackData.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Not specified";

    const message = `Hello Renuka Tours & Travels,

I have submitted a callback request through your website.

Customer Details
Name: ${callbackData.name}
Phone: ${callbackData.phone}

Trip Details
Destination: ${pkg.title}
Travel Date: ${formattedDate}
Vehicle Type: ${priceType === 'ac' ? 'AC' : 'Non AC'}

Kindly contact me with the quotation and availability at your earliest convenience.

Thank you.`;

    // Save inquiry to backend database in background
    try {
      await api.submitInquiry({
        name: callbackData.name,
        phone: callbackData.phone,
        pickup: 'Package Details Page',
        destination: pkg.title,
        vehicleType: priceType === 'ac' ? 'AC' : 'Non AC',
        date: callbackData.date || new Date().toISOString(),
        tripType: 'One Way',
        notes: `Callback request for Package: ${pkg.title}. Preferred Date: ${formattedDate}`
      });
    } catch (err) {
      console.warn('Inquiry background save failed:', err);
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    setCallbackData({ name: '', phone: '', date: '' });
  };

  const handleWhatsAppInquiry = async () => {
    const selectedPrice =
      pkg.pricing?.customQuote
        ? "Custom Quote"
        : priceType === "ac"
          ? (pkg.pricing?.ac ? `₹${pkg.pricing.ac.toLocaleString('en-IN')}` : 'Custom Quote')
          : (pkg.pricing?.nonAc ? `₹${pkg.pricing.nonAc.toLocaleString('en-IN')}` : 'Custom Quote');

    const message = `Hello Renuka Tours & Travels,

I would like to enquire about the following travel package.

Package: ${pkg.title}
Vehicle Preference: ${priceType === 'ac' ? 'AC' : 'Non AC'}

Kindly share the quotation, vehicle availability, and further booking details.

Thank you.`;

    // Save inquiry to backend database in background
    try {
      await api.submitInquiry({
        name: 'WhatsApp Lead User',
        phone: 'WhatsApp Button Clicked',
        pickup: 'Package Link',
        destination: pkg.title,
        vehicleType: priceType === 'ac' ? 'AC' : 'Non AC',
        date: new Date().toISOString(),
        tripType: 'One Way',
        notes: `Direct interest in Package: ${pkg.title} (${priceType.toUpperCase()} - Price: ${selectedPrice})`
      });
    } catch (err) {
      console.warn('Inquiry background save failed:', err);
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased animate-pulse">
        <Navbar />
        <div className="flex-grow pt-32 px-6 max-w-[1280px] mx-auto w-full space-y-8">
          <div className="h-[40vh] bg-slate-200 rounded-3xl w-full"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-20 bg-slate-200 rounded-3xl w-full"></div>
              <div className="h-40 bg-slate-200 rounded-3xl w-full"></div>
            </div>
            <div className="lg:col-span-4 h-80 bg-slate-200 rounded-3xl w-full"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center space-y-4 pt-32">
          <AlertCircle className="text-red-500" size={48} />
          <h2 className="text-3xl font-extrabold font-headings text-[#1E293B]">Package Loading Failed</h2>
          <p className="text-sm text-slate-500 max-w-sm">{error || "We couldn't find the package you were looking for."}</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/packages')}
              className="px-6 py-2.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-full hover:bg-slate-300 transition-colors shadow-sm"
            >
              Back to Catalog
            </button>
            <button
              onClick={fetchPackage}
              className="px-6 py-2.5 bg-[#F97316] text-white text-xs font-bold rounded-full hover:bg-orange-600 transition-colors shadow-md flex items-center gap-1"
            >
              <RefreshCw size={12} />
              <span>Retry</span>
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedPrice =
    pkg.pricing?.customQuote
      ? "Custom Quote"
      : priceType === "ac"
        ? (pkg.pricing?.ac ? `₹${pkg.pricing.ac.toLocaleString('en-IN')}` : 'Custom Quote')
        : (pkg.pricing?.nonAc ? `₹${pkg.pricing.nonAc.toLocaleString('en-IN')}` : 'Custom Quote');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] antialiased">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[55vh] min-h-[380px] bg-slate-900 text-white overflow-hidden pt-20">
        <img
          src={heroImage}
          alt={pkg.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1280&fit=crop'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6">
          <span className="bg-[#F97316] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md mb-4">
            {pkg.category}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold font-headings drop-shadow-lg leading-tight max-w-4xl mb-4">
            {pkg.title}
          </h1>
          <span className="flex items-center gap-2 text-sm text-slate-200 drop-shadow-md">
            <Calendar size={16} className="text-[#F97316]" />
            {pkg.duration}
          </span>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="py-12 max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Details Content */}
          <div className="lg:col-span-8 space-y-12">

            {/* Tour Highlights */}
            {Array.isArray(pkg.highlights) && pkg.highlights.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/55 shadow-sm space-y-4">
                <h2 className="text-xl font-bold font-headings text-[#1E293B]">Tour Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pkg.highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2.5 items-start">
                      <CheckCircle2 size={16} className="text-[#F97316] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-600 font-light">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Package Overview */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/55 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center">
                  <Compass size={20} className="text-[#F97316]" />
                </div>

                <div>
                  <span className="text-[#F97316] font-bold text-[11px] uppercase tracking-widest">
                    Tour Overview
                  </span>
                  <h2 className="text-2xl font-bold font-headings text-[#1E293B]">
                    About This Package
                  </h2>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-8">
                {pkg.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">
                    Destination
                  </span>
                  <p className="mt-1 font-bold text-[#1E293B]">
                    {pkg.title}
                  </p>
                </div>

                <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">
                    Duration
                  </span>
                  <p className="mt-1 font-bold text-[#1E293B]">
                    {pkg.duration}
                  </p>
                </div>

                <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">
                    Tour Type
                  </span>
                  <p className="mt-1 font-bold text-[#1E293B]">
                    {pkg.category}
                  </p>
                </div>

                <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-100">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">
                    Vehicle
                  </span>
                  <p className="mt-1 font-bold text-[#1E293B]">
                    {pkg.acPrice === "Custom Quote" ? "Custom Vehicle" : "AC / Non AC"}
                  </p>
                </div>
              </div>
            </div>
            {/* Photo Gallery */}
            {Array.isArray(pkg.gallery) && pkg.gallery.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/55 shadow-sm space-y-4">
                <h2 className="text-xl font-bold font-headings text-[#1E293B]">Destination Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {pkg.gallery.map((img, index) => (
                    <div key={index} className="h-44 rounded-2xl overflow-hidden bg-slate-50">
                      <img
                        src={img}
                        alt={`${pkg.title} Gallery ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&fit=crop'; }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Choose Renuka Tours */}
            <div className="bg-[#FFF7ED] p-6 md:p-8 rounded-3xl border border-orange-100 shadow-sm space-y-6">
              <div className="text-center max-w-sm mx-auto">
                <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">Safe & Secured</span>
                <h3 className="text-lg font-bold font-headings text-[#1E293B] mt-1">Why Choose Renuka Travels</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Experienced Drivers", desc: "Safe driving on hills and highways.", icon: <Award size={18} /> },
                  { title: "Well Maintained Fleet", desc: "Spotless, sanitized, commercial certified.", icon: <ShieldCheck size={18} /> },
                  { title: "24/7 Operations Support", desc: "GPS tracking and instant backups.", icon: <Clock size={18} /> },
                  { title: "Transparent Pricing", desc: "Inclusive of toll taxes and allowances.", icon: <Compass size={18} /> }
                ].map((item, index) => (
                  <div key={index} className="flex gap-3 items-start bg-white p-4 rounded-2xl shadow-sm border border-orange-50">
                    <div className="text-[#F97316] mt-0.5">{item.icon}</div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1E293B]">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">

            {/* Price & Booking Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/55 shadow-lg space-y-6">
              <div className="space-y-3">
                <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">
                  Package Price
                </span>

                {pkg.acPrice === "Custom Quote" ? (
                  <div className="space-y-2">
                    <span className="text-2xl font-extrabold text-[#F97316] font-headings">
                      {pkg.acPrice}
                    </span>
                    <p className="text-xs text-slate-500 font-light">
                      Contact us for personalized quote and special offers
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center bg-slate-100 rounded-full p-1 w-fit">
                      <button
                        onClick={() => setPriceType("ac")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${priceType === "ac"
                          ? "bg-[#F97316] text-white"
                          : "text-slate-500"
                          }`}
                      >
                        AC
                      </button>

                      <button
                        onClick={() => setPriceType("nonac")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${priceType === "nonac"
                          ? "bg-[#F97316] text-white"
                          : "text-slate-500"
                          }`}
                      >
                        Non AC
                      </button>
                    </div>

                    <span className="text-3xl font-extrabold text-[#F97316] font-headings block">
                      {pkg.pricing?.customQuote ? (
                        "Custom Quote"
                      ) : priceType === "ac" ? (
                        pkg.pricing?.ac ? `₹${pkg.pricing.ac.toLocaleString('en-IN')}` : 'Custom Quote'
                      ) : (
                        pkg.pricing?.nonAc ? `₹${pkg.pricing.nonAc.toLocaleString('en-IN')}` : 'Custom Quote'
                      )}
                    </span>

                    {pkg.pricing && !pkg.pricing.tollIncluded && (
                      <div className="text-[11px] text-slate-500">
                        Additional Toll Charges:
                        <span className="font-bold text-[#F97316] ml-1">
                          Extra
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Package Info */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 text-xs">
                <div>
                  <span className="block text-slate-400 font-medium">Duration</span>
                  <span className="font-bold text-[#1E293B]">{pkg.duration}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium">Vehicle Type</span>
                  <span className="font-bold text-[#1E293B]">
                    {pkg.acPrice === "Custom Quote" ? "Custom" : "AC/Non-AC"}
                  </span>
                </div>
              </div>

              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full py-3 rounded-full bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FaWhatsapp size={14} />
                <span>Book on WhatsApp</span>
              </button>

              {/* Callback Form */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider text-center">
                  Request Free Call Back
                </h4>
                <form onSubmit={handleCallbackSubmit} className="space-y-4">
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={callbackData.name}
                      onChange={(e) => setCallbackData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all min-h-[44px]"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={callbackData.phone}
                      onChange={(e) => setCallbackData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all min-h-[44px]"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehicle Preference</label>
                    <div className="relative">
                      <select
                        value={priceType}
                        onChange={(e) => setPriceType(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all min-h-[44px] appearance-none"
                      >
                        <option value="ac">Air Conditioned (AC)</option>
                        <option value="nonac">Non Air Conditioned (Non-AC)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Travel Date</label>
                    <input
                      type="date"
                      required
                      value={callbackData.date}
                      onChange={(e) => setCallbackData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all min-h-[44px]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 rounded-2xl bg-[#F97316] hover:bg-orange-600 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
                  >
                    <Phone size={12} />
                    <span>Inquire Call Back</span>
                  </button>
                </form>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Related Packages */}
      <section className="py-20 max-w-[1280px] mx-auto px-6 border-t border-slate-200/50">
        <div className="mb-10 text-center max-w-sm mx-auto">
          <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">More Trips</span>
          <h2 className="text-2xl font-bold font-headings text-[#1E293B] mt-1">Related Tour Packages</h2>
        </div>
        {Array.isArray(relatedPackages) && relatedPackages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPackages.map((relPkg) => (
              <motion.div
                key={relPkg.slug}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/55 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="h-44 relative bg-slate-50">
                  <img
                    src={relPkg.image}
                    alt={relPkg.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&fit=crop'; }}
                  />
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                      <Calendar size={10} className="text-[#F97316]" />
                      {relPkg.duration}
                    </span>
                    <h3 className="text-sm font-bold text-[#1E293B] font-headings mt-1 line-clamp-1">
                      {relPkg.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs font-bold text-[#F97316]">
                      {relPkg.pricing?.customQuote 
                        ? 'Custom Quote' 
                        : (relPkg.pricing?.ac ? `₹${relPkg.pricing.ac.toLocaleString('en-IN')}` : 'Custom Quote')}
                    </span>
                    <Link
                      to={`/packages/${relPkg.slug}`}
                      className="flex items-center gap-0.5 text-xs font-bold text-[#1E293B] hover:text-[#F97316] transition-colors"
                    >
                      <span>View</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
