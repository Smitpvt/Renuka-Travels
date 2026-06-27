import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fuseSearch, normalizeText, expandQuery } from '../utils/search';

/**
 * Highlights matches of the query inside a given string.
 */
function HighlightText({ text, query }) {
  if (!query || !text) return <span>{text}</span>;

  const expandedQuery = expandQuery(query);
  const queryNormalized = normalizeText(expandedQuery);
  const terms = queryNormalized.split(' ').filter(Boolean);

  if (terms.length === 0) return <span>{text}</span>;

  // Escape regex characters
  const escapedTerms = terms.map((term) => term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');

  const parts = String(text).split(regex);

  return (
    <span>
      {parts.map((part, index) => {
        const isMatch = regex.test(part);
        return isMatch ? (
          <span key={index} className="text-[#F97316] font-semibold">
            {part}
          </span>
        ) : (
          part
        );
      })}
    </span>
  );
}

/**
 * Generic, reusable premium SearchInput component.
 */
export default function SearchInput({
  value = '',
  onQueryChange,
  onCommit,
  placeholder = 'Search...',
  data = [],
  searchFields = [],
  primaryKey = 'title',
  renderSuggestion,
  onSelect,
  suggestions,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Compute suggestions list: use external suggestions if provided, or client-side filter
  const activeSuggestions =
    suggestions ??
    (value.trim()
      ? fuseSearch(data, value, searchFields, primaryKey).slice(0, 8)
      : []);

  // Reset active keyboard index when suggestions list changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [value, activeSuggestions.length]);

  // Click outside detection to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const newVal = e.target.value;
    onQueryChange(newVal, true); // true indicates typing, i.e., replace history
    setIsOpen(true);
  };

  const handleClear = () => {
    onQueryChange('', false); // clear is a committed action, pushes history or updates query
    if (onCommit) {
      onCommit('');
    }
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelect = (item) => {
    const selectionText = item[primaryKey];
    onQueryChange(selectionText, false); // select suggestion pushes history
    if (onSelect) {
      onSelect(item);
    }
    if (onCommit) {
      onCommit(selectionText);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) =>
        prev < activeSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : activeSuggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < activeSuggestions.length) {
        handleSelect(activeSuggestions[activeIndex]);
      } else {
        // Pressing enter with no active index: commit search (creates history state)
        if (onCommit) {
          onCommit(value);
        }
        setIsOpen(false);
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto mb-8 z-40">
      <div className="relative flex items-center">
        {/* Left Search Icon */}
        <div className="absolute left-4 text-slate-400 pointer-events-none transition-colors duration-200">
          <Search size={18} />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/15 hover:border-slate-300 transition-all duration-300 shadow-sm focus:shadow-md"
        />

        {/* Right Clear (X) Button */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {isOpen && activeSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <ul className="max-h-[300px] overflow-y-auto divide-y divide-slate-100">
              {activeSuggestions.map((item, index) => (
                <li
                  key={item.slug || index}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors duration-150 ${
                    index === activeIndex
                      ? 'bg-orange-50/70 border-l-4 border-l-[#F97316] pl-2.5'
                      : 'hover:bg-slate-50/40'
                  }`}
                >
                  {renderSuggestion ? (
                    renderSuggestion(item, value)
                  ) : (
                    <div className="flex items-center gap-3 w-full">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item[primaryKey]}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0 border border-slate-100"
                        />
                      )}
                      <div className="flex-grow min-w-0">
                        <div className="text-sm font-bold text-slate-800 truncate">
                          <HighlightText text={item[primaryKey]} query={value} />
                        </div>
                        {item.category && (
                          <div className="text-xs text-slate-500 font-light truncate mt-0.5">
                            {item.category} • {item.duration}
                          </div>
                        )}
                        {item.type && (
                          <div className="text-xs text-slate-500 font-light truncate mt-0.5">
                            {item.type} • {item.seats} Seats
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
