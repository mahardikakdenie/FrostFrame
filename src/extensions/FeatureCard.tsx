import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Search, Smartphone, Layout, Shield, Heart } from 'lucide-react';

const iconMap: Record<string, any> = {
  Zap, Search, Smartphone, Layout, Shield, Heart
};

const FeatureCardView = ({ node, selected }: any) => {
  const { icon, title } = node.attrs;
  const Icon = iconMap[icon] || Zap;

  return (
    <NodeViewWrapper>
      <motion.div 
        whileHover={{ x: 5 }}
        className={`group/item p-4 rounded-xl transition-all ${selected ? 'ring-2 ring-indigo-500 bg-indigo-50/50' : ''}`}
      >
        <div className="w-12 h-12 bg-slate-50 rounded flex items-center justify-center text-indigo-600 mb-6 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all shadow-sm border border-slate-100">
          <Icon className="w-6 h-6" />
        </div>
        <NodeViewContent className="feature-card-content" />
      </motion.div>
    </NodeViewWrapper>
  );
};

export const FeatureCard = Node.create({
  name: 'featureCard',
  group: 'block levelFourElement',
  content: 'heroHeadline heroSubheadline', // Using existing headline/subheadline for internal content
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      icon: { default: 'Zap' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="feature-card"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'feature-card' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FeatureCardView);
  },
});
