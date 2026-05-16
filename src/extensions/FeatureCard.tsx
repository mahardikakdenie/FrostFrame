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
        whileHover={{ y: -5 }}
        className={`group/item p-8 rounded-[2rem] border-2 border-slate-100 bg-white transition-all hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-100 ${selected ? 'ring-2 ring-indigo-500 bg-indigo-50/50' : ''}`}
      >
        <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 group-hover/item:bg-indigo-600 transition-all shadow-xl skew-x--10">
          <div className="skew-x-10">
            <Icon className="w-7 h-7" />
          </div>
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
