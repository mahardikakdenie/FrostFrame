import React from 'react';
import { 
  Star, 
  Search, 
  HelpCircle, 
  Layout, 
  Zap, 
  Shield, 
  Heart, 
  Sparkles, 
  Smile, 
  CheckCircle2, 
  Info,
  Type,
  Maximize2,
  Sliders,
  ShieldAlert,
  Layers,
  Sun,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ColorPicker } from '../ColorPicker';
import { cn } from '../../../lib/utils';
import { useUIStore } from '../../../store/useUIStore';
import { ResponsiveLabel, updateResponsiveValue } from '../ResponsiveConfig';
import { ElementConfigProps } from './types';

const POPULAR_ICONS = [
  'Star', 'Zap', 'Heart', 'Shield', 'CheckCircle2', 'Info', 'Sparkles', 'Smile', 
  'Award', 'Bell', 'Bookmark', 'Cloud', 'Code', 'Coffee', 'Cpu', 'Crown', 
  'Flag', 'Flashlight', 'Gift', 'Globe', 'HelpCircle', 'Home', 'Key', 'Layers', 
  'LifeBuoy', 'Lock', 'Mail', 'MapPin', 'Moon', 'Music', 'Package', 'Phone', 
  'Play', 'Rocket', 'Send', 'Settings', 'Share2', 'ShoppingBag', 'Tag', 
  'Target', 'ThumbsUp', 'Trash2', 'User', 'Video', 'Volume2', 'Watch'
];

const VARIANT_OPTIONS = [
  { id: 'subtle', label: 'Subtle', desc: 'Soft tint' },
  { id: 'outline', label: 'Outline', desc: 'Border only' },
  { id: 'solid', label: 'Solid', desc: 'Bold fill' },
  { id: 'glass', label: 'Glass', desc: 'Frosted effect' },
];

const SHADOW_PRESETS = [
  { value: '', label: 'None' },
  { value: 'shadow-sm', label: 'SM' },
  { value: 'shadow-md', label: 'MD' },
  { value: 'shadow-lg', label: 'LG' },
  { value: 'shadow-2xl', label: 'XL' },
  { value: 'shadow-glass', label: 'Glass' },
];

const BORDER_RADIUS_PRESETS = [
  { value: '0px',    label: 'None' },
  { value: '0.25rem', label: 'S' },
  { value: '0.5rem', label: 'M' },
  { value: '1rem', label: 'L' },
  { value: '9999px', label: 'Full' },
];

export const BadgeConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value as Record<string, any> : {};
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredIcons = POPULAR_ICONS.filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-left-2 duration-300 pb-20">
      
      {/* ── Header ── */}
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Level 3 Element</span>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">BADGE SYSTEM</h2>
      </div>

      {/* ── Content ── */}
      <div className="space-y-4">
        <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Label Content</label>
        <textarea 
          value={attributes.textContent || value?.textContent || (isObject ? value.text : value) || ''}
          onChange={(e) => onChange('textContent', e.target.value)}
          className="w-full p-4 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-inner focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none min-h-[80px] resize-none transition-all leading-relaxed"
          placeholder="NEW RELEASE"
        />
      </div>

      {/* ── Visual Variant ── */}
      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
           <Layers className="w-3.5 h-3.5 text-indigo-500" />
           <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Appearance Style</h4>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {VARIANT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => onChange('variant', opt.id)}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all',
                (attributes.variant || 'subtle') === opt.id
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-200'
              )}
            >
              <span className="text-[10px] font-black uppercase tracking-tight leading-none">{opt.label}</span>
              <span className={cn(
                'text-[7px] font-bold uppercase leading-none opacity-60',
                (attributes.variant || 'subtle') === opt.id ? 'text-white' : 'text-slate-400'
              )}>{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Icon Picker ── */}
      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
           <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
           <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Iconography</h4>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search icon name..."
          />
        </div>

        <div className="grid grid-cols-6 gap-1.5 h-40 overflow-y-auto pr-2 custom-scrollbar border border-slate-100 dark:border-slate-800 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
          <button 
            onClick={() => onChange('icon', null)}
            className={cn(
              "aspect-square flex items-center justify-center rounded-lg border transition-all text-[8px] font-black uppercase",
              !attributes.icon 
                ? "bg-indigo-600 border-indigo-600 text-white" 
                : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-300"
            )}
          >
            NONE
          </button>
          {filteredIcons.map(name => {
            const Icon = (LucideIcons as any)[name] || HelpCircle;
            return (
              <button 
                key={name}
                onClick={() => onChange('icon', name)}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-lg border transition-all",
                  attributes.icon === name 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md" 
                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-indigo-200"
                )}
                title={name}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>

        {attributes.icon && (
          <div className="space-y-3 pt-2">
            <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Icon Position</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'left', label: 'Left Side' },
                { id: 'right', label: 'Right Side' },
              ].map(pos => (
                <button
                  key={pos.id}
                  onClick={() => onChange('iconPosition', pos.id)}
                  className={cn(
                    'py-2 text-[10px] font-black uppercase rounded-lg border transition-all',
                    (attributes.iconPosition || 'left') === pos.id
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                  )}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Floating Decor ── */}
      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
           <Sun className="w-3.5 h-3.5 text-indigo-500" />
           <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Floating Decor</h4>
        </div>

        <div className="space-y-6">
           <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Decor Type</label>
              <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
                 {[
                   { id: 'none', label: 'None' },
                   { id: 'icon', label: 'Icon' },
                   { id: 'text', label: 'Text' },
                 ].map(type => (
                   <button
                     key={type.id}
                     onClick={() => onChange('floatingType', type.id)}
                     className={cn(
                       "flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all",
                       (attributes.floatingType || 'none') === type.id 
                         ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                         : "text-slate-400 hover:text-slate-600"
                     )}
                   >
                     {type.label}
                   </button>
                 ))}
              </div>
           </div>

           {(attributes.floatingType === 'icon' || attributes.floatingType === 'text') && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                 {attributes.floatingType === 'icon' ? (
                    <div className="space-y-3">
                       <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Select Decor Icon</label>
                       <div className="grid grid-cols-6 gap-1.5 h-24 overflow-y-auto pr-2 custom-scrollbar border border-slate-100 dark:border-slate-800 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
                          {POPULAR_ICONS.slice(0, 30).map(name => {
                             const Icon = (LucideIcons as any)[name] || HelpCircle;
                             return (
                               <button 
                                 key={name}
                                 onClick={() => onChange('floatingContent', name)}
                                 className={cn(
                                   "aspect-square flex items-center justify-center rounded-lg border transition-all",
                                   attributes.floatingContent === name 
                                     ? "bg-indigo-600 border-indigo-600 text-white shadow-md" 
                                     : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-indigo-200"
                                 )}
                               >
                                 <Icon size={12} />
                               </button>
                             );
                          })}
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-3">
                       <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Decor Text (Short)</label>
                       <input 
                         type="text" 
                         className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-slate-700 dark:text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
                         value={attributes.floatingContent || ''}
                         onChange={(e) => onChange('floatingContent', e.target.value)}
                         placeholder="e.g. NEW"
                         maxLength={4}
                       />
                    </div>
                 )}

                 <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Position</label>
                    <div className="grid grid-cols-2 gap-2">
                       {[
                         { id: 'top-left', label: 'Top Left' },
                         { id: 'top-right', label: 'Top Right' },
                       ].map(pos => (
                         <button
                           key={pos.id}
                           onClick={() => onChange('floatingPosition', pos.id)}
                           className={cn(
                             'py-2 text-[10px] font-black uppercase rounded-lg border transition-all',
                             (attributes.floatingPosition || 'top-right') === pos.id
                               ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                               : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                           )}
                         >
                           {pos.label}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
           )}
        </div>
      </div>

      {/* ── Typography & Layout ── */}
      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
           <Type className="w-3.5 h-3.5 text-indigo-500" />
           <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Typography Details</h4>
        </div>

        <div className="space-y-6">
           <div className="space-y-3 text-left">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic ml-0.5">Alignment</label>
              <div className="grid grid-cols-3 gap-2">
                 {[
                   { icon: <AlignLeft className="w-3.5 h-3.5" />, value: 'text-left' },
                   { icon: <AlignCenter className="w-3.5 h-3.5" />, value: 'text-center' },
                   { icon: <AlignRight className="w-3.5 h-3.5" />, value: 'text-right' },
                 ].map(item => (
                   <button key={item.value} onClick={() => onChange('textAlign', item.value)} className={cn("p-2.5 rounded-xl flex items-center justify-center transition-all border", (attributes.textAlign || 'text-left') === item.value ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 shadow-sm" : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-400")}>
                      {item.icon}
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">Font Size (rem)</label>
                 <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">{attributes.fontSizeScale || 0.7}</span>
              </div>
              <input type="range" min="0.5" max="2" step="0.05" className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600" value={attributes.fontSizeScale || 0.7} onChange={(e) => onChange('fontSizeScale', parseFloat(e.target.value))} />
           </div>

           <div className="space-y-3">
             <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Text Style & Transform</label>
             <div className="grid grid-cols-2 gap-2">
                <button onClick={() => onChange('fontStyle', attributes.fontStyle === 'italic' ? 'not-italic' : 'italic')} className={cn("py-2 text-[10px] font-bold rounded-lg border transition-all italic", (attributes.fontStyle === 'italic' || !attributes.fontStyle) ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30 shadow-sm" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400")}>Italic</button>
                <button onClick={() => onChange('textTransform', attributes.textTransform === 'uppercase' ? 'normal-case' : 'uppercase')} className={cn("py-2 text-[10px] font-bold rounded-lg border transition-all uppercase tracking-widest", (attributes.textTransform === 'uppercase' || !attributes.textTransform) ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30 shadow-sm" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400")}>Uppercase</button>
             </div>
           </div>

           <div className="space-y-3">
             <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Shape Transform</label>
             <div className="grid grid-cols-2 gap-2">
                <button onClick={() => onChange('transform', attributes.transform === 'skew-x-[-10deg]' ? 'skew-x-0' : 'skew-x-[-10deg]')} className={cn("py-2 text-[10px] font-bold rounded-lg border transition-all", (attributes.transform === 'skew-x-[-10deg]' || !attributes.transform) ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30 shadow-sm" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400")}>Slanted (Skew)</button>
                <button onClick={() => onChange('transform', 'skew-x-0')} className={cn("py-2 text-[10px] font-bold rounded-lg border transition-all", (attributes.transform === 'skew-x-0') ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30 shadow-sm" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400")}>Flat (Normal)</button>
             </div>
           </div>
        </div>
      </div>

      {/* ── Colors ── */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
        <ColorPicker 
          label="Primary Color" 
          value={attributes.color || '#6366f1'} 
          onChange={(color) => onChange('color', color)} 
        />
        {attributes.variant !== 'solid' && (
          <ColorPicker 
            label="Border Color (Optional)" 
            value={attributes.borderColor || ''} 
            onChange={(color) => onChange('borderColor', color)} 
          />
        )}
      </div>

      {/* ── Effects & Spacing ── */}
      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
           <Sliders className="w-3.5 h-3.5 text-indigo-500" />
           <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Effects & Radius</h4>
        </div>

        <div className="space-y-6">
           <div className="space-y-3">
             <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left ml-0.5">Outer Shadow</label>
             <div className="grid grid-cols-3 gap-2">
                {SHADOW_PRESETS.map(opt => (
                   <button key={opt.value} onClick={() => onChange('shadow', opt.value)} className={cn("py-2 px-1 rounded-lg border text-[8px] font-black uppercase transition-all", (attributes.shadow || 'shadow-sm') === opt.value ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-indigo-100")}>
                      {opt.label}
                   </button>
                ))}
             </div>
           </div>

           <div className="space-y-3 text-left">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic ml-0.5">Corner Radius</label>
              <div className="grid grid-cols-5 gap-1.5">
                 {BORDER_RADIUS_PRESETS.map(preset => (
                    <button key={preset.value} onClick={() => onChange('borderRadius', preset.value)} className={cn('py-2 rounded-xl border text-[9px] font-black uppercase tracking-tight transition-all', (attributes.borderRadius || '0.5rem') === preset.value ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-indigo-200')}>
                       {preset.label}
                    </button>
                 ))}
              </div>
           </div>

           <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">Glass Blur (px)</label>
                 <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">{attributes.blur || 0}px</span>
              </div>
              <input type="range" min="0" max="20" step="1" className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-400" value={attributes.blur || 0} onChange={(e) => onChange('blur', parseInt(e.target.value))} />
           </div>

           <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">Opacity (%)</label>
                 <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">{attributes.opacity ?? 100}%</span>
              </div>
              <input type="range" min="0" max="100" step="5" className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600" value={attributes.opacity ?? 100} onChange={(e) => onChange('opacity', parseInt(e.target.value))} />
           </div>
        </div>
      </div>

    </div>
  );
};
