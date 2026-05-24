import React from 'react';
import { Image as ImageIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useUIStore } from '../../../store/useUIStore';
import { ElementConfigProps } from './types';
import { updateResponsiveValue } from '../ResponsiveConfig';
import { cn } from '../../../lib/utils';

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
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">

      {/* ── Source ── */}
      <div className="space-y-3">
        <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic">
          Image Source
        </label>

        {/* Preview thumbnail */}
        {currentSrc && (
          <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 mb-3">
            <img
              src={currentSrc}
              alt={currentAlt}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3">
              <span className="text-[8px] font-black text-white uppercase tracking-widest truncate italic opacity-80">
                {currentSrc.startsWith('data:') ? 'Local Upload' : currentSrc.split('/').pop() || 'Image'}
              </span>
            </div>
          </div>
        )}

        {/* URL + Open modal */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 placeholder:text-slate-300 dark:placeholder:text-slate-600"
            value={currentSrc}
            onChange={(e) => onChange(mediaKey, e.target.value)}
            placeholder="https://... or paste URL"
          />
          <button
            onClick={handleOpenModal}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider whitespace-nowrap"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Browse</span>
          </button>
        </div>
      </div>

      {/* ── Image-specific controls ── */}
      {isImageElement && (
        <>
          {/* Alt Text */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic">
              Alt Text
            </label>
            <input
              type="text"
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 placeholder:text-slate-300 dark:placeholder:text-slate-600"
              value={currentAlt}
              onChange={(e) => onChange('alt', e.target.value)}
              placeholder="Descriptive text for accessibility..."
            />
          </div>

          {/* Object Fit */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic">
              Image Fit
            </label>
            <div className="grid grid-cols-3 gap-2">
              {OBJECT_FIT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onChange('objectFit', opt.value)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all',
                    currentObjectFit === opt.value
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-200'
                  )}
                >
                  <span className="text-[10px] font-black uppercase tracking-tight leading-none">{opt.label}</span>
                  <span className={cn(
                    'text-[8px] font-bold leading-none',
                    currentObjectFit === opt.value ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                  )}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic">
              Corner Radius
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {BORDER_RADIUS_PRESETS.map(preset => (
                <button
                  key={preset.value}
                  onClick={() => onChange('borderRadius', preset.value)}
                  className={cn(
                    'py-2 rounded-xl border text-[9px] font-black uppercase tracking-tight transition-all',
                    currentBorderRadius === preset.value
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-200'
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            {/* Custom radius input */}
            <div className="flex gap-2 items-center">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic whitespace-nowrap">Custom</span>
              <input
                type="text"
                className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30"
                value={currentBorderRadius}
                onChange={(e) => onChange('borderRadius', e.target.value)}
                placeholder="e.g. 1.5rem"
              />
            </div>
          </div>

          {/* Min Height */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">
                Min Height
              </label>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 px-2.5 py-1 rounded-full italic">
                {currentMinHeight || 'Auto'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="600"
              step="20"
              className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
              value={parseInt(currentMinHeight) || 0}
              onChange={(e) => {
                const px = `${e.target.value}px`;
                const newVal = updateResponsiveValue(attributes.minHeight, activeDevice, px);
                onChange('minHeight', e.target.value === '0' ? null : newVal);
              }}
            />
            <div className="flex justify-between text-[8px] font-bold text-slate-300 dark:text-slate-600 italic">
              <span>Auto</span>
              <span>600px</span>
            </div>
          </div>
        </>
      )}

      {/* ── For heroMedia: show bg-specific controls ── */}
      {!isImageElement && (
        <div className="space-y-3">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic">
            Background Position
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { v: 'top', icon: <AlignLeft className="w-3 h-3 rotate-90" /> },
              { v: 'center', icon: <AlignCenter className="w-3 h-3 rotate-90" /> },
              { v: 'bottom', icon: <AlignRight className="w-3 h-3 rotate-90" /> },
            ].map(opt => (
              <button
                key={opt.v}
                onClick={() => onChange('bgPosition', opt.v)}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-2.5 rounded-xl border transition-all',
                  attributes.bgPosition === opt.v
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-200'
                )}
              >
                {opt.icon}
                <span className="text-[9px] font-black uppercase tracking-tight capitalize">{opt.v}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
