import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ThumbsUp, MapPin, Award, Shield, Building2 } from 'lucide-react';

const statsData = [
  { value: 12000, suffix: '+', label: 'Happy Customers', icon: <ThumbsUp size={24} /> },
  { value: 35, suffix: '+', label: 'Destinations', icon: <MapPin size={24} /> },
  { value: 24, suffix: '+', label: 'Years Experience', icon: <Award size={24} /> },
   { value: 50, suffix: '+', label: 'Corporate Companies Served', icon: <Building2 size={24} /> }
];

function Counter({ value, suffix = '', duration = 1.5 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
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
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="py-20 bg-[#eddcd5]/50 border-y border-[#e2d0c8]/40">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {statsData.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="text-center group"
          >
            <div className="inline-flex p-4 rounded-full bg-[#8D4F0B]/10 text-[#8D4F0B] mb-4 group-hover:bg-[#8D4F0B] group-hover:text-white transition-colors duration-300">
              {stat.icon}
            </div>
            <div className="text-3xl md:text-4xl font-extrabold font-headings text-[#8D4F0B] tracking-tight">
              <Counter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-xs font-bold text-[#53634F] uppercase tracking-wider mt-2">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
