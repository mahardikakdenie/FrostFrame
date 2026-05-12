import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../store/useUIStore';

interface EditableElementProps {
  id: string; // unique within the section, e.g., "title"
  sectionId: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

export const EditableElement = React.memo(({ 
  id, 
  sectionId, 
  children, 
  className,
  activeClassName 
}: EditableElementProps) => {
  const fullId = `${sectionId}.${id}`;
  
  // Use selectors to prevent unnecessary re-renders of all elements
  const isHovered = useUIStore((state) => state.hoveredId === fullId);
  const isFocused = useUIStore((state) => state.focusedId === fullId);
  
  const setHoveredId = useUIStore((state) => state.setHoveredId);
  const setFocusedId = useUIStore((state) => state.setFocusedId);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setHoveredId(fullId);
  }, [fullId, setHoveredId]);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, [setHoveredId]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setFocusedId(fullId, 'element');
  }, [fullId, setFocusedId]);

  return (
    <div 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative transition-all duration-300 cursor-pointer rounded-lg",
        "before:absolute before:-inset-2 before:border-2 before:border-transparent before:rounded-xl before:transition-all before:pointer-events-none before:z-[5]",
        isHovered && !isFocused && "before:border-indigo-400/30",
        isFocused && "before:border-indigo-500 before:shadow-[0_0_20px_-5px_rgba(79,70,229,0.4)]",
        className,
        isFocused && activeClassName
      )}
    >
      {children}
      
      <AnimatePresence>
        {(isHovered || isFocused) && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -top-7 left-0 flex items-center gap-2 z-20 pointer-events-none"
          >
            <div className="bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-lg flex items-center gap-1.5 italic">
               <div className="w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" />
               {id.split('.').pop()}
            </div>
            {isFocused && (
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
