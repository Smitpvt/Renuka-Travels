import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Wrench, Users, Clock } from 'lucide-react';

const benefits = [
  {
    title: 'Experienced Drivers',
    desc: 'Professionally trained, background-vetted, and courteous chauffeurs with years of local ghat and highway driving experience.',
    icon: <Users className="w-5 h-5" />
  },
  {
    title: 'Maintained Fleet',
    desc: 'Rigorous routine cleaning, safety inspection checklists, and regular detailing for ultimate hygiene and mechanical safety.',
    icon: <Wrench className="w-5 h-5" />
  },
  {
    title: '24/7 Operations Support',
    desc: 'Round-the-clock coordination, GPS live tracking, and support systems active day and night for emergency backups.',
    icon: <Clock className="w-5 h-5" />
  },
  {
    title: 'Transparent Billing',
    desc: 'Fixed all-inclusive quotation packages outlining tolls, parking, and permit fees. Zero hidden surcharges.',
    icon: <ShieldCheck className="w-5 h-5" />
  }
];

const timelineSteps = [
  {
    num: '01',
    title: 'Submit Inquiry',
    desc: 'Provide your dates, destination, and preferred vehicle class through our quick forms or WhatsApp.'
  },
  {
    num: '02',
    title: 'Receive Quotation',
    desc: 'Get an all-inclusive customized quote directly via WhatsApp or email within 15 minutes.'
  },
  {
    num: '03',
    title: 'Confirm Booking',
    desc: 'Confirm your vehicle block with a token advance and receive chauffeur details 12 hours prior to journey.'
  },
  {
    num: '04',
    title: 'Travel in Comfort',
    desc: 'Enjoy a professional, safe, and memorable road trip in a clean vehicle driven by an expert.'
  }
];

export default function Whychooseus() {
  return (
    <section id="why-choose-us" className="py-20 bg-white scroll-mt-24 px-6 border-b border-slate-100">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold font-headings text-[#1E293B] mt-1 mb-4">
              A Decade of Travel Excellence
            </h2>
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              We coordinate high-quality logistics, tour operations, and private vehicle leasing across Maharashtra, ensuring safety, absolute reliability, and premium comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="bg-[#F8FAFC] p-6 rounded-3xl border border-slate-150 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h4 className="text-sm font-bold text-[#1E293B] mb-1">{benefit.title}</h4>
                  <p className="text-[11px] text-slate-500 font-light leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Timeline Steps */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8 lg:pl-6"
        >
          <div>
            <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-bold font-headings text-[#1E293B] mt-1 mb-4">
              How It Works
            </h2>
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              Booking your customized premium trip with Renuka Travels is a quick, seamless, and transparent process.
            </p>
          </div>

          <div className="relative border-l border-orange-100 pl-8 ml-4 space-y-8">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Step indicator dot */}
                <div className="absolute -left-[45px] top-0.5 w-8 h-8 rounded-full bg-white border-2 border-[#F97316] text-[#F97316] font-headings font-extrabold text-xs flex items-center justify-center shadow-sm group-hover:bg-[#F97316] group-hover:text-white transition-colors duration-300">
                  {step.num}
                </div>
                <h4 className="text-sm font-bold text-[#1E293B] group-hover:text-[#F97316] transition-colors">{step.title}</h4>
                <p className="text-xs text-slate-500 font-light leading-relaxed mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
