import React from 'react';
import { NodeViewProps } from '@tiptap/react';
import { Twitter, Github, Linkedin } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';

export const Footer = (props: NodeViewProps) => {
  const { node } = props;
  const { logo, description, links, copyright } = node.attrs;

  return (
    <SectionWrapper {...props} sectionName="FOOTER_SECTION.NODE" showAddPricing={false} className="py-20 px-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black italic shadow-2xl skew-x--10 text-xl mb-8">L</div>
            <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 mb-6 uppercase skew-x-[-2deg]">{logo || 'LANDO'}</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed mb-8 italic">{description}</p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-1 cursor-pointer">
                <Twitter className="w-4 h-4" />
              </div>
              <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-1 cursor-pointer">
                <Github className="w-4 h-4" />
              </div>
              <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-1 cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </div>
            </div>
          </div>

          {(links || []).map((group: any, i: number) => (
            <div key={i}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-8 italic">{group?.title}</h3>
              <ul className="space-y-4">
                {(group?.items || []).map((item: any, j: number) => (
                  <li key={j}>
                    <a className="text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 transition-colors cursor-pointer italic">{item?.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] italic">{copyright}</p>
          <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
             <span className="hover:text-indigo-600 transition-colors cursor-pointer">Privacy</span>
             <span className="hover:text-indigo-600 transition-colors cursor-pointer">Terms</span>
             <span className="hover:text-indigo-600 transition-colors cursor-pointer">Security</span>
          </div>
        </div>
    </SectionWrapper>
  );
};
