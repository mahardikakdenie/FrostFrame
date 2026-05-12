import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { Plus, GripVertical } from 'lucide-react';

const FreeColumnComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { padding, background, width, flexSizing } = node.attrs;
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
      className={cn(
        "group/col relative min-h-[100px] transition-all duration-300",
        sizeClass,
        selected ? "ring-2 ring-blue-500 z-30" : "hover:ring-1 hover:ring-blue-200"
      )}
      style={{ 
        backgroundColor: background || 'transparent',
        padding: padding || '1rem'
      }}
    >
      <div className={cn(
        "absolute -top-6 left-0 flex items-center gap-1 opacity-0 group-hover/col:opacity-100 transition-opacity z-50 pointer-events-none",
        selected && "opacity-100"
      )}>
        <div 
          onClick={handleSelectNode}
          className="bg-blue-600 text-[8px] text-white px-2 py-0.5 rounded font-black uppercase tracking-widest pointer-events-auto cursor-pointer"
        >
          COLUMN
        </div>
        <div 
          data-drag-handle 
          onClick={handleSelectNode}
          className="bg-blue-600 text-white p-0.5 rounded cursor-grab active:cursor-grabbing pointer-events-auto"
        >
          <GripVertical className="w-2.5 h-2.5" />
        </div>
      </div>

      <div className="relative w-full h-full min-h-[120px]">
        {isEmpty && (
          <div className="absolute inset-0 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-200 transition-all group/dropzone pointer-events-none">
             <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover/dropzone:scale-110 group-hover/dropzone:text-blue-500 transition-all">
               <Plus className="w-5 h-5" />
             </div>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover/dropzone:text-blue-400 transition-colors">
               DROP WIDGET HERE
             </span>
          </div>
        )}
        <NodeViewContent className="w-full h-full min-h-[120px]" />
      </div>
    </NodeViewWrapper>
  );
};

export const FreeColumnExtension = Node.create({
  name: 'freeColumn',
  group: 'layoutBlock',
  content: 'levelThreeElement*',
  draggable: true,
  defining: true,

  addAttributes() {
    return {
      id: { default: null },
      padding: { default: '1rem' },
      background: { default: null },
      width: { default: 'w-full' },
      flexSizing: { default: 'flex-1' } // 'flex-1' | 'flex-none' | 'custom'
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="free-column"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'free-column' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FreeColumnComponent);
  },
});
