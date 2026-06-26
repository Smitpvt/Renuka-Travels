import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../sections/Hero';
import Trustsection from '../sections/Trustsection';
import PopularDestinations from '../sections/PopularDestinations';
import Cartype from '../sections/Cartype';
import Whychooseus from '../sections/Whychooseus';
import Testimonial from '../sections/Testimonial';
import CustomPackageBuilder from '../sections/CustomPackageBuilder';
import CTA from '../sections/CTA';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] antialiased">
      <Navbar />
      <main>
        {/* 1. Hero Section */}
        <Hero />
        
        {/* 2. Corporate Clients Marquee */}
        <Trustsection />
        
        {/* 3. Featured Packages */}
        <PopularDestinations />

        {/* 5. Featured Fleet Categories */}
        <Cartype />

        {/* 6. Why Choose Us */}
        <Whychooseus />

        {/* 7. Testimonials */}
        <Testimonial />

        {/* 8. Custom Package CTA */}
        <CustomPackageBuilder />

        {/* 9. General CTA */}
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
