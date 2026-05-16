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
      <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter text-left">ICON PICKER</h2>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input 
          type="text" 
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
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
                "aspect-square flex items-center justify-center rounded-lg border",
                attributes.icon === name ? "bg-indigo-600 text-white" : "bg-white text-slate-400"
              )}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>
      
      <div className="pt-6 border-t border-slate-100">
        <ColorPicker 
          label="Icon Color" 
          value={attributes.color || '#4f46e5'} 
          onChange={(color) => onChange('color', color)} 
        />
      </div>
    </div>
  );
};
