import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { cn } from '../lib/utils';
import { GripVertical } from 'lucide-react';

const HeroSubheadlineComponent = (props: any) => {
  const { node, selected } = props;
  const { fontWeight, lineHeight, textAlign, color, letterSpacing, fontSizeScale } = node.attrs;

  const getFontSize = () => {
    if (fontSizeScale) return { fontSize: `${fontSizeScale}rem` };
    return {};
  };

  return (
    <NodeViewWrapper className="group/subheadline relative my-4">
      {/* Visual Indicator & Drag Handle */}
      <div 
        className={cn(
          "absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/subheadline:opacity-100 transition-opacity z-50",
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
        selected ? "ring-2 ring-indigo-500 ring-offset-6 rounded-lg" : "hover:ring-2 hover:ring-indigo-100 hover:ring-offset-6 rounded-lg"
      )}>
        {/* Badge Label */}
        <div className={cn(
          "absolute -top-8 left-0 flex items-center gap-2 pointer-events-none transition-all duration-300",
          (selected || props.editor.isActive('heroSubheadline')) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <span className="bg-slate-700 text-[10px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-lg">
            SUBTITLE
          </span>
        </div>

        <div 
          style={{ 
            color: color || '#64748b',
            letterSpacing: letterSpacing || '0.1em',
            ...getFontSize()
          }}
          className={cn(
            "text-sm leading-relaxed font-black max-w-lg transition-all duration-300 outline-none min-h-[1.5em] uppercase opacity-80",
            fontWeight,
            lineHeight,
            textAlign
          )}
        >
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const HeroSubheadline = Node.create({
  name: 'heroSubheadline',
  group: 'block heroBlock levelThreeElement',
  content: 'inline*',
  draggable: true,
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      id: { default: null },
      fontWeight: { default: 'font-medium' },
      lineHeight: { default: 'leading-relaxed' },
      textAlign: { default: 'text-left' },
      color: { default: '#64748b' },
      letterSpacing: { default: null },
      fontSizeScale: { default: null }
    };
  },

  parseHTML() {
    return [{ tag: 'p[data-type="hero-subheadline"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes, { 'data-type': 'hero-subheadline' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeroSubheadlineComponent);
  },
});
