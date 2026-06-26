import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTA from '../sections/CTA';
import { Phone, Mail, MapPin, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../services/api';
import { OFFICE_PHONE, OFFICE_EMAIL, OFFICE_ADDRESS, GOOGLE_MAPS_EMBED_URL, WHATSAPP_NUMBER } from '../constants/contact';

const faqs = [
  {
    question: 'How do I confirm my booking?',
    answer: 'Once you receive our all-inclusive quotation and agree to the rates, we require a small token advance to block the vehicle. You will receive final driver and vehicle details via SMS/WhatsApp 12 hours before pickup.'
  },
  {
    question: 'Are parking and toll fees included in the quote?',
    answer: 'Yes! We provide transparent, all-inclusive quotations that cover tolls, state taxes, permit charges, and parking fees, so you never have to make unexpected payments during your trip.'
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellations made 24 hours prior to travel are eligible for a full refund of the token amount. For cancellations within 24 hours, the advance amount will be held as credit for your next booking.'
  },
  {
    question: 'Are your vehicles commercially licensed and insured?',
    answer: 'Absolutely. All our cars, SUVs, travellers, and buses carry valid commercial registration (yellow plates), comprehensive commercial passenger insurance, and up-to-date fitness certificates.'
  }
];

function FAQItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left font-headings font-bold text-xs text-[#1E293B] focus:outline-none"
      >
        <span>{faq.question}</span>
        {isOpen ? <ChevronUp size={16} className="text-[#F97316]" /> : <ChevronDown size={16} className="text-[#F97316]" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-6 pb-4 text-xs text-slate-500 font-light leading-relaxed border-t border-slate-50 pt-2"
          >
            {faq.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save inquiry to backend database
      await api.submitInquiry({
        name: formData.name,
        phone: formData.phone,
        pickup: 'Contact Page Callback Form',
        destination: `Service: ${formData.service}`,
        vehicleType: 'Any',
        date: new Date().toISOString(),
        tripType: 'One Way',
        notes: `Submitted via Callback request form. Email: ${formData.email}. Message: ${formData.message}`
      });

      const message = `Hello Renuka Tours & Travels,

I have submitted a callback request through your website.

Customer Details
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}

Trip Details
Service Type: ${formData.service}
Message: ${formData.message}

Kindly contact me with the quotation and availability at your earliest convenience.

Thank you.`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      
      setFormData({ name: '', email: '', phone: '', service: 'general', message: '' });
      e.target.reset();
    } catch (err) {
      console.error('Inquiry submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] antialiased">
      <Navbar />

      {/* Contact Hero */}
      <section className="relative pt-40 pb-20 bg-[#1E293B] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img
            src="/images/maharashtra_landscape.png"
            alt="Scenic road support"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent"></div>

        <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">Connect With Us</span>
            <h1 className="text-4xl md:text-5xl font-extrabold font-headings">Contact & Support</h1>
            <p className="text-sm md:text-base text-slate-300 font-light max-w-xl mx-auto leading-relaxed">
              Have questions about booking availability, corporate accounts, or route quotes? Get in touch with our team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Details & Callback request Form */}
      <section className="py-20 max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Info Column */}
        <div className="space-y-8">
          <div>
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest font-headings">Support 24 / 7</span>
            <h2 className="text-3xl font-bold font-headings text-[#1E293B] mt-1 mb-3">How to Reach Us</h2>
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              Our travel consultants are available round-the-clock to prepare quotes, track active trips, and coordinate schedules.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4 bg-white p-5 rounded-3xl border border-slate-100/70 shadow-sm">
              <div className="p-3 bg-orange-50 rounded-2xl text-[#F97316]">
                <Phone size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">Phone Call Support</h4>
                <p className="text-sm text-slate-500 mt-1">
                  <a href={`tel:${OFFICE_PHONE.replace(/\s+/g, '')}`} className="hover:text-[#F97316] transition-colors">{OFFICE_PHONE}</a>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-5 rounded-3xl border border-slate-100/70 shadow-sm">
              <div className="p-3 bg-orange-50 rounded-2xl text-[#F97316]">
                <Mail size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">Email Enquiries</h4>
                <p className="text-sm text-slate-500 mt-1">
                  <a href={`mailto:${OFFICE_EMAIL}`} className="hover:text-[#F97316] transition-colors">{OFFICE_EMAIL}</a>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-5 rounded-3xl border border-slate-100/70 shadow-sm">
              <div className="p-3 bg-orange-50 rounded-2xl text-[#F97316]">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E293B] uppercase tracking-wider">Office Address</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed font-light">
                  {OFFICE_ADDRESS}
                </p>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="overflow-hidden rounded-3xl border border-slate-250 shadow-sm">
            <iframe
              title="Renuka Tours Location"
              src={GOOGLE_MAPS_EMBED_URL}
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen=""
            />
          </div>
        </div>

        {/* Callback request Form Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/55 shadow-lg h-fit">
          <h3 className="text-lg font-bold font-headings text-[#1E293B] mb-5">Request A Callback</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Full Name"
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-250 rounded-2xl text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-250 rounded-2xl text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all"
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Mobile Number"
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-250 rounded-2xl text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all"
              />
            </div>
            <div>
              <select
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-250 rounded-2xl text-xs text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all appearance-none"
              >
                <option value="general">General Inquiry</option>
                <option value="package">Package Booking</option>
                <option value="rental">Vehicle Rental</option>
                <option value="corporate">Corporate Commute</option>
              </select>
            </div>
            <div>
              <textarea
                name="message"
                required
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Briefly explain your trip requirement (Travel date, route details, vehicle choice...)"
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-250 rounded-2xl text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all"
              ></textarea>
            </div>
            <motion.button
              whileHover={{ scale: 1.01, y: -0.5 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Send size={12} />
              <span>{isSubmitting ? 'Submitting Inquiry...' : 'Submit Inquiry via WhatsApp'}</span>
            </motion.button>
          </form>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-[700px] mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">Questions</span>
            <h2 className="text-3xl font-bold font-headings text-[#1E293B]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}
