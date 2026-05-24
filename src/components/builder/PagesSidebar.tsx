"use client";

import React, { useState } from 'react';
import { FileText, Plus, Trash2, Edit3, Check, X, ExternalLink } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { cn } from '../../lib/utils';

export function PagesSidebar() {
  const { pages, activePageId, addPage, deletePage, setActivePageId, updatePageMetadata } = useProjectStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');

  const handleAddPage = async () => {
    if (!newName.trim()) return;
    const slug = newSlug.trim() || `/${newName.toLowerCase().replace(/\s+/g, '-')}`;
    await addPage(newName, slug);
    setNewName('');
    setNewSlug('');
    setIsAdding(false);
  };

  const startEditing = (page: any) => {
    setEditingId(page.id);
    setEditName(page.name);
    setEditSlug(page.slug);
  };

  const handleUpdate = async (id: string) => {
    await updatePageMetadata(id, editName, editSlug);
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-[12px] font-black text-slate-900 dark:text-white uppercase italic tracking-widest">Site Pages</h3>
          <button 
            onClick={() => setIsAdding(true)}
            className="p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {isAdding && (
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-indigo-500 shadow-xl mb-4 animate-in zoom-in-95 duration-200">
             <div className="space-y-3">
                <div>
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Page Name</label>
                   <input 
                     autoFocus
                     value={newName}
                     onChange={e => setNewName(e.target.value)}
                     placeholder="e.g. About Us"
                     className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                   />
                </div>
                <div>
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">URL Slug</label>
                   <input 
                     value={newSlug}
                     onChange={e => setNewSlug(e.target.value)}
                     placeholder="/about"
                     className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                   />
                </div>
                <div className="flex gap-2 pt-2">
                   <button 
                     onClick={handleAddPage}
                     className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest"
                   >
                     Create
                   </button>
                   <button 
                     onClick={() => setIsAdding(false)}
                     className="px-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 py-2 rounded-xl text-[10px] font-black uppercase"
                   >
                     <X className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>
        )}

        {pages.map((page) => (
          <div 
            key={page.id}
            className={cn(
              "group relative flex flex-col transition-all rounded-2xl overflow-hidden",
              activePageId === page.id 
                ? "bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-500" 
                : "bg-white dark:bg-slate-800/40 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            )}
          >
            {editingId === page.id ? (
              <div className="p-4 space-y-3">
                 <input 
                   autoFocus
                   value={editName}
                   onChange={e => setEditName(e.target.value)}
                   className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                 />
                 <input 
                   value={editSlug}
                   onChange={e => setEditSlug(e.target.value)}
                   className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                 />
                 <div className="flex gap-2">
                    <button onClick={() => handleUpdate(page.id)} className="flex-1 bg-emerald-500 text-white p-2 rounded-xl flex justify-center"><Check className="w-4 h-4"/></button>
                    <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-500 p-2 rounded-xl flex justify-center"><X className="w-4 h-4"/></button>
                 </div>
              </div>
            ) : (
              <div 
                onClick={() => setActivePageId(page.id)}
                className="p-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    activePageId === page.id ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  )}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className={cn(
                      "text-[11px] font-black uppercase tracking-wider italic leading-none mb-1",
                      activePageId === page.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"
                    )}>
                      {page.name}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                      {page.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={(e) => { e.stopPropagation(); startEditing(page); }}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {pages.length > 1 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); deletePage(page.id); }}
                      className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg text-slate-400 hover:text-rose-500 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
