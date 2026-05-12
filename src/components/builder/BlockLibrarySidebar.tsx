import React, { useState } from 'react';
import { Plus, Search, ChevronDown, ChevronRight, Layout, Rows3, Columns2 } from 'lucide-react';
import { BLOCK_VARIANTS } from '../../lib/blockVariants';
import { cn } from '../../lib/utils';

interface VariantPickerProps {
  onAddSection: (type: string, payload?: any) => void;
}

export function BlockLibrarySidebar({ onAddSection }: VariantPickerProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = [
    { label: 'Hero Sections', type: 'strictHeroRow', hasVariants: true },
    { label: 'Empty Layouts', type: 'freeRow', hasVariants: true },
    { label: 'Features', type: 'featuresSection', hasVariants: false },
    { label: 'Pricing', type: 'pricingSection', hasVariants: false },
    { label: 'Testimonials', type: 'testimonialSection', hasVariants: false },
    { label: 'Footer', type: 'footerSection', hasVariants: false },
    { label: 'Empty Column', type: 'freeColumn', hasVariants: false },
  ];

  const toggleCategory = (type: string) => {
    setExpandedCategory(expandedCategory === type ? null : type);
  };

  const handleDragStartItem = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('tiptap-node-type', type);
    document.body.classList.add('is-dragging-' + type);
  }

  const handleDragStartVariant = (e: React.DragEvent, type: string, payload: any) => {
    e.dataTransfer.setData('tiptap-node-type', type);
    e.dataTransfer.setData('tiptap-variant-payload', JSON.stringify(payload));
    document.body.classList.add('is-dragging-' + type);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-[12px] font-black text-slate-900 uppercase italic tracking-widest">Library</h3>
          <div className="p-2 bg-slate-50 rounded-lg text-slate-400 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-all">
            <Search className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {categories.map((cat) => {
          const variants = BLOCK_VARIANTS[cat.type];
          const isExpanded = expandedCategory === cat.type;

          return (
            <div key={cat.label} className="flex flex-col gap-2">
              {/* Category Header */}
              <div 
                onClick={() => cat.hasVariants ? toggleCategory(cat.type) : onAddSection(cat.type)}
                draggable={!cat.hasVariants}
                onDragStart={!cat.hasVariants ? (e) => handleDragStartItem(e, cat.type) : undefined}
                onDragEnd={() => document.body.className = document.body.className.replace(/\bis-dragging-\S+/g, '')}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer group",
                  isExpanded ? "border-indigo-500 bg-indigo-50" : "border-slate-100 bg-white hover:border-indigo-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    isExpanded ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                  )}>
                    <Layout className="w-4 h-4" />
                  </div>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest italic", isExpanded ? "text-indigo-700" : "text-slate-600")}>
                    {cat.label}
                  </span>
                </div>
                {cat.hasVariants && (
                  <div className="text-slate-400">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                )}
              </div>

              {/* Variants Grid */}
              {cat.hasVariants && isExpanded && variants && (
                <div className="grid grid-cols-2 gap-3 pl-2 pr-2 animate-in fade-in slide-in-from-top-2">
                  {variants.map(variant => {
                    const TargetIcon = variant.icon;
                    return (
                      <div 
                        key={variant.id}
                        onClick={() => onAddSection(cat.type, variant.generatePayload())}
                        draggable
                        onDragStart={(e) => handleDragStartVariant(e, cat.type, variant.generatePayload())}
                        onDragEnd={() => document.body.className = document.body.className.replace(/\bis-dragging-\S+/g, '')}
                        className="aspect-square bg-slate-50 border-2 border-transparent hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center gap-3 transition-all group scale-100 active:scale-95 cursor-grab active:cursor-grabbing"
                      >
                        <div className="w-10 h-10 bg-white border border-slate-200 group-hover:border-indigo-200 rounded-lg transition-all shadow-sm flex items-center justify-center">
                          <TargetIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                        </div>
                        <span className="text-[8px] font-black justify-center items-center text-center uppercase tracking-widest text-slate-500 group-hover:text-indigo-600 italic leading-none">{variant.name}</span>
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
