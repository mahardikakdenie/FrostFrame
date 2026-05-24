import React from 'react';
import { Search, HelpCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ColorPicker } from '../ColorPicker';
import { cn } from '../../../lib/utils';
import { ElementConfigProps } from './types';

export const IconConfig = ({ value, onChange }: ElementConfigProps) => {
  const isObject = typeof value === 'object' && value !== null;
  const attributes = isObject ? value : {};
  const [searchTerm, setSearchQuery] = React.useState('');

  const popularIcons = ['Star', 'Zap', 'Heart', 'Shield', 'Smartphone', 'Search', 'Check', 'X', 'Layout', 'Grid3X3'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
      <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter text-left">ICON PICKER</h2>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        <input 
          type="text" 
          className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30"
          value={searchTerm}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search icons..."
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {popularIcons.map(name => {
          const Icon = (LucideIcons as any)[name] || HelpCircle;
          return (
            <button 
              key={name}
              onClick={() => onChange('icon', name)}
              className={cn(
                "aspect-square flex items-center justify-center rounded-lg border transition-all",
                attributes.icon === name 
                  ? "bg-indigo-600 border-indigo-600 text-white" 
                  : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-indigo-200 dark:hover:border-indigo-500/30"
              )}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>
      
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
        <ColorPicker 
          label="Icon Color" 
          value={attributes.color || '#4f46e5'} 
          onChange={(color) => onChange('color', color)} 
        />
      </div>
    </div>
  );
};
