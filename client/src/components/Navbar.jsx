import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "../logo/Logo.jpg";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Packages", path: "/packages" },
  { name: "Cars", path: "/cars" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-5 left-0 w-full z-50 px-4 md:px-6">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`max-w-[1280px] mx-auto rounded-full border border-white/30 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-lg py-2 md:py-3 px-6 md:px-8"
            : "bg-white/75 backdrop-blur-md shadow-md py-4 px-6 md:px-8"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center"
          >
            <img src={Logo} alt="Renuka Travels" className="h-8 md:h-10 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative text-sm font-semibold transition-colors duration-300 py-1 ${
                    active
                      ? "text-[#F97316]"
                      : "text-[#1E293B]/80 hover:text-[#F97316]"
                  }`}
                >
                  {item.name}
                  {active && (
                    <motion.span
                      layoutId="activeNavLine"
                      className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[#F97316] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              to="/contact"
              className="px-6 py-2.5 rounded-full bg-[#F97316] border border-[#F97316] text-white hover:bg-transparent hover:text-[#F97316] text-xs font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-1.5 text-[#1E293B] hover:text-[#F97316] transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-4 right-4 mt-2 md:hidden"
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-[24px] border border-white/40 shadow-xl overflow-hidden p-6 flex flex-col gap-4">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`text-sm font-semibold py-1.5 border-b border-[#1E293B]/5 transition-colors ${
                      active ? "text-[#F97316]" : "text-[#1E293B] hover:text-[#F97316]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Link
                to="/contact"
                className="mt-2 w-full text-center bg-[#F97316] text-white text-xs font-bold py-3 rounded-full hover:bg-[#1E293B] transition-colors shadow-md"
              >
                Get Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
