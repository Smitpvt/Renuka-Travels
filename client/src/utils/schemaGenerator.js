import { OFFICE_PHONE, OFFICE_EMAIL, OFFICE_ADDRESS } from '../constants/contact';

// Parse price string to number (e.g. "₹18,000" -> 18000)
const parsePrice = (priceVal) => {
  if (typeof priceVal === 'number') return priceVal;
  if (typeof priceVal === 'string') {
    const cleaned = priceVal.replace(/[^\d]/g, '');
    return cleaned ? parseInt(cleaned, 10) : null;
  }
  return null;
};

// Formats relative URLs to absolute URLs
const resolveUrl = (origin, path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
};

// Address helper
const getAddressObject = () => {
  return {
    "@type": "PostalAddress",
    "streetAddress": "Labour Society, Hanuman Nagar, Vadar Pada Road No. 1, Akurli Road, Kandivali East",
    "addressLocality": "Mumbai",
    "addressRegion": "Maharashtra",
    "postalCode": "400101",
    "addressCountry": "IN"
  };
};

export const generateTravelAgencySchema = (origin, testimonials = []) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${origin}/#travelagency`,
    "name": "Renuka Travels",
    "description": "Delivering safe, comfortable, and dependable travel experiences through customized tours and professional transportation services since 2002.",
    "url": origin,
    "logo": resolveUrl(origin, '/src/logo/Logo-Photoroom.png'),
    "image": resolveUrl(origin, '/src/logo/Logo.jpg'),
    "telephone": OFFICE_PHONE,
    "email": OFFICE_EMAIL,
    "address": getAddressObject(),
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "19.2008",
      "longitude": "72.8637"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "₹₹ - ₹₹₹",
    "sameAs": []
  };

  // Only generate Review or AggregateRating if genuine review data exists (explicit ratings, authors, bodies)
  if (testimonials && Array.isArray(testimonials) && testimonials.length > 0) {
    const validTestimonials = testimonials.filter(
      (t) => t && t.name && typeof t.rating === 'number' && t.rating >= 1 && t.rating <= 5 && t.review
    );

    if (validTestimonials.length > 0) {
      const totalRating = validTestimonials.reduce((sum, t) => sum + t.rating, 0);
      const ratingValue = Number((totalRating / validTestimonials.length).toFixed(1));

      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": ratingValue,
        "reviewCount": validTestimonials.length,
        "bestRating": "5",
        "worstRating": "1"
      };

      schema.review = validTestimonials.map((t) => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": t.name
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": t.rating,
          "bestRating": "5",
          "worstRating": "1"
        },
        "reviewBody": t.review
      }));
    }
  }

  return schema;
};

export const generateOrganizationSchema = (origin) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    "name": "Renuka Travels",
    "url": origin,
    "logo": resolveUrl(origin, '/src/logo/Logo-Photoroom.png'),
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": OFFICE_PHONE,
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi", "Marathi"]
    },
    "sameAs": []
  };
};

export const generateLocalBusinessSchema = (origin) => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${origin}/#localbusiness`,
    "name": "Renuka Travels",
    "description": "Delivering safe, comfortable, and dependable travel experiences through customized tours and professional transportation services since 2002.",
    "url": origin,
    "logo": resolveUrl(origin, '/src/logo/Logo-Photoroom.png'),
    "image": resolveUrl(origin, '/src/logo/Logo.jpg'),
    "telephone": OFFICE_PHONE,
    "email": OFFICE_EMAIL,
    "address": getAddressObject(),
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "19.2008",
      "longitude": "72.8637"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "₹₹ - ₹₹₹"
  };
};

export const generateWebsiteSchema = (origin) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    "url": origin,
    "name": "Renuka Travels",
    "publisher": {
      "@id": `${origin}/#organization`
    }
  };
};

export const generateWebPageSchema = (pageType, url, title, description) => {
  return {
    "@context": "https://schema.org",
    "@type": pageType || "WebPage",
    "@id": `${url}#webpage`,
    "url": url,
    "name": title,
    "description": description
  };
};

export const generateBreadcrumbSchema = (breadcrumbs) => {
  if (!breadcrumbs || !Array.isArray(breadcrumbs) || breadcrumbs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": crumb.name,
      "item": crumb.item
    }))
  };
};

export const generateServiceSchema = (origin) => {
  const provider = {
    "@type": "TravelAgency",
    "@id": `${origin}/#travelagency`,
    "name": "Renuka Travels",
    "url": origin
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Corporate Travel",
      "description": "Professional employee commute and corporate trip coordination.",
      "provider": provider,
      "areaServed": "IN"
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Airport Transfers",
      "description": "Timely pick-ups and drops for all airport transfers.",
      "provider": provider,
      "areaServed": "IN"
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Tour Packages",
      "description": "Pre-planned private tours to Lonavala, Mahabaleshwar, Alibaug, and nearby scenic hill stations.",
      "provider": provider,
      "areaServed": "IN"
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Bus Rental",
      "description": "Premium 35-55 seater heavy buses for marriage guest transit and pilgrimage circles.",
      "provider": provider,
      "areaServed": "IN"
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Car Rental",
      "description": "Comfortable 4-7 seat cars for corporate travels, hotel transfers, and small families.",
      "provider": provider,
      "areaServed": "IN"
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Wedding Transportation",
      "description": "Comfortable fleet management for guests, airport pickups, and premium bridal cars.",
      "provider": provider,
      "areaServed": "IN"
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "School & College Trips",
      "description": "Safe and secure transport for educational tours.",
      "provider": provider,
      "areaServed": "IN"
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Custom Tour Packages",
      "description": "Personalized itineraries tailored to your unique travel needs.",
      "provider": provider,
      "areaServed": "IN"
    }
  ];
};

export const generateVehicleSchema = (vehicle, origin) => {
  if (!vehicle) return null;

  // Determine the most appropriate Schema.org type based on vehicle category
  let schemaType = "Vehicle";
  if (vehicle.type === "SUV / Cars" || (vehicle.category && vehicle.category.toLowerCase().includes("mpv"))) {
    schemaType = "Car";
  } else if (vehicle.type === "Mini Bus" || vehicle.type === "Luxury Bus") {
    schemaType = "Bus";
  }

  // Build images list
  const images = [];
  if (vehicle.image) {
    images.push(resolveUrl(origin, vehicle.image));
  }
  if (vehicle.gallery && Array.isArray(vehicle.gallery)) {
    vehicle.gallery.forEach((img) => {
      if (img) images.push(resolveUrl(origin, img));
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": vehicle.name ? vehicle.name.trim() : "",
    "description": vehicle.description || vehicle.cabinDescription || "",
    "url": `${origin}/cars/${vehicle.slug}`,
    "image": images
  };

  // Seating Capacity parsing
  const seatMatch = typeof vehicle.seats === 'string' ? vehicle.seats.match(/\d+/) : null;
  const seatingCapacity = seatMatch ? parseInt(seatMatch[0], 10) : (typeof vehicle.seats === 'number' ? vehicle.seats : null);
  if (seatingCapacity) {
    schema.seatingCapacity = seatingCapacity;
  }

  // Brand extraction
  const lowerName = (vehicle.name || "").toLowerCase();
  let brandName = "";
  if (lowerName.includes("maruti") || lowerName.includes("suzuki")) {
    brandName = "Maruti Suzuki";
  } else if (lowerName.includes("toyota") || lowerName.includes("innova")) {
    brandName = "Toyota";
  } else if (lowerName.includes("force") || lowerName.includes("traveller")) {
    brandName = "Force";
  }

  if (brandName) {
    schema.brand = {
      "@type": "Brand",
      "name": brandName
    };
  }

  // Offers if pricing is specified
  if (vehicle.pricing && typeof vehicle.pricing.ac === 'number' && vehicle.pricing.ac > 0) {
    schema.offers = {
      "@type": "Offer",
      "price": vehicle.pricing.ac,
      "priceCurrency": "INR",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": vehicle.pricing.ac,
        "priceCurrency": "INR",
        "priceType": "https://schema.org/BasePrice",
        "unitText": vehicle.pricing.type === "per_km" ? "KM" : "Day"
      },
      "availability": "https://schema.org/InStock",
      "url": `${origin}/cars/${vehicle.slug}`
    };
  }

  // Additional specifications as PropertyValue elements
  const additionalProperty = [];
  if (typeof vehicle.ac === 'boolean') {
    additionalProperty.push({
      "@type": "PropertyValue",
      "name": "Air Conditioning",
      "value": vehicle.ac ? "AC" : "Non-AC"
    });
  }
  if (vehicle.fuelType) {
    additionalProperty.push({
      "@type": "PropertyValue",
      "name": "Fuel Type",
      "value": vehicle.fuelType
    });
  }
  if (vehicle.amenities && Array.isArray(vehicle.amenities)) {
    vehicle.amenities.forEach((amenity) => {
      additionalProperty.push({
        "@type": "PropertyValue",
        "name": "Amenity",
        "value": amenity
      });
    });
  }
  if (additionalProperty.length > 0) {
    schema.additionalProperty = additionalProperty;
  }

  return schema;
};

export const generatePackageSchema = (pkg, origin) => {
  if (!pkg) return null;

  // Build images list
  const images = [];
  if (pkg.image) {
    images.push(resolveUrl(origin, pkg.image));
  }
  if (pkg.gallery && Array.isArray(pkg.gallery)) {
    pkg.gallery.forEach((img) => {
      const imgSrc = typeof img === 'string' ? img : img?.image;
      if (imgSrc) images.push(resolveUrl(origin, imgSrc));
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": pkg.title ? pkg.title.trim() : "",
    "description": pkg.desc || "",
    "image": images,
    "category": "TouristTrip",
    "url": `${origin}/packages/${pkg.slug}`
  };

  // Add itinerary highlights
  if (pkg.highlights && Array.isArray(pkg.highlights) && pkg.highlights.length > 0) {
    schema.itinerary = {
      "@type": "ItemList",
      "itemListElement": pkg.highlights.map((highlight, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Place",
          "name": highlight
        }
      }))
    };
  }

  // Offers section if pricing exists
  const acPriceVal = pkg.pricing?.customQuote ? null : (pkg.pricing?.ac || pkg.acPrice);
  const parsedPrice = parsePrice(acPriceVal);

  if (parsedPrice) {
    schema.offers = {
      "@type": "Offer",
      "price": parsedPrice,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": `${origin}/packages/${pkg.slug}`,
      "provider": {
        "@type": "TravelAgency",
        "@id": `${origin}/#travelagency`,
        "name": "Renuka Travels",
        "url": origin
      }
    };
  }

  // Additional properties
  const additionalProperty = [];
  if (pkg.duration) {
    additionalProperty.push({
      "@type": "PropertyValue",
      "name": "Duration",
      "value": pkg.duration
    });
  }
  if (pkg.category) {
    additionalProperty.push({
      "@type": "PropertyValue",
      "name": "Trip Category",
      "value": pkg.category
    });
  }
  if (additionalProperty.length > 0) {
    schema.additionalProperty = additionalProperty;
  }

  return schema;
};

export const generateFAQSchema = (faqs) => {
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};
