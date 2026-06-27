import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTA from '../sections/CTA';
import Travelsolutions from '../sections/Travelsolutions';
import { Check, Target, Compass, Award, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] antialiased">
      <Navbar />

      {/* About Hero */}
      <section className="relative pt-40 pb-20 bg-[#1E293B] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img
            src="/images/maharashtra_landscape.png"
            alt="Scenic Maharashtra Travel History"
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
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">Our Identity</span>
            <h1 className="text-4xl md:text-5xl font-extrabold font-headings leading-tight">About Renuka Travels</h1>
            <p className="text-sm md:text-base text-slate-300 font-light max-w-xl mx-auto leading-relaxed">
              Established in 2002, Renuka Travels has been providing reliable transportation solutions and tour packages across Maharashtra.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story & Mission/Vision */}
      <section className="py-12 md:py-20 max-w-[1280px] mx-auto px-6 space-y-12 md:space-y-20">
        
        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">Our Beginnings</span>
            <h2 className="text-3xl font-bold font-headings text-[#1E293B]">Our Story</h2>
            <p className="text-sm text-slate-500 leading-relaxed font-light">
              Established in 2002, Renuka Travels has been providing dependable and comfortable travel solutions for families, business groups, schools, and pilgrimage travelers. Built on a commitment to quality service, customer satisfaction, and reliable logistics, we have earned the trust of thousands of clients.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed font-light">
              Today, Renuka Travels operates a premium fleet of SUVs, Tempo Travellers, and luxury buses, offering custom tour itineraries and corporate transport solutions across the state of Maharashtra and beyond.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100/60 aspect-[4/3]"
          >
            <img
              src="/images/renuka_fleet.png"
              alt="Renuka Travels Fleet Showcase"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Mission and Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-3xl border border-slate-200/55 shadow-sm flex items-start space-x-4"
          >
            <div className="p-3 bg-orange-50 text-[#F97316] rounded-2xl flex-shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-headings text-[#1E293B] mb-2">Our Mission</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                To deliver safe, comfortable, and dependable travel experiences through quality vehicle rentals, personalized coordination, and transparent pricing policies, making every road trip memorable.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white p-8 rounded-3xl border border-slate-200/55 shadow-sm flex items-start space-x-4"
          >
            <div className="p-3 bg-orange-50 text-[#F97316] rounded-2xl flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-headings text-[#1E293B] mb-2">Our Vision</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                To be the leading private transport rental operator in Maharashtra, recognized for professional chauffeurs, high-quality vehicle hygiene standards, and client trust.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Redesigned Travel Solutions section integrated on About page */}
      <Travelsolutions />

      {/* Fleet Overview cards */}
      <section className="py-12 md:py-20 max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">Our Fleet</span>
          <h2 className="text-3xl font-bold font-headings text-[#1E293B] mt-1 mb-3">Managed Logistics Vehicles</h2>
          <p className="text-sm text-slate-500 font-light">
            We operate and lease a wide range of verified, commercially licensed, and routinely serviced transport vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Executive Sedans & SUVs', text: 'Comfortable 4-7 seat cars for corporate travels, hotel transfers, and small families.', tag: 'SUV / Cars' },
            { title: 'Tempo Travellers', text: 'Spacious 17-seater pushback passenger vans equipped with multi-zone cooling and screen media.', tag: 'Mini Bus' },
            { title: 'Luxury Tour Coaches', text: 'Premium 35-55 seater heavy buses for marriage guest transit and pilgrimage circles.', tag: 'Luxury Bus' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-slate-200/55 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="inline-block bg-orange-50 text-[#F97316] text-[10px] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                  {item.tag}
                </span>
                <h3 className="text-base font-bold font-headings text-[#1E293B] mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-light">{item.text}</p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-emerald-500 font-semibold flex items-center">
                  <CheckCircle2 size={12} className="mr-1" /> Sanitized & Insured
                </span>
                <Link to="/cars" className="text-xs font-bold text-[#1E293B] hover:text-[#F97316] transition-colors flex items-center">
                  <span>Browse</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}
