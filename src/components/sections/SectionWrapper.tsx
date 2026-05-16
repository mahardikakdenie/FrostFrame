import React, { useState, useCallback } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GripHorizontal } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../lib/utils';

interface SectionWrapperProps extends NodeViewProps {
  sectionName: string;
  children: React.ReactNode;
  className?: string;
  showAddPricing?: boolean;
}

export const SectionWrapper = ({ 
  node, 
  selected, 
  editor, 
  getPos,
  sectionName, 
  children, 
  className,
  showAddPricing = true
}: SectionWrapperProps) => {
  const sectionId = node.attrs.id;
  const setFocusedId = useUIStore((state) => state.setFocusedId);
  const focusedId = useUIStore((state) => state.focusedId);
  const isActive = selected || focusedId === sectionId;
  const [isHovered, setIsHovered] = useState(false);

  const insertAfter = useCallback((type: string) => {
    const pos = (getPos?.() ?? 0) + node.nodeSize;
    editor.chain().focus().insertContentAt(pos, { type }).run();
  }, [getPos, node.nodeSize, editor]);

  const handleSectionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusedId(sectionId, 'section');
  }, [sectionId, setFocusedId]);

  return (
    <NodeViewWrapper 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        onClick={handleSectionClick}
        className={cn(
          "relative transition-all cursor-pointer m-4 rounded overflow-hidden",
          isActive ? "ring-2 ring-indigo-500 border-2 border-indigo-500 border-dashed" : "hover:ring-2 hover:ring-slate-300 shadow-sm",
          className
        )}
      >
        {/* Section Drag Handle (Fase Fix Drag) */}
        <div 
          data-drag-handle
          className={cn(
            "absolute left-1/2 -translate-x-1/2 top-0 h-6 w-12 bg-slate-800 text-white rounded-b-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-[60] cursor-grab active:cursor-grabbing shadow-lg",
            isActive && "opacity-100"
          )}
        >
          <GripHorizontal className="w-3.5 h-3.5" />
        </div>

        {isActive && (
          <div className="absolute top-0 left-4 bg-slate-900 text-white z-30 flex items-center gap-2 theme-badge">
            <div className="flex items-center gap-2">
               <span className="text-emerald-500">●</span>
               <span className="italic tracking-widest uppercase">{sectionName}</span>
            </div>
          </div>
        )}
        
        {children}
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
            {showAddPricing && (
              <button 
                onClick={(e) => { e.stopPropagation(); insertAfter('pricingSection'); }}
                className="bg-white border border-slate-200 text-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 text-[10px] font-black pr-3 italic px-4"
              >
                <Plus className="w-4 h-4" /> ADD PRICING
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </NodeViewWrapper>
  );
};
