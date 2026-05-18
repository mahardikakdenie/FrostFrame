import React from 'react';
import { Plus, Maximize2, Play } from 'lucide-react';
import { useUIStore } from '../../../store/useUIStore';
import { cn } from '../../../lib/utils';
import { ElementConfigProps } from './types';
import { updateResponsiveValue } from '../ResponsiveConfig';

export const VideoConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};
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

  const handleResponsiveChange = (key: string, val: string) => {
    const newVal = updateResponsiveValue(attributes[key], activeDevice, val);
    onChange(key, newVal);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Motion Asset</span>
        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">VIDEO CONFIG</h2>
      </div>

      <div className="space-y-6">
        {/* Source Type Selector */}
        <div className="space-y-4">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Video Source Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'link', label: 'Direct Link', icon: <Maximize2 className="w-3 h-3" /> },
              { id: 'upload', label: 'Local Upload', icon: <Plus className="w-3 h-3" /> },
              { id: 'youtube', label: 'YouTube URL', icon: <Play className="w-3 h-3" /> },
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => onChange('sourceType', mode.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                  sourceType === mode.id ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-slate-50 border-slate-100 text-slate-400 hover:border-indigo-200"
                )}
              >
                {mode.icon}
                <span className="text-[7px] font-black uppercase tracking-tighter leading-none">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Source Input */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">
            {sourceType === 'youtube' ? 'YouTube URL' : sourceType === 'upload' ? 'Uploaded Video File' : 'Direct Video Link (.mp4, .webm)'}
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
              value={attributes.src || ''}
              onChange={(e) => onChange('src', e.target.value)}
              placeholder={sourceType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://...'}
            />
            {sourceType === 'upload' && (
              <button 
                onClick={handleOpenSourceModal}
                className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {sourceType !== 'youtube' && (
          <div className="space-y-4">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Poster Image (Thumbnail)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
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

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
           <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Autoplay</label>
              <button 
                onClick={() => onChange('autoplay', !attributes.autoplay)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all border",
                  attributes.autoplay 
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm" 
                    : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
                )}
              >
                <span className="text-[10px] font-black uppercase tracking-tight">{attributes.autoplay ? 'ON' : 'OFF'}</span>
                <div className={cn(
                  "w-8 h-4 rounded-full relative transition-all duration-300",
                  attributes.autoplay ? "bg-indigo-600" : "bg-slate-300"
                )}>
                  <div className={cn(
                    "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300",
                    attributes.autoplay ? "left-4" : "left-0.5"
                  )} style={{ left: attributes.autoplay ? '1.125rem' : '0.125rem' }} />
                </div>
              </button>
           </div>
           <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Loop Video</label>
              <button 
                onClick={() => onChange('loop', !attributes.loop)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all border",
                  attributes.loop 
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm" 
                    : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200"
                )}
              >
                <span className="text-[10px] font-black uppercase tracking-tight">{attributes.loop ? 'ON' : 'OFF'}</span>
                <div className={cn(
                  "w-8 h-4 rounded-full relative transition-all duration-300",
                  attributes.loop ? "bg-indigo-600" : "bg-slate-300"
                )}>
                  <div className={cn(
                    "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300",
                    attributes.loop ? "left-4" : "left-0.5"
                  )} style={{ left: attributes.loop ? '1.125rem' : '0.125rem' }} />
                </div>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
