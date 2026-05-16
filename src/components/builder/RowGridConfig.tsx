import React from 'react';
import { 
  Columns, 
  LayoutTemplate, 
  Columns3, 
  Columns4, 
  ArrowRight, 
  ArrowDown,
  AlignCenter,
  AlignLeft,
  AlignRight,
  StretchHorizontal
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../store/useUIStore';
import { ResponsiveLabel, updateResponsiveValue } from './ResponsiveConfig';

interface RowGridConfigProps {
  value: any;
  onChange: (key: string, value: any) => void;
  elementPath: string;
  nodeType?: string;
}

export function RowGridConfig({ value, onChange, nodeType }: RowGridConfigProps) {
  const activeDevice = useUIStore(state => state.activeDevice);
  
  const currentDisplayType = value?.displayType || 'grid';
  const currentFlexDirection = value?.flexDirection || 'row';
  const currentAlignItems = value?.alignItems || 'stretch';
  const currentJustifyContent = value?.justifyContent || 'start';
  
  // Handle responsive gridCols
  const rawGridCols = value?.gridCols || 1;
  let currentGridCols = 1;
  
  if (typeof rawGridCols === 'object' && rawGridCols !== null) {
    currentGridCols = rawGridCols[activeDevice] || rawGridCols.desktop || 1;
  } else {
    currentGridCols = rawGridCols;
  }
  
  const isLayoutRow = nodeType === 'layoutRow';

  if (!isLayoutRow) return null;

  const handleGridChange = (cols: number) => {
    const newVal = updateResponsiveValue(value?.gridCols, activeDevice, cols);
    onChange('gridCols', newVal);
  };

  const handleDisplayTypeChange = (type: string) => {
      onChange('displayType', type);
  };

  return (
    <div className="space-y-8">
      {/* Display Type */}
      <div className="space-y-4">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">
          Display Mode
        </label>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => handleDisplayTypeChange('grid')}
            className={cn(
              "flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all",
              currentDisplayType === 'grid' 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Grid Layout
          </button>
          <button
            onClick={() => handleDisplayTypeChange('flex')}
            className={cn(
              "flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all",
              currentDisplayType === 'flex' 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Flex Layout
          </button>
        </div>
      </div>

      {/* Flex Specific Config */}
      {currentDisplayType === 'flex' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
          {/* Direction */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">
              Direction (Sejajar / Bertumpuk)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChange('flexDirection', 'row')}
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-center gap-2 transition-all",
                  currentFlexDirection === 'row' 
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm" 
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                )}
              >
                <ArrowRight className="w-4 h-4" />
                <span className="text-[10px] font-bold">Sejajar (Row)</span>
              </button>
              <button
                onClick={() => onChange('flexDirection', 'col')}
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-center gap-2 transition-all",
                  currentFlexDirection === 'col' 
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm" 
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                )}
              >
                <ArrowDown className="w-4 h-4" />
                <span className="text-[10px] font-bold">Bertumpuk (Col)</span>
              </button>
            </div>
          </div>

          {/* Alignment */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">
              Alignment (Cross Axis)
            </label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
               {[
                 { id: 'start', icon: AlignLeft },
                 { id: 'center', icon: AlignCenter },
                 { id: 'end', icon: AlignRight },
                 { id: 'stretch', icon: StretchHorizontal },
               ].map(item => (
                 <button
                   key={item.id}
                   onClick={() => onChange('alignItems', item.id)}
                   className={cn(
                     "flex-1 py-2 flex justify-center items-center rounded-lg transition-all",
                     currentAlignItems === item.id 
                       ? "bg-white text-indigo-600 shadow-sm" 
                       : "text-slate-400 hover:text-slate-600"
                   )}
                 >
                   <item.icon className="w-4 h-4" />
                 </button>
               ))}
            </div>
          </div>

          {/* Justify */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">
              Distribution (Main Axis)
            </label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
               {[
                 { id: 'start', label: 'Start' },
                 { id: 'center', label: 'Center' },
                 { id: 'end', label: 'End' },
                 { id: 'between', label: 'Space Between' },
               ].map(item => (
                 <button
                   key={item.id}
                   onClick={() => onChange('justifyContent', item.id)}
                   className={cn(
                     "flex-1 py-1 text-[8px] font-black uppercase rounded-lg transition-all",
                     currentJustifyContent === item.id 
                       ? "bg-white text-indigo-600 shadow-sm" 
                       : "text-slate-400 hover:text-slate-600"
                   )}
                 >
                   {item.label.split(' ')[0]}
                 </button>
               ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid Specific Config */}
      {currentDisplayType === 'grid' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <ResponsiveLabel>
            Grid Columns
          </ResponsiveLabel>
          
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 6].map(cols => (
              <button
                key={cols}
                onClick={() => handleGridChange(cols)}
                className={cn(
                  "p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all",
                  currentGridCols === cols 
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm" 
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                )}
              >
                {cols === 1 ? <LayoutTemplate className="w-4 h-4" /> : 
                 cols === 2 ? <Columns className="w-4 h-4" /> : 
                 cols === 3 ? <Columns3 className="w-4 h-4" /> : 
                 cols === 4 ? <Columns4 className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                <span className="text-[10px] font-bold">{cols} {cols === 1 ? 'Column' : 'Columns'}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const Grid3X3 = ({ className }: any) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>
  </svg>
);
