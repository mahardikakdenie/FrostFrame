import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { GripVertical, Trash2, ExternalLink } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

const ButtonComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { text, link, variant, color, size, borderRadius, width, marginTop } = node.attrs;
  
  const openConfirmModal = useUIStore(state => state.openConfirmModal);

  const handleSelectNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    openConfirmModal({
      title: 'Delete Button',
      message: 'Are you sure you want to remove this button?',
      variant: 'danger',
      onConfirm: () => {
        const pos = getPos();
        if (typeof pos === 'number') {
          editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
        }
      }
    });
  };

  const isPrimary = variant === 'primary';

  return (
    <NodeViewWrapper 
      className={cn(
        "group/btn relative my-4 inline-block transition-all",
        width === 'full' ? 'w-full' : 'w-auto'
      )}
      style={{ marginTop: marginTop || '0px' }}
    >
      {/* Visual Indicator & Drag Handle */}
      <div 
        className={cn(
          "absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-opacity z-50",
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
        "relative transition-all duration-300",
        selected ? "ring-2 ring-indigo-500 ring-offset-4 rounded-xl" : "hover:ring-2 hover:ring-indigo-100 hover:ring-offset-2 rounded-xl"
      )}>
        {/* Badge Label & Actions */}
        <div className={cn(
          "absolute -top-10 right-0 flex flex-row-reverse items-center gap-1 transition-all duration-300 z-40",
          selected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <button 
            onClick={handleDelete}
            className="bg-rose-500 text-white p-0.5 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Delete Button"
          >
             <Trash2 className="w-2.5 h-2.5" />
          </button>
          <div 
            onClick={handleSelectNode}
            className="bg-indigo-600 text-[10px] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20 cursor-pointer"
          >
            BUTTON
          </div>
        </div>

        {isPrimary ? (
          <button 
            style={{ 
              backgroundColor: color || 'var(--primary-color)',
              borderRadius: borderRadius || '0.75rem'
            }}
            className={cn(
              "text-white font-black uppercase italic tracking-widest transition-all hover:-translate-y-1 active:translate-y-0 text-center skew-x--10 shadow-xl",
              size === 'sm' ? 'px-6 py-2.5 text-[8px]' : size === 'lg' ? 'px-12 py-5 text-[12px]' : 'px-9 py-4 text-[10px]',
              width === 'full' ? 'w-full' : 'w-auto'
            )}
          >
            <div className="skew-x-10 flex items-center justify-center gap-2">
              {text || 'BUTTON'}
              {link && <ExternalLink className="w-3 h-3 opacity-50" />}
            </div>
          </button>
        ) : (
          <button 
            style={{ 
              borderColor: color || 'var(--primary-color)', 
              color: color || 'var(--primary-color)',
              borderRadius: borderRadius || '0.75rem'
            }}
            className={cn(
              "bg-white border-2 font-black uppercase italic tracking-widest transition-all hover:bg-slate-50 hover:-translate-y-1 active:translate-y-0 text-center skew-x--10 shadow-xl",
              size === 'sm' ? 'px-6 py-2.5 text-[8px]' : size === 'lg' ? 'px-12 py-5 text-[12px]' : 'px-9 py-4 text-[10px]',
              width === 'full' ? 'w-full' : 'w-auto'
            )}
          >
            <div className="skew-x-10 flex items-center justify-center gap-2">
              {text || 'BUTTON'}
              {link && <ExternalLink className="w-3 h-3 opacity-50" />}
            </div>
          </button>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export const ButtonElement = Node.create({
  name: 'buttonElement',
  group: 'block',
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      id: { default: null },
      text: { default: 'CLICK ME' },
      link: { default: '#' },
      variant: { default: 'primary' },
      color: { default: null },
      size: { default: 'md' },
      borderRadius: { default: '0.75rem' },
      width: { default: 'auto' },
      marginTop: { default: '0px' }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="button-element"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'button-element' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ButtonComponent);
  },
});
