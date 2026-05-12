import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { cn } from '../lib/utils';
import { GripVertical } from 'lucide-react';

const RowComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { gap, alignItems, id } = node.attrs;

  const handleSelectNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  return (
    <NodeViewWrapper className="group/row relative w-full my-4">
      {/* Label & Drag Handle */}
      <div className={cn(
        "absolute -left-10 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity z-50",
        selected && "opacity-100"
      )}>
        <div 
          data-drag-handle 
          onClick={handleSelectNode}
          className="bg-slate-800 text-white p-1.5 rounded-lg cursor-grab active:cursor-grabbing shadow-lg"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      {selected && (
        <div 
          onClick={handleSelectNode}
          className="absolute -top-7 left-0 bg-slate-800 text-[8px] text-white px-2 py-1 rounded font-black uppercase tracking-widest z-40 cursor-pointer"
        >
          ROW
        </div>
      )}

      <div 
        className={cn(
          "flex flex-wrap w-full transition-all duration-300",
          selected ? "ring-2 ring-slate-800 ring-offset-4 rounded-xl" : "hover:ring-1 hover:ring-slate-300"
        )}
        style={{ 
          gap: gap || '1.5rem',
          alignItems: alignItems || 'stretch'
        }}
      >
        <NodeViewContent className="flex w-full" style={{ gap: gap || '1.5rem', alignItems: alignItems || 'stretch' }} />
      </div>
    </NodeViewWrapper>
  );
};

export const LayoutRow = Node.create({
  name: 'layoutRow',
  group: 'layoutBlock',
  content: 'layoutColumn+',
  draggable: true,
  defining: true,

  addAttributes() {
    return {
      id: { default: null },
      gap: { default: '1.5rem' },
      alignItems: { default: 'stretch' },
      background: { default: null }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="layout-row"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'layout-row' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(RowComponent);
  },
});
