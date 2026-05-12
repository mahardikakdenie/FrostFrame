import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { cn } from '../lib/utils';
import { GripVertical, Image as ImageIcon } from 'lucide-react';

const HeroMediaComponent = (props: any) => {
  const { node, selected } = props;
  const { url, alt, borderRadius } = node.attrs;

  return (
    <NodeViewWrapper className="group/media relative my-8">
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

      <div className={cn(
        "relative transition-all duration-300 overflow-hidden",
        selected ? "ring-2 ring-indigo-500 ring-offset-4" : "hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4"
      )} style={{ borderRadius: borderRadius || '1rem' }}>
        {/* Badge Label */}
        <div className={cn(
          "absolute top-4 left-4 flex items-center gap-2 pointer-events-none transition-all duration-300 z-20",
          (selected || props.editor.isActive('heroMedia')) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <span className="bg-indigo-600 text-[10px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-xl">
            IMAGE / MEDIA
          </span>
        </div>
        
        {url ? (
          <img 
            src={url} 
            alt={alt || 'Hero Media'} 
            className="w-full h-auto object-cover shadow-2xl"
            style={{ borderRadius: borderRadius || '1rem' }}
          />
        ) : (
          <div className="w-full aspect-video bg-slate-100 flex flex-col items-center justify-center gap-4 text-slate-400">
             <ImageIcon className="w-12 h-12" />
             <span className="text-[10px] font-black uppercase tracking-widest">Placeholder Image</span>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export const HeroMedia = Node.create({
  name: 'heroMedia',
  group: 'heroBlock levelThreeElement',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      url: { default: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015' },
      alt: { default: 'App Screenshot' },
      borderRadius: { default: '1.5rem' }
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
