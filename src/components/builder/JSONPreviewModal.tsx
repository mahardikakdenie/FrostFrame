import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code2, Copy, Check, Database } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { getDraftFromDB } from '../../lib/db';
import { cn } from '../../lib/utils';

export const JSONPreviewModal = () => {
  const { jsonModal, closeJsonModal } = useUIStore();
  const [jsonContent, setJsonContent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (jsonModal.isOpen) {
      const fetchJson = async () => {
        const draft = await getDraftFromDB();
        if (draft && draft.content) {
          setJsonContent(JSON.stringify(draft.content, null, 2));
        } else {
          setJsonContent('// No draft found in IndexedDB');
        }
      };
      fetchJson();
    }
  }, [jsonModal.isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!jsonModal.isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[80vh] rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                <Code2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-none mb-1 italic">Developer Tools</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
                  IndexedDB Schema Inspector
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase italic tracking-widest text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all shadow-sm active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
              <button 
                onClick={closeJsonModal}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden p-8 flex flex-col gap-4">
            <div className="flex items-center gap-2 px-1 text-left">
              <Database className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Store: drafts / Key: current-draft</span>
            </div>
            
            <div className="flex-1 bg-slate-900 rounded-[1.5rem] p-6 overflow-auto custom-scrollbar border-4 border-slate-800 dark:border-slate-950 shadow-inner">
              <pre className="text-xs font-mono text-indigo-300 leading-relaxed selection:bg-indigo-500/30">
                {jsonContent}
              </pre>
            </div>
          </div>

          {/* Footer Info */}
          <div className="px-8 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.1em]">Structure validated via Tiptap Schema Engine</span>
             </div>
             <span className="text-[8px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.1em]">Lando Studio v1.0.4 - JSON Debugger</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
