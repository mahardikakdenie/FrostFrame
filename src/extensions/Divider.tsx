import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { GripVertical, Trash2 } from 'lucide-react';

const DividerComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { color, thickness, style, width, marginY } = node.attrs;

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this divider?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  return (
    <NodeViewWrapper 
      className="group/divider relative my-2"
      onDoubleClick={handleDoubleClick}
    >
      {/* Visual Indicator & Drag Handle */}
      <div 
        className={cn(
          "absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/divider:opacity-100 transition-opacity z-50",
          selected && "opacity-100"
        )}
      >
        <div 
          data-drag-handle
          className="p-1.5 bg-indigo-600 text-white rounded-lg cursor-grab active:cursor-grabbing shadow-lg hover:scale-110 transition-transform"
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      <div className={cn(
        "relative transition-all duration-300 py-4 cursor-pointer",
        selected ? "ring-2 ring-indigo-500 ring-offset-4 rounded-lg" : "hover:ring-2 hover:ring-indigo-100"
      )}>
        {/* Actions */}
        <div className={cn(
          "absolute -top-4 right-0 flex items-center gap-2 pointer-events-none transition-all duration-300",
          selected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <button 
            onClick={handleDelete}
            className="bg-rose-500 text-white p-1 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
          >
             <Trash2 className="w-3 h-3" />
          </button>
        </div>

        <div className="flex justify-center w-full">
           <hr 
            style={{ 
              borderColor: color || '#e2e8f0',
              borderTopWidth: thickness || '2px',
              borderStyle: style || 'solid',
              width: width || '100%',
              marginTop: marginY || '1rem',
              marginBottom: marginY || '1rem'
            }}
            className="transition-all duration-300"
           />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const Divider = Node.create({
  name: 'divider',
  group: 'block levelThreeElement',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      color: { default: '#e2e8f0' },
      thickness: { default: '2px' },
      style: { default: 'solid' }, // 'solid' | 'dashed' | 'dotted'
      width: { default: '100%' },
      marginY: { default: '1rem' }
    };
  },

  parseHTML() {
    return [{ tag: 'hr[data-type="divider"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['hr', mergeAttributes(HTMLAttributes, { 'data-type': 'divider' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DividerComponent);
  },
});
