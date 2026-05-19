import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { cn } from '../lib/utils';

import { useUIStore } from '../store/useUIStore';

const SectionComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { background, padding, id } = node.attrs;

  const focusedId = useUIStore(state => state.focusedId);
  const selectionPath = useUIStore(state => state.selectionPath);
  const hoveredId = useUIStore(state => state.hoveredId);
  
  const isFocused = focusedId === id;
  const isHovered = hoveredId === id;
  const isAncestorOfFocus = selectionPath.some(item => item.id === id) && !isFocused;

  const handleSelectNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  return (
    <NodeViewWrapper 
      className="group/section relative w-full"
      style={{ margin: 'var(--section-margin)' }}
    >
      {/* 🚀 ADAPTIVE FOCUS: Hide section label if child is focused */}
      {(selected && !isAncestorOfFocus) && (
        <div 
          onClick={handleSelectNode}
          className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900/60 backdrop-blur-md text-[9px] text-white px-4 py-1 rounded-full font-black uppercase tracking-[0.2em] z-50 shadow-xl border border-white/10 cursor-pointer"
        >
          Layout Section
        </div>
      )}
      
      <section 
        onClick={handleSelectNode}
        style={{ padding: padding === 'py-24' ? 'var(--section-padding)' : undefined }}
        className={cn(
          "w-full transition-all duration-300 relative",
          background || 'bg-white',
          padding !== 'py-24' && padding,
          // 🚀 ADAPTIVE FOCUS: Dampen rings if child is focused
          isFocused ? "ring-4 ring-indigo-500/20 ring-inset shadow-2xl" : (isAncestorOfFocus ? "" : "hover:ring-2 hover:ring-indigo-100 ring-inset"),
          isHovered && "ring-4 ring-indigo-500/40 border-indigo-500 z-50 shadow-2xl"
        )}
      >
        <div className="w-full h-full">
          <NodeViewContent />
        </div>
      </section>
    </NodeViewWrapper>
  );
};

export const LayoutSection = Node.create({
  name: 'layoutSection',
  group: 'block',
  content: 'layoutRow+',
  draggable: true,
  defining: true,

  addAttributes() {
    return {
      id: { 
        default: null,
        parseHTML: element => element.getAttribute('data-id') || crypto.randomUUID(),
        renderHTML: attributes => ({ 'data-id': attributes.id })
      },
      background: { default: 'bg-white' },
      padding: { default: 'py-24' },
      layout: { default: 'full-width' }
    };
  },

  parseHTML() {
    return [{ tag: 'section[data-type="layout-section"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['section', mergeAttributes(HTMLAttributes, { 'data-type': 'layout-section' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SectionComponent);
  },
});
