import React from 'react';
import { NodeViewProps } from '@tiptap/react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';
import { cn } from '../../lib/utils';

export const Pricing = (props: NodeViewProps) => {
  const { node, editor } = props;
  const { title, subtitle, billingCycle, tiers } = node.attrs;

  return (
    <SectionWrapper {...props} sectionName="PRICING_SECTION.NODE" className="bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-slate-900 mb-4 theme-headline">{title}</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{subtitle}</p>
            
            <div className="mt-8 flex items-center justify-center gap-6">
              <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] transition-colors italic", billingCycle === 'monthly' ? "text-indigo-600" : "text-slate-400")}>Monthly</span>
              <div 
                onClick={() => editor.chain().focus().updateAttributes('pricingSection', { billingCycle: billingCycle === 'monthly' ? 'annually' : 'monthly' }).run()}
                className="w-14 h-7 bg-slate-900 rounded-full relative p-1 cursor-pointer transition-colors shadow-inner"
              >
                <motion.div 
                  className="w-5 h-5 bg-white rounded-full shadow-lg"
                  initial={false}
                  animate={{ x: billingCycle === 'monthly' ? 0 : 28 }}
                />
              </div>
              <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] transition-colors italic", billingCycle === 'annually' ? "text-indigo-600" : "text-slate-400")}>Annually <span className="ml-1 text-[8px] text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">SAVE 20%</span></span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(tiers || []).map((tier: any, idx: number) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className={cn(
                  "p-12 theme-card flex flex-col relative overflow-hidden",
                  tier.badge ? "!border-indigo-500 shadow-indigo-100" : ""
                )}
              >
                <div className="theme-card-inner flex flex-col grow">
                  {tier.badge && (
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-black px-8 py-2 uppercase tracking-[0.2em] rotate-45 translate-x-8 translate-y-4 shadow-xl italic">
                        {tier.badge}
                    </div>
                  )}
                  <h3 className="text-xl font-black text-slate-900 mb-2 theme-headline">{tier.name}</h3>
                  <div className="flex items-baseline mb-8">
                    <span className="text-5xl font-black text-slate-900 theme-headline">{tier.price}</span>
                    <span className="text-slate-400 text-[10px] font-black ml-2 uppercase tracking-widest italic">/ Mo</span>
                  </div>
                  <ul className="space-y-4 mb-12 grow">
                    {tier.features.map((feature: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-center text-slate-600 text-[10px] font-black uppercase tracking-wider italic">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3 shrink-0">
                          <Check className="w-3 h-3 text-emerald-500" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={cn(
                    "w-full py-4 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em] italic skew-x--10",
                    tier.badge ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1" : "bg-slate-900 text-white hover:bg-black hover:-translate-y-1 shadow-2xl"
                  )}>
                    <div className="skew-x-10">{tier.ctaText}</div>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
    </SectionWrapper>
  );
};
