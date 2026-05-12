import React from 'react';
import { cn } from '../../lib/utils';
import { Maximize, Minimize, Expand, LayoutList } from 'lucide-react';

interface DimensionConfigProps {
  value: any;
  onChange: (key: string, val: any) => void;
  nodeType: string;
}

export function DimensionConfig({ value, onChange, nodeType }: DimensionConfigProps) {
  const isRow = nodeType.toLowerCase().includes('row') || nodeType === 'sectionGrid' || nodeType.toLowerCase().includes('section');
  const isColumn = nodeType.toLowerCase().includes('column');

  if (!isRow && !isColumn) return null;

  const handleWidthChange = (w: string) => {
    onChange('width', w);
    if (w !== 'w-full') {
       onChange('flexSizing', 'custom');
    }
  };

  return (
    <div className="space-y-6 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-2 mb-2">
        <Expand className="w-3.5 h-3.5 text-slate-400" />
        <h4 className="text-[10px] font-black tracking-widest text-slate-800 uppercase">
          Dimensions & Sizing
        </h4>
      </div>

      {isRow && (
        <>
          <div className="space-y-4">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">
              Height
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'auto', label: 'Auto' },
                { id: 'min-h-screen', label: 'Min Screen' },
                { id: 'h-screen', label: 'Full Screen' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChange('height', opt.id)}
                  className={cn(
                    "py-2 px-1 text-[10px] font-semibold rounded-md transition-all border",
                    (value?.height || 'auto') === opt.id 
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">
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
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {isColumn && (
        <>
          <div className="space-y-4">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">
              Flex Sizing
            </label>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'flex-1', label: 'Fill / Grow' },
                { id: 'flex-none', label: 'Hug Content' },
                { id: 'custom', label: 'Custom' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChange('flexSizing', opt.id)}
                  className={cn(
                    "flex-1 py-1.5 text-[10px] font-semibold rounded-md transition-all",
                    (value?.flexSizing || 'flex-1') === opt.id 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {(value?.flexSizing === 'custom' || value?.flexSizing === 'flex-none') && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">
                Width
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'w-full md:w-1/4', label: '25%' },
                  { id: 'w-full md:w-1/3', label: '33%' },
                  { id: 'w-full md:w-1/2', label: '50%' },
                  { id: 'w-full', label: '100%' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleWidthChange(opt.id)}
                    className={cn(
                      "py-2 px-1 text-[10px] font-semibold rounded-md transition-all border",
                      (value?.width || 'w-full') === opt.id 
                        ? "bg-blue-50 border-blue-200 text-blue-700" 
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
