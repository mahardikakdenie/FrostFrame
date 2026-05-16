import React from 'react';
import { Plus } from 'lucide-react';
import { useUIStore } from '../../../store/useUIStore';
import { ElementConfigProps } from './types';

export const MediaConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};
  const openMediaModal = useUIStore(state => state.openMediaModal);

  const handleOpenModal = () => {
    openMediaModal(attributes.id || 'media-edit', (newUrl: string) => {
      onChange('url', newUrl);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Visual Asset</span>
        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">MEDIA CONFIG</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic text-left">Source URL</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
              value={attributes.url || ''}
              onChange={(e) => onChange('url', e.target.value)}
              placeholder="https://..."
            />
            <button 
              onClick={handleOpenModal}
              className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
