import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { GripVertical, Trash2, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

const ButtonComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, text, link, variant, color, size, borderRadius, width, marginTop } = node.attrs;
  
  const openConfirmModal = useUIStore(state => state.openConfirmModal);
  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

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

  const handleMove = (direction: 'up' | 'down') => (e: React.MouseEvent) => {
    e.stopPropagation();
    const pos = getPos();
    if (typeof pos !== 'number') return;

    const { doc } = editor.state;
    const $pos = doc.resolve(pos);
    const parent = $pos.parent;
    const index = $pos.index();

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= parent.childCount) return;

    const otherNode = parent.child(targetIndex);
    const targetPos = direction === 'up' 
      ? pos - otherNode.nodeSize 
      : pos + node.nodeSize;

    editor.chain()
      .deleteRange({ from: pos, to: pos + node.nodeSize })
      .insertContentAt(targetPos, node.toJSON())
      .setNodeSelection(targetPos)
      .focus()
      .run();
  };

  const isPrimary = variant === 'primary';

  return (
    <NodeViewWrapper 
      className={cn(
        "group/btn relative my-4 inline-block transition-all",
        width === 'full' ? 'w-full' : 'w-auto',
        (isHovered || selected) ? "z-[300]" : "z-10"
      )}
      style={{ marginTop: marginTop || '0px' }}
      onClick={handleSelectNode}
    >
      <div className={cn(
        "relative transition-all duration-300",
        selected ? "ring-2 ring-indigo-500 ring-offset-4 rounded-xl shadow-2xl" : "hover:ring-2 hover:ring-indigo-100 hover:ring-offset-2 rounded-xl",
        isHovered && "ring-4 ring-indigo-500/40 border-indigo-500 z-[301] shadow-2xl transition-all duration-300"
      )}>
        {/* Badge Label & Actions (Top-Right Standard) */}
        <div className={cn(
          "absolute -top-7 right-0 flex flex-row-reverse items-center gap-1 transition-all duration-300 z-[400]",
          selected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        )}>
          <button 
            onClick={handleDelete}
            className="bg-rose-500/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-rose-600 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Delete Button"
          >
             <Trash2 className="w-3 h-3" />
          </button>
          
          <button 
            onClick={handleMove('down')}
            className="bg-slate-700/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-slate-900 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Move Down"
          >
             <ArrowDown className="w-3 h-3" />
          </button>
          
          <button 
            onClick={handleMove('up')}
            className="bg-slate-700/80 backdrop-blur-md text-white p-1 rounded-full shadow-xl hover:bg-slate-900 transition-all hover:scale-110 active:scale-90 pointer-events-auto"
            title="Move Up"
          >
             <ArrowUp className="w-3 h-3" />
          </button>

          <div 
            onClick={handleSelectNode}
            className="bg-slate-900/40 backdrop-blur-md text-[9px] text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-xl border border-white/20 cursor-pointer pointer-events-auto"
          >
            BUTTON
          </div>

          <div 
            data-drag-handle
            className="bg-slate-900/40 backdrop-blur-md text-white p-1 rounded-full cursor-grab active:cursor-grabbing pointer-events-auto shadow-xl border border-white/20"
          >
            <GripVertical className="w-3 h-3" />
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
