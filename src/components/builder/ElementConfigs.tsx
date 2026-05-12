import React from 'react';
import { ColorPicker } from './ColorPicker';
import { cn } from '../../lib/utils';
import { Type, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Maximize2 } from 'lucide-react';

interface ElementConfigProps {
  value: any;
  onChange: (key: string, val: any) => void;
  elementPath: string;
  activeFormatting?: any;
}

export const HeadingConfig = ({ value, onChange, elementPath, activeFormatting }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};
  
  // Use current selection color if available, otherwise fallback to attribute color
  const currentColor = activeFormatting?.color || attributes.color || "#0f172a";

  const isSpecialNode = ['heroHeadline', 'heroSubheadline', 'heroBadge'].some(t => elementPath.toLowerCase().includes(t.toLowerCase()) || activeFormatting?.nodeType === t);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      {/* Body Content Sync Field */}
      {(isSpecialNode || !elementPath.includes('title')) && (
        <div className="space-y-4">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Body Content</label>
          <textarea 
            value={attributes.textContent || value?.textContent || (isObject ? value.text : value) || ''}
            onChange={(e) => onChange(isObject ? `${elementPath}.textContent` : 'textContent', e.target.value)}
            className="w-full p-4 text-xs font-bold border border-slate-200 rounded-2xl bg-white shadow-inner focus:ring-2 focus:ring-indigo-100 outline-none min-h-[100px] resize-none transition-all leading-relaxed"
            placeholder="Type your content here..."
          />
          <p className="text-[8px] text-slate-400 font-medium italic">Changes here update the canvas in real-time.</p>
        </div>
      )}

      <div className="space-y-4">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Structure & Semantics</label>
        <div className="flex gap-1.5 flex-wrap">
           {['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].map(tag => (
             <button 
               key={tag}
               onClick={() => onChange(`${elementPath}.level`, tag)}
               className={cn(
                 "px-3 py-2 text-[10px] font-black rounded-lg border transition-all uppercase",
                 (attributes.level || 'h1') === tag ? "bg-indigo-600 border-indigo-600 text-white" : "bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-200"
               )}
             >
               {tag}
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Typography Tuning</label>
        
        {/* Font Weight */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-[8px] font-black text-slate-400 uppercase italic">
            <span>Font Weight</span>
            <span className="text-indigo-500">{(attributes.fontWeight || 'font-black').replace('font-', '')}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: 'Light', value: 'font-light' },
              { label: 'Medium', value: 'font-medium' },
              { label: 'Bold', value: 'font-bold' },
              { label: 'Black', value: 'font-black' },
            ].map(w => (
              <button 
                key={w.value}
                onClick={() => onChange(`${elementPath}.fontWeight`, w.value)}
                className={cn(
                  "py-2 text-[9px] font-bold rounded-lg border transition-all",
                  (attributes.fontWeight || 'font-black') === w.value ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-400 border-slate-100 hover:border-indigo-200"
                )}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        {/* Alignment */}
        <div className="grid grid-cols-4 gap-2">
           {[
             { icon: <AlignLeft className="w-3 h-3" />, value: 'text-left' },
             { icon: <AlignCenter className="w-3 h-3" />, value: 'text-center' },
             { icon: <AlignRight className="w-3 h-3" />, value: 'text-right' },
           ].map(item => (
             <button 
               key={item.value} 
               onClick={() => onChange(`${elementPath}.textAlign`, item.value)}
               className={cn(
                 "p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all border",
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
        onChange={(color) => onChange(`${elementPath}.color`, color)} 
      />
    </div>
  );
};

export const ButtonConfig = ({ value, onChange, elementPath }: ElementConfigProps) => {
  // Check if we are editing the text or the whole button object
  const isObject = typeof value === 'object' && value !== null;
  const labelText = isObject ? value.text : value;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="space-y-4">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Button Label</label>
        <input 
          type="text"
          value={labelText}
          onChange={(e) => onChange(isObject ? `${elementPath}.text` : elementPath, e.target.value)}
          className="w-full px-4 py-3 text-xs font-bold border border-slate-200 rounded-xl bg-white shadow-inner focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
        />
      </div>

      <div className="space-y-4">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Button Style</label>
        <div className="space-y-3">
           {['Solid Fill', 'Outline Border', 'Glass Subtle'].map(style => (
             <button 
               key={style}
               className={cn(
                 "w-full p-3 text-[10px] font-black uppercase italic tracking-tighter border rounded-xl flex items-center justify-between group transition-all",
                 style === 'Solid Fill' ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300"
               )}
             >
               {style}
               {style === 'Solid Fill' && <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />}
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Link Target</label>
        <div className="relative">
          <input 
            type="text" 
            placeholder="https://..."
            className="w-full pl-9 pr-4 py-3 text-[10px] font-mono border border-slate-200 rounded-xl bg-slate-50 outline-none"
          />
          <Maximize2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      <ColorPicker 
        label="Accent Color" 
        value={isObject && value.color ? value.color : "#4f46e5"} 
        onChange={(color) => onChange(`${elementPath}.color`, color)} 
      />
    </div>
  );
};
