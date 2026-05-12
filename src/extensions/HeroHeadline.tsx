import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { cn } from '../lib/utils';
import { GripVertical } from 'lucide-react';

const HeroHeadlineComponent = (props: any) => {
  const { node, selected } = props;
  const { level, fontWeight, lineHeight, textAlign, color } = node.attrs;

  return (
    <NodeViewWrapper className="group/headline relative my-4">
      {/* Visual Indicator & Drag Handle */}
      <div 
        className={cn(
          "absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/headline:opacity-100 transition-opacity z-50",
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
        "relative transition-all duration-300",
        selected ? "ring-2 ring-indigo-500 ring-offset-8 rounded-lg" : "hover:ring-2 hover:ring-indigo-200 hover:ring-offset-8 rounded-lg"
      )}>
        {/* Badge Label */}
        <div className={cn(
          "absolute -top-10 left-0 flex items-center gap-2 pointer-events-none transition-all duration-300",
          (selected || props.editor.isActive('heroHeadline')) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <span className="bg-indigo-600 text-[10px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20">
            HEADLINE {level?.toUpperCase()}
          </span>
          {selected && (
            <span className="bg-slate-900/10 backdrop-blur-md text-[8px] text-slate-500 px-2 py-1 rounded-full font-bold uppercase tracking-tight">
              Editing
            </span>
          )}
        </div>

        <div 
          style={{ color: color || 'inherit' }}
          className={cn(
            "outline-none transition-all duration-300 min-h-[1em]",
            fontWeight || 'font-black',
            lineHeight || 'leading-tight',
            textAlign || 'text-left',
            level === 'h1' && "text-6xl tracking-tighter uppercase",
            level === 'h2' && "text-5xl tracking-tight uppercase",
            level === 'h3' && "text-4xl tracking-tight uppercase",
            level === 'h4' && "text-3xl tracking-tight",
            level === 'h5' && "text-2xl tracking-normal",
            level === 'h6' && "text-xl tracking-normal",
            level === 'p' && "text-xl font-medium text-slate-500"
          )}
        >
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const HeroHeadline = Node.create({
  name: 'heroHeadline',
  group: 'heroBlock levelThreeElement',
  content: 'inline*',
  draggable: true,
  defining: true,

  addAttributes() {
    return {
      id: { default: null },
      level: { default: 'h1' },
      fontWeight: { default: 'font-black' },
      lineHeight: { default: 'leading-[0.95]' },
      textAlign: { default: 'text-left' },
      color: { default: '#0f172a' }
    };
  },

  parseHTML() {
    return [
      { tag: 'h1[data-type="hero-headline"]' },
      { tag: 'h2[data-type="hero-headline"]' },
      { tag: 'p[data-type="hero-headline"]' },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [node.attrs.level || 'h1', mergeAttributes(HTMLAttributes, { 'data-type': 'hero-headline' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeroHeadlineComponent);
  },
});
