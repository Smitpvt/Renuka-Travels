import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Briefcase, 
  Sparkles, 
  Heart, 
  BookOpen, 
  Navigation, 
  TrendingUp, 
  Clock 
} from 'lucide-react';

const solutions = [
  {
    title: 'Weekend Getaways',
    desc: 'Pre-planned private tours to Lonavala, Mahabaleshwar, Alibaug, and nearby scenic hill stations.',
    icon: <Calendar className="w-6 h-6 text-[#F97316]" />
  },
  {
    title: 'Corporate Mobility',
    desc: 'Professional transfers for corporate clients, employees, and executive event schedules.',
    icon: <Briefcase className="w-6 h-6 text-[#F97316]" />
  },
  {
    title: 'Custom Packages',
    desc: 'Tailored travel plans designed to accommodate your specific route, date, and group requirements.',
    icon: <Sparkles className="w-6 h-6 text-[#F97316]" />
  },
  {
    title: 'Pilgrimage Tours',
    desc: 'Hassle-free temple visits covering Ashtavinayak temples, Shirdi, Shani Shingnapur, and Jyotirlingas.',
    icon: <Navigation className="w-6 h-6 text-[#F97316]" />
  },
  {
    title: 'Wedding Transport',
    desc: 'Comfortable fleet management for guests, airport pickups, and premium bridal cars.',
    icon: <Heart className="w-6 h-6 text-[#F97316]" />
  },
  {
    title: 'School Excursions',
    desc: 'Verified drivers and safety-first luxury buses for school picnics and field trips.',
    icon: <BookOpen className="w-6 h-6 text-[#F97316]" />
  },
  {
    title: 'One-Way Drops',
    desc: 'Convenient single-way drops between major cities without paying full return charges.',
    icon: <TrendingUp className="w-6 h-6 text-[#F97316]" />
  },
  {
    title: 'Outstation Rentals',
    desc: 'Reliable multi-day outstation car and coach leasing with professional chauffeurs.',
    icon: <Clock className="w-6 h-6 text-[#F97316]" />
  }
];

export default function Travelsolutions() {
  return (
    <section className="py-12 md:py-20 bg-[#FFF7ED]/35">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">Mobility Services</span>
          <h2 className="text-3xl md:text-4xl font-bold font-headings text-[#1E293B] mt-1 mb-4">
            Travel Solutions We Offer
          </h2>
          <p className="text-sm text-slate-500 font-light leading-relaxed">
            Reliable, safe, and premium private vehicle rentals and customized holiday tour itineraries for every traveler.
          </p>
        </div>

        {/* Grid of Icons */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {solutions.map((sol, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                {sol.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E293B] mb-2">{sol.title}</h3>
                <p className="text-[11px] text-slate-500 font-light leading-relaxed">{sol.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
