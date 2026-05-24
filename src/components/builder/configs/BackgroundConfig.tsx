import React from 'react';
import { Image as ImageIcon, Plus } from 'lucide-react';
import { ColorPicker } from '../ColorPicker';
import { useUIStore } from '../../../store/useUIStore';
import { ElementConfigProps } from './types';

export const BackgroundConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};
  const openMediaModal = useUIStore(state => state.openMediaModal);

  const handleOpenBgModal = () => {
    openMediaModal(attributes.id || 'bg-edit', (newUrl: string) => {
      onChange('bgImage', newUrl);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Canvas Styling</span>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">BACKGROUND SYSTEM</h2>
      </div>

      <div className="space-y-8">
        <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-[2rem] space-y-6">
           <ColorPicker 
            label="Base Color" 
            value={attributes.background || attributes.bgColor || 'transparent'} 
            onChange={(color) => onChange('background', color)} 
          />
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-[2rem] space-y-6">
           <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-500" />
              <label className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest block italic">Image Backdrop</label>
           </div>
           
           <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-1 focus:ring-indigo-500"
              value={attributes.bgImage || ''}
              onChange={(e) => onChange('bgImage', e.target.value)}
            />
            <button 
              onClick={handleOpenBgModal}
              className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {attributes.bgImage && (
          <div className="p-6 bg-slate-900 dark:bg-slate-950 border border-slate-800 dark:border-slate-900 rounded-[2rem] space-y-6">
               <ColorPicker 
                 label="Overlay Color" 
                 value={attributes.bgOverlay || '#0f172a'} 
                 onChange={(color) => onChange('bgOverlay', color)} 
               />
               
               <div className="space-y-3">
                  <input 
                    type="range" 
                    min="0" max="100" step="5"
                    className="w-full h-1 bg-slate-800 dark:bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    value={attributes.bgOpacity || 40}
                    onChange={(e) => onChange('bgOpacity', parseInt(e.target.value))}
                  />
               </div>
          </div>
        )}
      </div>
    </div>
  );
};
