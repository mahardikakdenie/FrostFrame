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
  const { id, icon, title, iconTransform, gridColumn, gridRow } = node.attrs;
  const Icon = iconMap[icon] || Zap;
  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const currentIconTransform = iconTransform || ''; // Remove brutalist default skew

  return (
    <NodeViewWrapper 
      className={cn(
        "h-full",
        gridColumn && `md:${gridColumn}`,
        gridRow && `md:${gridRow}`
      )}
      onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
    >
      <motion.div 
        whileHover={{ y: -5, scale: 1.01 }}
        className={cn(
          "group/item p-8 bg-white/70 backdrop-blur-xl transition-all h-full flex flex-col justify-center",
          selected ? 'ring-2 ring-indigo-500 bg-indigo-50/50' : 'border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]',
          isHovered ? 'ring-4 ring-indigo-500/40 border-indigo-500 z-50 shadow-2xl' : ''
        )}
        style={{ 
          borderRadius: 'var(--border-radius)',
        }}
      >
        <div 
          className={cn("w-14 h-14 text-white flex items-center justify-center mb-8 transition-all shadow-lg", currentIconTransform)}
          style={{ 
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            borderRadius: '1.25rem',
          }}
        >
          <Icon className="w-7 h-7" />
        </div>
        <NodeViewContent className="feature-card-content" />
      </motion.div>
    </NodeViewWrapper>
  );
};

export const FeatureCard = Node.create({
  name: 'featureCard',
  group: 'block levelFourElement',
  content: 'heroHeadline heroSubheadline', 
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      icon: { default: 'Zap' },
      iconTransform: { default: null },
      gridColumn: { default: 'col-span-1' },
      gridRow: { default: 'row-span-1' },
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
