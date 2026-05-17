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
  isParentGrid?: boolean;
}

export function RowGridConfig({ value, onChange, nodeType, isParentGrid }: RowGridConfigProps) {
  const activeDevice = useUIStore(state => state.activeDevice);
  
  const isColumn = nodeType === 'layoutColumn';
  const isLayoutRow = nodeType === 'layoutRow' || nodeType === 'sectionGrid' || nodeType?.toLowerCase().includes('row');

  const currentDisplayType = value?.displayType || (isColumn ? 'flex' : 'grid');

  // Helper to read responsive attribute
  const getVal = (attr: any, def: any) => {
    if (typeof attr === 'object' && attr !== null) {
      return attr[activeDevice] || attr.desktop || def;
    }
    return attr || def;
  };

  const currentFlexDirection = getVal(value?.flexDirection, isColumn ? 'col' : 'row');
  const currentAlignItems = getVal(value?.alignItems, 'stretch');
  const currentJustifyContent = getVal(value?.justifyContent, 'start');
  const currentAlignContent = getVal(value?.alignContent, 'start');
  
  // Handle responsive gap
  const rawGap = value?.gap || (isColumn ? '1rem' : '1.5rem');
  let currentGap = '1rem';
  if (typeof rawGap === 'object' && rawGap !== null) {
    currentGap = rawGap[activeDevice] || rawGap.desktop || (isColumn ? '1rem' : '1.5rem');
  } else {
    currentGap = rawGap;
  }
  
  // Handle responsive gridCols
  const rawGridCols = value?.gridCols || 1;
  let currentGridCols = 1;
  
  if (typeof rawGridCols === 'object' && rawGridCols !== null) {
    currentGridCols = rawGridCols[activeDevice] || rawGridCols.desktop || 1;
  } else {
    currentGridCols = rawGridCols;
  }

  if (!isLayoutRow && !isColumn) return null;

  const handleGridChange = (cols: number) => {
    const newVal = updateResponsiveValue(value?.gridCols, activeDevice, cols);
    onChange('gridCols', newVal);
  };

  const handleDisplayTypeChange = (type: string) => {
      onChange('displayType', type);
  };

  const handleGapChange = (val: string) => {
    const newVal = updateResponsiveValue(value?.gap, activeDevice, val);
    onChange('gap', newVal);
  };

  const handleFlexChange = (key: string, val: string) => {
    const newVal = updateResponsiveValue(value?.[key], activeDevice, val);
    onChange(key, newVal);
  };

  return (
    <div className="space-y-8">
      {/* Display Type */}
      {!isColumn && (
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
      )}

      {/* Gap Configuration (Available for both) */}
      <div className="space-y-4">
        <ResponsiveLabel>
          Gap / Spacing
        </ResponsiveLabel>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-slate-500">
            <span>0px</span>
            <span className="text-indigo-600 font-black">{currentGap}</span>
            <span>64px</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="4" 
            step="0.25"
            className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            value={parseFloat(currentGap.replace('rem', '')) || 0}
            onChange={(e) => handleGapChange(`${e.target.value}rem`)}
          />
        </div>
      </div>

      {/* Flex Specific Config */}
      {(currentDisplayType === 'flex' || isColumn) && (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-2">
          {/* Direction */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">
              {isColumn ? 'Inner Content Direction' : 'Direction (Flow)'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleFlexChange('flexDirection', 'row')}
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-center gap-2 transition-all",
                  currentFlexDirection === 'row' 
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm" 
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                )}
              >
                <ArrowRight className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Horizontal</span>
              </button>
              <button
                onClick={() => handleFlexChange('flexDirection', 'col')}
                className={cn(
                  "p-3 rounded-xl border flex items-center justify-center gap-2 transition-all",
                  currentFlexDirection === 'col' 
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm" 
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                )}
              >
                <ArrowDown className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Vertical</span>
              </button>
            </div>
          </div>

          {/* Justify Content */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">
              {isColumn ? 'Content Distribution (Main Axis)' : 'Justify Content (Main Axis)'}
            </label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
               {[
                 { id: 'start', label: 'Start' },
                 { id: 'center', label: 'Center' },
                 { id: 'end', label: 'End' },
                 { id: 'between', label: 'Between' },
                 { id: 'around', label: 'Around' },
               ].map(item => (
                 <button
                   key={item.id}
                   onClick={() => handleFlexChange('justifyContent', item.id)}
                   className={cn(
                     "flex-1 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all",
                     currentJustifyContent === item.id 
                       ? "bg-white text-indigo-600 shadow-sm" 
                       : "text-slate-400 hover:text-slate-600"
                   )}
                 >
                   {item.label}
                 </button>
               ))}
            </div>
          </div>

          {/* Align Items */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">
              {isColumn ? 'Content Alignment (Cross Axis)' : 'Align Items (Cross Axis)'}
            </label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
               {[
                 { id: 'start', icon: AlignLeft, label: 'Start' },
                 { id: 'center', icon: AlignCenter, label: 'Center' },
                 { id: 'end', icon: AlignRight, label: 'End' },
                 { id: 'stretch', icon: StretchHorizontal, label: 'Stretch' },
               ].map(item => (
                 <button
                   key={item.id}
                   onClick={() => handleFlexChange('alignItems', item.id)}
                   className={cn(
                     "flex-1 py-2 flex flex-col justify-center items-center rounded-lg transition-all gap-1",
                     currentAlignItems === item.id 
                       ? "bg-white text-indigo-600 shadow-sm" 
                       : "text-slate-400 hover:text-slate-600"
                   )}
                   title={item.label}
                 >
                   <item.icon className="w-4 h-4" />
                   <span className="text-[7px] font-black uppercase">{item.label}</span>
                 </button>
               ))}
            </div>
          </div>

          {/* Align Content */}
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">
              {isColumn ? 'Content Line Spacing' : 'Align Content (Line Spacing)'}
            </label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
               {[
                 { id: 'start', label: 'Start' },
                 { id: 'center', label: 'Center' },
                 { id: 'end', label: 'End' },
                 { id: 'between', label: 'Between' },
                 { id: 'stretch', label: 'Stretch' },
               ].map(item => (
                 <button
                   key={item.id}
                   onClick={() => handleFlexChange('alignContent', item.id)}
                   className={cn(
                     "flex-1 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all",
                     currentAlignContent === item.id 
                       ? "bg-white text-indigo-600 shadow-sm" 
                       : "text-slate-400 hover:text-slate-600"
                   )}
                 >
                   {item.label}
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
