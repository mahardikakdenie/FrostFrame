import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { ColorPicker } from '../ColorPicker';
import { cn } from '../../../lib/utils';
import { ElementConfigProps } from './types';

export const ParagraphConfig = ({ value, onChange, elementPath, activeFormatting }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};
  const currentColor = activeFormatting?.color || attributes.color || "#64748b";
  const getPath = (key: string) => elementPath ? `${elementPath}.${key}` : key;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Typography</span>
        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">PARAGRAPH</h2>
      </div>

      <div className="space-y-4">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Body Content</label>
        <textarea 
          value={attributes.textContent || value?.textContent || (isObject ? value.text : value) || ''}
          onChange={(e) => onChange(isObject ? getPath('textContent') : 'textContent', e.target.value)}
          className="w-full p-4 text-xs font-bold border border-slate-200 rounded-2xl bg-white shadow-inner focus:ring-2 focus:ring-indigo-100 outline-none min-h-[100px] resize-none transition-all leading-relaxed"
          placeholder="Type your paragraph content here..."
        />
        <p className="text-[8px] text-slate-400 font-medium italic text-left">Changes here update the canvas in real-time.</p>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-100">
        <div className="space-y-3">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Alignment</label>
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
                  (attributes.textAlign || 'text-left') === item.value ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm" : "bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-200"
                )}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>

        <ColorPicker 
          label="Text Color" 
          value={currentColor} 
          onChange={(color) => onChange(getPath('color'), color)} 
        />
      </div>
    </div>
  );
};
