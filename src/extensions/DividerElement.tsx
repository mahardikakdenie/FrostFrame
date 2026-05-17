import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { Trash2, GripVertical, Minus } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

const DividerComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { color, thickness, width, marginTop } = node.attrs;
  const activeDevice = useUIStore(state => state.activeDevice);

  const handleSelectNode = (e: React.MouseEvent) => {
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

  const currentMarginTop = (typeof marginTop === 'object' && marginTop !== null) ? (marginTop[activeDevice] || '0px') : (marginTop || '0px');

  return (
    <NodeViewWrapper 
      className="group/divider relative my-4 w-full"
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
        "relative transition-all duration-300 flex items-center justify-center min-h-[20px]",
        selected ? "ring-2 ring-indigo-500 ring-offset-4 rounded-lg" : "hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4 rounded-lg"
      )}>
        {/* Badge Label & Actions */}
        <div className={cn(
          "absolute -top-10 right-0 flex flex-row-reverse items-center gap-1 transition-all duration-300",
          (selected || editor.isActive('dividerElement')) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <button 
            onClick={handleDelete}
            className="bg-rose-500 text-white p-0.5 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Delete Divider"
          >
             <Trash2 className="w-2.5 h-2.5" />
          </button>
          <div 
            onClick={handleSelectNode}
            className="bg-indigo-600 text-[10px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20 cursor-pointer"
          >
            DIVIDER
          </div>
        </div>

        <div 
          style={{ 
            backgroundColor: color || 'var(--primary-color)',
            height: thickness || '2px',
            width: width || '100%',
            marginTop: currentMarginTop,
            opacity: 0.2
          }}
          className="rounded-full transition-all duration-500"
        />
      </div>
    </NodeViewWrapper>
  );
};

export const DividerElement = Node.create({
  name: 'dividerElement',
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      color: { default: null },
      thickness: { default: '2px' },
      width: { default: '100%' },
      marginTop: { default: '20px' }
    };
  },

  parseHTML() {
    return [{ tag: 'hr[data-type="divider-element"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['hr', mergeAttributes(HTMLAttributes, { 'data-type': 'divider-element' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DividerComponent);
  },
});
