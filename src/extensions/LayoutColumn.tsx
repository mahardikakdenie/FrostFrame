import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { cn } from '../lib/utils';
import { Plus, GripVertical } from 'lucide-react';

const ColumnComponent = (props: any) => {
  const { node, selected } = props;
  const { width, padding, background, id } = node.attrs;
  const isEmpty = node.childCount === 0;

  return (
    <NodeViewWrapper 
      className={cn(
        "group/column relative min-h-[100px] transition-all duration-300",
        selected ? "ring-2 ring-indigo-500 z-30" : "hover:ring-1 hover:ring-indigo-200"
      )}
      style={{ 
        flex: width === 'auto' ? '1 1 0' : `0 0 ${width}`,
        backgroundColor: background || 'transparent',
        padding: padding || '1rem'
      }}
    >
      {/* Label & Drag Handle */}
      <div className={cn(
        "absolute -top-6 left-0 flex items-center gap-1 opacity-0 group-hover/column:opacity-100 transition-opacity z-50 pointer-events-none",
        selected && "opacity-100"
      )}>
        <div className="bg-indigo-600 text-[8px] text-white px-2 py-0.5 rounded font-black uppercase tracking-widest pointer-events-auto">
          Column
        </div>
        <div data-drag-handle className="bg-indigo-600 text-white p-0.5 rounded cursor-grab active:cursor-grabbing pointer-events-auto">
          <GripVertical className="w-2.5 h-2.5" />
        </div>
      </div>

      <div className="relative w-full h-full min-h-[120px]">
        {isEmpty && (
          <div className="absolute inset-0 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-200 transition-all group/dropzone pointer-events-none">
             <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover/dropzone:scale-110 group-hover/dropzone:text-indigo-500 transition-all">
               <Plus className="w-5 h-5" />
             </div>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover/dropzone:text-indigo-400 transition-colors">
               DROP WIDGET HERE
             </span>
          </div>
        )}
        <NodeViewContent className="w-full h-full min-h-[120px]" />
      </div>
    </NodeViewWrapper>
  );
};

export const LayoutColumn = Node.create({
  name: 'layoutColumn',
  group: 'layoutBlock',
  content: 'levelThreeElement*', // Restricted to element level
  draggable: true,
  defining: true,

  addAttributes() {
    return {
      id: { default: null },
      width: { default: 'auto' }, // Can be 50%, 33%, etc.
      padding: { default: '1rem' },
      background: { default: null },
      textAlign: { default: 'text-left' }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="layout-column"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'layout-column' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnComponent);
  },
});
