import React from 'react';
// @ts-ignore - BubbleMenu export might vary depending on Tiptap version installed
import { Editor, BubbleMenu } from '@tiptap/react';
import { Bold, Italic, Strikethrough, RemoveFormatting, Type } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FloatingToolbarProps {
  editor: Editor | null;
}

export const FloatingToolbar = ({ editor }: FloatingToolbarProps) => {
  if (!editor) return null;

  return (
    <BubbleMenu 
      editor={editor} 
      tippyOptions={{ duration: 100, animation: 'scale' }}
      className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-200"
    >
      <div className="flex items-center gap-0.5 px-1 border-r border-white/10 mr-1">
        <Type className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-[8px] font-black text-white/50 uppercase tracking-widest ml-1">Format</span>
      </div>

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "p-2 rounded-xl transition-all hover:bg-white/10",
          editor.isActive('bold') ? "text-indigo-400 bg-white/10" : "text-white/80"
        )}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "p-2 rounded-xl transition-all hover:bg-white/10",
          editor.isActive('italic') ? "text-indigo-400 bg-white/10" : "text-white/80"
        )}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={cn(
          "p-2 rounded-xl transition-all hover:bg-white/10",
          editor.isActive('strike') ? "text-indigo-400 bg-white/10" : "text-white/80"
        )}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-px h-4 bg-white/10 mx-1" />

      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className="p-2 rounded-xl transition-all hover:bg-white/10 text-white/80 hover:text-rose-400"
        title="Clear Formatting"
      >
        <RemoveFormatting className="w-4 h-4" />
      </button>
    </BubbleMenu>
  );
};
