import React, { useState, useCallback } from 'react';
import { NodeViewWrapper, NodeViewProps, NodeViewContent } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../lib/utils';
import { EditableElement } from '../builder/EditableElement';

export const Hero = (props: NodeViewProps) => {
  const { node, selected, editor } = props;
  const { id: sectionId, eyebrow, title, subtitle, primaryCTA, secondaryCTA, mediaUrl } = node.attrs;
  
  const setFocusedId = useUIStore((state) => state.setFocusedId);
  const focusedId = useUIStore((state) => state.focusedId);
  const isSectionFocused = focusedId === sectionId;
  const [isHovered, setIsHovered] = useState(false);

  const insertAfter = (type: string) => {
    const pos = props.getPos() + node.nodeSize;
    editor.chain().focus().insertContentAt(pos, { type }).run();
  };

  const handleSectionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusedId(sectionId, 'section');
  }, [sectionId, setFocusedId]);

  return (
    <NodeViewWrapper className="group relative">
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleSectionClick}
        className={cn(
          "relative min-h-[600px] flex items-center justify-center cursor-pointer transition-all m-4 rounded overflow-hidden",
          isSectionFocused || selected ? "ring-2 ring-indigo-500 border-2 border-indigo-500 border-dashed" : "hover:ring-2 hover:ring-slate-300 shadow-sm"
        )}
      >
        {(isSectionFocused || selected) && (
          <div className="absolute top-0 left-4 bg-indigo-500 text-white text-[9px] px-2 py-1 rounded-b font-black z-20 shadow-lg font-mono uppercase tracking-widest">
            SECTION: HERO
          </div>
        )}
        
        <div className="absolute inset-0 bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-white" />
          <img src={mediaUrl} className="absolute right-0 top-0 w-1/2 h-full object-cover opacity-20 mask-gradient-to-l" referrerPolicy="no-referrer" />
        </div>

        <div className="relative z-10 text-left p-12 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hero-content-stack"
          >
            <NodeViewContent className="hero-section-children" />
          </motion.div>
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
              className="bg-white border border-slate-200 text-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 text-[10px] font-bold pr-3"
            >
              <Plus className="w-4 h-4" /> Add Hero
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); insertAfter('pricingSection'); }}
              className="bg-white border border-slate-200 text-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 text-[10px] font-bold pr-3"
            >
              <Plus className="w-4 h-4" /> Add Pricing
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </NodeViewWrapper>
  );
};
