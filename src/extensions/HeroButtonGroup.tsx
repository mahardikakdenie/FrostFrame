import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { cn } from '../lib/utils';
import { GripVertical } from 'lucide-react';

const HeroButtonGroupComponent = (props: any) => {
  const { node, selected } = props;
  const { primaryCTA, secondaryCTA, textAlign } = node.attrs;

  return (
    <NodeViewWrapper className={cn(
      "group/buttons relative my-8",
      textAlign === 'text-center' ? 'flex justify-center' : 'flex justify-start'
    )}>
       {/* Visual Indicator & Drag Handle */}
      <div 
        className={cn(
          "absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/buttons:opacity-100 transition-opacity z-50",
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
        "flex flex-wrap gap-4 relative transition-all duration-300 p-2",
        selected ? "ring-2 ring-indigo-500 ring-offset-4 rounded-xl" : "hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4 rounded-xl"
      )}>
        {/* Badge Label */}
        <div className={cn(
          "absolute -top-10 left-0 flex items-center gap-2 pointer-events-none transition-all duration-300",
          (selected || props.editor.isActive('heroButtonGroup')) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <span className="bg-indigo-600 text-[10px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-xl">
            BUTTONS
          </span>
        </div>
        
        <button 
          style={{ backgroundColor: primaryCTA?.color || '#0f172a' }}
          className="text-white font-mono text-xs px-8 py-4 rounded font-bold shadow-2xl hover:brightness-110 transition-all hover:-translate-y-0.5 active:translate-y-0 text-center uppercase"
        >
          {primaryCTA?.text || 'GET STARTED'}
        </button>

        <button 
          style={{ borderColor: secondaryCTA?.color || '#e2e8f0', color: secondaryCTA?.color || '#0f172a' }}
          className="bg-white border text-mono text-xs px-8 py-4 rounded font-bold hover:bg-slate-50 transition-all uppercase"
        >
          {secondaryCTA?.text || 'VIEW DEMO'}
        </button>
      </div>
    </NodeViewWrapper>
  );
};

export const HeroButtonGroup = Node.create({
  name: 'heroButtonGroup',
  group: 'heroBlock levelThreeElement',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      primaryCTA: { default: { text: 'Get Started', link: '#', color: '#0f172a' } },
      secondaryCTA: { default: { text: 'View Demo', link: '#', color: '#0f172a' } },
      textAlign: { default: 'text-left' }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="hero-button-group"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'hero-button-group' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeroButtonGroupComponent);
  },
});
