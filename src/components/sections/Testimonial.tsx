import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Quote } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../lib/utils';

export const Testimonial = (props: NodeViewProps) => {
  const { node, selected, editor } = props;
  const { id: sectionId, quote, author, rating, logos } = node.attrs;
  const setFocusedId = useUIStore((state) => state.setFocusedId);
  const focusedId = useUIStore((state) => state.focusedId);
  const isActive = selected || focusedId === sectionId;
  const [isHovered, setIsHovered] = useState(false);

  const insertAfter = (type: string) => {
    const pos = props.getPos() + node.nodeSize;
    editor.chain().focus().insertContentAt(pos, { type }).run();
  };

  return (
    <NodeViewWrapper className="group relative">
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setFocusedId(sectionId, 'section')}
        className={cn(
          "py-32 px-6 bg-slate-900 transition-all cursor-pointer m-4 rounded overflow-hidden relative text-white",
          isActive ? "ring-2 ring-indigo-500 border-2 border-indigo-500 border-dashed" : "hover:ring-2 hover:ring-slate-700 shadow-2xl"
        )}
      >
        {isActive && (
          <div className="absolute top-0 left-4 bg-indigo-600 text-white text-[9px] px-3 py-1.5 rounded-b-xl font-black z-30 shadow-2xl skew-x--10 flex items-center gap-2">
            <div className="skew-x-10 flex items-center gap-2">
              <span className="text-white animate-pulse">â</span>
              <span className="italic tracking-widest">TESTIMONIAL.NODE</span>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-10 transform -translate-y-4">
             <Quote className="w-32 h-32 text-indigo-400 rotate-180" />
          </div>
          
          <div className="flex justify-center gap-1.5 mb-12">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={cn("w-6 h-6 rounded-lg flex items-center justify-center skew-x--10", i < rating ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-slate-800")}>
                <Star className={cn("w-3 h-3 skew-x-10", i < rating ? "text-white fill-white" : "text-slate-600")} />
              </div>
            ))}
          </div>

          <blockquote className="text-4xl md:text-5xl font-black italic tracking-tighter leading-[1.1] mb-16 skew-x-[-2deg] uppercase">
            "{quote || 'This is an amazing product.'}"
          </blockquote>

          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-indigo-600 rounded-2xl rotate-6 -z-10" />
              <img 
                src={author?.avatar} 
                className="w-20 h-20 rounded-2xl border-4 border-slate-900 shadow-2xl object-cover -rotate-3 hover:rotate-0 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="font-black uppercase tracking-[0.2em] text-sm italic text-indigo-500">{author?.name || 'Jane Doe'}</div>
            <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 italic">{author?.role || 'CEO'}</div>
          </div>

          <div className="mt-32 pt-16 border-t border-slate-800/50 flex flex-wrap justify-center gap-16 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
             {(logos || []).map((logo: string, i: number) => (
               <span key={i} className="font-black text-2xl italic tracking-tighter uppercase skew-x-[-5deg]">{logo}</span>
             ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); insertAfter('layoutRow'); }}
              className="bg-white border border-slate-200 text-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 text-[10px] font-black pr-3 italic px-4"
            >
              <Plus className="w-4 h-4" /> ADD ROW
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); insertAfter('pricingSection'); }}
              className="bg-white border border-slate-200 text-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 text-[10px] font-black pr-3 italic px-4"
            >
              <Plus className="w-4 h-4" /> ADD PRICING
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </NodeViewWrapper>
  );
};
