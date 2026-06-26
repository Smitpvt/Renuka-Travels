import React from 'react';
import { motion } from 'framer-motion';

const VehicleCard = ({ vehicle, onCardClick }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      onClick={() => onCardClick(vehicle)}
      className="bg-white rounded-2xl overflow-hidden border border-[#e2d0c8]/60 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48 bg-gray-100">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-3 right-3 flex gap-2">
          <span className="bg-[#8D4F0B] text-white px-2.5 py-1 rounded-full text-[10px] font-semibold">
            {vehicle.capacity}
          </span>

          <span className="bg-[#D68A45] text-white px-2.5 py-1 rounded-full text-[10px] font-semibold">
            {vehicle.acType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-[#241915] mb-2">
          {vehicle.name}
        </h3>

        <p className="text-xs text-[#53634F] leading-relaxed mb-4 line-clamp-2">
          {vehicle.description}
        </p>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {Array.isArray(vehicle.amenities) && vehicle.amenities.slice(0, 2).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D68A45]" />
              <span className="text-xs text-[#53634F]">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            className="border border-[#D68A45] text-[#8D4F0B] hover:bg-[#F7F2EE] py-2 rounded-xl text-xs font-semibold transition"
          >
            Request Quote
          </button>

          <button
            className="bg-[#D68A45] hover:bg-[#8D4F0B] text-white py-2 rounded-xl text-xs font-semibold transition"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleCard;