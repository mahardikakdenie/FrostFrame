import React from 'react';
import { NodeViewProps } from '@tiptap/react';
import { motion } from 'framer-motion';
import { Zap, Search, Smartphone, Layout, Shield, Heart } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';
import { cn } from '../../lib/utils';

const iconMap: Record<string, any> = {
  Zap, Search, Smartphone, Layout, Shield, Heart
};

export const Features = (props: NodeViewProps) => {
  const { node } = props;
  const { title, subtitle, columns, features } = node.attrs;

  return (
    <SectionWrapper {...props} sectionName="FEATURES_SECTION.NODE" className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 relative">
            <div className="absolute -left-8 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-full skew-x--10 opacity-20" />
            <h2 className="text-5xl font-black text-slate-900 mb-4 theme-headline">
              {title || 'OUR FEATURES'}
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] max-w-xl">{subtitle || 'Unmatched performance and scalability for your business.'}</p>
            <div className="flex gap-1 mt-8">
              <div className="w-12 h-2 bg-indigo-600 rounded-full skew-x-[-20deg]" />
              <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse" />
            </div>
          </div>

          <div className={cn(
            "grid gap-12",
            columns === 2 ? "md:grid-cols-2" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3"
          )}>
            {(features || []).map((feature: any, idx: number) => {
              const Icon = iconMap[feature.icon] || Zap;
              return (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="group/item p-8 theme-card"
                >
                  <div className="theme-card-inner">
                    <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 group-hover/item:bg-indigo-600 transition-all shadow-xl skew-x--10">
                      <div className="skew-x-10">
                        <Icon className="w-7 h-7" />
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3 theme-headline">{feature.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
    </SectionWrapper>
  );
};
