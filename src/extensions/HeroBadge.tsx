import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { cn } from '../lib/utils';
import { GripVertical } from 'lucide-react';

const HeroBadgeComponent = (props: any) => {
  const { node, selected } = props;
  const { color, textAlign } = node.attrs;

  return (
    <NodeViewWrapper className={cn(
      "w-full group/badge relative my-2 z-10",
      textAlign === 'text-center' ? 'flex justify-center' : 'flex justify-start'
    )}>
      {/* Visual Indicator & Drag Handle */}
      <div 
        className={cn(
          "absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/badge:opacity-100 transition-opacity z-50",
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
        "relative transition-all duration-300 py-1",
        selected ? "ring-2 ring-indigo-500 ring-offset-4 rounded-lg" : "hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4 rounded-lg"
      )}>
        {/* Badge Label */}
        <div className={cn(
          "absolute -top-10 left-0 flex items-center gap-2 pointer-events-none transition-all duration-300",
          (selected || props.editor.isActive('heroBadge')) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <span className="bg-indigo-600 text-[10px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-xl">
            TOP BADGE
          </span>
        </div>

        <div 
          style={{ color: color || '#4f46e5', backgroundColor: color ? `${color}15` : '#eef2ff' }}
          className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded italic outline-none min-w-[50px] min-h-[1.5em]"
        >
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const HeroBadge = Node.create({
  name: 'heroBadge',
  group: 'heroBlock levelThreeElement',
  content: 'inline*',
  draggable: true,
  defining: true,

  addAttributes() {
    return {
      id: { default: null },
      color: { default: '#4f46e5' },
      textAlign: { default: 'text-left' }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="hero-badge"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'hero-badge' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeroBadgeComponent);
  },
});
