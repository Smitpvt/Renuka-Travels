import React from "react";
import { motion } from "framer-motion";

const corporatePartners = [
  {
    name: "Reliance",
    logo: "https://imgs.search.brave.com/xkWyXd5SfNpt2DMX2vX23UeeZfLCXXBDcMO6T5ZVF2A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9icmFu/ZGxvZ29odWIuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI0/LzA1L1JlbGlhbmNl/LUluZHVzdHJpZXMt/TGltaXRlZC1Mb2dv/LnBuZw",
  },
  {
    name: "Coca Cola",
    logo: "https://imgs.search.brave.com/Wlo385SHohwIYE60UHXqTo5NTh92kye9NK7nZ3GCgos/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bG9nby53aW5lL2Ev/bG9nby9Db2NhLUNv/bGEvQ29jYS1Db2xh/LUxvZ28ud2luZS5z/dmc",
  },
  {
    name: "HDFC Bank",
    logo: "https://imgs.search.brave.com/M8uuofcWSLe_LVigB6bDqM_bwk2qyRjg98AuWMuTcgo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL3RodW1icy82/MjdiYWRhNzhkNjU5/ODE5YjExMDg1MDQu/cG5n",
  },
  {
    name: "IDFC Bank",
    logo: "https://imgs.search.brave.com/NBT1bgaYbZr5z-7KhOndLzQpqIO_7zN6-xjQL9hObjk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/d2lrLmNvbS9jb250/ZW50L3VwbG9hZHMv/aW1hZ2VzL2lkZmMt/Zmlyc3QtYmFuazg4/NDYuanBn",
  },
  {
    name: "FedEx",
    logo: "https://imgs.search.brave.com/Luix6U-D5PoCIs52tONmbmAO314OwIjxHF8C4tLTmfQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nbWFydC5jb20v/ZmlsZXMvMTUvRmVk/ZXgtTG9nby1QTkct/RmlsZS5wbmc",
  },
  {
    name: "BigBasket",
    logo: "https://imgs.search.brave.com/JCYBhJvAEuVM4FhnouHGqw7O5CS3-QiYADcLXJt5u7o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90b3Bw/bmcuY29tL3VwbG9h/ZHMvcHJldmlldy8x/MC1pbmNyZWFzZS1p/bi1wdXNoLW5vdGlm/aWNhdGlvbi1kZWxp/dmVyeS1yYXRlLWJp/Zy1iYXNrZXQtbG9n/by0xMTU2MzAzMzg0/NmJ3c2Fpdnc3bmUu/cG5n",
  },
  {
    name: "Facebook",
    logo: "https://imgs.search.brave.com/gnFlnTqnt2fYOlzmGJ6_mG1XSRcGubg7JvJtjuRR3KY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuZnJlZXBuZ2xv/Z28uY29tL2ltYWdl/cy9hbGxfaW1nL2Zh/Y2Vib29rLWNpcmNs/ZS1sb2dvLXBuZy5w/bmc",
  },
  {
    name: "Mindspace",
    logo: "https://imgs.search.brave.com/nom3ncBJWQA4nitKisTQPlFwCqnDuC6_vkn8NW3pzXY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bWluZHNwYWNlaW5k/aWEuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDI1LzA0L01J/TkRTUEFDRS0wMS5z/dmc",
  },
];

export default function Trustsection() {
  return (
    <section className="py-12 bg-transparent border-y border-slate-200/50 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        <p className="text-[10px] md:text-xs font-bold tracking-widest text-[#1E293B]/50 uppercase mb-8 text-center">
          Trusted Corporate Mobility Partner
        </p>

        {/* Marquee Container */}
        <div className="relative overflow-hidden w-full flex items-center">
          {/* Fading Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none"></div>

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              duration: 40, // Slower movement
              ease: "linear",
            }}
            className="flex w-max gap-20 items-center"
          >
            {[...corporatePartners, ...corporatePartners].map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center min-w-[120px] md:min-w-[150px]"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-10 md:h-12 w-auto object-contain filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}