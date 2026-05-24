import React from 'react';
import { ColorPicker } from '../ColorPicker';
import { cn } from '../../../lib/utils';
import { ElementConfigProps } from './types';

export const DividerConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Visual Elements</span>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">DIVIDER LINE</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
           <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Thickness</label>
           <div className="flex gap-2 flex-wrap">
             {['1px', '2px', '4px', '8px'].map(t => (
               <button
                 key={t}
                 onClick={() => onChange('thickness', t)}
                 className={cn(
                   "px-4 py-2 text-[10px] font-black uppercase rounded-lg border transition-all",
                   (attributes.thickness || '2px') === t 
                     ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" 
                     : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-200"
                 )}
               >
                 {t}
               </button>
             ))}
           </div>
        </div>

        <div className="space-y-4">
           <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Width</label>
           <div className="flex gap-2 flex-wrap">
             {['100%', '75%', '50%', '25%'].map(w => (
               <button
                 key={w}
                 onClick={() => onChange('width', w)}
                 className={cn(
                   "px-4 py-2 text-[10px] font-black uppercase rounded-lg border transition-all",
                   (attributes.width || '100%') === w 
                     ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" 
                     : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-200"
                 )}
               >
                 {w}
               </button>
             ))}
           </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
           <ColorPicker 
             label="Divider Color" 
             value={attributes.color || 'var(--primary-color)'} 
             onChange={(color) => onChange('color', color)} 
           />
        </div>
      </div>
    </div>
  );
};
