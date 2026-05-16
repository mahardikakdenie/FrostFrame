import React from 'react';
import { Plus } from 'lucide-react';
import { ElementConfigProps } from './types';

export const ButtonConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const buttons = isObject && Array.isArray(value.buttons) ? value.buttons : [];

  const updateButton = (index: number, key: string, val: any) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], [key]: val };
    onChange('buttons', newButtons);
  };

  const addButton = () => {
    const newButtons = [...buttons, { text: 'NEW BUTTON', link: '#', color: '#4f46e5', variant: 'secondary' }];
    onChange('buttons', newButtons);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <div className="flex items-center justify-between">
         <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter text-left">BUTTON GROUP</h2>
         <button onClick={addButton} className="bg-indigo-600 text-white p-2 rounded-xl"><Plus className="w-4 h-4" /></button>
      </div>

      <div className="space-y-4">
        {buttons.map((btn: any, idx: number) => (
          <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
             <input 
               type="text" 
               className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold"
               value={btn.text}
               onChange={(e) => updateButton(idx, 'text', e.target.value)}
             />
          </div>
        ))}
      </div>
    </div>
  );
};
