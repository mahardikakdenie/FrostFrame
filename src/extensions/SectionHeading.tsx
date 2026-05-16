import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';

const SectionHeadingView = () => {
  return (
    <NodeViewWrapper className="mb-24 relative">
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
