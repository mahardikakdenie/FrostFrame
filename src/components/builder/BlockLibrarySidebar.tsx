import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Layout, Grid, Type, Image as ImageIcon, CreditCard, Zap, Star, Rows3, Columns2, Sparkles, LayoutTemplate, Grid3X3, AlignLeft, Smile, Minus, Plus } from 'lucide-react';
import { BLOCK_VARIANTS } from '../../lib/blockVariants';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../store/useUIStore';

interface VariantPickerProps {
  onAddSection: (type: string, payload?: any) => void;
}

export function BlockLibrarySidebar({ onAddSection }: VariantPickerProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('basicElements');
  const setDragState = useUIStore((state) => state.setDragState);

  const categories = [
    { label: 'Basic Elements', type: 'basicElements', icon: Sparkles },
    { label: 'Layout Rows', type: 'layoutRow', icon: Layout },
    { label: 'Hero Sections', type: 'heroSections', icon: Grid },
    { label: 'Features', type: 'features', icon: Zap },
    { label: 'Pricing', type: 'pricing', icon: CreditCard },
  ];

  const toggleCategory = (type: string) => {
    setExpandedCategory(expandedCategory === type ? null : type);
  };

  const handleDragStartVariant = (e: React.DragEvent, type: string, payload: any) => {
    // For Tiptap drag and drop, we pass the node type and optional payload
    // Use the actual node type from payload if available, otherwise fallback to category type
    const baseType = payload?.type || (type === 'layoutRow' ? 'layoutRow' : 
                    ['heroSections', 'features', 'pricing'].includes(type) ? 'layoutRow' : type);
    
    e.dataTransfer.setData('tiptap-node-type', baseType);
    e.dataTransfer.setData('tiptap-variant-payload', JSON.stringify(payload));
    setDragState(true, baseType);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-[12px] font-black text-slate-900 uppercase italic tracking-widest">Component Library</h3>
          <div className="p-2 bg-slate-50 rounded-lg text-slate-400 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-all">
            <Search className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {categories.map((cat) => {
          const variants = BLOCK_VARIANTS[cat.type];
          const isExpanded = expandedCategory === cat.type;
          const CategoryIcon = cat.icon;

          return (
            <div key={cat.label} className="flex flex-col gap-2">
              {/* Category Header */}
              <div 
                onClick={() => toggleCategory(cat.type)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-[2rem] transition-all cursor-pointer group skew-x-[-2deg]",
                  isExpanded 
                    ? "bg-indigo-600 text-white shadow-[0_15px_40px_rgba(79,70,229,0.25)]" 
                    : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 hover:-translate-y-1"
                )}
              >
                <div className="flex items-center gap-4 skew-x-[2deg]">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                    isExpanded ? "bg-white text-indigo-600" : "bg-white text-slate-400 group-hover:bg-indigo-600 group-hover:text-white shadow-sm"
                  )}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <span className={cn("text-[11px] font-black uppercase tracking-[0.2em] italic", isExpanded ? "text-white" : "text-slate-500 group-hover:text-slate-900")}>
                    {cat.label}
                  </span>
                </div>
                <div className={cn("skew-x-[2deg] pr-2", isExpanded ? "text-white" : "text-slate-300")}>
                  {isExpanded ? <ChevronDown className="w-5 h-5 animate-bounce-subtle" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </div>

              {/* Variants Grid */}
              {isExpanded && variants && (
                <div className="grid grid-cols-2 gap-3 pt-3 pb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  {variants.map(variant => {
                    const TargetIcon = variant.icon;
                    return (
                      <div 
                        key={variant.id}
                        onClick={() => onAddSection('layoutRow', variant.generatePayload())}
                        draggable
                        onDragStart={(e) => handleDragStartVariant(e, cat.type, variant.generatePayload())}
                        onDragEnd={() => setDragState(false, null)}
                        className={cn(
                          "bg-white rounded-2xl flex flex-col transition-all group scale-100 active:scale-95 cursor-grab active:cursor-grabbing hover:shadow-lg border border-slate-100 hover:border-indigo-100 overflow-hidden relative",
                          variant.image ? "min-h-[140px]" : "aspect-square items-center justify-center gap-3"
                        )}
                      >
                        {variant.image ? (
                          <div className="w-full h-24 overflow-hidden transition-all bg-slate-50 relative">
                            <img 
                              src={variant.image} 
                              alt={variant.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                            />
                            <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-slate-50 rounded-xl transition-all flex items-center justify-center group-hover:bg-indigo-50 shadow-sm">
                            <TargetIcon className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                          </div>
                        )}
                        <div className="p-3 flex items-center justify-between w-full bg-white relative z-10 border-t border-slate-50">
                          <div className="flex flex-col text-left min-w-0">
                            <span className="text-[9px] font-black uppercase tracking-tight text-slate-900 italic leading-none mb-1 truncate">
                              {variant.name}
                            </span>
                            <span className="text-[7px] font-bold text-slate-300 uppercase tracking-widest leading-none truncate">
                              {cat.label.replace('Elements', 'Ele')}
                            </span>
                          </div>
                          {!variant.image && (
                            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                              <Plus className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
