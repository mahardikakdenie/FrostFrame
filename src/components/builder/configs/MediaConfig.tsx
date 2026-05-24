import React from 'react';
import { Image as ImageIcon, Sliders, Shield, Sun, Square, Palette, Layers, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useUIStore } from '../../../store/useUIStore';
import { ElementConfigProps } from './types';
import { updateResponsiveValue, ResponsiveLabel } from '../ResponsiveConfig';
import { cn } from '../../../lib/utils';
import { ColorPicker } from '../ColorPicker';

const OBJECT_FIT_OPTIONS = [
  { value: 'cover',   label: 'Cover',   desc: 'Fill & crop' },
  { value: 'contain', label: 'Contain', desc: 'Fit inside' },
  { value: 'fill',    label: 'Fill',    desc: 'Stretch' },
];

const BORDER_RADIUS_PRESETS = [
  { value: '0px',    label: 'None' },
  { value: '0.5rem', label: 'SM' },
  { value: '0.75rem', label: 'MD' },
  { value: '1.5rem', label: 'LG' },
  { value: '9999px', label: 'Full' },
];

const SHADOW_PRESETS = [
  { value: '', label: 'None' },
  { value: 'shadow-sm', label: 'SM' },
  { value: 'shadow-md', label: 'MD' },
  { value: 'shadow-lg', label: 'LG' },
  { value: 'shadow-2xl', label: 'XL' },
  { value: 'shadow-glass', label: 'Glass' },
];

export const MediaConfig = ({ value, onChange, mediaKey = 'src' }: ElementConfigProps & { mediaKey?: string }) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value as Record<string, any> : {};
  const activeDevice = useUIStore(state => state.activeDevice);
  const openMediaModal = useUIStore(state => state.openMediaModal);

  /** Whether this is an imageElement (has alt/objectFit) vs heroMedia (bgImage only) */
  const isImageElement = mediaKey === 'src';

  const currentSrc = attributes[mediaKey] || '';
  const currentAlt = attributes.alt || '';
  const currentObjectFit = attributes.objectFit || 'cover';
  const currentBorderRadius = attributes.borderRadius || '0.75rem';

  const currentMinHeight = (() => {
    const mh = attributes.minHeight;
    if (mh && typeof mh === 'object') return (mh as any)[activeDevice] || '200px';
    return mh || '';
  })();

  const handleOpenModal = () => {
    openMediaModal(attributes.id || 'media-edit', (newUrl: string) => {
      onChange(mediaKey, newUrl);
    }, 'image');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-left-2 duration-300">

      {/* ── Section: Asset ── */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1 text-left">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Asset Control</span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">MEDIA SOURCE</h2>
        </div>

        {/* Preview thumbnail */}
        {currentSrc && (
          <div className="relative w-full h-40 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 mb-4 group shadow-glass">
            <img
              src={currentSrc}
              alt={currentAlt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-4">
              <span className="text-[9px] font-black text-white uppercase tracking-widest truncate italic opacity-80">
                {currentSrc.startsWith('data:') ? 'Local Upload' : currentSrc.split('/').pop() || 'Image'}
              </span>
            </div>
          </div>
        )}

        {/* URL + Open modal */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-inner"
            value={currentSrc}
            onChange={(e) => onChange(mediaKey, e.target.value)}
            placeholder="https://... or paste URL"
          />
          <button
            onClick={handleOpenModal}
            className="bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Browse</span>
          </button>
        </div>
      </div>

      {/* ── Image-specific controls ── */}
      {isImageElement && (
        <>
          {/* Alt Text */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left ml-0.5">
              Accessibility (Alt Text)
            </label>
            <input
              type="text"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-medium text-slate-600 dark:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30"
              value={currentAlt}
              onChange={(e) => onChange('alt', e.target.value)}
              placeholder="Descriptive text..."
            />
          </div>

          {/* Filters & FX */}
          <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Filters & FX</h4>
             </div>

             <div className="space-y-6">
                <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">Opacity</label>
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">{attributes.opacity ?? 100}%</span>
                   </div>
                   <input type="range" min="0" max="100" className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600" value={attributes.opacity ?? 100} onChange={(e) => onChange('opacity', parseInt(e.target.value))} />
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">Grayscale</label>
                      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400">{attributes.grayscale ?? 0}%</span>
                   </div>
                   <input type="range" min="0" max="100" className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-slate-400 dark:accent-slate-500" value={attributes.grayscale ?? 0} onChange={(e) => onChange('grayscale', parseInt(e.target.value))} />
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">Blur</label>
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">{attributes.blur ?? 0}px</span>
                   </div>
                   <input type="range" min="0" max="20" step="1" className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-400" value={attributes.blur ?? 0} onChange={(e) => onChange('blur', parseInt(e.target.value))} />
                </div>
             </div>
          </div>

          {/* Border & Stroke */}
          <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-2 mb-4">
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Border & Stroke</h4>
             </div>

             <div className="space-y-6">
                <div className="space-y-3 text-left">
                   <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic ml-0.5">Thickness</label>
                   <div className="flex gap-1.5 flex-wrap">
                      {['0px', '1px', '2px', '4px', '8px'].map(w => (
                         <button key={w} onClick={() => onChange('borderWidth', w === '0px' ? null : w)} className={cn("px-3 py-2 text-[10px] font-black rounded-lg border transition-all", (attributes.borderWidth || '0px') === w ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-indigo-200")}>
                            {w === '0px' ? 'NONE' : w}
                         </button>
                      ))}
                   </div>
                </div>

                {attributes.borderWidth && (
                   <ColorPicker label="Stroke Color" value={attributes.borderColor || 'var(--primary-color)'} onChange={(c) => onChange('borderColor', c)} />
                )}

                <div className="space-y-3 text-left">
                   <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic ml-0.5">Corner Radius</label>
                   <div className="grid grid-cols-5 gap-1.5">
                      {BORDER_RADIUS_PRESETS.map(preset => (
                         <button key={preset.value} onClick={() => onChange('borderRadius', preset.value)} className={cn('py-2 rounded-xl border text-[9px] font-black uppercase tracking-tight transition-all', currentBorderRadius === preset.value ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-indigo-200')}>
                            {preset.label}
                         </button>
                      ))}
                   </div>
                   <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-[10px] font-mono uppercase text-slate-700 dark:text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500" value={currentBorderRadius} onChange={(e) => onChange('borderRadius', e.target.value)} placeholder="Custom e.g. 20px" />
                </div>
             </div>
          </div>

          {/* Shadows */}
          <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-2 mb-4">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Outer Shadows</h4>
             </div>
             <div className="grid grid-cols-3 gap-2">
                {SHADOW_PRESETS.map(opt => (
                   <button key={opt.value} onClick={() => onChange('shadow', opt.value)} className={cn("py-2.5 px-1 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all", (attributes.shadow || '') === opt.value ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-indigo-200")}>
                      {opt.label}
                   </button>
                ))}
             </div>
          </div>

          {/* Layout & Physics */}
          <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-2 mb-4">
                <Sun className="w-3.5 h-3.5 text-indigo-500" />
                <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Dimensions & Alignment</h4>
             </div>

             <div className="space-y-6">
                {/* Width Control */}
                <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                      <ResponsiveLabel>Width</ResponsiveLabel>
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full italic">
                         {attributes.width && typeof attributes.width === 'object' ? attributes.width[activeDevice] : (attributes.width || '100%')}
                      </span>
                   </div>
                   <div className="grid grid-cols-4 gap-1.5">
                      {['25%', '50%', '75%', '100%'].map(w => (
                         <button key={w} onClick={() => onChange('width', updateResponsiveValue(attributes.width, activeDevice, w))} className={cn("py-2 text-[9px] font-black rounded-lg border transition-all", (attributes.width && typeof attributes.width === 'object' ? attributes.width[activeDevice] : attributes.width || '100%') === w ? "bg-indigo-600 border-indigo-600 text-white shadow-md" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-indigo-200")}>
                            {w}
                         </button>
                      ))}
                   </div>
                   <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-[10px] font-mono uppercase text-slate-700 dark:text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500" value={attributes.width && typeof attributes.width === 'object' ? attributes.width[activeDevice] : (attributes.width || '')} onChange={(e) => onChange('width', updateResponsiveValue(attributes.width, activeDevice, e.target.value))} placeholder="e.g. 400px or 80%" />
                </div>

                {/* Fixed Height Control */}
                <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                      <ResponsiveLabel>Fixed Height</ResponsiveLabel>
                      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full italic">
                         {attributes.height && typeof attributes.height === 'object' ? attributes.height[activeDevice] : (attributes.height || 'Auto')}
                      </span>
                   </div>
                   <input type="range" min="0" max="800" step="10" className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500" value={parseInt(attributes.height && typeof attributes.height === 'object' ? attributes.height[activeDevice] : attributes.height) || 0} onChange={(e) => {
                      const val = e.target.value === '0' ? 'auto' : `${e.target.value}px`;
                      onChange('height', updateResponsiveValue(attributes.height, activeDevice, val));
                   }} />
                   <input type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-[10px] font-mono uppercase text-slate-700 dark:text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500" value={attributes.height && typeof attributes.height === 'object' ? attributes.height[activeDevice] : (attributes.height || '')} onChange={(e) => onChange('height', updateResponsiveValue(attributes.height, activeDevice, e.target.value))} placeholder="e.g. 300px or 50vh" />
                </div>

                {/* Min Height Control */}
                <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                      <ResponsiveLabel>Min Height</ResponsiveLabel>
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full italic">
                         {currentMinHeight || 'None'}
                      </span>
                   </div>
                   <input type="range" min="0" max="1000" step="20" className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600" value={parseInt(currentMinHeight) || 0} onChange={(e) => {
                      const val = e.target.value === '0' ? 'auto' : `${e.target.value}px`;
                      onChange('minHeight', updateResponsiveValue(attributes.minHeight, activeDevice, val));
                   }} />
                </div>

                {/* Object Fit */}
                <div className="space-y-3">
                   <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Crop & Scaling (Object Fit)</label>
                   <div className="grid grid-cols-3 gap-2">
                     {OBJECT_FIT_OPTIONS.map(opt => (
                       <button key={opt.value} onClick={() => onChange('objectFit', opt.value)} className={cn('flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all', currentObjectFit === opt.value ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-200')}>
                         <span className="text-[10px] font-black uppercase tracking-tight leading-none">{opt.label}</span>
                         <span className={cn('text-[8px] font-bold leading-none', currentObjectFit === opt.value ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500')}>{opt.desc}</span>
                       </button>
                     ))}
                   </div>
                </div>
             </div>
          </div>
        </>
      )}

      {/* ── For heroMedia: show bg-specific controls ── */}
      {!isImageElement && (
        <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-left">
          <div className="flex items-center gap-2 mb-4">
             <Palette className="w-3.5 h-3.5 text-indigo-500" />
             <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic">Surface Logic</h4>
          </div>
          <div className="space-y-3">
             <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic ml-0.5">Focus Position</label>
             <div className="grid grid-cols-3 gap-1.5">
                {[
                  { v: 'top', icon: <AlignLeft className="w-3 h-3 rotate-90" /> },
                  { v: 'center', icon: <AlignCenter className="w-3 h-3 rotate-90" /> },
                  { v: 'bottom', icon: <AlignRight className="w-3 h-3 rotate-90" /> },
                ].map(opt => (
                  <button key={opt.v} onClick={() => onChange('bgPosition', opt.v)} className={cn('flex items-center justify-center gap-1.5 py-3 rounded-xl border transition-all', attributes.bgPosition === opt.v ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-200')}>
                    {opt.icon}
                    <span className="text-[9px] font-black uppercase tracking-tight capitalize">{opt.v}</span>
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

