import React, { useState, useEffect } from 'react';
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
import StructuredData from '../components/StructuredData';
import {
  generateTravelAgencySchema,
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateWebsiteSchema,
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateServiceSchema
} from '../utils/schemaGenerator';
import { api } from '../services/api';

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.getTestimonials()
      .then((data) => {
        if (data && data.testimonials) {
          setTestimonials(data.testimonials);
        }
      })
      .catch((err) => {
        console.warn('Failed to load testimonials for schema:', err);
      });
  }, []);

  const origin = window.location.origin;
  const url = window.location.href;

  const travelAgencySchema = generateTravelAgencySchema(origin, testimonials);
  const organizationSchema = generateOrganizationSchema(origin);
  const localBusinessSchema = generateLocalBusinessSchema(origin);
  const websiteSchema = generateWebsiteSchema(origin);
  const webpageSchema = generateWebPageSchema(
    'WebPage',
    url,
    'Renuka Travels | Premium Travel & Car Rentals Maharashtra',
    'Explore Maharashtra comfortably with Renuka Tours & Travels. Premium taxi, tempo traveller, and luxury coach rentals for family trips, corporate travel, and weekend getaways.'
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: url }
  ]);
  const serviceSchemas = generateServiceSchema(origin);

  const allSchemas = [
    travelAgencySchema,
    organizationSchema,
    localBusinessSchema,
    websiteSchema,
    webpageSchema,
    breadcrumbSchema,
    ...serviceSchemas
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] antialiased">
      <StructuredData data={allSchemas} />
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
