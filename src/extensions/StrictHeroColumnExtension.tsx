import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { GripVertical } from 'lucide-react';

const StrictHeroColumnComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { role, width, flexSizing } = node.attrs;
  const isEmpty = node.childCount === 0;

  let sizeClass = '';
  if (flexSizing === 'custom') {
      sizeClass = `flex-none ${width}`;
  } else {
      sizeClass = flexSizing;
  }

  const handleSelectNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  return (
    <NodeViewWrapper 
      onClick={handleSelectNode}
      className={cn(
        "group/col relative transition-all duration-300 min-h-[400px] flex flex-col",
        sizeClass,
        selected ? "ring-2 ring-indigo-500 z-30" : "hover:ring-1 hover:ring-indigo-200"
      )}
    >
      <div className={cn(
        "absolute -top-6 left-0 flex items-center gap-1 opacity-0 group-hover/col:opacity-100 transition-opacity z-50 pointer-events-none",
        selected && "opacity-100"
      )}>
        <div className="bg-indigo-600 text-[8px] text-white px-2 py-0.5 rounded font-black uppercase tracking-widest pointer-events-auto">
          {role === 'content' ? 'CONTENT COLUMN' : 'MEDIA COLUMN'}
        </div>
      </div>

      <div className="relative flex-1 w-full flex flex-col">
        {isEmpty ? (
          <div className="absolute inset-0 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-4 bg-slate-50/30 hover:bg-indigo-50/20 hover:border-indigo-200 transition-all group/dropzone pointer-events-none">
             <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover/dropzone:scale-110 group-hover/dropzone:text-indigo-500 transition-all border border-slate-100">
               <span className="text-2xl">+</span>
             </div>
             <div className="text-center space-y-1">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                 Click or Drop Here
               </span>
               <span className="text-[8px] font-medium text-slate-300 uppercase tracking-tighter block">
                 to add {role === 'content' ? 'Headlines, Badges, etc.' : 'Media/Image'}
               </span>
             </div>
          </div>
        ) : null}
        <NodeViewContent className={cn("w-full h-full flex-1 flex flex-col justify-center", isEmpty ? "opacity-0" : "opacity-100")} />
      </div>
    </NodeViewWrapper>
  );
};

export const StrictHeroColumnExtension = Node.create({
  name: 'strictHeroColumn',
  group: 'layoutBlock',
  content: 'levelThreeElement+', // Elements Level 3
  draggable: false, // Don't allow dragging the strict column itself independently
  defining: true,

  addAttributes() {
    return {
      id: { default: null },
      role: { default: 'content' }, // 'content' or 'media'
      width: { default: 'w-full md:w-1/2' },
      flexSizing: { default: 'flex-1' } // 'flex-1' | 'flex-none' | 'custom'
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="strict-hero-column"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'strict-hero-column' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(StrictHeroColumnComponent);
  },
});
