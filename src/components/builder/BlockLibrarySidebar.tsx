import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Layout, Grid, Type, Image as ImageIcon, CreditCard, Zap, Star, Rows3, Columns2, Sparkles, LayoutTemplate, Grid3X3, AlignLeft, Smile, Minus, Plus, MessageSquare } from 'lucide-react';
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
    { label: 'Bento Grid', type: 'bento', icon: Grid3X3 },
    { label: 'Forms', type: 'forms', icon: MessageSquare },
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
    // 🔑 FIX: Also mark document.body so dragover handler (which uses stale closure)
    // can detect the drag type even before React re-renders.
    document.body.classList.add('is-dragging-' + baseType);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-[12px] font-black text-slate-900 dark:text-white uppercase italic tracking-widest">Component Library</h3>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-all">
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
                  "flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer group",
                  isExpanded 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
                    : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                    isExpanded ? "bg-white text-indigo-600" : "bg-white dark:bg-slate-700 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white shadow-sm"
                  )}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <span className={cn("text-[11px] font-black uppercase tracking-[0.2em] italic", isExpanded ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white")}>
                    {cat.label}
                  </span>
                </div>
                <div className={cn("pr-2", isExpanded ? "text-white" : "text-slate-300 dark:text-slate-600")}>
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
                        onDragEnd={() => {
                          setDragState(false, null);
                          // Clean up body class added on dragStart
                          document.body.className = document.body.className.replace(/\bis-dragging-\S+/g, '');
                        }}
                        className={cn(
                          "bg-white dark:bg-slate-800/50 rounded-2xl flex flex-col transition-all group scale-100 active:scale-95 cursor-grab active:cursor-grabbing hover:shadow-xl border border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-900 overflow-hidden relative backdrop-blur-sm",
                          variant.image ? "min-h-[140px]" : "aspect-square items-center justify-center gap-3"
                        )}
                      >
                        {variant.image ? (
                          <div className="w-full h-24 overflow-hidden transition-all bg-slate-50 dark:bg-slate-900 relative">
                            <img 
                              src={variant.image} 
                              alt={variant.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                            />
                            <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700/50 rounded-xl transition-all flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 shadow-sm">
                            <TargetIcon className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                          </div>
                        )}
                        <div className="p-3 flex items-center justify-between w-full bg-white dark:bg-slate-800 relative z-10 border-t border-slate-50 dark:border-slate-700">
                          <div className="flex flex-col text-left min-w-0">
                            <span className="text-[9px] font-black uppercase tracking-tight text-slate-900 dark:text-white italic leading-none mb-1 truncate">
                              {variant.name}
                            </span>
                            <span className="text-[7px] font-bold text-slate-300 dark:text-slate-500 uppercase tracking-widest leading-none truncate">
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
