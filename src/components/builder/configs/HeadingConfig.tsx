import React from 'react';
import { TextQuote, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { ColorPicker } from '../ColorPicker';
import { cn } from '../../../lib/utils';
import { useUIStore } from '../../../store/useUIStore';
import { ResponsiveLabel } from '../ResponsiveConfig';
import { ElementConfigProps } from './types';

export const HeadingConfig = ({ value, onChange, elementPath, activeFormatting }: ElementConfigProps) => {
  const activeDevice = useUIStore(state => state.activeDevice);
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};
  
  const currentColor = activeFormatting?.color || attributes.color || "#0f172a";
  const getPath = (key: string) => elementPath ? `${elementPath}.${key}` : key;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="space-y-4">
        <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic">Body Content</label>
        <textarea 
          value={attributes.textContent || value?.textContent || (isObject ? value.text : value) || ''}
          onChange={(e) => onChange(isObject ? getPath('textContent') : 'textContent', e.target.value)}
          className="w-full p-4 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-inner focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none min-h-[100px] resize-none transition-all leading-relaxed"
          placeholder="Type your content here..."
        />
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <TextQuote className="w-3.5 h-3.5 text-indigo-500" />
          <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Typography Details</h4>
        </div>

        <div className="space-y-4">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Structure</label>
          <div className="flex gap-1.5 flex-wrap">
            {['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].map(tag => (
              <button 
                key={tag}
                onClick={() => onChange(getPath('level'), tag)}
                className={cn(
                  "px-3 py-2 text-[10px] font-black rounded-lg border transition-all uppercase",
                  (attributes.level || 'h1') === tag 
                    ? "bg-indigo-600 border-indigo-600 text-white" 
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-indigo-200 dark:hover:border-indigo-500/30"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Font Weight</label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'L', value: 'font-light' },
              { label: 'M', value: 'font-medium' },
              { label: 'B', value: 'font-bold' },
              { label: 'X', value: 'font-black' },
            ].map(w => (
              <button 
                key={w.value}
                onClick={() => onChange(getPath('fontWeight'), w.value)}
                className={cn(
                  "py-2 text-[10px] font-bold rounded-lg border transition-all",
                  (attributes.fontWeight || 'font-black') === w.value 
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100" 
                    : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/30"
                )}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
           <ResponsiveLabel>Font Size (rem)</ResponsiveLabel>
           <div className="space-y-2">
              <input 
                type="range" 
                min="1" max="10" step="0.5"
                className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                value={attributes.fontSizeScale || 4}
                onChange={(e) => onChange(getPath('fontSizeScale'), parseFloat(e.target.value))}
              />
           </div>
        </div>

        <div className="space-y-3">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Alignment</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <AlignLeft className="w-3.5 h-3.5" />, value: 'text-left' },
              { icon: <AlignCenter className="w-3.5 h-3.5" />, value: 'text-center' },
              { icon: <AlignRight className="w-3.5 h-3.5" />, value: 'text-right' },
            ].map(item => (
              <button 
                key={item.value} 
                onClick={() => onChange(getPath('textAlign'), item.value)}
                className={cn(
                  "p-3 rounded-xl flex flex-col items-center justify-center transition-all border",
                  (attributes.textAlign || 'text-left') === item.value 
                    ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-indigo-200 dark:hover:border-indigo-500/30"
                )}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
        <ColorPicker 
          label="Text Color" 
          value={currentColor} 
          onChange={(color) => onChange(getPath('color'), color)} 
        />
      </div>
    </div>
  );
};
