import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, Github, Linkedin, Plus } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../lib/utils';

export const Footer = (props: NodeViewProps) => {
  const { node, selected, editor } = props;
  const { id: sectionId, logo, description, links, copyright } = node.attrs;
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
          "py-20 px-12 bg-white transition-all cursor-pointer m-4 rounded overflow-hidden relative border-t border-slate-100",
          isActive ? "ring-2 ring-indigo-500 border-2 border-indigo-500 border-dashed" : "hover:ring-2 hover:ring-slate-100"
        )}
      >
        {isActive && (
          <div className="absolute top-0 left-4 bg-indigo-500 text-white text-[9px] px-2 py-0.5 rounded-b font-black z-20 shadow-lg font-mono">FOOTER_SECTION.NODE</div>
        )}

        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 mb-6">{logo || 'LANDO'}</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{description}</p>
            <div className="flex gap-4">
              <Twitter className="w-5 h-5 text-slate-400 hover:text-indigo-500 transition-colors" />
              <Github className="w-5 h-5 text-slate-400 hover:text-indigo-500 transition-colors" />
              <Linkedin className="w-5 h-5 text-slate-400 hover:text-indigo-500 transition-colors" />
            </div>
          </div>

          {(links || []).map((group: any, i: number) => (
            <div key={i}>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-6 italic">{group?.title}</h3>
              <ul className="space-y-4">
                {(group?.items || []).map((item: any, j: number) => (
                  <li key={j}>
                    <a className="text-slate-500 text-sm font-medium hover:text-indigo-600 transition-colors cursor-pointer">{item?.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{copyright}</p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
             <span className="hover:text-indigo-500 transition-colors">Privacy</span>
             <span className="hover:text-indigo-500 transition-colors">Terms</span>
             <span className="hover:text-indigo-500 transition-colors">Cookies</span>
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
              onClick={(e) => { e.stopPropagation(); insertAfter('footerSection'); }}
              className="bg-white border border-slate-200 text-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 text-[10px] font-bold pr-3 font-mono"
            >
              <Plus className="w-4 h-4" /> ADD FOOTER
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </NodeViewWrapper>
  );
};
