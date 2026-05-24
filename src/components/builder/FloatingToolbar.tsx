import React from 'react';
// Use a more resilient import strategy for Tiptap React components
import * as TiptapReact from '@tiptap/react';
import { Bold, Italic, Strikethrough, RemoveFormatting, Type } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FloatingToolbarProps {
  editor: any; // Using any to avoid strict type issues with BubbleMenu
}

export const FloatingToolbar = ({ editor }: FloatingToolbarProps) => {
  if (!editor) return null;

  // Safely extract BubbleMenu if it exists in the bundle
  const BubbleMenu = (TiptapReact as any).BubbleMenu;

  if (!BubbleMenu) {
    console.warn("Tiptap BubbleMenu component not found in @tiptap/react");
    return null;
  }

  return (
    <BubbleMenu 
      editor={editor} 
      tippyOptions={{ duration: 100, animation: 'scale' }}
      className="flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 p-1.5 rounded-full shadow-xl animate-in zoom-in-95 duration-200"
    >
      <div className="flex items-center gap-0.5 px-3 border-r border-slate-200 dark:border-white/10 mr-1">
        <Type className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        <span className="text-[8px] font-black text-slate-400 dark:text-white/50 uppercase tracking-widest ml-1">Format</span>
      </div>

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "p-2 rounded-full transition-all hover:bg-slate-100 dark:hover:bg-white/10",
          editor.isActive('bold') ? "text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-white/10" : "text-slate-600 dark:text-white/80"
        )}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "p-2 rounded-full transition-all hover:bg-slate-100 dark:hover:bg-white/10",
          editor.isActive('italic') ? "text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-white/10" : "text-slate-600 dark:text-white/80"
        )}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={cn(
          "p-2 rounded-full transition-all hover:bg-slate-100 dark:hover:bg-white/10",
          editor.isActive('strike') ? "text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-white/10" : "text-slate-600 dark:text-white/80"
        )}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />

      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className="p-2 rounded-full transition-all hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 dark:text-white/80 hover:text-rose-500"
        title="Clear Formatting"
      >
        <RemoveFormatting className="w-4 h-4" />
      </button>
    </BubbleMenu>
  );
};

