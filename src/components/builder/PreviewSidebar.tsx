import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings2, MousePointer2, Type, Palette, Layout, Layers, ChevronRight, Sparkles, Trash2 } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { cn } from '../../lib/utils';
import { HeadingConfig, ButtonConfig, MediaConfig, BackgroundConfig, IconConfig, VideoConfig, ParagraphConfig, DividerConfig, SpacerConfig, AdvancedConfig } from './ElementConfigs';
import { RowGridConfig } from './RowGridConfig';
import { DimensionConfig } from './DimensionConfig';
import { DeviceSelector, ResponsiveLabel, updateResponsiveValue } from './ResponsiveConfig';
import { ThemeSettings } from './ThemeSettings';

export const PreviewSidebar = () => {
  const focusedId = useUIStore((state) => state.focusedId);
  const selectionPath = useUIStore((state) => state.selectionPath);
  const setFocusedId = useUIStore((state) => state.setFocusedId);
  const drillDownId = useUIStore((state) => state.drillDownId);
  const activeDevice = useUIStore((state) => state.activeDevice);
  const setDrillDownId = useUIStore((state) => state.setDrillDownId);

  const deleteNode = useCallback((id: string) => {
    const editor = (window as any).editor;
    if (!editor) return;

    if (confirm('Are you sure you want to delete this element?')) {
      editor.state.doc.descendants((node: any, pos: number) => {
        const nodeId = node.attrs.id || pos.toString();
        if (nodeId === id) {
          editor.view.dispatch(
            editor.view.state.tr.delete(pos, pos + node.nodeSize)
          );
          if (focusedId === id) setFocusedId(null);
          return false;
        }
      });
    }
  }, [focusedId, setFocusedId]);

  const [view, setView] = useState<'config' | 'theme'>('config');
  const [targetAttrs, setTargetAttrs] = useState<any>(null);
  const [nodeType, setNodeType] = useState<string>('');
  const [activeFormatting, setActiveFormatting] = useState<any>({});
  const [childNodes, setChildNodes] = useState<{id: string, type: string, label: string}[]>([]);

  // Automatically switch to config view when a node is focused
  useEffect(() => {
    if (focusedId) setView('config');
  }, [focusedId]);

  useEffect(() => {
    const editor = (window as any).editor;
    if (!editor || !focusedId) return;

    const handleUpdate = () => {
      // Find the node in the doc
      let found = false;
      let children: {id: string, type: string, label: string}[] = [];

      console.log('Sidebar searching for ID:', focusedId);

      editor.state.doc.descendants((n: any, pos: number) => {
        const id = n.attrs.id || pos.toString();
        if (id === focusedId) {
          console.log('Sidebar found node:', n.type.name, n.attrs);
          setTargetAttrs({
            ...n.attrs,
            textContent: n.textContent,
          });
          setNodeType(n.type.name);
          
          // Get children
          n.content.forEach((child: any, offset: number) => {
             children.push({
                id: child.attrs.id || (pos + offset + 1).toString(),
                type: child.type.name,
                label: child.type.name.replace(/([A-Z])/g, ' $1').trim().toUpperCase()
             });
          });
          
          found = true;
          return false;
        }
      });
      
      if (found) {
        setChildNodes(children);
      } else {
        setTargetAttrs(null);
        setNodeType('');
        setChildNodes([]);
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

    // Special case for textContent (updating the node's inner content)
    if (key === 'textContent') {
      let nodePos = -1;
      let targetNode: any = null;

      editor.state.doc.descendants((node: any, pos: number) => {
        const id = node.attrs.id || pos.toString();
        if (id === focusedId) {
          nodePos = pos;
          targetNode = node;
          return false;
        }
      });

      if (nodePos !== -1 && targetNode) {
        editor.chain()
          .focus()
          .insertContentAt({ 
            from: nodePos + 1, 
            to: nodePos + targetNode.nodeSize - 1 
          }, value)
          .run();
        
        setTargetAttrs((prev: any) => prev ? { ...prev, textContent: value } : null);
      }
      return;
    }

    // Special case for layoutRow gridCols
    if (nodeType === 'layoutRow' && key === 'gridCols') {
      editor.commands.updateGridCols(value);
      setTargetAttrs((prev: any) => prev ? { ...prev, [key]: value } : null);
      return;
    }

    editor.state.doc.descendants((node: any, pos: number) => {
      if ((node.attrs.id === focusedId || pos.toString() === focusedId)) {
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
  }, [focusedId, nodeType]);

  if (!focusedId || !targetAttrs) return null;
  
  const layoutTypes = [
    'pricingSection', 'featuresSection', 'testimonialSection', 'footerSection', 'layoutSection',
    'layoutColumn', 'layoutRow', 'sectionGrid', 'sectionHeading'
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
          
          <div className="flex items-center gap-2 relative z-10 bg-slate-100 p-1 rounded-xl">
             <button 
                onClick={() => setView('config')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  view === 'config' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
                title="Node Configuration"
             >
                <Settings2 className="w-4 h-4" />
             </button>
             <button 
                onClick={() => setView('theme')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  view === 'theme' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
                title="Global Theme Settings"
             >
                <Palette className="w-4 h-4" />
             </button>
          </div>

          <div className="flex flex-col items-end flex-1 pr-4">
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-none mb-1.5 italic">
               {view === 'config' ? 'Configuration' : 'Design System'}
             </span>
             <span className="text-xs font-black text-slate-800 italic uppercase tracking-tighter">
               {view === 'config' ? nodeType.replace(/([A-Z])/g, ' $1').trim() : 'Global Settings'}
             </span>
          </div>

          <button 
            onClick={() => setFocusedId(null)}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all relative z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Navigation / Breadcrumbs */}
        {view === 'config' && (
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
        )}

        {/* Device Toggle */}
        <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Breakpoint Edit</span>
           <DeviceSelector />
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
           {view === 'theme' ? (
             <ThemeSettings />
           ) : (
             <>
                {/* Hierarchy Selection Pilihan untuk masuk ke hirarky */}
                {isLayoutBlock && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-indigo-500" />
                          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic text-left">Layers & Hierarchy</h4>
                        </div>
                        <button 
                          onClick={() => setDrillDownId(drillDownId === focusedId ? null : focusedId)}
                          className={cn(
                            "px-2 py-1 rounded text-[8px] font-black uppercase transition-all",
                            drillDownId === focusedId ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-indigo-100"
                          )}
                        >
                          {drillDownId === focusedId ? 'Exit Drill-down' : 'Enter Hierarchy'}
                        </button>
                      </div>
                      <div className="grid gap-2">
                        {childNodes.length > 0 ? childNodes.map((child) => (
                          <div 
                            key={child.id} 
                            className="group flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer"
                            onClick={() => setFocusedId(child.id, 'element')}
                          >
                              <div className="w-6 h-6 bg-white border border-slate-200 rounded flex items-center justify-center text-[8px] font-black text-slate-400 group-hover:text-indigo-500 group-hover:border-indigo-200">
                                {child.type.substring(0, 2).toUpperCase()}
                              </div>
                              <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-900 uppercase tracking-tight">{child.label}</span>
                              
                              <div className="ml-auto flex items-center gap-2">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); deleteNode(child.id); }}
                                  className="p-1.5 rounded-lg text-slate-300 hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                  title="Delete Element"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-400" />
                              </div>
                          </div>
                        )) : (
                          <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">No Nested Elements</span>
                          </div>
                        )}
                      </div>
                  </div>
                )}

                {isLayoutBlock ? (
                  <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1 italic">Layout Detail Settings</span>
                        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter text-left">{nodeType.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</h2>
                      </div>

                      {renderBlockConfig()}

                      <BackgroundConfig value={targetAttrs} onChange={updateAttribute} elementPath="" />

                      {(nodeType.toLowerCase().includes('row') || nodeType === 'sectionGrid') && (
                        <RowGridConfig value={targetAttrs} onChange={updateAttribute} elementPath="" nodeType={nodeType} />
                      )}

                      <DimensionConfig value={targetAttrs} onChange={updateAttribute} nodeType={nodeType} />

                      <div className="space-y-4">
                        <ResponsiveLabel>Vertical Padding</ResponsiveLabel>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-500">
                              <span>Spacing Scale</span>
                              <span>{typeof targetAttrs.padding === 'object' ? (targetAttrs.padding[activeDevice] || targetAttrs.padding.desktop || 'py-8') : (targetAttrs.padding || 'py-8')}</span>
                            </div>
                            <input 
                              type="range" 
                              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                              min="0" max="64"
                              value={(typeof targetAttrs.padding === 'object' ? (targetAttrs.padding[activeDevice] || targetAttrs.padding.desktop || 'py-8') : (targetAttrs.padding || 'py-8')).replace(/[^\d]/g, '') || 8}
                              onChange={(e) => {
                                  const newVal = updateResponsiveValue(targetAttrs.padding, activeDevice, `py-${e.target.value}`);
                                  updateAttribute('padding', newVal);
                              }}
                            />
                          </div>
                      </div>
                    </section>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1 italic">Element Details</span>
                        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">{nodeType.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</h2>
                      </div>

                      <HeadingConfig 
                        value={targetAttrs} 
                        onChange={updateAttribute} 
                        elementPath="" 
                        activeFormatting={activeFormatting}
                      />
                      
                      {nodeType === 'heroButtonGroup' && (
                        <ButtonConfig value={targetAttrs} onChange={updateAttribute} elementPath="" />
                      )}

                      {(nodeType === 'heroMedia' || nodeType === 'imageElement') && (
                        <MediaConfig value={targetAttrs} onChange={updateAttribute} elementPath="" />
                      )}

                      {nodeType === 'iconElement' && (
                        <IconConfig value={targetAttrs} onChange={updateAttribute} elementPath="" />
                      )}

                      {nodeType === 'videoElement' && (
                        <VideoConfig value={targetAttrs} onChange={updateAttribute} elementPath="" />
                      )}

                      {nodeType === 'paragraphElement' && (
                        <ParagraphConfig value={targetAttrs} onChange={updateAttribute} elementPath="" activeFormatting={activeFormatting} />
                      )}

                      {nodeType === 'dividerElement' && (
                        <DividerConfig value={targetAttrs} onChange={updateAttribute} elementPath="" />
                      )}

                      {nodeType === 'spacerElement' && (
                        <SpacerConfig value={targetAttrs} onChange={updateAttribute} elementPath="" />
                      )}

                      {/* Global Advanced Positioning for all elements */}
                      <AdvancedConfig value={targetAttrs} onChange={updateAttribute} elementPath="" />

                      {nodeType === 'heroMedia' && (
                        <div className="mt-8 pt-8 border-t border-slate-100">
                          <BackgroundConfig value={targetAttrs} onChange={updateAttribute} elementPath="" />
                        </div>
                      )}
                  </div>
                )}
             </>
           )}
         </div>

        <div className="p-6 bg-white border-t border-slate-100 flex-shrink-0">
           <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-100 animate-[pulse_2s_infinite]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-emerald-700 uppercase italic leading-none">Smart-Sync Active</span>
                <span className="text-[9px] font-bold text-emerald-600 mt-1">Hierarchy Navigation Enabled</span>
              </div>
           </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
