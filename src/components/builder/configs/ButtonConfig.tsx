import React from 'react';
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  Type, 
  Palette, 
  Layout, 
  Settings2, 
  Search, 
  HelpCircle,
  Sliders,
  Layers,
  MousePointer2,
  Maximize,
  Square,
  Shield,
  Zap,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ElementConfigProps } from './types';
import { cn } from '../../../lib/utils';
import { ColorPicker } from '../ColorPicker';
import { ResponsiveLabel } from '../ResponsiveConfig';
import { useUIStore } from '../../../store/useUIStore';

const POPULAR_ICONS = [
  'Star', 'Zap', 'Heart', 'Shield', 'CheckCircle2', 'Info', 'Sparkles', 'Smile', 
  'Award', 'Bell', 'Bookmark', 'Cloud', 'Code', 'Coffee', 'Cpu', 'Crown', 
  'Flag', 'Flashlight', 'Gift', 'Globe', 'HelpCircle', 'Home', 'Key', 'Layers', 
  'LifeBuoy', 'Lock', 'Mail', 'MapPin', 'Moon', 'Music', 'Package', 'Phone', 
  'Play', 'Rocket', 'Send', 'Settings', 'Share2', 'ShoppingBag', 'Tag', 
  'Target', 'ThumbsUp', 'Trash2', 'User', 'Video', 'Volume2', 'Watch',
  'ChevronRight', 'ArrowRight', 'Download', 'ExternalLink', 'Plus', 'Minus'
];

const VARIANT_OPTIONS = [
  { id: 'primary',   label: 'Solid', desc: 'Bold brand fill' },
  { id: 'secondary', label: 'Outline', desc: 'Stroke only' },
  { id: 'soft',      label: 'Subtle', desc: 'Light tint' },
  { id: 'glass',     label: 'Frosted', desc: 'Glass effect' },
  { id: 'ghost',     label: 'Ghost', desc: 'Invisible base' },
];

const GRADIENT_PRESETS = [
  { label: 'None', value: null },
  { label: 'Indigo', value: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)' },
  { label: 'Ocean', value: 'linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%)' },
  { label: 'Sunset', value: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)' },
  { label: 'Emerald', value: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' },
  { label: 'Dark', value: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' },
];

const HOVER_EFFECTS = [
  { id: 'lift',  label: 'Lift',  desc: 'Move up' },
  { id: 'scale', label: 'Scale', desc: 'Slight zoom' },
  { id: 'glow',  label: 'Glow',  desc: 'Outer glow' },
];

const SHADOW_PRESETS = [
  { value: '', label: 'None' },
  { value: 'shadow-sm', label: 'SM' },
  { value: 'shadow-md', label: 'MD' },
  { value: 'shadow-lg', label: 'LG' },
  { value: 'shadow-xl', label: 'XL' },
  { value: 'shadow-2xl', label: '2XL' },
  { value: 'shadow-glass', label: 'Glass' },
];

const BORDER_RADIUS_PRESETS = [
  { value: '0px',    label: 'None' },
  { value: '0.375rem', label: 'S' },
  { value: '0.75rem', label: 'M' },
  { value: '1.5rem', label: 'L' },
  { value: '9999px', label: 'Full' },
];

export const ButtonConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const isGroup = Array.isArray(value?.buttons);
  const buttons = isGroup ? value.buttons : [];
  const [searchTerm, setSearchTerm] = React.useState('');
  const activeDevice = useUIStore(state => state.activeDevice);

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

  const filteredIcons = POPULAR_ICONS.filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const IconPicker = ({ label, current, onSelect }: any) => (
    <div className="space-y-3">
       <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">{label}</label>
       <div className="grid grid-cols-6 gap-1.5 h-28 overflow-y-auto pr-2 custom-scrollbar border border-slate-100 dark:border-slate-800 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
          <button 
            onClick={() => onSelect(null)}
            className={cn(
              "aspect-square flex items-center justify-center rounded-lg border transition-all text-[7px] font-black uppercase",
              !current ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-300"
            )}
          >OFF</button>
          {POPULAR_ICONS.slice(0, 24).map(name => {
            const Icon = (LucideIcons as any)[name] || HelpCircle;
            return (
              <button 
                key={name}
                onClick={() => onSelect(name)}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-lg border transition-all",
                  current === name ? "bg-indigo-600 border-indigo-600 text-white shadow-md" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-indigo-200"
                )}
              >
                <Icon size={12} />
              </button>
            );
          })}
       </div>
    </div>
  );

  if (isGroup) {
    // ... (ButtonGroup render remains similar but with updated variants)
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
          <div className="flex items-center justify-between">
             <div className="flex flex-col gap-1 text-left">
               <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Action Set</span>
               <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">BUTTON GROUP</h2>
             </div>
             <button onClick={addButton} className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
               <Plus className="w-5 h-5" />
             </button>
          </div>
  
          <div className="space-y-6">
            {buttons.map((btn: any, idx: number) => (
              <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-[2rem] space-y-6 relative group">
                 <button 
                   onClick={() => removeButton(idx)}
                   className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                 >
                   <Trash2 className="w-3.5 h-3.5" />
                 </button>
  
                 <div className="space-y-4">
                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Label & Link</label>
                    <div className="space-y-3">
                      <div className="relative">
                        <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <input 
                          type="text" 
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 shadow-inner"
                          value={btn.text}
                          onChange={(e) => updateButton(idx, 'text', e.target.value)}
                          placeholder="Button Text"
                        />
                      </div>
                    </div>
                 </div>
  
                 <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Appearance</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {VARIANT_OPTIONS.slice(0, 4).map(opt => (
                         <button 
                           key={opt.id}
                           onClick={() => updateButton(idx, 'variant', opt.id)}
                           className={cn(
                             "py-2 text-[8px] font-black uppercase rounded-lg transition-all border",
                             btn.variant === opt.id 
                               ? "bg-indigo-600 border-indigo-600 text-white shadow-md" 
                               : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-indigo-100"
                           )}
                         >
                           {opt.label}
                         </button>
                      ))}
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
    <div className="space-y-10 animate-in fade-in slide-in-from-left-2 duration-300 pb-20">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Action Element</span>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">BUTTON SYSTEM</h2>
      </div>

      <div className="space-y-8">
        {/* ── Section: Content ── */}
        <div className="space-y-6">
          <div className="space-y-3">
             <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left ml-0.5">Display Label</label>
             <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 shadow-inner"
                value={value.text || ''}
                onChange={(e) => onChange('text', e.target.value)}
                placeholder="CLICK ME"
             />
          </div>
          <div className="space-y-3">
             <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left ml-0.5">Link URL</label>
             <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 shadow-inner"
                value={value.link || ''}
                onChange={(e) => onChange('link', e.target.value)}
                placeholder="https://..."
             />
          </div>
        </div>

        {/* ── Section: Visual Style ── */}
        <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
           <div className="flex items-center gap-2 mb-4">
              <Palette className="w-3.5 h-3.5 text-indigo-500" />
              <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Appearance</h4>
           </div>

           <div className="grid grid-cols-2 gap-2">
             {VARIANT_OPTIONS.map(opt => (
               <button
                 key={opt.id}
                 onClick={() => onChange('variant', opt.id)}
                 className={cn(
                   'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all',
                   (value.variant || 'primary') === opt.id
                     ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                     : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-200'
                 )}
               >
                 <span className="text-[10px] font-black uppercase tracking-tight leading-none">{opt.label}</span>
                 <span className={cn('text-[7px] font-bold uppercase leading-none opacity-60', (value.variant || 'primary') === opt.id ? 'text-indigo-100' : 'text-slate-400')}>{opt.desc}</span>
               </button>
             ))}
           </div>

           {value.variant === 'primary' && (
             <div className="space-y-3 animate-in fade-in duration-300">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Gradient Mesh</label>
                <div className="grid grid-cols-3 gap-1.5">
                   {GRADIENT_PRESETS.map(g => (
                      <button key={g.label} onClick={() => onChange('gradient', g.value)} className={cn("py-2 text-[8px] font-black rounded-lg border transition-all", value.gradient === g.value ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400")}>
                         {g.label}
                      </button>
                   ))}
                </div>
             </div>
           )}

           <ColorPicker label="Brand Primary Color" value={value.color || '#6366f1'} onChange={(color) => onChange('color', color)} />
        </div>

        {/* ── Section: Iconography ── */}
        <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
           <div className="flex items-center gap-2 mb-4">
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Iconography</h4>
           </div>
           <IconPicker label="Leading Icon" current={value.leadingIcon} onSelect={(val: any) => onChange('leadingIcon', val)} />
           <IconPicker label="Trailing Icon" current={value.trailingIcon} onSelect={(val: any) => onChange('trailingIcon', val)} />
        </div>

        {/* ── Section: Typography ── */}
        <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
           <div className="flex items-center gap-2 mb-4">
              <Type className="w-3.5 h-3.5 text-indigo-500" />
              <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Typography Details</h4>
           </div>
           <div className="space-y-6">
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Font Weight</label>
                 <div className="grid grid-cols-3 gap-1.5">
                    {['font-medium', 'font-bold', 'font-black'].map(w => (
                       <button key={w} onClick={() => onChange('fontWeight', w)} className={cn("py-2 text-[8px] font-black uppercase rounded-lg border transition-all", (value.fontWeight || 'font-black') === w ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400")}>
                          {w.replace('font-', '')}
                       </button>
                    ))}
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => onChange('fontStyle', value.fontStyle === 'italic' ? 'not-italic' : 'italic')} className={cn("py-2 text-[10px] font-bold rounded-lg border transition-all italic", (value.fontStyle === 'italic' || !value.fontStyle) ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 text-indigo-600 dark:text-indigo-400 shadow-sm" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400")}>Italic</button>
                 <button onClick={() => onChange('textTransform', value.textTransform === 'uppercase' ? 'normal-case' : 'uppercase')} className={cn("py-2 text-[10px] font-bold rounded-lg border transition-all uppercase tracking-widest", (value.textTransform === 'uppercase' || !value.textTransform) ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 text-indigo-600 dark:text-indigo-400 shadow-sm" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400")}>Uppercase</button>
              </div>
           </div>
        </div>

        {/* ── Section: Geometry ── */}
        <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
           <div className="flex items-center gap-2 mb-4">
              <Maximize className="w-3.5 h-3.5 text-indigo-500" />
              <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Geometry</h4>
           </div>
           <div className="space-y-4">
              <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
                 {['sm', 'md', 'lg'].map(s => (
                    <button key={s} onClick={() => onChange('size', s)} className={cn("flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all", value.size === s ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400")}>{s}</button>
                 ))}
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
                 <button onClick={() => onChange('width', 'auto')} className={cn("flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all", value.width !== 'full' ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400")}>Auto Width</button>
                 <button onClick={() => onChange('width', 'full')} className={cn("flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all", value.width === 'full' ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400")}>Full Width</button>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                 {BORDER_RADIUS_PRESETS.map(preset => (
                    <button key={preset.value} onClick={() => onChange('borderRadius', preset.value)} className={cn('py-2 rounded-xl border text-[9px] font-black uppercase transition-all', (value.borderRadius || '0.75rem') === preset.value ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-indigo-200')}>
                       {preset.label}
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* ── Section: Advanced FX ── */}
        <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
           <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Advanced FX</h4>
           </div>
           <div className="space-y-6">
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left ml-0.5">Interaction (Hover)</label>
                 <div className="grid grid-cols-3 gap-2">
                    {HOVER_EFFECTS.map(opt => (
                       <button key={opt.id} onClick={() => onChange('hoverEffect', opt.id)} className={cn("py-2.5 flex flex-col items-center gap-1 rounded-xl border transition-all", (value.hoverEffect || 'lift') === opt.id ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-indigo-100")}>
                          <span className="text-[9px] font-black uppercase">{opt.label}</span>
                          <span className={cn("text-[7px] font-bold uppercase opacity-60", (value.hoverEffect || 'lift') === opt.id ? "text-indigo-200" : "text-slate-400")}>{opt.desc}</span>
                       </button>
                    ))}
                 </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                 {SHADOW_PRESETS.slice(0, 4).map(opt => (
                    <button key={opt.value} onClick={() => onChange('shadow', opt.value)} className={cn("py-2 px-1 rounded-lg border text-[8px] font-black uppercase transition-all", (value.shadow || 'shadow-xl') === opt.value ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-indigo-100")}>
                       {opt.label || 'NONE'}
                    </button>
                 ))}
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                 <div className="flex items-center gap-2 mb-4"><Shield className="w-3.5 h-3.5 text-indigo-500" /><h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Stroke Custom</h4></div>
                 <div className="grid grid-cols-5 gap-1.5">
                    {['0px', '1px', '2px', '4px', '8px'].map(w => (
                       <button key={w} onClick={() => onChange('borderWidth', w === '0px' ? null : w)} className={cn("py-2 text-[9px] font-black rounded-lg border transition-all", (value.borderWidth || (value.variant === 'secondary' ? '2px' : '0px')) === w ? "bg-indigo-600 border-indigo-600 text-white shadow-md" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400")}>{w === '0px' ? 'OFF' : w}</button>
                    ))}
                 </div>
                 <ColorPicker label="Border Stroke Color" value={value.borderColor || '#6366f1'} onChange={(c) => onChange('borderColor', c)} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
