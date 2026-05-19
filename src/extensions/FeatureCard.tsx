import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Search, Smartphone, Layout, Shield, Heart } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { cn } from '../lib/utils';

const iconMap: Record<string, any> = {
  Zap, Search, Smartphone, Layout, Shield, Heart
};

const FeatureCardView = ({ node, selected }: any) => {
  const { id, icon, title, iconTransform } = node.attrs;
  const Icon = iconMap[icon] || Zap;
  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const currentIconTransform = iconTransform || 'skew-x--10';
  const innerIconTransform = currentIconTransform.includes('skew-x--') 
    ? currentIconTransform.replace('skew-x--', 'skew-x-') 
    : currentIconTransform.includes('skew-x-') 
      ? currentIconTransform.replace('skew-x-', 'skew-x--') 
      : '';

  return (
    <NodeViewWrapper onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}>
      <motion.div 
        whileHover={{ y: -5 }}
        className={`group/item p-8 bg-white transition-all hover:shadow-2xl hover:shadow-indigo-100 ${selected ? 'ring-2 ring-indigo-500 bg-indigo-50/50' : ''} ${isHovered ? 'ring-4 ring-indigo-500/40 border-indigo-500 z-50 shadow-2xl' : ''}`}
        style={{ 
          borderRadius: 'var(--border-radius)',
          borderWidth: '2px',
          borderColor: 'var(--color-slate-100)',
        }}
      >
        <div 
          className={cn("w-14 h-14 text-white flex items-center justify-center mb-8 transition-all shadow-xl", currentIconTransform)}
          style={{ 
            backgroundColor: 'var(--secondary-color)',
            borderRadius: '1rem', // Smaller fixed radius for icon container or use theme?
          }}
        >
          <div className={innerIconTransform}>
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
      iconTransform: { default: null }, // default 'skew-x--10' handled in component
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
