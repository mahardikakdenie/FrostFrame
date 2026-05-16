import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { Trash2, GripVertical, MoveVertical } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

const SpacerComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { height, marginTop } = node.attrs;
  const activeDevice = useUIStore(state => state.activeDevice);

  const handleSelectNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this spacer?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  const currentHeight = (typeof height === 'object' && height !== null) ? (height[activeDevice] || '40px') : (height || '40px');
  const currentMarginTop = (typeof marginTop === 'object' && marginTop !== null) ? (marginTop[activeDevice] || '0px') : (marginTop || '0px');

  return (
    <NodeViewWrapper 
      className="group/spacer relative w-full"
      onDoubleClick={handleDoubleClick}
    >
      {/* Visual Indicator & Drag Handle */}
      <div 
        className={cn(
          "absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/spacer:opacity-100 transition-opacity z-50",
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
        "relative transition-all duration-300 flex items-center justify-center border-2 border-transparent",
        selected ? "ring-2 ring-indigo-500 ring-offset-2 rounded-lg bg-indigo-50/20 border-dashed border-indigo-200" : "hover:bg-slate-50/50 hover:border-dashed hover:border-slate-200 rounded-lg"
      )}
      style={{ 
        height: currentHeight,
        marginTop: currentMarginTop !== '0px' ? currentMarginTop : undefined
      }}>
        {/* Badge Label & Actions */}
        <div className={cn(
          "absolute -top-10 right-0 flex flex-row-reverse items-center gap-1 transition-all duration-300",
          (selected || editor.isActive('spacerElement')) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <button 
            onClick={handleDelete}
            className="bg-rose-500 text-white p-0.5 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Delete Spacer"
          >
             <Trash2 className="w-2.5 h-2.5" />
          </button>
          <div 
            onClick={handleSelectNode}
            className="bg-indigo-600 text-[8px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20 cursor-pointer"
          >
            SPACER
          </div>
        </div>

        <div className="opacity-10 pointer-events-none flex flex-col items-center gap-1">
           <MoveVertical className="w-4 h-4" />
           <span className="text-[8px] font-black">{currentHeight}</span>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const SpacerElement = Node.create({
  name: 'spacerElement',
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      height: { 
        default: '40px',
        keepAttributes: true,
        parseHTML: element => element.getAttribute('data-height'),
        renderHTML: attributes => ({ 'data-height': typeof attributes.height === 'object' ? JSON.stringify(attributes.height) : attributes.height })
      },
      marginTop: { default: '0px' }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="spacer-element"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'spacer-element' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SpacerComponent);
  },
});
