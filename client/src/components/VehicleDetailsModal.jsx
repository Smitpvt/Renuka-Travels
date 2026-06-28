import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const VehicleDetailsModal = ({ vehicle, isOpen, onClose }) => {
  const [mainImage, setMainImage] = useState(vehicle?.image || '');

  if (!vehicle) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="fixed top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
              {/* Left Side - Gallery */}
              <div className="flex flex-col gap-4">
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-square">
                  <motion.img
                    key={mainImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={mainImage}
                    alt={vehicle.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {vehicle.thumbnails.map((thumb, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setMainImage(thumb)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                        mainImage === thumb
                          ? 'border-amber-700'
                          : 'border-gray-200 hover:border-amber-400'
                      }`}
                    >
                      <img
                        src={thumb}
                        alt={`${vehicle.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Right Side - Details */}
              <div className="flex flex-col gap-6">
                {/* Header */}
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {vehicle.name}
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    <span className="inline-block bg-amber-100 text-amber-900 px-4 py-1 rounded-full text-sm font-semibold">
                      {vehicle.capacity}
                    </span>
                    <span className="inline-block bg-green-100 text-green-900 px-4 py-1 rounded-full text-sm font-semibold">
                      {vehicle.acType}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed">
                  {vehicle.description}
                </p>

                {/* Features Grid */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Amenities
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {Array.isArray(vehicle.amenities) && vehicle.amenities.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-700 mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vehicle Category */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Vehicle Type
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="bg-amber-50 text-amber-900 px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      {vehicle.category}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold transition"
                  >
                    Request Quote
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    WhatsApp
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VehicleDetailsModal;
