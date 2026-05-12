import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../lib/utils';

export const Pricing = (props: NodeViewProps) => {
  const { node, selected, editor } = props;
  const { id: sectionId, title, subtitle, billingCycle, tiers } = node.attrs;
  const setFocusedId = useUIStore((state) => state.setFocusedId);
  const focusedId = useUIStore((state) => state.focusedId);
  const isActive = selected || focusedId === sectionId;
  const [isHovered, setIsHovered] = useState(false);

  const insertAfter = (type: string) => {
    const pos = props.getPos() + node.nodeSize;
    editor.chain().focus().insertContentAt(pos, { type }).run();
  };

  return (
    <NodeViewWrapper className="group relative">
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "py-24 px-6 bg-slate-50 transition-all cursor-pointer m-4 rounded overflow-hidden relative",
          isActive ? "ring-2 ring-indigo-500 border-2 border-indigo-500 border-dashed" : "hover:ring-2 hover:ring-slate-200"
        )}
      >
        {isActive && (
          <div className="absolute top-0 left-4 bg-indigo-500 text-white text-[9px] px-2 py-0.5 rounded-b font-black z-20">PRICING_SECTION.NODE</div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase leading-none">{title}</h2>
            <p className="text-slate-500 font-medium">{subtitle}</p>
            
            <div className="mt-8 flex items-center justify-center gap-4">
              <span className={cn("text-xs font-bold uppercase tracking-widest transition-colors", billingCycle === 'monthly' ? "text-indigo-600" : "text-slate-400")}>Monthly</span>
              <div className="w-12 h-6 bg-slate-200 rounded-full relative p-1 cursor-pointer hover:bg-slate-300 transition-colors">
                <motion.div 
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  initial={false}
                  animate={{ x: billingCycle === 'monthly' ? 0 : 24 }}
                />
              </div>
              <span className={cn("text-xs font-bold uppercase tracking-widest transition-colors", billingCycle === 'annually' ? "text-indigo-600" : "text-slate-400")}>Annually <span className="ml-1 text-[9px] text-green-500">(-20%)</span></span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(tiers || []).map((tier: any, idx: number) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className={cn(
                  "bg-white p-10 rounded shadow-sm border flex flex-col relative overflow-hidden",
                  tier.badge ? "border-indigo-500 ring-1 ring-indigo-500" : "border-slate-200"
                )}
              >
                {tier.badge && (
                   <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[8px] font-black px-4 py-1 uppercase tracking-tighter rotate-45 translate-x-4 translate-y-3">
                      {tier.badge}
                   </div>
                )}
                <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-wide italic">{tier.name}</h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-black text-slate-900">{tier.price}</span>
                  <span className="text-slate-400 text-sm font-bold ml-1 uppercase">/ MONTH</span>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {tier.features.map((feature: string, fIdx: number) => (
                    <li key={fIdx} className="flex items-center text-slate-600 text-sm font-medium">
                      <Check className="w-4 h-4 text-indigo-500 mr-3 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={cn(
                  "w-full py-3 rounded text-xs font-bold transition-all uppercase tracking-widest",
                  tier.badge ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}>
                  {tier.ctaText}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); insertAfter('strictHeroRow'); }}
              className="bg-white border border-slate-200 text-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 text-[10px] font-bold pr-3"
            >
              <Plus className="w-4 h-4" /> Add Hero
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); insertAfter('pricingSection'); }}
              className="bg-white border border-slate-200 text-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 text-[10px] font-bold pr-3"
            >
              <Plus className="w-4 h-4" /> Add Pricing
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </NodeViewWrapper>
  );
};
