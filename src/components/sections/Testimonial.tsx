import React from 'react';
import { NodeViewProps } from '@tiptap/react';
import { Star, Quote } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';
import { cn } from '../../lib/utils';

export const Testimonial = (props: NodeViewProps) => {
  const { node } = props;
  const { quote, author, rating, logos } = node.attrs;

  return (
    <SectionWrapper {...props} sectionName="TESTIMONIAL.NODE" className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-10 transform -translate-y-4">
             <Quote className="w-32 h-32 text-indigo-400 rotate-180" />
          </div>
          
          <div className="flex justify-center gap-1.5 mb-12">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={cn("w-6 h-6 rounded-lg flex items-center justify-center skew-x--10", i < rating ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-slate-800")}>
                <Star className={cn("w-3 h-3 skew-x-10", i < rating ? "text-white fill-white" : "text-slate-600")} />
              </div>
            ))}
          </div>

          <blockquote className="text-4xl md:text-5xl mb-16 theme-headline !italic">
            "{quote || 'This is an amazing product.'}"
          </blockquote>

          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-indigo-600 rounded-2xl rotate-6 -z-10" />
              <img 
                src={author?.avatar} 
                className="w-20 h-20 rounded-2xl border-4 border-slate-900 shadow-2xl object-cover -rotate-3 hover:rotate-0 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="font-black uppercase tracking-[0.2em] text-sm italic text-indigo-500">{author?.name || 'Jane Doe'}</div>
            <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 italic">{author?.role || 'CEO'}</div>
          </div>

          <div className="mt-32 pt-16 border-t border-slate-800/50 flex flex-wrap justify-center gap-16 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
             {(logos || []).map((logo: string, i: number) => (
               <span key={i} className="font-black text-2xl italic tracking-tighter uppercase skew-x-[-5deg]">{logo}</span>
             ))}
          </div>
        </div>
    </SectionWrapper>
  );
};
