import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { GripVertical, Image as ImageIcon, Trash } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

const HeroMediaComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, bgImage, bgOverlay, bgOpacity, bgPosition, bgSize, borderRadius, minHeight } = node.attrs;

  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this media container?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  return (
    <NodeViewWrapper className="group/media relative my-8" onClick={(e) => e.stopPropagation()}>
       {/* Visual Indicator & Drag Handle */}
      <div 
        className={cn(
          "absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity z-50",
          selected && "opacity-100"
        )}
      >
        <div 
          data-drag-handle
          className="p-1.5 bg-indigo-600 text-white rounded-lg cursor-grab active:cursor-grabbing shadow-lg hover:scale-110 transition-transform"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      <div 
        className={cn(
          "relative transition-all duration-300 overflow-hidden cursor-pointer min-h-[300px] flex items-center justify-center p-12",
          selected ? "ring-2 ring-indigo-500 ring-offset-4 rounded-[1.5rem]" : "hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4",
          isHovered && "ring-4 ring-indigo-500/40 border-indigo-500 z-50 shadow-2xl transition-all duration-300"
        )} 
        style={{ 
          borderRadius: borderRadius || '1.5rem',
          minHeight: minHeight || '400px'
        }}
      >
        {/* Background Image Layer */}
        {bgImage && (
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundPosition: bgPosition || 'center',
              backgroundSize: bgSize || 'cover',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}

        {/* Overlay Layer */}
        {bgOverlay && (
          <div 
            className="absolute inset-0 z-1 pointer-events-none"
            style={{
              backgroundColor: bgOverlay,
              opacity: bgOpacity !== undefined ? bgOpacity / 100 : 0.4
            }}
          />
        )}

        {/* Badge Label & Actions */}
        <div className={cn(
          "absolute -top-7 right-0 flex flex-row-reverse items-center gap-1 transition-all duration-300 z-50",
          (selected || editor.isActive('heroMedia')) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <button 
            onClick={handleDelete}
            className="bg-rose-500/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Delete Media"
          >
             <Trash className="w-3 h-3" />
          </button>
          <span className="bg-slate-900/40 backdrop-blur-md text-[10px] text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20">
            BANNER CONTAINER
          </span>
        </div>
        
        <div className="relative z-10 w-full">
          <NodeViewContent className="w-full flex flex-col items-center justify-center gap-4" />
          
          {!bgImage && node.childCount === 0 && (
            <div className="flex flex-col items-center gap-4 text-slate-400 opacity-40">
               <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-indigo-500" />
               </div>
               <div className="flex flex-col items-center gap-1 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest">Banner Backdrop</span>
                  <span className="text-[8px] font-bold uppercase tracking-tighter italic">Upload Background Image in Sidebar</span>
               </div>
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const HeroMedia = Node.create({
  name: 'heroMedia',
  group: 'block heroBlock levelThreeElement',
  content: 'block*',
  draggable: true,
  defining: true,

  addAttributes() {
    return {
      id: { default: null },
      bgImage: { default: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015' },
      bgOverlay: { default: '#0f172a' },
      bgOpacity: { default: 40 },
      bgPosition: { default: 'center' },
      bgSize: { default: 'cover' },
      borderRadius: { default: '1.5rem' },
      minHeight: { default: '400px' }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="hero-media"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'hero-media' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeroMediaComponent);
  },
});
