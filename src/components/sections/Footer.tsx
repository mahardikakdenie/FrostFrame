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
          <div className="absolute top-0 left-4 bg-slate-900 text-white text-[9px] px-3 py-1.5 rounded-b-xl font-black z-30 shadow-2xl skew-x--10 flex items-center gap-2">
            <div className="skew-x-10 flex items-center gap-2">
              <span className="text-emerald-500">â</span>
              <span className="italic tracking-widest">FOOTER_SECTION.NODE</span>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black italic shadow-2xl skew-x--10 text-xl mb-8">L</div>
            <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 mb-6 uppercase skew-x-[-2deg]">{logo || 'LANDO'}</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed mb-8 italic">{description}</p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-1 cursor-pointer">
                <Twitter className="w-4 h-4" />
              </div>
              <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-1 cursor-pointer">
                <Github className="w-4 h-4" />
              </div>
              <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-1 cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </div>
            </div>
          </div>

          {(links || []).map((group: any, i: number) => (
            <div key={i}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-8 italic">{group?.title}</h3>
              <ul className="space-y-4">
                {(group?.items || []).map((item: any, j: number) => (
                  <li key={j}>
                    <a className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 transition-colors cursor-pointer italic">{item?.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] italic">{copyright}</p>
          <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
             <span className="hover:text-indigo-600 transition-colors cursor-pointer">Privacy</span>
             <span className="hover:text-indigo-600 transition-colors cursor-pointer">Terms</span>
             <span className="hover:text-indigo-600 transition-colors cursor-pointer">Security</span>
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
          </motion.div>
        )}
      </AnimatePresence>
    </NodeViewWrapper>
  );
};
