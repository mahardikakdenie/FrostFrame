import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { useUIStore } from '../store/useUIStore';

const SectionGridView = ({ node }: any) => {
  const { id, columns, displayType, flexWrap } = node.attrs;
  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;
  
  let colsClass = '';
  if (displayType === 'grid') {
      colsClass = columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
  }

  const baseDisplayClass = displayType === 'flex' ? `flex ${flexWrap === 'wrap' ? 'flex-wrap' : 'flex-nowrap'}` : 'grid';

  return (
    <NodeViewWrapper className={cn(
      "transition-all duration-300 rounded-2xl",
      isHovered && "ring-4 ring-indigo-500/40 border-indigo-500 z-50 shadow-2xl transition-all duration-300"
    )}>
      <NodeViewContent 
        className={cn(
          "gap-12",
          baseDisplayClass,
          colsClass
        )} 
      />
    </NodeViewWrapper>
  );
};

export const SectionGrid = Node.create({
  name: 'sectionGrid',
  group: 'block levelFourElement',
  content: 'featureCard+',
  draggable: false,

  addAttributes() {
    return {
      id: { default: null },
      columns: { default: 3 },
      displayType: { default: 'grid' },
      flexWrap: { default: 'wrap' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="section-grid"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'section-grid' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SectionGridView);
  },
});
