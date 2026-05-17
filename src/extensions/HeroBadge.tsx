import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { cn } from '../lib/utils';
import { GripVertical, Trash2 } from 'lucide-react';

const HeroBadgeComponent = (props: any) => {
  const { node, selected } = props;
  const { color, textAlign, letterSpacing, fontSizeScale } = node.attrs;

  const getFontSize = () => {
    if (fontSizeScale) return { fontSize: `${fontSizeScale}rem` };
    return {};
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this badge?')) {
      const pos = props.getPos();
      if (typeof pos === 'number') {
        props.editor.view.dispatch(props.editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  return (
    <NodeViewWrapper 
      className={cn(
        "w-full group/badge relative my-2 z-10",
        textAlign === 'text-center' ? 'flex justify-center' : 'flex justify-start'
      )}
    >
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
        {/* Badge Label & Actions */}
        <div className={cn(
          "absolute -top-10 right-0 flex flex-row-reverse items-center gap-1 transition-all duration-300",
          (selected || props.editor.isActive('heroBadge')) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <button 
            onClick={handleDelete}
            className="bg-rose-500 text-white p-0.5 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Delete Badge"
          >
             <Trash2 className="w-2.5 h-2.5" />
          </button>
          <div 
            onClick={() => { if (typeof props.getPos === 'function') props.editor.commands.setNodeSelection(props.getPos()); }}
            className="bg-indigo-600 text-[10px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20 cursor-pointer"
          >
            TOP BADGE
          </div>
        </div>

        <div 
          style={{ 
            color: color || 'var(--primary-color)', 
            backgroundColor: color ? `${color}15` : 'rgba(var(--primary-color-rgb), 0.1)',
            letterSpacing: letterSpacing || '0.2em',
            ...getFontSize()
          }}
          className="inline-block px-4 py-1.5 text-[10px] font-black uppercase rounded-lg italic outline-none min-w-[50px] min-h-[1.5em] shadow-sm skew-x--10 border border-current/10"
        >
          <div className="skew-x-10">
            <NodeViewContent />
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const HeroBadge = Node.create({
  name: 'heroBadge',
  group: 'block heroBlock levelThreeElement',
  content: 'inline*',
  draggable: true,
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      id: { default: null },
      color: { default: null }, // Fallback to primary-color via style
      textAlign: { default: 'text-left' },
      letterSpacing: { default: null },
      fontSizeScale: { default: null }
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
