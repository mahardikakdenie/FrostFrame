import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../lib/utils';

export const ConfirmationModal = () => {
  const { confirmModal, closeConfirmModal } = useUIStore();
  const { isOpen, title, message, onConfirm, variant } = confirmModal;

  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: <AlertTriangle className="w-6 h-6 text-rose-50" />,
      bg: "bg-rose-500",
      border: "border-rose-600",
      button: "bg-rose-600 hover:bg-rose-700 shadow-rose-200 dark:shadow-rose-900/20",
      accent: "text-rose-600 dark:text-rose-400",
      containerBg: "bg-rose-50 dark:bg-rose-900/20"
    },
    warning: {
      icon: <AlertCircle className="w-6 h-6 text-amber-50" />,
      bg: "bg-amber-500",
      border: "border-amber-600",
      button: "bg-amber-600 hover:bg-amber-700 shadow-amber-200 dark:shadow-amber-900/20",
      accent: "text-amber-600 dark:text-amber-400",
      containerBg: "bg-amber-50 dark:bg-amber-900/20"
    },
    info: {
      icon: <Info className="w-6 h-6 text-indigo-50" />,
      bg: "bg-indigo-500",
      border: "border-indigo-600",
      button: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-indigo-900/20",
      accent: "text-indigo-600 dark:text-indigo-400",
      containerBg: "bg-indigo-50 dark:bg-indigo-900/20"
    }
  };

  const currentVariant = variants[variant] || variants.danger;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
        >
          {/* Header Accent */}
          <div className={cn("h-2 w-full", currentVariant.bg)} />
          
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className={cn("p-3 rounded-2xl shadow-lg", currentVariant.bg)}>
                {currentVariant.icon}
              </div>
              <button 
                onClick={closeConfirmModal}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-8 text-left">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                {title}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                {message}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeConfirmModal}
                className="flex-1 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onConfirm) onConfirm();
                  closeConfirmModal();
                }}
                className={cn(
                  "flex-1 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95",
                  currentVariant.button
                )}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};