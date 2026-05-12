import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';

const SectionHeadingView = () => {
  return (
    <NodeViewWrapper className="mb-20">
      <NodeViewContent className="section-heading-content" />
      <div className="w-12 h-1 bg-indigo-600 mt-6 rounded-full" />
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
