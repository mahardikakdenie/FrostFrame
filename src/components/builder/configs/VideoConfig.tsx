import React from 'react';
import { Plus, Link, Upload, Youtube } from 'lucide-react';
import { useUIStore } from '../../../store/useUIStore';
import { cn } from '../../../lib/utils';
import { ElementConfigProps } from './types';
import { updateResponsiveValue } from '../ResponsiveConfig';

const BORDER_RADIUS_PRESETS = [
  { value: '0px',    label: 'None' },
  { value: '0.75rem', label: 'MD' },
  { value: '1.5rem', label: 'LG' },
  { value: '2rem',   label: 'XL' },
  { value: '9999px', label: 'Full' },
];

const ASPECT_RATIO_OPTIONS = [
  { value: '16/9',  label: '16:9',  desc: 'Widescreen' },
  { value: '4/3',   label: '4:3',   desc: 'Classic' },
  { value: '1/1',   label: '1:1',   desc: 'Square' },
  { value: '21/9',  label: '21:9',  desc: 'Cinematic' },
];

export const VideoConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value as Record<string, any> : {};
  const activeDevice = useUIStore(state => state.activeDevice);
  const openMediaModal = useUIStore(state => state.openMediaModal);

  const sourceType = attributes.sourceType || 'link';

  const handleOpenSourceModal = () => {
    openMediaModal(attributes.id || 'video-src', (newUrl: string) => {
      onChange('src', newUrl);
      onChange('sourceType', 'upload');
    }, 'video');
  };

  const handleOpenPosterModal = () => {
    openMediaModal(attributes.id || 'video-poster', (newUrl: string) => {
      onChange('poster', newUrl);
    }, 'image');
  };

  const getResponsiveVal = (key: string, fallback: string) => {
    const attr = attributes[key];
    if (attr && typeof attr === 'object') return (attr as any)[activeDevice] || fallback;
    return attr || fallback;
  };

  const currentBorderRadius = attributes.borderRadius && typeof attributes.borderRadius === 'object'
    ? (attributes.borderRadius as any)[activeDevice] || '1.5rem'
    : attributes.borderRadius || '1.5rem';

  const currentMinHeight = getResponsiveVal('minHeight', '');

  const ToggleSwitch = ({ label, stateKey }: { label: string; stateKey: 'autoplay' | 'loop' }) => (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic">{label}</label>
      <button
        onClick={() => onChange(stateKey, !attributes[stateKey])}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all border',
          attributes[stateKey]
            ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400 shadow-sm'
            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-600'
        )}
      >
        <span className="text-[10px] font-black uppercase tracking-tight">{attributes[stateKey] ? 'ON' : 'OFF'}</span>
        <div className={cn('w-8 h-4 rounded-full relative transition-all duration-300', attributes[stateKey] ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700')}>
          <div
            className="absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300"
            style={{ left: attributes[stateKey] ? '1.125rem' : '0.125rem' }}
          />
        </div>
      </button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">

      {/* ── Source Type ── */}
      <div className="space-y-3">
        <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic">
          Video Source
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'link',    label: 'Direct Link', Icon: Link },
            { id: 'upload',  label: 'Upload File',  Icon: Upload },
            { id: 'youtube', label: 'YouTube',      Icon: Youtube },
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => onChange('sourceType', mode.id)}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all',
                sourceType === mode.id
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-indigo-200 dark:hover:border-indigo-500/30'
              )}
            >
              <mode.Icon className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase tracking-tighter leading-none">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Source URL / File ── */}
      <div className="space-y-3">
        <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic">
          {sourceType === 'youtube' ? 'YouTube URL' : sourceType === 'upload' ? 'Video File' : 'Direct URL (.mp4, .webm)'}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 placeholder:text-slate-300 dark:placeholder:text-slate-600"
            value={attributes.src || ''}
            onChange={(e) => onChange('src', e.target.value)}
            placeholder={sourceType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://...'}
          />
          {(sourceType === 'upload' || sourceType === 'link') && (
            <button
              onClick={handleOpenSourceModal}
              className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
              title="Browse files"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Poster (non-YouTube) ── */}
      {sourceType !== 'youtube' && (
        <div className="space-y-3">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic">
            Poster / Thumbnail
          </label>

          {attributes.poster && (
            <div className="w-full h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-2">
              <img src={attributes.poster} alt="poster" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 placeholder:text-slate-300 dark:placeholder:text-slate-600"
              value={attributes.poster || ''}
              onChange={(e) => onChange('poster', e.target.value)}
              placeholder="https://...jpg"
            />
            <button
              onClick={handleOpenPosterModal}
              className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Playback ── */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <ToggleSwitch label="Autoplay" stateKey="autoplay" />
        <ToggleSwitch label="Loop" stateKey="loop" />
      </div>

      {/* ── Aspect Ratio (non-YouTube) ── */}
      {sourceType !== 'youtube' && (
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">
              Min Height
            </label>
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full italic">
              {currentMinHeight || 'Auto'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="800"
            step="20"
            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
            value={parseInt(currentMinHeight) || 0}
            onChange={(e) => {
              const px = `${e.target.value}px`;
              const newVal = updateResponsiveValue(attributes.minHeight, activeDevice, px);
              onChange('minHeight', e.target.value === '0' ? null : newVal);
            }}
          />
        </div>
      )}

      {/* ── Aspect Ratio (YouTube) ── */}
      {sourceType === 'youtube' && (
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic">
            Aspect Ratio
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ASPECT_RATIO_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onChange('aspectRatio', opt.value)}
                className={cn(
                  'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all',
                  (attributes.aspectRatio || '16/9') === opt.value
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-200'
                )}
              >
                <span className="text-[11px] font-black uppercase tracking-tight">{opt.label}</span>
                <span className={cn('text-[8px] font-bold',
                  (attributes.aspectRatio || '16/9') === opt.value ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                )}>{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Border Radius ── */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
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
      </div>

    </div>
  );
};
