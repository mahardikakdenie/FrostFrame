import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { ExternalLink } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';

const ButtonComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, text, link, variant, color, size, borderRadius, width, marginTop, transform, fontStyle, textTransform, fontFamily } = node.attrs;

  const openConfirmModal = useUIStore(state => state.openConfirmModal);
  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

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
  const buttonTransform = transform || 'skew-x--10';
  const innerTransform = buttonTransform.includes('skew-x--')
    ? buttonTransform.replace('skew-x--', 'skew-x-')
    : buttonTransform.includes('skew-x-')
      ? buttonTransform.replace('skew-x-', 'skew-x--')
      : '';

  return (
    <NodeViewWrapper
      data-drag-handle
      className={cn(
        'group/btn relative my-4 inline-block transition-all',
        width === 'full' ? 'w-full' : 'w-auto',
        (isHovered || selected) ? 'z-[300]' : 'z-10'
      )}
      style={{ marginTop: marginTop || '0px' }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos());
      }}
    >
      <div className={cn(
        'relative transition-all duration-300',
        selected ? 'ring-2 ring-indigo-500 ring-offset-4 rounded-xl shadow-2xl' : 'hover:ring-2 hover:ring-indigo-100 hover:ring-offset-2 rounded-xl',
        isHovered && 'ring-4 ring-indigo-500/40 z-[301] shadow-2xl'
      )}>
        <ElementToolbar
          label="BUTTON"
          selected={selected}
          isActive={editor.isActive('buttonElement')}
          node={node}
          groupName="btn"
          onDelete={handleDelete}
          onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
          onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
          onSelect={() => { if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos()); }}
        />

        {isPrimary ? (
          <button
            style={{
              backgroundColor: color || 'var(--primary-color)',
              borderRadius: borderRadius || '0.75rem',
              fontFamily: fontFamily || 'var(--font-heading)'
            }}
            className={cn(
              'text-white font-black transition-all hover:-translate-y-1 active:translate-y-0 text-center shadow-xl',
              buttonTransform,
              fontStyle || 'italic',
              textTransform || 'uppercase',
              size === 'sm' ? 'px-6 py-2.5 text-[8px]' : size === 'lg' ? 'px-12 py-5 text-[12px]' : 'px-9 py-4 text-[10px]',
              width === 'full' ? 'w-full' : 'w-auto'
            )}
          >
            <div className={cn('flex items-center justify-center gap-2', innerTransform)}>
              {text || 'BUTTON'}
              {link && <ExternalLink className="w-3 h-3 opacity-50" />}
            </div>
          </button>
        ) : (
          <button
            style={{
              borderColor: color || 'var(--primary-color)',
              color: color || 'var(--primary-color)',
              borderRadius: borderRadius || '0.75rem',
              fontFamily: fontFamily || 'var(--font-heading)'
            }}
            className={cn(
              'bg-white border-2 font-black transition-all hover:bg-slate-50 hover:-translate-y-1 active:translate-y-0 text-center shadow-xl',
              buttonTransform,
              fontStyle || 'italic',
              textTransform || 'uppercase',
              size === 'sm' ? 'px-6 py-2.5 text-[8px]' : size === 'lg' ? 'px-12 py-5 text-[12px]' : 'px-9 py-4 text-[10px]',
              width === 'full' ? 'w-full' : 'w-auto'
            )}
          >
            <div className={cn('flex items-center justify-center gap-2', innerTransform)}>
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
      marginTop: { default: '0px' },
      transform: { default: null },
      fontStyle: { default: null },
      textTransform: { default: null },
      fontFamily: { default: null }
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
