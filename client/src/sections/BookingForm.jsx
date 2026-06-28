import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Car } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Fuse from "fuse.js";
import { City } from "country-state-city";
import { api } from '../services/api';
import { WHATSAPP_NUMBER } from '../constants/contact';

const indiaCities = City.getCitiesOfCountry("IN").map((city) => city.name);
const locations = [...new Set(indiaCities)];

const fuse = new Fuse(locations, {
  threshold: 0.35,
});

export default function BookingForm({ isNested = false }) {
  const [searchParams, setSearchParams] = useState({
    pickup: '',
    destination: '',
    date: '',
    vehicleType: 'SUV / Cars',
    tripType: 'One Way'
  });

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSearch = (value, setSuggestions) => {
    if (!value.trim() || value.length < 2) {
      setSuggestions([]);
      return;
    }
    const results = fuse.search(value);
    setSuggestions(results.slice(0, 5).map((result) => result.item));
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    const formattedDate = searchParams.date
      ? new Date(searchParams.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Not specified";

    const message = `Hello Renuka Tours & Travels,

I would like to request a quotation for my upcoming trip.

Trip Details
Pickup Location: ${searchParams.pickup}
Destination: ${searchParams.destination}
Travel Date: ${formattedDate}
Vehicle Type: ${searchParams.vehicleType}
Trip Type: ${searchParams.tripType}

Please provide the best available quotation along with the vehicle options.

Thank you.`;

    // Save inquiry to backend database in background
    try {
      await api.submitInquiry({
        name: 'Booking Form Lead',
        phone: 'WhatsApp Link Clicked',
        pickup: searchParams.pickup,
        destination: searchParams.destination,
        vehicleType: searchParams.vehicleType,
        date: searchParams.date || new Date().toISOString(),
        tripType: searchParams.tripType,
        notes: `Inquiry submitted via Booking Form. Date: ${formattedDate}`
      });
    } catch (err) {
      console.warn('Inquiry background save failed:', err);
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const formContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`bg-white rounded-3xl border border-orange-100 shadow-xl w-full ${
        isNested ? "p-6 md:p-8 shadow-md" : "p-6 md:p-10 max-w-4xl mx-auto"
      }`}
    >
      {isNested && (
        <div className="text-center mb-6">
          <h3 className="text-xl md:text-2xl font-bold font-headings text-[#1E293B]">
            Book Your Ride
          </h3>
        </div>
      )}

      <form onSubmit={handleSearchSubmit} className="space-y-6">
        {/* Trip Type Selectors */}
        <div className="flex flex-wrap gap-3 justify-center">
          {["One Way", "Round Trip", "Multi City"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSearchParams((prev) => ({ ...prev, tripType: type }))}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                searchParams.tripType === type
                  ? "bg-[#F97316] text-white shadow-md"
                  : "bg-[#F8FAFC] text-[#1E293B]/70 border border-slate-200 hover:bg-orange-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Inputs Grid */}
        <div className={`grid grid-cols-1 gap-6 ${isNested ? "" : "md:grid-cols-2"}`}>
          
          {/* Pickup Location */}
          <div className="relative">
            <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Pickup Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3 text-[#F97316]" size={16} />
              <input
                type="text"
                name="pickup"
                required
                value={searchParams.pickup}
                placeholder="e.g. Mumbai Airport / Pune City"
                onChange={(e) => {
                  handleInputChange(e);
                  handleLocationSearch(e.target.value, setPickupSuggestions);
                }}
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all"
              />
            </div>
            {pickupSuggestions.length > 0 && (
              <div className="absolute z-20 w-full bg-white border border-slate-200 rounded-2xl shadow-xl mt-1 max-h-48 overflow-y-auto">
                {pickupSuggestions.map((city) => (
                  <div
                    key={city}
                    onClick={() => {
                      setSearchParams((prev) => ({ ...prev, pickup: city }));
                      setPickupSuggestions([]);
                    }}
                    className="px-4 py-2.5 text-xs text-[#1E293B] hover:bg-orange-50 cursor-pointer transition-colors"
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Destination */}
          <div className="relative">
            <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3 text-[#F97316]" size={16} />
              <input
                type="text"
                name="destination"
                required
                value={searchParams.destination}
                placeholder="e.g. Mahabaleshwar / Lonavala"
                onChange={(e) => {
                  handleInputChange(e);
                  handleLocationSearch(e.target.value, setDestinationSuggestions);
                }}
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all"
              />
            </div>
            {destinationSuggestions.length > 0 && (
              <div className="absolute z-20 w-full bg-white border border-slate-200 rounded-2xl shadow-xl mt-1 max-h-48 overflow-y-auto">
                {destinationSuggestions.map((city) => (
                  <div
                    key={city}
                    onClick={() => {
                      setSearchParams((prev) => ({ ...prev, destination: city }));
                      setDestinationSuggestions([]);
                    }}
                    className="px-4 py-2.5 text-xs text-[#1E293B] hover:bg-orange-50 cursor-pointer transition-colors"
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Travel Date */}
          <div>
            <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Travel Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-3 text-[#F97316]" size={16} />
              <input
                type="date"
                name="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={searchParams.date}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Vehicle Type Select */}
          <div>
            <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wider">Preferred Vehicle Type</label>
            <div className="relative">
              <Car className="absolute left-4 top-3 text-[#F97316]" size={16} />
              <select
                name="vehicleType"
                value={searchParams.vehicleType}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:bg-white transition-all appearance-none"
              >
                <option value="SUV / Cars">SUV / Cars (4-7 Seater)</option>
                <option value="Mini Bus">Mini Bus (17-26 Seater Tempo Traveller / Coach)</option>
                <option value="Luxury Bus">Luxury Bus (35-55 Seater Coach)</option>
              </select>
              <span className="absolute right-4 top-4 text-xs text-[#1E293B]/60 pointer-events-none">▼</span>
            </div>
          </div>

        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          className="w-full bg-[#F97316] text-white py-4 rounded-2xl text-sm font-bold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <FaWhatsapp size={16} />
          <span>Inquire on WhatsApp</span>
        </motion.button>
      </form>
    </motion.div>
  );

  if (isNested) {
    return formContent;
  }

  return (
    <section id="book-now" className="py-16 bg-[#FFF7ED] scroll-mt-24 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[#F97316] font-bold text-xs uppercase tracking-widest">Reserve Your Ride</span>
          <h2 className="text-3xl md:text-4xl font-bold font-headings text-[#1E293B] mt-1 mb-3">
            Book Your Ride
          </h2>
          <p className="text-sm text-[#1E293B]/70">
            Tell us your travel details and we'll connect you with the best vehicle quote instantly via WhatsApp.
          </p>
        </div>
        {formContent}
      </div>
    </section>
  );
}
