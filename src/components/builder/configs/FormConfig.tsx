import React from 'react';
import { ElementConfigProps } from './types';

export function FormConfig({ value, onChange }: ElementConfigProps) {
  const nodeType = value.type;

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-500">
      <div className="space-y-2">
        <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic ml-0.5">Field Label</label>
        <input 
          type="text" 
          className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border border-slate-200 dark:border-slate-800"
          value={value.label || ''}
          onChange={(e) => onChange('label', e.target.value)}
          placeholder="e.g. FULL NAME"
        />
      </div>

      {(nodeType === 'inputElement' || nodeType === 'textareaElement') && (
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic ml-0.5">Placeholder</label>
          <input 
            type="text" 
            className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border border-slate-200 dark:border-slate-800"
            value={value.placeholder || ''}
            onChange={(e) => onChange('placeholder', e.target.value)}
            placeholder="e.g. Enter your name..."
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic ml-0.5">Field Name (ID)</label>
        <input 
          type="text" 
          className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border border-slate-200 dark:border-slate-800"
          value={value.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="e.g. user_name"
        />
      </div>

      {nodeType === 'textareaElement' && (
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic ml-0.5">Rows</label>
          <input 
            type="number" 
            className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border border-slate-200 dark:border-slate-800"
            value={value.rows || 4}
            onChange={(e) => onChange('rows', parseInt(e.target.value))}
          />
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase italic">Required Field</span>
          <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Mark as mandatory</span>
        </div>
        <button 
          onClick={() => onChange('required', !value.required)}
          className={`w-12 h-6 rounded-full transition-all relative ${value.required ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value.required ? 'right-1' : 'left-1'}`} />
        </button>
      </div>
    </div>
  );
}
