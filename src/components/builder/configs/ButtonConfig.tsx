import React from 'react';
import { Plus, Trash2, ExternalLink, Type, Palette, Layout, Settings2 } from 'lucide-react';
import { ElementConfigProps } from './types';
import { cn } from '../../../lib/utils';
import { ColorPicker } from '../ColorPicker';

export const ButtonConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const isGroup = Array.isArray(value?.buttons);
  const buttons = isGroup ? value.buttons : [];

  const updateButton = (index: number, key: string, val: any) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], [key]: val };
    onChange('buttons', newButtons);
  };

  const addButton = () => {
    const newButtons = [...buttons, { text: 'NEW BUTTON', link: '#', color: null, variant: 'secondary' }];
    onChange('buttons', newButtons);
  };

  const removeButton = (index: number) => {
    const newButtons = buttons.filter((_: any, i: number) => i !== index);
    onChange('buttons', newButtons);
  };

  if (isGroup) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
        <div className="flex items-center justify-between">
           <div className="flex flex-col gap-1 text-left">
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Action Set</span>
             <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">BUTTON GROUP</h2>
           </div>
           <button onClick={addButton} className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
             <Plus className="w-5 h-5" />
           </button>
        </div>

        <div className="space-y-6">
          {buttons.map((btn: any, idx: number) => (
            <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-6 relative group">
               <button 
                 onClick={() => removeButton(idx)}
                 className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
               >
                 <Trash2 className="w-3.5 h-3.5" />
               </button>

               <div className="space-y-4">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Label & Link</label>
                  <div className="space-y-3">
                    <div className="relative">
                      <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                        value={btn.text}
                        onChange={(e) => updateButton(idx, 'text', e.target.value)}
                        placeholder="Button Text"
                      />
                    </div>
                    <div className="relative">
                      <ExternalLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                        value={btn.link}
                        onChange={(e) => updateButton(idx, 'link', e.target.value)}
                        placeholder="Destination URL"
                      />
                    </div>
                  </div>
               </div>

               <div className="space-y-4 pt-4 border-t border-slate-100">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Appearance</label>
                  <div className="flex bg-white p-1 rounded-xl border border-slate-100">
                    <button 
                      onClick={() => updateButton(idx, 'variant', 'primary')}
                      className={cn(
                        "flex-1 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all",
                        btn.variant === 'primary' ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:bg-slate-50"
                      )}
                    >Solid</button>
                    <button 
                      onClick={() => updateButton(idx, 'variant', 'secondary')}
                      className={cn(
                        "flex-1 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all",
                        btn.variant === 'secondary' ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:bg-slate-50"
                      )}
                    >Outline</button>
                  </div>
                  <ColorPicker 
                    label="Custom Color"
                    value={btn.color || ''} 
                    onChange={(color) => updateButton(idx, 'color', color)} 
                  />
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Standalone ButtonElement Config
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1 italic">Single Action</span>
        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">BUTTON CONFIG</h2>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <div className="space-y-3">
             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Button Label</label>
             <div className="relative">
                <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white"
                  value={value.text || ''}
                  onChange={(e) => onChange('text', e.target.value)}
                  placeholder="Enter text..."
                />
             </div>
          </div>

          <div className="space-y-3">
             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Link URL</label>
             <div className="relative">
                <ExternalLink className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white"
                  value={value.link || ''}
                  onChange={(e) => onChange('link', e.target.value)}
                  placeholder="https://..."
                />
             </div>
          </div>
        </div>

        {/* Style Settings */}
        <div className="space-y-6 pt-8 border-t border-slate-100">
           <div className="space-y-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Design Style</label>
              <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => onChange('variant', 'primary')}
                  className={cn(
                    "py-2 text-[10px] font-black uppercase italic rounded-lg transition-all",
                    value.variant === 'primary' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                  )}
                >Primary Solid</button>
                <button 
                  onClick={() => onChange('variant', 'secondary')}
                  className={cn(
                    "py-2 text-[10px] font-black uppercase italic rounded-lg transition-all",
                    value.variant === 'secondary' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                  )}
                >Outline Style</button>
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Button Size</label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {['sm', 'md', 'lg'].map(s => (
                  <button 
                    key={s}
                    onClick={() => onChange('size', s)}
                    className={cn(
                      "flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all",
                      value.size === s ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                    )}
                  >{s}</button>
                ))}
              </div>
           </div>

           <ColorPicker 
              label="Custom Brand Color"
              value={value.color || ''} 
              onChange={(color) => onChange('color', color)} 
           />
        </div>

        {/* Layout Settings */}
        <div className="space-y-6 pt-8 border-t border-slate-100">
           <div className="space-y-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Sizing Mode</label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => onChange('width', 'auto')}
                  className={cn(
                    "flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all",
                    value.width !== 'full' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                  )}
                >Auto Width</button>
                <button 
                  onClick={() => onChange('width', 'full')}
                  className={cn(
                    "flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all",
                    value.width === 'full' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                  )}
                >Full Width</button>
              </div>
           </div>
           
           <div className="space-y-3 text-left">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Corner Radius</label>
                <span className="text-[10px] font-bold text-indigo-600">{value.borderRadius || '0.75rem'}</span>
              </div>
              <input 
                type="range" 
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                min="0" max="3" step="0.25"
                value={parseFloat(value.borderRadius?.replace('rem', '')) || 0.75}
                onChange={(e) => onChange('borderRadius', `${e.target.value}rem`)}
              />
           </div>
        </div>
      </div>
    </div>
  );
};
