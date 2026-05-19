import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings2, MousePointer2, Palette, Layout, ChevronRight, Sparkles, ArrowUpDown, ArrowLeft, Info, Trash2, Type, Square, Image as ImageIcon, Play, Minus, GripHorizontal, MessageSquare, AlignLeft, LucideIcon } from 'lucide-react';
import { Editor } from '@tiptap/core';
import { Node as ProsemirrorNode } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
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

declare global {
  interface Window {
    editor: Editor;
  }
}

interface NodeTarget {
  node: ProsemirrorNode;
  pos: number;
}

// 🚀 REUSABLE UI: Premium Minimal Accordion
const ConfigAccordion = ({ 
  title, 
  icon: Icon, 
  children, 
  description,
  defaultOpen = true 
}: { 
  title: string, 
  icon: LucideIcon, 
  children: React.ReactNode, 
  description?: string,
  defaultOpen?: boolean 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={cn(
      "group/acc-container transition-all duration-300 rounded-2xl overflow-hidden",
      isOpen 
        ? "bg-white border border-slate-200/60 shadow-sm mb-6" 
        : "bg-transparent border border-transparent hover:bg-slate-100/50 mb-2"
    )}>
      <div className={cn(
        "flex items-center justify-between w-full p-3.5 relative z-10 transition-colors",
        isOpen ? "bg-slate-50/50 border-b border-slate-100" : "text-slate-900"
      )}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3.5 flex-1 text-left"
        >
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm",
            isOpen ? "bg-indigo-600 text-white shadow-indigo-100" : "bg-white text-slate-400 border border-slate-100"
          )}>
            <Icon className="w-4 h-4" />
          </div>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-[0.15em] italic leading-none transition-colors",
            isOpen ? "text-slate-900" : "text-slate-500 group-hover/acc-container:text-slate-900"
          )}>{title}</span>
        </button>
        
        <div className="flex items-center gap-1.5 pr-1">
          {description && (
            <div className="relative">
              <button 
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={cn(
                  "p-1.5 transition-all cursor-help rounded-lg hover:bg-slate-200/50",
                  isOpen ? "text-slate-400" : "text-slate-300"
                )}
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
              {showTooltip && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98, x: -10 }}
                className="absolute right-full top-1/2 -translate-y-1/2 mr-6 w-64 p-5 bg-indigo-600 text-white text-[10px] font-medium tracking-wide leading-relaxed rounded-2xl shadow-2xl z-[9999] pointer-events-none border border-white/10 backdrop-blur-xl"
              >
                {description}
                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-indigo-600 rotate-45" />
              </motion.div>
              )}
              </AnimatePresence>
              </div>
              )}
              <button 
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
              "w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-300",
              isOpen ? "bg-slate-200/50 text-slate-600 rotate-180" : "text-slate-300 hover:text-slate-900"
              )}
              >
              <ChevronRight className="w-3.5 h-3.5" />
              </button>
              </div>
              </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="px-5 pb-8 pt-6 space-y-8 animate-in fade-in slide-in-from-top-1 duration-500">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const PreviewSidebar = () => {
  const focusedId = useUIStore((state) => state.focusedId);
  const selectionPath = useUIStore((state) => state.selectionPath);
  const setFocusedId = useUIStore((state) => state.setFocusedId);
  const setHoveredId = useUIStore((state) => state.setHoveredId);
  const activeDevice = useUIStore((state) => state.activeDevice);
  const openConfirmModal = useUIStore((state) => state.openConfirmModal);

  // 🚀 HELPER: Format Node Label
  const getLabel = useCallback((type: string) => {
    return type.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
  }, []);

  const layoutTypes = useMemo(() => [
    'pricingSection', 'featuresSection', 'footerSection', 'layoutSection',
    'layoutColumn', 'layoutRow', 'sectionGrid', 'sectionHeading', 'testimonialSection'
  ], []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<'config' | 'theme'>('config');

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [focusedId, view]);

  const parentItem = selectionPath.length > 1 ? selectionPath[selectionPath.length - 2] : null;

  const debouncedTextUpdate = useMemo(() => 
    debounce((value: string, id: string) => {
      const editor = window.editor;
      if (!editor) return;
      let found = false;
      const { selection } = editor.state;
      const selectedNode = selection instanceof NodeSelection ? selection.node : null;
      const $from = selection.$from;
      const updateIfMatch = (n: ProsemirrorNode, p: number) => {
        if (n.attrs.id === id || p.toString() === id) {
          editor.chain().insertContentAt({ from: p + 1, to: p + n.nodeSize - 1 }, value).run();
          found = true; return true;
        }
        return false;
      };
      if (selectedNode && updateIfMatch(selectedNode, selection.from)) return;
      for (let d = $from.depth; d > 0; d--) { if (updateIfMatch($from.node(d), $from.before(d))) return; }
      if (!found) { editor.state.doc.descendants((node, pos) => { if (updateIfMatch(node, pos)) return false; }); }
    }, 400),
  []);

  const resolveNode = useCallback((idOverride?: string): NodeTarget | null => {
    const editor = window.editor;
    const targetId = idOverride || focusedId;
    if (!editor || !targetId) return null;
    const { selection } = editor.state;
    const selectedNode = selection instanceof NodeSelection ? selection.node : null;
    const $from = selection.$from;
    const check = (n: ProsemirrorNode, p: number): NodeTarget | null => (n.attrs.id === targetId || p.toString() === targetId) ? { node: n, pos: p } : null;
    if (selectedNode) { const res = check(selectedNode, selection.from); if (res) return res; }
    // Prevent RangeError: don't check depth 0 (the doc node) with before()
    for (let d = $from.depth; d > 0; d--) { const res = check($from.node(d), $from.before(d)); if (res) return res; }
    let found: NodeTarget | null = null;
    editor.state.doc.descendants((node, pos) => { const res = check(node, pos); if (res) { found = res; return false; } });
    return found;
  }, [focusedId]);

  const deleteNode = useCallback(() => {
    if (!focusedId) return;
    openConfirmModal({
      title: 'Delete Element',
      message: 'Are you sure you want to remove this element? This action cannot be undone.',
      variant: 'danger',
      onConfirm: () => {
        const editor = window.editor;
        const target = resolveNode();
        if (editor && target) {
          editor.commands.deleteRange({ from: target.pos, to: target.pos + target.node.nodeSize });
          setFocusedId(null);
        }
      }
    });
  }, [focusedId, resolveNode, setFocusedId, openConfirmModal]);

  const [targetAttrs, setTargetAttrs] = useState<Record<string, unknown> | null>(null);
  const [nodeType, setNodeType] = useState<string>('');
  const [activeFormatting, setActiveFormatting] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const editor = window.editor;
    if (!editor) return;

    const handleUpdate = () => {
      const { selection, doc } = editor.state;
      const selectedNode = selection instanceof NodeSelection ? selection.node : null;
      const $from = selection.$from;

      // 1. Resolve Attributes for focusedId
      if (focusedId) {
        let foundFocus = false;
        const checkFocus = (n: ProsemirrorNode, pos: number) => {
          const id = n.attrs.id || pos.toString();
          if (id === focusedId) {
            const newAttrs = { 
              ...n.attrs, 
              textContent: n.textContent,
              realChildCount: n.childCount 
            };
            setTargetAttrs((prev) => (prev && JSON.stringify(prev) === JSON.stringify(newAttrs)) ? prev : newAttrs);
            setNodeType(n.type.name);
            foundFocus = true; return true;
          }
          return false;
        };
        if (selectedNode && checkFocus(selectedNode, selection.from)) {} 
        else { for (let d = $from.depth; d > 0; d--) { if (checkFocus($from.node(d), $from.before(d))) break; } }
        if (!foundFocus) { doc.descendants((n, pos) => { if (checkFocus(n, pos)) return false; }); }
      } else {
        setTargetAttrs(null);
        setNodeType('doc');
      }

      const textStyleAttrs = editor.getAttributes('textStyle');
      setActiveFormatting({ color: textStyleAttrs.color || null });
    };
    editor.on('selectionUpdate', handleUpdate); editor.on('update', handleUpdate); handleUpdate();
    return () => { editor.off('selectionUpdate', handleUpdate); editor.off('update', handleUpdate); };
  }, [focusedId]);

  const getResponsiveVal = useCallback((attr: unknown, device: 'desktop' | 'tablet' | 'mobile', fallback: string): string => {
    if (attr && typeof attr === 'object' && !Array.isArray(attr)) {
      const obj = attr as Record<string, unknown>;
      const val = obj[device];
      if (typeof val === 'string') return val;
    }
    if (typeof attr === 'string') return attr;
    return fallback;
  }, []);

  const updateAttribute = useCallback((key: string, value: unknown) => {
    const editor = window.editor;
    if (!editor || !focusedId) return;
    const target = resolveNode();
    if (!target) return;
    if (key === 'textContent') {
      setTargetAttrs((prev) => prev ? { ...prev, textContent: value } : null);
      if (typeof value === 'string') { debouncedTextUpdate(value, focusedId); }
      return;
    }
    if (nodeType === 'layoutRow' && key === 'gridCols') {
      const commands = editor.commands as Record<string, unknown>;
      if (typeof commands.updateGridCols === 'function') { (commands.updateGridCols as (v: unknown) => void)(value); }
      setTargetAttrs((prev) => prev ? { ...prev, [key]: value } : null);
      return;
    }
    editor.view.dispatch(
      editor.view.state.tr
        .setNodeMarkup(target.pos, undefined, { ...target.node.attrs, [key]: value })
        .setMeta('isSidebarUpdate', true)
    );
    setTargetAttrs((prev) => prev ? { ...prev, [key]: value } : null);
  }, [focusedId, nodeType, resolveNode, debouncedTextUpdate]);

  // 🚀 ICON MAPPING: Element Specific Icons
  const getIcon = (type: string) => {
    const map: Record<string, LucideIcon> = {
      'heroHeadline': Type,
      'heroSubheadline': Type,
      'sectionHeading': Type,
      'paragraphElement': AlignLeft,
      'buttonElement': MousePointer2,
      'imageElement': ImageIcon,
      'heroMedia': ImageIcon,
      'videoElement': Play,
      'dividerElement': Minus,
      'spacerElement': GripHorizontal,
      'testimonialSection': MessageSquare,
      'layoutRow': Layout,
      'layoutColumn': Square,
      'sectionGrid': Layout,
    };
    return map[type] || Sparkles;
  };

  const renderBlockConfig = () => {
    if (!focusedId) return null;
    if (!targetAttrs) return null;

    const hasTitle = targetAttrs.title !== undefined;
    const hasSubtitle = targetAttrs.subtitle !== undefined;

    // 🚀 Layout blocks only show title/subtitle if they have them in attributes
    const contentFields = (hasTitle || hasSubtitle) ? (
      <div className="space-y-5 text-left animate-in fade-in duration-500">
        {hasTitle && (
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic ml-0.5">Primary Entry</label>
            <input 
              type="text" 
              className="w-full bg-slate-50/50 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all duration-300 border border-slate-200/60 focus:border-indigo-400"
              value={(targetAttrs.title as string) || ''}
              onChange={(e) => updateAttribute('title', e.target.value)}
            />
          </div>
        )}
        {hasSubtitle && (
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic ml-0.5">Contextual Narrative</label>
            <textarea 
              className="w-full bg-slate-50/50 rounded-xl px-4 py-3 text-xs font-medium text-slate-600 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all duration-300 h-24 resize-none leading-relaxed border border-slate-200/60 focus:border-indigo-400"
              value={(targetAttrs.subtitle as string) || ''}
              onChange={(e) => updateAttribute('subtitle', e.target.value)}
            />
          </div>
        )}
      </div>
    ) : null;

    // 🚀 Calculate Children for Layout Blocks
    const target = resolveNode();
    const children: { id: string, type: string, label: string }[] = [];
    if (target && layoutTypes.includes(nodeType)) {
      target.node.forEach((child, offset) => {
        children.push({
          id: child.attrs.id || (target.pos + 1 + offset).toString(),
          type: child.type.name,
          label: getLabel(child.type.name)
        });
      });
    }

    // 🚀 Render Children List if it's a layout block
    const childrenList = (children.length > 0) ? (
      <div className="space-y-3 text-left animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block italic ml-0.5">Nested Modules</label>
          <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{children.length}</span>
        </div>
        <div className="grid gap-2">
          {children.map((child, idx) => {
            const ChildIcon = getIcon(child.type);
            return (
              <button
                key={child.id}
                onClick={() => setFocusedId(child.id, 'element')}
                onMouseEnter={() => setHoveredId(child.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group/child-item flex items-center gap-3 p-3 bg-slate-50/50 hover:bg-slate-900 rounded-xl transition-all duration-300 border border-slate-200/60 hover:border-slate-900 text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-white text-slate-400 flex items-center justify-center border border-slate-100 group-hover/child-item:bg-indigo-600 group-hover/child-item:text-white group-hover/child-item:border-indigo-600 transition-all">
                  <ChildIcon className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest group-hover/child-item:text-indigo-300 transition-colors">Module {idx + 1}</span>
                  <span className="text-[10px] font-bold text-slate-900 uppercase italic group-hover/child-item:text-white transition-colors truncate">{child.label}</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-300 group-hover/child-item:text-white group-hover/child-item:translate-x-0.5 transition-all" />
              </button>
            );
          })}
        </div>
      </div>
    ) : null;

    if (contentFields || childrenList) {
      return (
        <div className="space-y-8">
          {contentFields}
          {childrenList}
        </div>
      );
    }

    // 🚀 Default for Containers (Row, Column, etc): Info Panel
    const childCount = (targetAttrs.realChildCount as number) || 0;
    return (
      <div className="flex flex-col items-center justify-center py-10 px-6 bg-slate-50/50 rounded-[2rem] border border-slate-100/60 text-center gap-4 animate-in fade-in zoom-in-95 duration-500">
         <div className="w-14 h-14 rounded-[1.25rem] bg-white flex items-center justify-center text-slate-200 shadow-sm border border-slate-100">
           <Layout className="w-6 h-6 text-slate-300" />
         </div>
         <div className="flex flex-col gap-1.5 text-center">
           <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] italic">{getLabel(nodeType)}</span>
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-[200px]">
             Manages <span className="text-indigo-600">{childCount}</span> {childCount === 1 ? 'module' : 'modules'}. <br/>
             <span className="text-[8px] text-slate-300 block mt-1">Select internal elements to edit their specific content.</span>
           </p>
         </div>
      </div>
    );
  };

  const HeaderIcon = getIcon(nodeType);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col h-full w-full bg-white relative"
      >
        {/* Paper Header */}
        <div className="px-5 py-6 flex items-center justify-between bg-white shrink-0 border-b border-slate-100 z-10">
          <div className="flex flex-col flex-1 text-left min-w-0">
             <div className="flex items-center gap-2 mb-1">
               <HeaderIcon className="w-3 h-3 text-indigo-500" />
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none italic">
                 {focusedId ? 'Node Inspector' : 'System Active'}
               </span>
             </div>
             <h2 className="text-lg font-black text-slate-900 italic uppercase tracking-tighter leading-none truncate">
               {view === 'theme' ? 'Design Core' : (focusedId ? getLabel(nodeType) : 'Document Canvas')}
             </h2>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {focusedId && (
              <button 
                onClick={deleteNode}
                className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all rounded-lg border border-slate-100 hover:border-rose-500 shadow-sm"
                title="Delete Element"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            )}
            <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
               <button onClick={() => setView('config')} className={cn("p-2 rounded-lg transition-all", view === 'config' ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600")}><Settings2 className="w-4 h-4" /></button>
               <button onClick={() => setView('theme')} className={cn("p-2 rounded-lg transition-all", view === 'theme' ? "bg-white text-indigo-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600")}><Palette className="w-4 h-4" /></button>
            </div>
            <button onClick={() => setFocusedId(null)} className="w-9 h-9 flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all rounded-lg border border-rose-100 shadow-sm"><X className="w-4.5 h-4.5" /></button>
          </div>
        </div>

        {/* Dynamic Navigation */}
        {view === 'config' && selectionPath.length > 0 && (
          <div className="px-5 py-3 bg-slate-50/50 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth shrink-0 border-b border-slate-100 relative z-0">
            {selectionPath.map((pathItem, idx) => (
              <React.Fragment key={pathItem.id}>
                  {idx > 0 && <ChevronRight className="w-2.5 h-2.5 text-slate-300 flex-shrink-0" />}
                  <button 
                    onClick={() => setFocusedId(pathItem.id, idx === 0 ? 'section' : 'element')}
                    className={cn(
                      "whitespace-nowrap px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-wider transition-all",
                      pathItem.id === focusedId ? "bg-white text-indigo-600 shadow-sm border border-indigo-100" : "text-slate-400 hover:text-slate-900"
                    )}
                  >
                    {pathItem.label}
                  </button>
              </React.Fragment>
            ))}
          </div>
        )}

        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar space-y-8 pb-40"
        >
           {view === 'theme' ? (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><ThemeSettings /></div>
           ) : (
             <div className="space-y-8 relative">
                {parentItem && (
                  <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md pb-4 -mx-1 px-1">
                    <button 
                      onClick={() => setFocusedId(parentItem.id, 'element')}
                      className="flex items-center gap-4 w-full p-4 bg-slate-50/50 rounded-2xl group/back hover:bg-slate-900 transition-all duration-300 text-left border border-slate-100 hover:border-slate-900 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white text-slate-400 flex items-center justify-center border border-slate-200 transition-all duration-300 group-hover/back:bg-indigo-600 group-hover/back:text-white group-hover/back:border-indigo-600"><ArrowLeft className="w-4 h-4" /></div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 italic group-hover/back:text-indigo-300">Parent Context</span>
                        <span className="text-[11px] font-black text-slate-900 uppercase italic group-hover/back:text-white transition-colors leading-none">{parentItem.label}</span>
                      </div>
                    </button>
                  </div>
                )}

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                  <div className="flex items-center gap-3 mb-6 px-1">
                    <div className="w-0.5 h-8 bg-indigo-500 rounded-full" />
                    <div className="flex flex-col text-left">
                      <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-0.5 italic">Property Set</span>
                      <h2 className="text-xl font-black text-slate-900 uppercase italic leading-none">
                        {focusedId ? nodeType.replace(/([A-Z])/g, ' $1').trim() : 'Global Context'}
                      </h2>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <ConfigAccordion title="Content Matrix" icon={Settings2} description="Core content and primary information layer.">
                      {layoutTypes.includes(nodeType) ? renderBlockConfig() : (
                        ['heroHeadline', 'heroSubheadline', 'heroBadge', 'sectionHeading', 'featureCard'].includes(nodeType) && (
                          <HeadingConfig value={targetAttrs || {}} onChange={updateAttribute} elementPath="" activeFormatting={activeFormatting} />
                        )
                      )}
                      {nodeType === 'testimonialSection' && <TestimonialConfig value={targetAttrs || {}} onChange={updateAttribute} elementPath="" />}
                      {(nodeType === 'heroButtonGroup' || nodeType === 'buttonElement') && <ButtonConfig value={targetAttrs || {}} onChange={updateAttribute} elementPath="" />}
                      {nodeType === 'paragraphElement' && <ParagraphConfig value={targetAttrs || {}} onChange={updateAttribute} elementPath="" activeFormatting={activeFormatting} />}
                      
                      {/* Integrated Content-Centric Assets */}
                      {(nodeType === 'heroMedia' || nodeType === 'imageElement') && (
                        <MediaConfig 
                          value={targetAttrs || {}} 
                          onChange={updateAttribute} 
                          elementPath="" 
                          mediaKey={nodeType === 'heroMedia' ? 'bgImage' : 'src'} 
                        />
                      )}
                      {nodeType === 'videoElement' && <VideoConfig value={targetAttrs || {}} onChange={updateAttribute} elementPath="" />}
                      {nodeType === 'iconElement' && <IconConfig value={targetAttrs || {}} onChange={updateAttribute} elementPath="" />}
                      {nodeType === 'dividerElement' && <DividerConfig value={targetAttrs || {}} onChange={updateAttribute} elementPath="" />}
                      {nodeType === 'spacerElement' && <SpacerConfig value={targetAttrs || {}} onChange={updateAttribute} elementPath="" />}
                    </ConfigAccordion>

                    {focusedId && (
                      <>
                        <ConfigAccordion title="Visual Identity" icon={Palette} description="Visual aesthetics and style properties.">
                          <div className="space-y-10">
                            <BackgroundConfig value={targetAttrs || {}} onChange={updateAttribute} elementPath="" />
                            {/* Content configs moved to Content Matrix for better UX */}
                          </div>
                        </ConfigAccordion>

                        <ConfigAccordion title="Architecture" icon={Layout} description="Grid and sizing.">
                          <div className="space-y-10">
                            {(() => {
                              let isParentGrid = false;
                              if (nodeType === 'layoutColumn' && selectionPath.length > 1) {
                                const parentId = selectionPath[selectionPath.length - 2].id;
                                const parentNodeRes = resolveNode(parentId);
                                isParentGrid = !!parentNodeRes && parentNodeRes.node.attrs.displayType === 'grid';
                              }
                              return (
                                <>
                                  {(nodeType.toLowerCase().includes('row') || nodeType === 'sectionGrid' || nodeType === 'layoutColumn') && <RowGridConfig value={targetAttrs || {}} onChange={updateAttribute} elementPath="" nodeType={nodeType} isParentGrid={isParentGrid} />}
                                  <DimensionConfig value={targetAttrs || {}} onChange={updateAttribute} nodeType={nodeType} isParentGrid={isParentGrid} />
                                </>
                              );
                            })()}
                          </div>
                        </ConfigAccordion>

                        <ConfigAccordion title="Spatial System" icon={ArrowUpDown} description="Margins and padding.">
                          <div className="space-y-10 py-2 text-left">
                            {(nodeType === 'layoutRow' || nodeType.toLowerCase().includes('section')) && (
                              <div className="space-y-4">
                                <div className="flex justify-between items-center px-0.5">
                                  <ResponsiveLabel>Outer Margin</ResponsiveLabel>
                                  <span className="text-[10px] font-black text-white bg-indigo-600 px-3 py-1.5 rounded-full italic">{nodeType.toLowerCase().includes('section') && !(targetAttrs?.marginTop) ? 'AUTO' : getResponsiveVal(targetAttrs?.marginTop, activeDevice, '0px')}</span>
                                </div>
                                <input type="range" className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600" min="0" max="100" step="4" value={parseInt(getResponsiveVal(targetAttrs?.marginTop, activeDevice, '0px')) || 0} onChange={(e) => updateAttribute('marginTop', updateResponsiveValue(targetAttrs?.marginTop, activeDevice, `${e.target.value}px`))} />
                              </div>
                            )}
                            <div className="space-y-4">
                              <div className="flex justify-between items-center px-0.5">
                                <ResponsiveLabel>Internal Padding</ResponsiveLabel>
                                <span className="text-[10px] font-black text-white bg-indigo-600 px-3 py-1.5 rounded-full italic">{nodeType.toLowerCase().includes('section') && (!targetAttrs?.padding || targetAttrs?.padding === 'py-24') ? 'AUTO' : getResponsiveVal(targetAttrs?.padding, activeDevice, 'py-8')}</span>
                              </div>
                              <input type="range" className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600" min="0" max="160" step="8" value={parseInt(getResponsiveVal(targetAttrs?.padding, activeDevice, '8').replace(/[^\d]/g, '')) || 0} onChange={(e) => updateAttribute('padding', updateResponsiveValue(targetAttrs?.padding, activeDevice, `py-${e.target.value}`))} />
                            </div>
                          </div>
                        </ConfigAccordion>

                        <ConfigAccordion title="Core Physics" icon={MousePointer2} description="Transformations.">
                          <AdvancedConfig value={targetAttrs || {}} onChange={updateAttribute} elementPath="" />
                        </ConfigAccordion>
                      </>
                    )}
                  </div>
                </div>
             </div>
           )}
         </div>
      </motion.div>
    </AnimatePresence>
  );
};
