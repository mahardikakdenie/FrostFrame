import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const SWATCHES = [
  '#000000', '#ffffff', '#4f46e5', '#ef4444', 
  '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6',
  '#ec4899', '#64748b'
];

export const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => {
  const [localColor, setLocalColor] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalColor(value);
  }, [value]);

  const handleChange = (newColor: string) => {
    setLocalColor(newColor);
    
    // Throttled update to the store/parent
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(newColor);
    }, 100);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">{label}</label>
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full border border-slate-200 shadow-sm transition-colors duration-100" 
            style={{ backgroundColor: localColor }}
          />
          <input 
            type="text" 
            value={localColor}
            onChange={(e) => handleChange(e.target.value)}
            className="w-16 text-[10px] font-mono font-bold bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 outline-none focus:border-indigo-500"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {SWATCHES.map((color) => (
          <button
            key={color}
            onClick={() => handleChange(color)}
            className={cn(
              "w-5 h-5 rounded-full border border-slate-200 transition-transform active:scale-75",
              localColor === color && "ring-2 ring-indigo-500 ring-offset-1 scale-110"
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <input 
        type="color" 
        value={localColor}
        onChange={(e) => handleChange(e.target.value)}
        className="sr-only"
        id={`color-input-${label}`}
      />
      <label 
        htmlFor={`color-input-${label}`}
        className="block w-full py-1.5 border border-slate-200 rounded-lg text-center text-[9px] font-black uppercase tracking-tighter text-slate-400 hover:bg-slate-50 cursor-pointer transition-colors"
      >
        Custom Hex / RGB
      </label>
    </div>
  );
};
