import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { X, Settings2, MousePointer2, Type, Palette, Layout, Layers, ChevronRight, Sparkles, Trash2, GripVertical, ArrowUpDown, ArrowLeft } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { cn, debounce } from '../../lib/utils';
import { 
  HeadingConfig, 
  ButtonConfig, 
  MediaConfig, 
  BackgroundConfig, 
  IconConfig, 
  VideoConfig, 
  ParagraphConfig, 
  DividerConfig, 
  SpacerConfig, 
  AdvancedConfig,
  TestimonialConfig
} from './configs';
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
  const openConfirmModal = useUIStore((state) => state.openConfirmModal);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [view, setView] = useState<'config' | 'theme'>('config');

  // 🚀 UX IMPROVEMENT: Auto-scroll to top when focused element or view changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [focusedId, view]);

  // 🚀 UX IMPROVEMENT: Parent Navigation logic
  const parentItem = selectionPath.length > 1 ? selectionPath[selectionPath.length - 2] : null;

  // 🚀 OPTIMIZATION (Fase 5): Debounced editor update for textContent
  const debouncedTextUpdate = useMemo(() => 
    debounce((value: string, id: string) => {
      const editor = (window as any).editor;
      if (!editor) return;

      editor.state.doc.descendants((node: any, pos: number) => {
        if (node.attrs.id === id || pos.toString() === id) {
          editor.chain()
            .insertContentAt({ 
              from: pos + 1, 
              to: pos + node.nodeSize - 1 
            }, value)
            .run();
          return false;
        }
      });
    }, 400),
  []);

  // Helper to resolve node position (Optimized Fase 1)
  const resolveNode = useCallback((idOverride?: string) => {
    const editor = (window as any).editor;
    const targetId = idOverride || focusedId;
    if (!editor || !targetId) return null;

    const { selection } = editor.state;
    const selectedNode = (selection as any).node;
    const $from = selection.$from;
    const check = (n: any, p: number) => (n.attrs.id === targetId || p.toString() === targetId) ? { node: n, pos: p } : null;

    if (selectedNode) {
      const res = check(selectedNode, selection.from);
      if (res) return res;
    }
    for (let d = $from.depth; d >= 0; d--) {
      const res = check($from.node(d), $from.before(d));
      if (res) return res;
    }
    let found: any = null;
    editor.state.doc.descendants((node: any, pos: number) => {
      const res = check(node, pos);
      if (res) { found = res; return false; }
    });
    return found;
  }, [focusedId]);

  const deleteNode = useCallback((id: string) => {
    const editor = (window as any).editor;
    if (!editor) return;

    openConfirmModal({
      title: 'Delete Element',
      message: 'Are you sure you want to remove this element from your layout? This action cannot be undone.',
      variant: 'danger',
      onConfirm: () => {
        // 🚀 OPTIMIZATION: Use resolveNode (O(1)) instead of doc.descendants
        const target = resolveNode(id);
        if (target) {
          editor.view.dispatch(
            editor.view.state.tr.delete(target.pos, target.pos + target.node.nodeSize)
          );
          if (focusedId === id) setFocusedId(null);
        }
      }
    });
  }, [focusedId, setFocusedId, openConfirmModal, resolveNode]);

  const handleReorder = (newOrder: typeof childNodes) => {
    // 🚀 OPTIMIZATION: Only update local visual state during drag
    setChildNodes(newOrder);
  };

  const commitReorderToTiptap = useCallback((currentNodes: typeof childNodes) => {
    const editor = (window as any).editor;
    if (!editor) return;

    const target = resolveNode();
    if (!target) return;

    const { node: parentNode, pos: parentPos } = target;
    const newContent: any[] = [];

    // 🚀 OPTIMIZATION: O(N) Map for faster lookup
    const idMap = new Map();
    let offset = 0;
    parentNode.forEach((child: any) => {
      const id = child.attrs.id || (parentPos + 1 + offset).toString();
      idMap.set(id, child.toJSON());
      offset += child.nodeSize;
    });

    currentNodes.forEach(item => {
      const json = idMap.get(item.id);
      if (json) newContent.push(json);
    });

    if (newContent.length === parentNode.childCount) {
      editor.chain()
        .insertContentAt({ 
          from: parentPos + 1, 
          to: parentPos + parentNode.nodeSize - 1 
        }, newContent)
        .run();
    }
  }, [resolveNode]);

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
      let found = false;
      let children: {id: string, type: string, label: string}[] = [];

      // 🚀 OPTIMIZATION (Fase 1): Check current selection first (O(1))
      const { selection } = editor.state;
      const selectedNode = (selection as any).node;
      const $from = selection.$from;
      
      const checkNode = (n: any, pos: number) => {
        const id = n.attrs.id || pos.toString();
        if (id === focusedId) {
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
          return true;
        }
        return false;
      };

      // Try resolving from current selection/cursor path first
      if (selectedNode && checkNode(selectedNode, selection.from)) {
        // Found via NodeSelection
      } else {
        // Try resolving node at cursor depth (from deep to root)
        for (let d = $from.depth; d > 0; d--) {
          const node = $from.node(d);
          const pos = $from.before(d);
          if (checkNode(node, pos)) break;
        }
      }

      // Fallback: Full scan only if not found in active selection path
      if (!found) {
        editor.state.doc.descendants((n: any, pos: number) => {
          if (checkNode(n, pos)) return false;
        });
      }
      
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

    const target = resolveNode();
    if (!target) return;

    // Special case for textContent (updating the node's inner content)
    if (key === 'textContent') {
      // 🚀 OPTIMIZATION (Fase 5): Update local state immediately, editor eventually
      setTargetAttrs((prev: any) => prev ? { ...prev, textContent: value } : null);
      debouncedTextUpdate(value, focusedId);
      return;
    }

    // Special case for layoutRow gridCols
    if (nodeType === 'layoutRow' && key === 'gridCols') {
      editor.commands.updateGridCols(value);
      setTargetAttrs((prev: any) => prev ? { ...prev, [key]: value } : null);
      return;
    }

    editor.view.dispatch(
      editor.view.state.tr.setNodeMarkup(target.pos, undefined, {
        ...target.node.attrs,
        [key]: value
      })
    );
    setTargetAttrs((prev: any) => prev ? { ...prev, [key]: value } : null);
  }, [focusedId, nodeType]);

  if (!focusedId || !targetAttrs) return null;
  
  const layoutTypes = [
    'pricingSection', 'featuresSection', 'footerSection', 'layoutSection',
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

        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar"
        >
           {view === 'theme' ? (
             <ThemeSettings />
           ) : (
             <>
                {/* 🚀 NEW: Parent Navigation Header */}
                {parentItem && (
                  <button 
                    onClick={() => setFocusedId(parentItem.id, 'element')}
                    className="flex items-center gap-3 w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl group/back hover:bg-indigo-50/50 hover:border-indigo-200 transition-all text-left animate-in slide-in-from-left-4 mb-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover/back:text-indigo-600 group-hover/back:border-indigo-200 shadow-sm">
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Return to parent</span>
                      <span className="text-[10px] font-black text-slate-700 uppercase italic tracking-tighter group-hover/back:text-indigo-700">{parentItem.label}</span>
                    </div>
                  </button>
                )}

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
                        {childNodes.length > 0 ? (
                          <Reorder.Group 
                            axis="y" 
                            values={childNodes} 
                            onReorder={handleReorder} 
                            className="grid gap-2"
                          >
                            {childNodes.map((child) => (
                              <Reorder.Item 
                                key={child.id} 
                                value={child}
                                className="group flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer relative"
                                onClick={() => setFocusedId(child.id, 'element')}
                                onDragEnd={() => commitReorderToTiptap(childNodes)}
                              >
                                  <div className="cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-indigo-500 transition-colors">
                                    <GripVertical className="w-3.5 h-3.5" />
                                  </div>
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
                              </Reorder.Item>
                            ))}
                          </Reorder.Group>
                        ) : (
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

                      {(nodeType.toLowerCase().includes('row') || nodeType === 'sectionGrid' || nodeType === 'layoutColumn') && (
                        <RowGridConfig value={targetAttrs} onChange={updateAttribute} elementPath="" nodeType={nodeType} />
                      )}

                      <DimensionConfig value={targetAttrs} onChange={updateAttribute} nodeType={nodeType} />

                      {/* 🚀 ENHANCED SPACING UI */}
                      <div className="space-y-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
                          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic text-left">Vertical Spacing</h4>
                        </div>

                        <div className="space-y-6">
                          {/* Margin Control - Only for blocks that support it (Row, Section) */}
                          {(nodeType === 'layoutRow' || nodeType.toLowerCase().includes('section')) && (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <ResponsiveLabel>Margin Top</ResponsiveLabel>
                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                  {nodeType.toLowerCase().includes('section') && !targetAttrs.marginTop ? 'GLOBAL' : (typeof targetAttrs.marginTop === 'object' ? (targetAttrs.marginTop[activeDevice] || '0px') : (targetAttrs.marginTop || '0px'))}
                                </span>
                              </div>
                              <input 
                                type="range" 
                                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                                min="0" max="100" step="4"
                                value={parseInt((typeof targetAttrs.marginTop === 'object' ? (targetAttrs.marginTop[activeDevice] || '0px') : (targetAttrs.marginTop || '0px'))) || 0}
                                onChange={(e) => {
                                    const newVal = updateResponsiveValue(targetAttrs.marginTop, activeDevice, `${e.target.value}px`);
                                    updateAttribute('marginTop', newVal);
                                }}
                              />
                            </div>
                          )}

                          {/* Padding Control */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <ResponsiveLabel>Vertical Padding</ResponsiveLabel>
                              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                {nodeType.toLowerCase().includes('section') && (!targetAttrs.padding || targetAttrs.padding === 'py-24') ? 'GLOBAL' : (typeof targetAttrs.padding === 'object' ? (targetAttrs.padding[activeDevice] || 'py-8') : (targetAttrs.padding || 'py-8'))}
                              </span>
                            </div>
                            <input 
                              type="range" 
                              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                              min="0" max="160" step="8"
                              value={parseInt((typeof targetAttrs.padding === 'object' ? (targetAttrs.padding[activeDevice] || '8') : (targetAttrs.padding || '8')).toString().replace(/[^\d]/g, '')) || 0}
                              onChange={(e) => {
                                  const newVal = updateResponsiveValue(targetAttrs.padding, activeDevice, `py-${e.target.value}`);
                                  updateAttribute('padding', newVal);
                              }}
                            />
                            {nodeType.toLowerCase().includes('section') && (targetAttrs.padding && targetAttrs.padding !== 'py-24') && (
                              <button 
                                onClick={() => updateAttribute('padding', 'py-24')}
                                className="text-[9px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                              >
                                ↺ Reset to Global
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </section>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1 italic">Element Details</span>
                        <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">{nodeType.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</h2>
                      </div>

                      {['heroHeadline', 'heroSubheadline', 'heroBadge', 'sectionHeading', 'featureCard'].includes(nodeType) && (
                        <HeadingConfig 
                          value={targetAttrs} 
                          onChange={updateAttribute} 
                          elementPath="" 
                          activeFormatting={activeFormatting}
                        />
                      )}
                      
                      {nodeType === 'testimonialSection' && (
                        <TestimonialConfig value={targetAttrs} onChange={updateAttribute} elementPath="" />
                      )}

                      {nodeType === 'heroButtonGroup' && (
                        <ButtonConfig value={targetAttrs} onChange={updateAttribute} elementPath="" />
                      )}

                      {(nodeType === 'heroMedia' || nodeType === 'imageElement') && (
                        <MediaConfig 
                          value={targetAttrs} 
                          onChange={updateAttribute} 
                          elementPath="" 
                          mediaKey={nodeType === 'heroMedia' ? 'bgImage' : 'src'}
                        />
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
