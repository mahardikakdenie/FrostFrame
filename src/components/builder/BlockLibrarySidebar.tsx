import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Layout, Grid, Type, Image as ImageIcon, CreditCard, Zap, Star, Rows3, Columns2, Sparkles, LayoutTemplate, Grid3X3, AlignLeft, Smile, Minus } from 'lucide-react';
import { BLOCK_VARIANTS } from '../../lib/blockVariants';
import { cn } from '../../lib/utils';

interface VariantPickerProps {
  onAddSection: (type: string, payload?: any) => void;
}

export function BlockLibrarySidebar({ onAddSection }: VariantPickerProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('basicElements');

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
    // If it's a layoutRow variant, the 'type' is 'layoutRow'
    const baseType = type === 'layoutRow' ? 'layoutRow' : 
                    ['heroSections', 'features', 'pricing'].includes(type) ? 'layoutRow' : type;
    
    e.dataTransfer.setData('tiptap-node-type', baseType);
    e.dataTransfer.setData('tiptap-variant-payload', JSON.stringify(payload));
    document.body.classList.add('is-dragging-' + baseType);
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
                  "flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer group",
                  isExpanded ? "border-indigo-500 bg-indigo-50" : "border-slate-100 bg-white hover:border-indigo-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors skew-x--10",
                    isExpanded ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                  )}>
                    <div className="skew-x-10">
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest italic", isExpanded ? "text-indigo-700" : "text-slate-600")}>
                    {cat.label}
                  </span>
                </div>
                <div className="text-slate-400">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </div>

              {/* Variants Grid */}
              {isExpanded && variants && (
                <div className="grid grid-cols-2 gap-3 pl-2 pr-2 animate-in fade-in slide-in-from-top-2">
                  {variants.map(variant => {
                    const TargetIcon = variant.icon;
                    return (
                      <div 
                        key={variant.id}
                        onClick={() => onAddSection('layoutRow', variant.generatePayload())}
                        draggable
                        onDragStart={(e) => handleDragStartVariant(e, cat.type, variant.generatePayload())}
                        onDragEnd={() => document.body.className = document.body.className.replace(/\bis-dragging-\S+/g, '')}
                        className="aspect-square bg-slate-50 border-2 border-slate-100 hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all group scale-100 active:scale-95 cursor-grab active:cursor-grabbing hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1"
                      >
                        <div className="w-12 h-12 bg-white border-2 border-slate-200 group-hover:border-indigo-100 rounded-xl transition-all shadow-sm flex items-center justify-center group-hover:rotate-6 group-hover:scale-110">
                          <TargetIcon className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <span className="text-[8px] font-black justify-center items-center text-center uppercase tracking-[0.1em] text-slate-500 group-hover:text-indigo-600 italic leading-none px-2">
                          {variant.name}
                        </span>
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
