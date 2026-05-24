import React from 'react';
import { useUIStore } from '../../../store/useUIStore';
import { ResponsiveLabel, updateResponsiveValue } from '../ResponsiveConfig';
import { ElementConfigProps } from './types';

export const SpacerConfig = ({ value, onChange }: ElementConfigProps) => {
  const activeDevice = useUIStore(state => state.activeDevice);
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Layout Helper</span>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">EMPTY SPACER</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
           <ResponsiveLabel>Spacer Height (px)</ResponsiveLabel>
           <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span>0px</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-black">
                  {typeof attributes.height === 'object' 
                    ? (attributes.height[activeDevice] || '40px') 
                    : (attributes.height || '40px')}
                </span>
                <span>200px</span>
              </div>
              <input 
                type="range" 
                min="0" max="200" step="5"
                className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                value={(() => {
                  const val = typeof attributes.height === 'object' 
                    ? (attributes.height[activeDevice] || '40px') 
                    : (attributes.height || '40px');
                  return parseInt(val.toString().replace(/[^\d]/g, '')) || 40;
                })()}
                onChange={(e) => {
                  const val = `${e.target.value}px`;
                  const newVal = updateResponsiveValue(attributes.height, activeDevice, val);
                  onChange('height', newVal);
                }}
              />
           </div>
        </div>
      </div>
    </div>
  );
};
