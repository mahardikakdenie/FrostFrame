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
          <div className="absolute top-0 left-4 bg-indigo-500 text-white text-[9px] px-2 py-0.5 rounded-b font-black z-20 shadow-lg font-mono">TESTIMONIAL.NODE</div>
        )}

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-20 transform -translate-y-4">
             <Quote className="w-24 h-24 text-indigo-400 rotate-180" />
          </div>
          
          <div className="flex justify-center gap-1 mb-10">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn("w-5 h-5", i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-700")} />
            ))}
          </div>

          <blockquote className="text-3xl md:text-4xl font-black italic tracking-tight leading-tight mb-12">
            "{quote || 'This is an amazing product.'}"
          </blockquote>

          <div className="flex flex-col items-center">
            <img 
              src={author?.avatar} 
              className="w-16 h-16 rounded-full border-4 border-slate-800 shadow-xl mb-4 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="font-black uppercase tracking-widest text-sm italic">{author?.name || 'Jane Doe'}</div>
            <div className="text-slate-500 text-xs font-bold mt-1">{author?.role || 'CEO'}</div>
          </div>

          <div className="mt-24 pt-12 border-t border-slate-800 flex flex-wrap justify-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
             {(logos || []).map((logo: string, i: number) => (
               <span key={i} className="font-black text-xl italic tracking-tighter">{logo}</span>
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
              onClick={(e) => { e.stopPropagation(); insertAfter('testimonialSection'); }}
              className="bg-white border border-slate-200 text-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 text-[10px] font-bold pr-3 font-mono"
            >
              <Plus className="w-4 h-4" /> ADD TESTIMONIAL
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); insertAfter('pricingSection'); }}
              className="bg-white border border-slate-200 text-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 text-[10px] font-bold pr-3 font-mono"
            >
              <Plus className="w-4 h-4" /> ADD PRICING
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </NodeViewWrapper>
  );
};
