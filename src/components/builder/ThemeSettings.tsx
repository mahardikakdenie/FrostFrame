import React from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { Palette, Type, Square, RefreshCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ThemeSettings = () => {
  const theme = useThemeStore();

  const ColorInput = ({ label, value, onChange, id }: any) => (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">{label}</label>
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden shrink-0"
          style={{ backgroundColor: value }}
        >
          <input 
            type="color" 
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <input 
          type="text" 
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-mono uppercase focus:outline-none focus:ring-1 focus:ring-indigo-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-1">
         <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Global Design System</span>
         <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter text-left">BRAND IDENTITY</h2>
      </div>

      {/* Colors Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-3.5 h-3.5 text-indigo-500" />
          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic text-left">Global Colors</h4>
        </div>
        
        <div className="grid gap-6">
          <ColorInput label="Primary Brand Color" value={theme.primaryColor} onChange={theme.setPrimaryColor} />
          <ColorInput label="Secondary Color" value={theme.secondaryColor} onChange={theme.setSecondaryColor} />
          <ColorInput label="Accent Color" value={theme.accentColor} onChange={theme.setAccentColor} />
        </div>
      </div>

      {/* Typography Section */}
      <div className="space-y-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-3.5 h-3.5 text-indigo-500" />
          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic text-left">Typography</h4>
        </div>

        <div className="space-y-4">
           <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Heading Font Family</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                value={theme.headingFont}
                onChange={(e) => theme.setHeadingFont(e.target.value)}
              >
                <option value="Inter, sans-serif">Inter (Modern)</option>
                <option value="'JetBrains Mono', monospace">JetBrains Mono (Technical)</option>
                <option value="'Playfair Display', serif">Playfair Display (Elegant)</option>
                <option value="system-ui, sans-serif">System Default</option>
              </select>
           </div>
        </div>
      </div>

      {/* Shapes Section */}
      <div className="space-y-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <Square className="w-3.5 h-3.5 text-indigo-500" />
          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic text-left">Border Radius</h4>
        </div>

        <div className="grid grid-cols-4 gap-2 text-left">
           {[
             { id: '0px', label: 'None' },
             { id: '0.5rem', label: 'S' },
             { id: '1rem', label: 'M' },
             { id: '2rem', label: 'L' },
           ].map(radius => (
             <button
                key={radius.id}
                onClick={() => theme.setBorderRadius(radius.id)}
                className={cn(
                  "py-2 px-1 text-[10px] font-black rounded-lg border transition-all",
                  theme.borderRadius === radius.id 
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                )}
             >
                {radius.label}
             </button>
           ))}
        </div>
      </div>

      <button 
        onClick={theme.resetTheme}
        className="w-full flex items-center justify-center gap-2 py-3 mt-10 rounded-xl border border-dashed border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all"
      >
        <RefreshCcw className="w-3 h-3" />
        Reset to Defaults
      </button>
    </div>
  );
};
