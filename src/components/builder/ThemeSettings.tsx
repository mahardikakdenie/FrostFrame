import React from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { Palette, Type, Square, RefreshCcw, Maximize } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ThemeSettings = () => {
  const theme = useThemeStore();

  const ColorInput = ({ label, value, onChange, id }: any) => (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic">{label}</label>
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden shrink-0"
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
          className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-[10px] font-mono uppercase text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
         <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter text-left">BRAND IDENTITY</h2>
      </div>

      {/* 🚀 NEW: Theme Presets Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCcw className="w-3.5 h-3.5 text-indigo-500" />
          <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Theme Presets</h4>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'frosted', label: 'Frosted Glass' },
            { id: 'genz', label: 'Modern Gen-Z' },
            { id: 'bootstrap', label: 'Corporate (BS)' },
            { id: 'material', label: 'Material UI' },
          ].map(preset => (
            <button
              key={preset.id}
              onClick={() => theme.applyThemePreset(preset.id)}
              className={cn(
                "p-3 rounded-xl border-2 text-[8px] font-black uppercase tracking-widest transition-all text-center",
                theme.activeTheme === preset.id 
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" 
                  : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-indigo-200"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-3.5 h-3.5 text-indigo-500" />
          <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Global Colors</h4>
        </div>
        
        <div className="grid gap-6">
          <ColorInput label="Primary Brand Color" value={theme.primaryColor} onChange={theme.setPrimaryColor} />
          <ColorInput label="Secondary Color" value={theme.secondaryColor} onChange={theme.setSecondaryColor} />
          <ColorInput label="Accent Color" value={theme.accentColor} onChange={theme.setAccentColor} />
        </div>
      </div>

      {/* Spacing Section */}
      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-left">
        <div className="flex items-center gap-2 mb-4">
          <Maximize className="w-3.5 h-3.5 text-indigo-500" />
          <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Section Spacing</h4>
        </div>

        <div className="space-y-6">
           <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic">Vertical Margin</label>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">{theme.sectionMargin}</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" step="4"
                className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                value={parseInt(theme.sectionMargin) || 0}
                onChange={(e) => theme.setSectionMargin(`${e.target.value}px`)}
              />
           </div>

           <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic">Vertical Padding</label>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">{theme.sectionPadding}</span>
              </div>
              <input 
                type="range" 
                min="0" max="200" step="8"
                className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                value={parseInt(theme.sectionPadding) || 0}
                onChange={(e) => theme.setSectionPadding(`${e.target.value}px 1.5rem`)}
              />
           </div>
        </div>
      </div>

      {/* Typography Section */}
      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-3.5 h-3.5 text-indigo-500" />
          <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Typography</h4>
        </div>

        <div className="space-y-4">
           <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Heading Font Family</label>
              <select 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
                value={theme.headingFont}
                onChange={(e) => theme.setHeadingFont(e.target.value)}
              >
                <option value="Outfit, Inter, sans-serif">Outfit (Premium)</option>
                <option value="Inter, sans-serif">Inter (Modern)</option>
                <option value="'JetBrains Mono', monospace">JetBrains Mono (Technical)</option>
                <option value="'Playfair Display', serif">Playfair Display (Elegant)</option>
                <option value="system-ui, sans-serif">System Default</option>
              </select>
           </div>
        </div>
      </div>

      {/* Shapes Section */}
      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Square className="w-3.5 h-3.5 text-indigo-500" />
          <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Border Radius</h4>
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
                    ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400" 
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                )}
             >
                {radius.label}
             </button>
           ))}
        </div>
      </div>

      <button 
        onClick={theme.resetTheme}
        className="w-full flex items-center justify-center gap-2 py-3 mt-10 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
      >
        <RefreshCcw className="w-3 h-3" />
        Reset to Defaults
      </button>
    </div>
  );
};
