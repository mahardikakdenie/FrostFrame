import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { cn } from '../lib/utils';

const SectionComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { background, padding, id } = node.attrs;

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
      {selected && (
        <div 
          onClick={handleSelectNode}
          className="absolute -top-8 left-4 bg-indigo-500 text-[10px] text-white px-3 py-1 rounded-full font-black uppercase tracking-widest z-50 shadow-xl border-2 border-white cursor-pointer"
        >
          Section
        </div>
      )}
      
      <section 
        onClick={handleSelectNode}
        style={{ padding: padding === 'py-24' ? 'var(--section-padding)' : undefined }}
        className={cn(
          "w-full transition-all duration-300 relative",
          background || 'bg-white',
          padding !== 'py-24' && padding,
          selected ? "ring-4 ring-indigo-500 ring-inset" : "hover:ring-2 hover:ring-indigo-100 ring-inset"
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
      id: { default: null },
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
