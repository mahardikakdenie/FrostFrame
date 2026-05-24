/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useEffect } from 'react';
import { Editor } from '../components/builder/Editor';
import { PreviewSidebar } from '../components/builder/PreviewSidebar';
import { BlockLibrarySidebar } from '../components/builder/BlockLibrarySidebar';
import { PagesSidebar } from '../components/builder/PagesSidebar';
import { useStore } from '../store/useStore';
import { useUIStore } from '../store/useUIStore';
import { useThemeStore } from '../store/useThemeStore';
import { useProjectStore } from '../store/useProjectStore';
import { Monitor, Tablet, Smartphone, Eye, Plus, Send, Layout, ChevronLeft, Search, Undo2, Redo2, Trash2, Save, Code2, Sun, Moon, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { MediaLibraryModal } from '../components/builder/MediaLibraryModal';
import { ConfirmationModal } from '../components/builder/ConfirmationModal';
import { JSONPreviewModal } from '../components/builder/JSONPreviewModal';
import { ThemeSettings } from '../components/builder/ThemeSettings';
import { savePageToDB, getPageFromDB, db } from '../lib/db';
import { motion, AnimatePresence } from 'framer-motion';

export default function Page() {
  const previewMode = useUIStore((state) => state.previewMode);
  const setPreviewMode = useUIStore((state) => state.setPreviewMode);
  const focusedId = useUIStore((state) => state.focusedId);
  const setFocusedId = useUIStore((state) => state.setFocusedId);
  const activeSidebarTab = useUIStore((state) => state.activeSidebarTab);
  const setActiveSidebarTab = useUIStore((state) => state.setActiveSidebarTab);
  const openConfirmModal = useUIStore((state) => state.openConfirmModal);
  const saveStatus = useUIStore((state) => state.saveStatus);
  const setSaveStatus = useUIStore((state) => state.setSaveStatus);

  const openJsonModal = useUIStore((state) => state.openJsonModal);
  const inspectMode = useUIStore((state) => state.inspectMode);
  const setInspectMode = useUIStore((state) => state.setInspectMode);

  const colorMode = useThemeStore((state) => state.colorMode);
  const toggleColorMode = useThemeStore((state) => state.toggleColorMode);

  const { activePageId, pages, initProject } = useProjectStore();

  // 1. Initialize Project on mount
  useEffect(() => {
    initProject();
  }, []);

  // 2. Load page content when activePageId changes
  useEffect(() => {
    const loadPage = async () => {
      if (!activePageId) return;
      
      // Clear focus before changing content to avoid "Position out of range"
      setFocusedId(null, 'section', [], null);
      
      const pageData = await getPageFromDB(activePageId);
      const editor = (window as any).editor;
      if (editor && pageData) {
        editor.commands.setContent(pageData.content);
      } else if (editor) {
        // New page with no saved data — set clean empty canvas
        editor.commands.setContent({
          type: 'doc',
          content: [{
            type: 'layoutRow',
            attrs: { id: crypto.randomUUID(), gridCols: 1, displayType: 'flex' },
            content: [{ type: 'layoutColumn', attrs: { id: crypto.randomUUID() } }]
          }]
        });
      }
    };
    loadPage();
  }, [activePageId]);

  useEffect(() => {
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [colorMode]);

  const handleSaveDraft = async () => {
    const editor = (window as any).editor;
    const activePage = pages.find(p => p.id === activePageId);
    
    if (editor && activePageId && activePage) {
      setSaveStatus('saving');
      const content = editor.getJSON();
      await savePageToDB(activePageId, activePage.name, activePage.slug, content);
      
      setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }, 500);
    }
  };

  const addSection = (type: string, payload?: any) => {
    const editor = (window as any).editor;
    if (editor) {
      if (payload) {
        editor.chain().focus().insertContent(payload).run();
      } else {
        // Ensure layoutRow has at least one column to satisfy schema
        const content = type === 'layoutRow' 
          ? { 
              type, 
              attrs: { id: crypto.randomUUID() },
              content: [{ type: 'layoutColumn', attrs: { id: crypto.randomUUID() } }]
            }
          : { type, attrs: { id: crypto.randomUUID() } };
          
        editor.chain().focus().insertContent(content).run();
      }
      setTimeout(() => {
        const stage = document.getElementById('editor-stage');
        if (stage) stage.scrollTo({ top: stage.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  const jumpToSection = (index: number) => {
    const editor = (window as any).editor;
    if (editor) {
      const { doc } = editor.state;
      let pos = 0;
      let currentIdx = 0;
      const sectionTypes = ['heroSection', 'pricingSection', 'featuresSection', 'testimonialSection', 'footerSection'];
      doc.descendants((node: any, nodePos: number) => {
        if (sectionTypes.includes(node.type.name)) {
          if (currentIdx === index) {
            pos = nodePos;
            // Also focus the section in our UI store
            setFocusedId(node.attrs.id, 'section');
          }
          currentIdx++;
        }
      });
      // Scroll to element
      const allNodes = document.querySelectorAll('.ProseMirror > *');
      if (allNodes[index]) {
        allNodes[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      editor.chain().focus().setTextSelection(pos).run();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      <MediaLibraryModal />
      {/* Top Navigation Bar */}
      <nav className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-40 shrink-0">
        <div className="flex items-center gap-4">
          <img 
            src={colorMode === 'dark' ? '/logo-dark.svg' : '/logo.svg'} 
            alt="FrostUI Logo" 
            className="h-10 w-auto" 
          />
          <div className="flex flex-col text-left border-l border-slate-200 dark:border-slate-800 pl-4 ml-1">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
               <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Version 2.0 Frosted</span>
            </div>
          </div>
        </div>

        {/* 🚀 CENTERED: Device Selector & Status */}
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
               {[
                 { id: 'desktop', icon: Monitor, label: 'Desktop' },
                 { id: 'tablet', icon: Tablet, label: 'Tablet' },
                 { id: 'mobile', icon: Smartphone, label: 'Mobile' },
               ].map((mode) => (
                 <button
                   key={mode.id}
                   onClick={() => setPreviewMode(mode.id as any)}
                   className={cn(
                     "px-4 py-1.5 rounded-xl flex items-center gap-2 transition-all font-black text-[9px] uppercase tracking-widest",
                     previewMode === mode.id 
                       ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg" 
                       : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700"
                   )}
                 >
                   <mode.icon className="w-3.5 h-3.5" />
                   <span className="hidden lg:inline">{mode.id}</span>
                 </button>
               ))}
           </div>
           
           <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block" />

           <div className="hidden md:flex flex-col items-start">
               <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Status</span>
               <span className="text-[10px] font-black text-emerald-500 uppercase italic tracking-tighter flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Live Editor
               </span>
           </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 🚀 RIGHT: Integrated Toolbar */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm mr-2">
                <button 
                  onClick={toggleColorMode}
                  className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-90"
                  title={colorMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                   {colorMode === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                </button>
                <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800" />
                <button 
                  onClick={handleSaveDraft}
                  className={cn(
                    "p-2 rounded-xl transition-all active:scale-90 flex items-center gap-2 px-3",
                    saveStatus === 'saved' ? "bg-emerald-500 text-white" : "hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  )}
                  title="Save as Draft (Local)"
                >
                   <Save className="w-3.5 h-3.5" />
                   <span className="text-[8px] font-black uppercase tracking-widest italic">
                     {saveStatus === 'saving' ? 'Saving' : saveStatus === 'saved' ? 'Saved' : 'Save'}
                   </span>
                </button>
                <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800" />
                <button 
                  onClick={() => (window as any).editor?.commands.undo()}
                  className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-90"
                  title="Undo (Ctrl+Z)"
                >
                   <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => (window as any).editor?.commands.redo()}
                  className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-90"
                  title="Redo (Ctrl+Y)"
                >
                   <Redo2 className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800" />
                <button 
                  className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-500 transition-all"
                  title="Clear Canvas"
                  onClick={() => {
                    openConfirmModal({
                      title: 'Clear Canvas',
                      message: 'Are you sure you want to clear the entire canvas and delete your draft? This action cannot be undone.',
                      variant: 'danger',
                      onConfirm: async () => {
                        const editor = (window as any).editor;
                        if (editor) {
                          editor.commands.setContent({
                            type: 'doc',
                            content: [{
                              type: 'layoutRow',
                              attrs: { id: crypto.randomUUID(), gridCols: 1, displayType: 'flex' },
                              content: [{ type: 'layoutColumn', attrs: { id: crypto.randomUUID() } }]
                            }]
                          });
                          if (activePageId) await db.pages.delete(activePageId);
                          setSaveStatus('idle');
                        }
                      }
                    });
                  }}
                >
                   <Trash2 className="w-3.5 h-3.5" />
                </button>
          </div>

          <button 
            onClick={() => setInspectMode(!inspectMode)}
            className={cn(
              "hidden sm:flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase italic transition-all rounded-2xl border-2",
              inspectMode 
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 border-transparent hover:border-indigo-100 dark:hover:border-indigo-900"
            )}
          >
            <Eye className="w-4 h-4" />
            {inspectMode ? 'Editing Off' : 'Inspect'}
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase italic hover:bg-black dark:hover:bg-slate-200 shadow-xl shadow-slate-200 dark:shadow-none transition-all hover:-translate-y-0.5 active:translate-y-0">
            <Send className="w-4 h-4" />
            Publish
          </button>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Unified Panel (Blocks or Properties) */}
        <aside className={cn(
          "w-85 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 z-50 transition-all duration-300",
          inspectMode ? "w-0 opacity-0 overflow-hidden border-none" : "w-85"
        )}>
          {/* Global Sidebar Tabs Navigation */}
          <div className="flex p-4 border-b border-slate-100 dark:border-slate-800 gap-2 bg-slate-50/50 dark:bg-slate-900/50">
             <button 
               onClick={() => setActiveSidebarTab('library')}
               className={cn(
                 "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                 activeSidebarTab === 'library' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 bg-white dark:bg-slate-800 shadow-sm"
               )}
             >
               <Layout className="w-3.5 h-3.5" />
               {focusedId ? 'Properties' : 'Library'}
             </button>
             <button 
               onClick={() => setActiveSidebarTab('pages')}
               className={cn(
                 "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                 activeSidebarTab === 'pages' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 bg-white dark:bg-slate-800 shadow-sm"
               )}
             >
               <FileText className="w-3.5 h-3.5" />
               Pages
             </button>
             <button 
               onClick={() => setActiveSidebarTab('design')}
               className={cn(
                 "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                 activeSidebarTab === 'design' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 bg-white dark:bg-slate-800 shadow-sm"
               )}
             >
               <Save className="w-3.5 h-3.5" />
               Design
             </button>
          </div>

          <div className="flex-1 overflow-hidden relative">
             {activeSidebarTab === 'library' ? (
                focusedId ? <PreviewSidebar /> : <BlockLibrarySidebar onAddSection={addSection} />
             ) : activeSidebarTab === 'pages' ? (
                <PagesSidebar />
             ) : (
                <div className="p-8 overflow-y-auto h-full custom-scrollbar">
                   <ThemeSettings />
                </div>
             )}
          </div>
        </aside>

        {/* Editor Stage */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 flex flex-col justify-start items-center overflow-auto relative">
          <div 
            id="editor-stage"
            className={cn(
              "bg-white dark:bg-slate-900 transition-all duration-700 ease-out overflow-y-auto overflow-x-hidden relative custom-scrollbar",
              previewMode === 'desktop' && "w-full h-full",
              previewMode === 'tablet' && "w-[768px] h-full shadow-2xl border-x border-slate-200 dark:border-slate-800",
              previewMode === 'mobile' && "w-[375px] h-full shadow-2xl border-x border-slate-200 dark:border-slate-800"
            )}
          >
            {/* Window Browser Interface Simulation (Only for non-desktop or compact desktop) */}
            <div className={cn(
              "sticky top-0 left-0 w-full h-10 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center px-6 gap-2 z-50 border-b border-slate-100 dark:border-slate-800",
              previewMode === 'desktop' && "hidden"
            )}>
               <div className="flex gap-1.5 mr-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
               </div>
               <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-6 rounded-lg text-[9px] text-slate-400 dark:text-slate-500 flex items-center px-4 italic font-bold">
                  {`https://lando-builder.studio${pages.find(p => p.id === activePageId)?.slug || ''}`}
               </div>
            </div>
            
            <Editor />
          </div>
        </div>
      </main>

      {/* Bottom Status Bar */}
      <footer className="h-10 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 text-[10px] font-black italic text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-200 dark:shadow-none"></div>
            Engine: Tiptap v2.x
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>State Manager: Zustand Distributed Architecture</span>
            <button 
              onClick={openJsonModal}
              className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all group"
            >
              <Code2 className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-white" />
              <span>View JSON</span>
            </button>
          </div>
        </div>
        <div className="font-mono">
          Viewport: {previewMode === 'desktop' ? '1280' : previewMode === 'tablet' ? '768' : '375'}px x AUTO | 60FPS STABLE
        </div>
      </footer>
      <ConfirmationModal />
      <JSONPreviewModal />
      
      {/* 🚀 FLOATING NOTIFICATION: Bottom Right */}
      <AnimatePresence>
        {saveStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="fixed bottom-12 right-6 z-[9999] flex items-center gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-1 pl-4 pr-1 rounded-2xl shadow-xl shadow-slate-200 dark:shadow-none"
          >
             <div className="flex flex-col py-2">
                <span className="text-[10px] font-black uppercase italic tracking-widest text-slate-400 dark:text-slate-500 leading-none mb-1">System Status</span>
                <span className="text-xs font-black uppercase italic tracking-tighter flex items-center gap-2 text-slate-900 dark:text-white">
                   {saveStatus === 'saving' ? (
                      <>
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                        Syncing to IndexedDB...
                      </>
                   ) : (
                      <>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        Draft Saved Successfully
                      </>
                   )}
                </span>
             </div>
             <div className={cn(
               "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
               saveStatus === 'saving' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" : "bg-emerald-500 text-white"
             )}>
                {saveStatus === 'saving' ? <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
