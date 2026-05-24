import React from 'react';
import { Settings2Icon } from 'lucide-react';
import { useUIStore } from '../../../store/useUIStore';
import { cn } from '../../../lib/utils';
import { ResponsiveLabel, updateResponsiveValue } from '../ResponsiveConfig';
import { ElementConfigProps } from './types';

export const AdvancedConfig = ({ value, onChange }: ElementConfigProps) => {
  const activeDevice = useUIStore(state => state.activeDevice);
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};

  return (
    <div className="space-y-8 pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Settings2Icon className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest italic text-left">Advanced Positioning</h3>
      </div>

      {/* Margin */}
      <div className="space-y-6 bg-slate-50/50 dark:bg-slate-900/30 p-6 border border-slate-100 dark:border-slate-800 rounded-[2rem]">
        <div className="space-y-4">
          <ResponsiveLabel>Margin Top (Supports Negative)</ResponsiveLabel>
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-bold text-slate-500 dark:text-slate-400">
              <span>-150px</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black">
                {typeof attributes.marginTop === 'object' ? (attributes.marginTop[activeDevice] || '0px') : (attributes.marginTop || '0px')}
              </span>
              <span>150px</span>
            </div>
            <input 
              type="range" min="-150" max="150" step="5"
              className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              value={(() => {
                const val = typeof attributes.marginTop === 'object' ? (attributes.marginTop[activeDevice] || '0') : (attributes.marginTop || '0');
                return parseInt(val.toString().replace(/[^\d-]/g, '')) || 0;
              })()}
              onChange={(e) => {
                const newVal = updateResponsiveValue(attributes.marginTop, activeDevice, `${e.target.value}px`);
                onChange('marginTop', newVal);
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <ResponsiveLabel>Margin Bottom</ResponsiveLabel>
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-bold text-slate-500 dark:text-slate-400">
              <span>0px</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black">
                {typeof attributes.marginBottom === 'object' ? (attributes.marginBottom[activeDevice] || '0px') : (attributes.marginBottom || '0px')}
              </span>
              <span>150px</span>
            </div>
            <input 
              type="range" min="0" max="150" step="5"
              className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              value={(() => {
                const val = typeof attributes.marginBottom === 'object' ? (attributes.marginBottom[activeDevice] || '0') : (attributes.marginBottom || '0');
                return parseInt(val.toString().replace(/[^\d]/g, '')) || 0;
              })()}
              onChange={(e) => {
                const newVal = updateResponsiveValue(attributes.marginBottom, activeDevice, `${e.target.value}px`);
                onChange('marginBottom', newVal);
              }}
            />
          </div>
        </div>
      </div>

      {/* Padding */}
      <div className="space-y-6 bg-slate-50/50 dark:bg-slate-900/30 p-6 border border-slate-100 dark:border-slate-800 rounded-[2rem]">
        <div className="space-y-4">
          <ResponsiveLabel>Internal Padding</ResponsiveLabel>
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-bold text-slate-500 dark:text-slate-400">
              <span>0 (None)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black">
                {typeof attributes.padding === 'object' ? (attributes.padding[activeDevice] || '0') : (attributes.padding || '0')}
              </span>
              <span>16 (Max)</span>
            </div>
            <input 
              type="range" min="0" max="16" step="1"
              className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              value={(() => {
                const val = typeof attributes.padding === 'object' ? (attributes.padding[activeDevice] || '0') : (attributes.padding || '0');
                return parseInt(val.toString().replace(/[^\d]/g, '')) || 0;
              })()}
              onChange={(e) => {
                const val = e.target.value === '0' ? '' : `p-${e.target.value}`;
                const newVal = updateResponsiveValue(attributes.padding, activeDevice, val);
                onChange('padding', newVal);
              }}
            />
          </div>
        </div>
      </div>

      {/* Z-Index */}
      <div className="space-y-4">
         <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">Z-Index (Stack Order)</label>
         <div className="flex gap-2 flex-wrap">
           {['auto', '0', '10', '20', '30', '40', '50'].map(z => (
             <button
               key={z}
               onClick={() => onChange('zIndex', z === 'auto' ? null : `z-${z}`)}
               className={cn(
                 "px-3 py-2 text-[9px] font-black uppercase rounded-lg border transition-all",
                 (attributes.zIndex || 'auto') === (z === 'auto' ? 'auto' : `z-${z}`) 
                   ? "bg-emerald-600 border-emerald-600 text-white shadow-lg" 
                   : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-emerald-200 dark:hover:border-emerald-800"
               )}
             >
               {z}
             </button>
           ))}
         </div>
         <p className="text-[8px] text-slate-400 dark:text-slate-500 font-medium italic text-left">Useful when overlapping elements with negative margin.</p>
      </div>
    </div>
  );
};
