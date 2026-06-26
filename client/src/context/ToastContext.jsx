import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Render overlay container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 transition-all duration-300 animate-slide-in hover:scale-102"
          >
            {/* Icon mapping based on status type */}
            {toast.type === 'success' && <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-0.5" size={18} />}
            {toast.type === 'warning' && <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />}
            {toast.type === 'error' && <XCircle className="text-rose-500 flex-shrink-0 mt-0.5" size={18} />}

            <div className="flex-grow space-y-0.5">
              <p className="text-xs text-[#1E293B] font-medium leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors mt-0.5"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
