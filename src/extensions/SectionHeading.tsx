import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { useUIStore } from '../store/useUIStore';

const SectionHeadingView = ({ node }: any) => {
  const { id } = node.attrs;
  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  return (
    <NodeViewWrapper className={cn(
      "mb-24 relative transition-all duration-300 rounded-xl",
      isHovered && "ring-4 ring-indigo-500/40 border-indigo-500 z-50 shadow-2xl transition-all duration-300"
    )}>
      <div className="absolute -left-8 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-full skew-x--10 opacity-20" />
      <NodeViewContent className="section-heading-content" />
      <div className="flex gap-1 mt-8">
        <div className="w-12 h-2 bg-indigo-600 rounded-full skew-x-[-20deg]" />
        <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse" />
      </div>
    </NodeViewWrapper>
  );
};

export const SectionHeading = Node.create({
  name: 'sectionHeading',
  group: 'block levelFourElement',
  content: 'heroHeadline heroSubheadline',
  draggable: false,
  selectable: true,

  addAttributes() {
    return {
      id: { default: null }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="section-heading"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'section-heading' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SectionHeadingView);
  },
});
