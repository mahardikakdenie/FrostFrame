import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings2, MousePointer2, Type, Palette, Layout, Layers, ChevronRight, Sparkles } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../lib/utils';
import { HeadingConfig, ButtonConfig } from './ElementConfigs';
import { RowGridConfig } from './RowGridConfig';
import { DimensionConfig } from './DimensionConfig';

export const PreviewSidebar = () => {
  const focusedId = useUIStore((state) => state.focusedId);
  const selectionPath = useUIStore((state) => state.selectionPath);
  const setFocusedId = useUIStore((state) => state.setFocusedId);
  const drillDownId = useUIStore((state) => state.drillDownId);

  const [targetAttrs, setTargetAttrs] = useState<any>(null);
  const [nodeType, setNodeType] = useState<string>('');
  const [activeFormatting, setActiveFormatting] = useState<any>({});

  useEffect(() => {
    const editor = (window as any).editor;
    if (!editor || !focusedId) return;

    const handleUpdate = () => {
      // Find the node in the doc
      let found = false;
      editor.state.doc.descendants((n: any, pos: number) => {
        if (n.attrs.id === focusedId || pos.toString() === focusedId) {
          setTargetAttrs({
            ...n.attrs,
            textContent: n.textContent,
          });
          setNodeType(n.type.name);
          found = true;
          return false;
        }
      });
      
      if (!found) {
        setTargetAttrs(null);
        setNodeType('');
      }

      const textStyleAttrs = editor.getAttributes('textStyle');
      setActiveFormatting({
        color: textStyleAttrs.color || null,
      });
    };

    editor.on('selectionUpdate', handleUpdate);
    editor.on('update', handleUpdate);
    handleUpdate();

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('update', handleUpdate);
    };
  }, [focusedId]);

  const updateAttribute = useCallback((key: string, value: any) => {
    const editor = (window as any).editor;
    if (!editor || !focusedId) return;

    editor.state.doc.descendants((node: any, pos: number) => {
      if (node.attrs.id === focusedId || pos.toString() === focusedId) {
        editor.view.dispatch(
          editor.view.state.tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            [key]: value
          })
        );
        setTargetAttrs((prev: any) => prev ? { ...prev, [key]: value } : null);
        return false;
      }
    });
  }, [focusedId]);

  if (!focusedId || !targetAttrs) return null;
  
  const layoutTypes = [
    'pricingSection', 'featuresSection', 'testimonialSection', 'footerSection', 'layoutSection',
    'layoutColumn', 'strictHeroColumn', 'freeColumn', 'layoutRow', 'freeRow', 'strictHeroRow', 'sectionGrid', 'sectionHeading'
  ];
  const isLayoutBlock = layoutTypes.includes(nodeType);
  const isDrilledDown = drillDownId && selectionPath.some(p => p.id === drillDownId);

  const renderBlockConfig = () => {
    return (
      <div className="space-y-6">
        {targetAttrs.title !== undefined && (
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Title</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              value={targetAttrs.title}
              onChange={(e) => updateAttribute('title', e.target.value)}
            />
          </div>
        )}
        {targetAttrs.subtitle !== undefined && (
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Subtitle</label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white h-20 resize-none"
              value={targetAttrs.subtitle}
              onChange={(e) => updateAttribute('subtitle', e.target.value)}
            />
          </div>
        )}
        {targetAttrs.description !== undefined && (
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Description</label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white h-20 resize-none"
              value={targetAttrs.description}
              onChange={(e) => updateAttribute('description', e.target.value)}
            />
          </div>
        )}
        {targetAttrs.billingCycle !== undefined && (
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Billing Cycle</label>
            <div className="grid grid-cols-2 gap-2">
              {['monthly', 'annually'].map(cycle => (
                <button
                  key={cycle}
                  onClick={() => updateAttribute('billingCycle', cycle)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all border",
                    targetAttrs.billingCycle === cycle 
                      ? "bg-indigo-600 text-white border-indigo-600" 
                      : "bg-white text-slate-400 border-slate-200 hover:border-indigo-300"
                  )}
                >
                  {cycle}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 w-[340px] h-full bg-white border-r border-slate-200 shadow-2xl z-[60] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Sparkles className="w-24 h-24 text-indigo-500" />
          </div>
          
          <div className="flex items-center gap-3 relative z-10">
             <div className={cn(
               "w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 transition-transform hover:rotate-0",
               isLayoutBlock ? "bg-indigo-600 text-white shadow-indigo-200" : "bg-emerald-600 text-white shadow-emerald-200"
             )}>
                <Settings2 className="w-4 h-4" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-none mb-1.5 italic">
                  Configuration
                </span>
                <span className="text-sm font-black text-slate-800 flex items-center gap-2 italic uppercase tracking-tighter">
                  {nodeType.replace(/([A-Z])/g, ' $1').trim()}
                </span>
             </div>
          </div>
          <button 
            onClick={() => setFocusedId(null)}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all relative z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Navigation / Breadcrumbs */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
           {selectionPath.map((pathItem, idx) => (
             <React.Fragment key={pathItem.id}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />}
                <button 
                  onClick={() => setFocusedId(pathItem.id, idx === 0 ? 'section' : 'element')}
                  className={cn(
                    "whitespace-nowrap px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest transition-all",
                    pathItem.id === focusedId 
                      ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" 
                      : "text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
                  )}
                >
                  {pathItem.label}
                </button>
             </React.Fragment>
           ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
           {isLayoutBlock ? (
             <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Container Settings</span>
                   <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">{nodeType.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</h2>
                </div>

                {renderBlockConfig()}

                <div className="space-y-4">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Appearance</label>
                   <div className="grid grid-cols-2 gap-3">
                     <button 
                       className={cn(
                         "p-3 bg-white border rounded-xl flex flex-col items-start gap-2 hover:border-indigo-400 transition-all group",
                         targetAttrs.background ? "border-indigo-500 ring-1 ring-indigo-50" : "border-slate-200"
                       )}
                       onClick={() => updateAttribute('background', targetAttrs.background ? null : 'bg-slate-50')}
                     >
                        <Palette className={cn("w-4 h-4", targetAttrs.background ? "text-indigo-500" : "text-slate-400 group-hover:text-indigo-500")} />
                        <span className="text-[8px] font-black uppercase text-slate-500">
                          {targetAttrs.background ? 'Custom BG' : 'Default BG'}
                        </span>
                     </button>
                     <button className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col items-start gap-2 hover:border-indigo-400 transition-all group">
                        <Layout className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                        <span className="text-[8px] font-black uppercase text-slate-500 group-hover:text-indigo-600">Variants</span>
                     </button>
                   </div>
                </div>

                {(nodeType.toLowerCase().includes('row') || nodeType === 'sectionGrid') && (
                  <RowGridConfig value={targetAttrs} onChange={updateAttribute} elementPath="" nodeType={nodeType} />
                )}

                <div className="space-y-4">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Background</label>
                   <div className="h-12 w-full bg-slate-50 border border-slate-200 border-dashed rounded-xl flex items-center px-4 justify-between cursor-pointer hover:bg-white transition-all">
                      <span className="text-[10px] font-bold text-slate-400">Solid {targetAttrs.background || 'White'}</span>
                      <div className={cn("w-6 h-6 border border-slate-200 rounded shadow-sm", targetAttrs.background || 'bg-white')} />
                   </div>
                </div>

                <DimensionConfig value={targetAttrs} onChange={updateAttribute} nodeType={nodeType} />

                <div className="space-y-4">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic">Spacing</label>
                   <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                         <span>Vertical Spacing</span>
                         <span>{targetAttrs.padding || 'Auto'}</span>
                       </div>
                       <input 
                         type="range" 
                         className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                         min="0" max="64"
                         value={targetAttrs.padding?.replace(/[^\d]/g, '') || 12}
                         onChange={(e) => updateAttribute('padding', `py-${e.target.value}`)}
                       />
                    </div>
                 </div>

                 {isDrilledDown && (
                   <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mt-10">
                      <div className="flex items-center gap-3 text-indigo-700 mb-2">
                         <MousePointer2 className="w-4 h-4" />
                         <span className="text-[9px] font-black uppercase italic tracking-widest">In Drill-Down Mode</span>
                      </div>
                      <p className="text-[10px] font-medium text-indigo-600/70 leading-relaxed">
                         You are currently editing components inside this block. Use breadcrumbs to navigate layers.
                      </p>
                   </div>
                 )}
              </section>
           ) : (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1 italic">Element Settings</span>
                   <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">{nodeType.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</h2>
                </div>

                <HeadingConfig 
                  value={targetAttrs} 
                  onChange={updateAttribute} 
                  elementPath="" 
                  activeFormatting={activeFormatting}
                />
                
                {(nodeType === 'heroButtonGroup' || nodeType === 'heroMedia') && (
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-[10px] text-slate-400 font-medium">
                     Complex configuration for {nodeType} coming soon...
                   </div>
                )}
             </div>
           )}
         </div>

        <div className="p-6 bg-white border-t border-slate-100">
           <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-100 animate-[pulse_2s_infinite]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-emerald-700 uppercase italic leading-none">Smart-Sync Active</span>
                <span className="text-[9px] font-bold text-emerald-600 mt-1">Changes are live in editor</span>
              </div>
           </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
