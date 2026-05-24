import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { useUIStore } from '../store/useUIStore';

const SectionGridView = ({ node }: any) => {
  const { id, columns, displayType, flexWrap } = node.attrs;
  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;
  
  let layoutClass = '';
  if (displayType === 'grid') {
      layoutClass = cn("grid gap-12", columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3");
  } else if (displayType === 'bento') {
      layoutClass = "grid grid-cols-1 md:grid-cols-4 grid-rows-[repeat(2,minmax(250px,auto))] gap-6";
  } else {
      layoutClass = cn("flex gap-12", flexWrap === 'wrap' ? 'flex-wrap' : 'flex-nowrap');
  }

  return (
    <NodeViewWrapper className={cn(
      "transition-all duration-300 rounded-2xl",
      isHovered && "ring-4 ring-indigo-500/40 border-indigo-500 z-50 shadow-2xl transition-all duration-300"
    )}>
      <NodeViewContent 
        className={layoutClass} 
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
      displayType: { default: 'grid' }, // 'grid' | 'flex' | 'bento'
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
