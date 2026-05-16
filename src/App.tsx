/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Editor } from './components/builder/Editor';
import { PreviewSidebar } from './components/builder/PreviewSidebar';
import { BlockLibrarySidebar } from './components/builder/BlockLibrarySidebar';
import { useStore } from './store/useStore';
import { useUIStore } from './store/useUIStore';
import { Monitor, Tablet, Smartphone, Eye, Plus, Send, Layout, ChevronLeft, Search, Undo2, Redo2, Trash2, Save } from 'lucide-react';
import { cn } from './lib/utils';
import { MediaLibraryModal } from './components/builder/MediaLibraryModal';

export default function App() {
  const previewMode = useUIStore((state) => state.previewMode);
  const setPreviewMode = useUIStore((state) => state.setPreviewMode);
  const focusedId = useUIStore((state) => state.focusedId);
  const setFocusedId = useUIStore((state) => state.setFocusedId);

  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    const hasDraft = localStorage.getItem('lando-builder-draft');
    if (hasDraft) {
      console.log('Draft detected in LocalStorage and loaded.');
    }
  }, []);

  const handleSaveDraft = () => {
    const editor = (window as any).editor;
    if (editor) {
      setSaveStatus('saving');
      const content = editor.getJSON();
      localStorage.setItem('lando-builder-draft', JSON.stringify(content));
      
      setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
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
    <div className="flex flex-col h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
      <MediaLibraryModal />
      {/* Top Navigation Bar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-40 shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black italic shadow-2xl skew-x--10">L</div>
          <div className="flex flex-col text-left">
            <span className="font-black text-xs tracking-widest uppercase italic leading-none">Lando Studio</span>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Workspace: Draft_01</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase italic text-slate-500 hover:text-indigo-600 hover:bg-white border-2 border-transparent hover:border-indigo-100 rounded-2xl transition-all">
            <Eye className="w-4 h-4" />
            Inspect
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase italic hover:bg-black shadow-2xl shadow-slate-300 transition-all hover:-translate-y-0.5 active:translate-y-0">
            <Send className="w-4 h-4" />
            Publish Now
          </button>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Unified Panel (Blocks or Properties) */}
        <aside className="w-85 bg-white border-r border-slate-200 flex flex-col shrink-0 z-50">
          {focusedId ? (
            <PreviewSidebar />
          ) : (
            <BlockLibrarySidebar onAddSection={addSection} />
          )}
        </aside>

        {/* Editor Stage */}
        <div className="flex-1 bg-slate-100 p-12 flex flex-col justify-start items-center overflow-auto relative">
          {/* Integrated Toolbar */}
          <div className="w-full max-w-[1280px] mb-6 flex items-center justify-between px-4">
             <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-xl">
                <button 
                  onClick={handleSaveDraft}
                  className={cn(
                    "p-2.5 rounded-xl transition-all active:scale-90 flex items-center gap-2 px-4",
                    saveStatus === 'saved' ? "bg-emerald-500 text-white" : "hover:bg-slate-50 text-slate-400 hover:text-indigo-600"
                  )}
                  title="Save as Draft (Local)"
                >
                   <Save className="w-4 h-4" />
                   <span className="text-[9px] font-black uppercase tracking-widest italic">
                     {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Draft'}
                   </span>
                </button>
                <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                <button 
                  onClick={() => (window as any).editor?.commands.undo()}
                  className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
                  title="Undo (Ctrl+Z)"
                >
                   <Undo2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => (window as any).editor?.commands.redo()}
                  className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all active:scale-90"
                  title="Redo (Ctrl+Y)"
                >
                   <Redo2 className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                <button 
                  className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all"
                  title="Clear Canvas"
                  onClick={() => {
                    if (confirm('Clear entire canvas and delete draft?')) {
                      const editor = (window as any).editor;
                      if (editor) {
                        editor.commands.clearContent();
                        localStorage.removeItem('lando-builder-draft');
                        setSaveStatus('idle');
                      }
                    }
                  }}
                >
                   <Trash2 className="w-4 h-4" />
                </button>
             </div>

             <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-xl">
               {[
                 { id: 'desktop', icon: Monitor, label: 'Desktop 1280px' },
                 { id: 'tablet', icon: Tablet, label: 'Tablet 768px' },
                 { id: 'mobile', icon: Smartphone, label: 'Mobile 375px' },
               ].map((mode) => (
                 <button
                   key={mode.id}
                   onClick={() => setPreviewMode(mode.id as any)}
                   className={cn(
                     "px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-black text-[9px] uppercase tracking-widest",
                     previewMode === mode.id 
                       ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                       : "text-slate-400 hover:text-slate-600 hover:bg-white"
                   )}
                 >
                   <mode.icon className="w-3.5 h-3.5" />
                   <span className="hidden lg:inline">{mode.id}</span>
                 </button>
               ))}
             </div>

             <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</span>
                   <span className="text-[10px] font-black text-emerald-500 uppercase italic tracking-tighter flex items-center gap-1.5 text-right">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Live Editor
                   </span>
                </div>
             </div>
          </div>

          <div 
            id="editor-stage"
            className={cn(
              "bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 ease-out overflow-y-auto overflow-x-hidden relative border-4 border-slate-200/50 rounded-[40px] custom-scrollbar",
              previewMode === 'desktop' && "w-[1280px] h-full",
              previewMode === 'tablet' && "w-[768px] h-full",
              previewMode === 'mobile' && "w-[375px] h-full"
            )}
          >
            {/* Window Browser Interface Simulation */}
            <div className="sticky top-0 left-0 w-full h-10 bg-slate-50/80 backdrop-blur-md flex items-center px-6 gap-2 z-50 border-b border-slate-100">
               <div className="flex gap-1.5 mr-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
               </div>
               <div className="flex-1 bg-white border border-slate-200 h-6 rounded-lg text-[9px] text-slate-400 flex items-center px-4 italic font-bold">
                  https://lando-builder.studio/my-awesome-startup
               </div>
            </div>
            
            <Editor />
          </div>
        </div>
      </main>

      {/* Bottom Status Bar */}
      <footer className="h-10 bg-white border-t border-slate-200 flex items-center justify-between px-6 shrink-0 text-[10px] font-black italic text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-200"></div>
            Engine: Tiptap v2.x
          </div>
          <div className="hidden md:block">State Manager: Zustand Distributed Architecture</div>
        </div>
        <div className="font-mono">
          Viewport: {previewMode === 'desktop' ? '1280' : previewMode === 'tablet' ? '768' : '375'}px x AUTO | 60FPS STABLE
        </div>
      </footer>
    </div>
  );
}
