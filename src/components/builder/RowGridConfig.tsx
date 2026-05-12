import React from 'react';
import { Columns, SplitSquareHorizontal, LayoutTemplate, Columns3, Columns4 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RowGridConfigProps {
  value: any;
  onChange: (key: string, value: any) => void;
  elementPath: string;
  nodeType?: string;
}

export function RowGridConfig({ value, onChange, elementPath, nodeType }: RowGridConfigProps) {
  const currentGridCols = value?.gridCols || value?.columns || 2;
  const currentDisplayType = value?.displayType || 'grid';
  const currentFlexWrap = value?.flexWrap || 'wrap';
  
  const isFreeRow = nodeType === 'freeRow';
  const isStrictHeroRow = nodeType === 'strictHeroRow';
  const isSectionGrid = nodeType === 'sectionGrid';

  if (!isFreeRow && !isSectionGrid && !isStrictHeroRow) return null;

  const handleGridChange = (cols: number | string) => {
    if (isSectionGrid) {
      onChange('columns', cols);
      return;
    }
    if (isStrictHeroRow) {
      onChange('gridCols', cols);
      return;
    }
    const editor = (window as any).editor;
    if (editor) {
      editor.chain().focus().updateGridCols(cols).run();
    }
  };

  const handleDisplayTypeChange = (type: string) => {
      onChange('displayType', type);
      if (type === 'flex') {
          // Defaults for flex so it resets gracefully
          onChange('flexWrap', 'wrap'); 
      }
  };

  const handleFlexWrapChange = (wrap: string) => {
      onChange('flexWrap', wrap);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">
          Display Settings
        </label>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => handleDisplayTypeChange('grid')}
            className={cn(
              "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all",
              currentDisplayType === 'grid' 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Grid
          </button>
          <button
            onClick={() => handleDisplayTypeChange('flex')}
            className={cn(
              "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all",
              currentDisplayType === 'flex' 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Flex
          </button>
        </div>
      </div>

      {currentDisplayType === 'flex' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">
            Flex Wrap
          </label>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => handleFlexWrapChange('wrap')}
              className={cn(
                "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all",
                currentFlexWrap === 'wrap' 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              Wrap
            </button>
            <button
              onClick={() => handleFlexWrapChange('nowrap')}
              className={cn(
                "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all",
                currentFlexWrap === 'nowrap' 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              No Wrap
            </button>
          </div>
        </div>
      )}

      {currentDisplayType === 'grid' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">
            Grid Configuration
          </label>
          
          {/* Rest of the existing grid buttons */}
          <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleGridChange(1)}
          className={cn(
            "p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all",
            currentGridCols === 1 
              ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm" 
              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
          )}
        >
          <LayoutTemplate className="w-5 h-5" />
          <span className="text-[10px] font-bold">1 Column</span>
        </button>
        
        <button
          onClick={() => handleGridChange(2)}
          className={cn(
            "p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all",
            currentGridCols === 2 
              ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm" 
              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
          )}
        >
          <Columns className="w-5 h-5" />
          <span className="text-[10px] font-bold">2 Columns</span>
        </button>

        <button
          onClick={() => handleGridChange('left-sidebar')}
          className={cn(
            "p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all",
            currentGridCols === 'left-sidebar' 
              ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm" 
              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
          )}
        >
          <SplitSquareHorizontal className="w-5 h-5 -scale-x-100" />
          <span className="text-[10px] font-bold">2 Cols (Left Small)</span>
        </button>
        
        <button
          onClick={() => handleGridChange('right-sidebar')}
          className={cn(
            "p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all",
            currentGridCols === 'right-sidebar' 
              ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm" 
              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
          )}
        >
          <SplitSquareHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-bold">2 Cols (Right Small)</span>
        </button>

        <button
          onClick={() => handleGridChange(3)}
          className={cn(
            "p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all",
            currentGridCols === 3 
              ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm" 
              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
          )}
        >
          <Columns3 className="w-5 h-5" />
          <span className="text-[10px] font-bold">3 Columns</span>
        </button>
        <button
          onClick={() => handleGridChange(4)}
          className={cn(
            "p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all",
            currentGridCols === 4 
              ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm" 
              : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
          )}
        >
          <Columns4 className="w-5 h-5" />
          <span className="text-[10px] font-bold">4 Columns</span>
        </button>
      </div>
      </div>
      )}

      {isFreeRow && (
        <button
          onClick={() => {
            const editor = (window as any).editor;
            if (editor) {
              editor.chain().focus().addFreeColumn().run();
            }
          }}
          className="mt-4 w-full py-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-200 border-dashed flex items-center justify-center gap-2"
        >
          <span className="text-lg leading-none">+</span>
          <span>Add Empty Column</span>
        </button>
      )}
    </div>
  );
}
