import React from 'react';
import { cn } from '../../lib/utils';
import { Expand, AlignLeft, AlignCenter, AlignRight, StretchHorizontal } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { ResponsiveLabel, updateResponsiveValue } from './ResponsiveConfig';

interface DimensionConfigProps {
  value: any;
  onChange: (key: string, val: any) => void;
  nodeType: string;
  isParentGrid?: boolean;
}

export function DimensionConfig({ value, onChange, nodeType, isParentGrid }: DimensionConfigProps) {
  const activeDevice = useUIStore(state => state.activeDevice);
  const isRow = nodeType.toLowerCase().includes('row') || nodeType === 'sectionGrid' || nodeType.toLowerCase().includes('section');
  const isColumn = nodeType.toLowerCase().includes('column');

  if (!isRow && !isColumn) return null;

  // Handle responsive width
  const rawWidth = value?.width || 'w-full';
  let currentWidth = 'w-full';
  if (typeof rawWidth === 'object' && rawWidth !== null) {
    currentWidth = rawWidth[activeDevice] || rawWidth.desktop || 'w-full';
  } else {
    currentWidth = rawWidth;
  }

  // Handle responsive padding
  const rawPadding = value?.padding || '4';
  let currentPadding = '4';
  if (typeof rawPadding === 'object' && rawPadding !== null) {
    currentPadding = rawPadding[activeDevice] || rawPadding.desktop || '4';
  } else {
    currentPadding = rawPadding;
  }

  const handleWidthChange = (w: string) => {
    const newVal = updateResponsiveValue(value?.width, activeDevice, w);
    onChange('width', newVal);
    if (w !== 'w-full' && isColumn) {
       onChange('flexSizing', 'custom');
    }
  };

  const handlePaddingChange = (p: string) => {
    const newVal = updateResponsiveValue(value?.padding, activeDevice, p);
    onChange('padding', newVal);
  };

  return (
    <div className="space-y-8 pt-4 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-2">
        <Expand className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        <h4 className="text-[10px] font-black tracking-widest text-slate-800 dark:text-slate-200 uppercase">
          Dimensions & Sizing
        </h4>
      </div>

      {isRow && (
        <div className="space-y-4">
          <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic">
            Max Width
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'max-w-7xl mx-auto', label: 'Container (Boxed)' },
              { id: 'w-full', label: 'Full Width' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange('maxWidth', opt.id)}
                className={cn(
                  "py-2 px-1 text-[10px] font-semibold rounded-md transition-all border",
                  (value?.maxWidth || 'max-w-7xl mx-auto') === opt.id 
                    ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400" 
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isColumn && (
        <>
          <div className="space-y-4">
            <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block italic text-left">
              Text Alignment
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'text-left', icon: AlignLeft },
                { id: 'text-center', icon: AlignCenter },
                { id: 'text-right', icon: AlignRight },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChange('textAlign', opt.id)}
                  className={cn(
                    "py-2 px-1 text-[10px] font-semibold rounded-md transition-all border flex justify-center items-center",
                    (value?.textAlign || 'text-left') === opt.id 
                      ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400" 
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                  )}
                >
                  <opt.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <ResponsiveLabel>
              Width
            </ResponsiveLabel>
            {isParentGrid ? (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                 <span className="text-[9px] font-bold text-amber-700 dark:text-amber-500 leading-tight block uppercase">
                   Width managed by Parent Grid
                 </span>
                 <p className="text-[7px] text-amber-600/70 dark:text-amber-500/50 mt-1 italic leading-relaxed">
                   Lebar kolom ini dikontrol secara otomatis oleh sistem Grid pada baris (Row) induknya.
                 </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'w-1/4', label: '25%' },
                  { id: 'w-1/3', label: '33%' },
                  { id: 'w-1/2', label: '50%' },
                  { id: 'w-full', label: '100%' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleWidthChange(opt.id)}
                    className={cn(
                      "py-2 px-1 text-[10px] font-semibold rounded-md transition-all border",
                      currentWidth === opt.id 
                        ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400" 
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <ResponsiveLabel>
              Minimum Height (px)
            </ResponsiveLabel>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span>Auto</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-black">
                  {typeof value?.minHeight === 'object' 
                    ? (value?.minHeight[activeDevice] || 'Auto') 
                    : (value?.minHeight || 'Auto')}
                </span>
                <span>2000px</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="2000" 
                step="10"
                className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                value={(() => {
                  const val = typeof value?.minHeight === 'object' 
                    ? (value?.minHeight[activeDevice] || '0') 
                    : (value?.minHeight || '0');
                  return parseInt(val.toString().replace(/[^\d-]/g, '')) || 0;
                })()}
                onChange={(e) => {
                  const val = e.target.value === '0' ? 'auto' : `${e.target.value}px`;
                  const newVal = updateResponsiveValue(value?.minHeight, activeDevice, val);
                  onChange('minHeight', newVal);
                }}
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                 <button 
                   onClick={() => {
                     const newVal = updateResponsiveValue(value?.minHeight, activeDevice, '100vh');
                     onChange('minHeight', newVal);
                   }}
                   className={cn(
                     "py-1.5 text-[8px] font-black uppercase rounded-lg border transition-all",
                     (typeof value?.minHeight === 'object' ? value.minHeight[activeDevice] : value.minHeight) === '100vh'
                       ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                       : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-800"
                   )}
                 >
                   Full Screen (100vh)
                 </button>
                 <button 
                   onClick={() => {
                     const newVal = updateResponsiveValue(value?.minHeight, activeDevice, 'auto');
                     onChange('minHeight', newVal);
                   }}
                   className="py-1.5 text-[8px] font-black uppercase rounded-lg border bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-900 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                 >
                   Reset / Auto
                 </button>
              </div>
            </div>
          </div>

          {/* New Margin Section (Supports Minus) */}
          <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800">
            <ResponsiveLabel>
              Vertical Margin (px / Minus allowed)
            </ResponsiveLabel>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span>-200px</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">
                  {(() => {
                    const val = typeof value?.marginTop === 'object' 
                      ? (value?.marginTop[activeDevice] || '0px') 
                      : (value?.marginTop || '0px');
                    return val;
                  })()}
                </span>
                <span>200px</span>
              </div>
              <input 
                type="range" 
                min="-200" 
                max="200" 
                step="5"
                className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                value={(() => {
                  const val = typeof value?.marginTop === 'object' 
                    ? (value?.marginTop[activeDevice] || '0') 
                    : (value?.marginTop || '0');
                  return parseInt(val.toString().replace(/[^\d-]/g, '')) || 0;
                })()}
                onChange={(e) => {
                  const newVal = updateResponsiveValue(value?.marginTop, activeDevice, `${e.target.value}px`);
                  onChange('marginTop', newVal);
                }}
              />
              <p className="text-[7px] text-slate-400 dark:text-slate-500 italic">Use negative values to overlap elements.</p>
            </div>
          </div>

          <div className="space-y-4">
            <ResponsiveLabel>
              Internal Padding
            </ResponsiveLabel>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: '0', label: '0' },
                { id: '2', label: 'S' },
                { id: '4', label: 'M' },
                { id: '8', label: 'L' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handlePaddingChange(opt.id)}
                  className={cn(
                    "py-2 px-1 text-[10px] font-semibold rounded-md transition-all border",
                    currentPadding === opt.id 
                      ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400" 
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
