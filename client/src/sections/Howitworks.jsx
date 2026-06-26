import React from 'react';
import { motion } from 'framer-motion';
import { FormInput, FileText, CheckCircle, Car } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Submit Inquiry',
    desc: 'Enter your journey details (pickup, drop, dates) in our brief callback/quote forms.',
    icon: <FormInput className="w-6 h-6" />
  },
  {
    num: '02',
    title: 'Receive Custom Quotation',
    desc: 'Our operators calculate an all-inclusive custom rate and contact you within 15 minutes.',
    icon: <FileText className="w-6 h-6" />
  },
  {
    num: '03',
    title: 'Confirm & Pay',
    desc: 'Pay a minimal token amount to confirm your reservation and block the vehicle class.',
    icon: <CheckCircle className="w-6 h-6" />
  },
  {
    num: '04',
    title: 'Enjoy Chauffeur Drive',
    desc: 'Receive driver details 12 hours prior. Relax as our polite driver drives you safely.',
    icon: <Car className="w-6 h-6" />
  }
];

export default function Howitworks() {
  return (
    <section className="py-20 max-w-[1280px] mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[#8D4F0B] font-bold text-xs uppercase tracking-widest font-headings">Process Flow</span>
        <h2 className="text-3xl font-bold font-headings text-[#241915] mt-2 mb-4">How It Works</h2>
        <p className="text-sm text-[#53634F] font-light">
          Book your premium ride with Renuka Tours in four simple and rapid steps.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        transition={{ staggerChildren: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0 }
            }}
            className="bg-white rounded-2xl p-6 border border-[#e2d0c8]/50 shadow-sm relative group hover:border-[#8D4F0B] transition-colors duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#8D4F0B]/10 text-[#8D4F0B] flex items-center justify-center mb-6 group-hover:bg-[#8D4F0B] group-hover:text-white transition-colors duration-300">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold font-headings text-[#241915] mb-2">{step.title}</h3>
              <p className="text-xs text-[#53634F] leading-relaxed font-light">{step.desc}</p>
            </div>
            <div className="absolute top-6 right-6 font-headings font-extrabold text-2xl text-[#8D4F0B]/10 group-hover:text-[#8D4F0B]/20 transition-colors">
              {step.num}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
