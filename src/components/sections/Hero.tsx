import React from 'react';
import { NodeViewProps, NodeViewContent } from '@tiptap/react';
import { motion } from 'framer-motion';
import { SectionWrapper } from './SectionWrapper';

export const Hero = (props: NodeViewProps) => {
  const { node } = props;
  
  return (
    <SectionWrapper {...props} sectionName="HERO_SECTION.NODE" className="min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />
          <div className="absolute right-0 top-0 w-1/2 h-full bg-indigo-600/5 skew-x--10 translate-x-12" />
        </div>

        <div className="relative z-10 text-left p-12 w-full max-w-7xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-content-stack w-full"
          >
            <NodeViewContent className="hero-section-children w-full" />
          </motion.div>
        </div>
    </SectionWrapper>
  );
};
