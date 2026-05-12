import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Search, Smartphone, Plus, Layout, Shield, Heart } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../lib/utils';

const iconMap: Record<string, any> = {
  Zap, Search, Smartphone, Layout, Shield, Heart
};

export const Features = (props: NodeViewProps) => {
  const { node, selected, editor } = props;
  const { id: sectionId, title, subtitle, columns, features } = node.attrs;
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
          "py-24 px-6 bg-white transition-all cursor-pointer m-4 rounded overflow-hidden relative",
          isActive ? "ring-2 ring-indigo-500 border-2 border-indigo-500 border-dashed" : "hover:ring-2 hover:ring-slate-100 shadow-sm"
        )}
      >
        {isActive && (
          <div className="absolute top-0 left-4 bg-indigo-500 text-white text-[9px] px-2 py-0.5 rounded-b font-black z-20 shadow-lg font-mono">FEATURES_SECTION.NODE</div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-[0.9] italic">
              {title || 'OUR FEATURES'}
            </h2>
            <p className="text-slate-500 font-medium max-w-xl">{subtitle}</p>
            <div className="w-12 h-1 bg-indigo-600 mt-6 rounded-full" />
          </div>

          <div className={cn(
            "grid gap-12",
            columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3"
          )}>
            {(features || []).map((feature: any, idx: number) => {
              const Icon = iconMap[feature.icon] || Zap;
              return (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 5 }}
                  className="group/item"
                >
                  <div className="w-12 h-12 bg-slate-50 rounded flex items-center justify-center text-indigo-600 mb-6 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all shadow-sm border border-slate-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-3 uppercase tracking-tight italic">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.description}</p>
                </motion.div>
              );
            })}
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
              onClick={(e) => { e.stopPropagation(); insertAfter('strictHeroRow'); }}
              className="bg-white border border-slate-200 text-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 text-[10px] font-bold pr-3 font-mono"
            >
              <Plus className="w-4 h-4" /> ADD HERO
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); insertAfter('featuresSection'); }}
              className="bg-white border border-slate-200 text-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 text-[10px] font-bold pr-3 font-mono"
            >
              <Plus className="w-4 h-4" /> ADD FEATURES
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
