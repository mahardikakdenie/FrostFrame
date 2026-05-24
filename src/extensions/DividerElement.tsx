import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { useUIStore } from '../store/useUIStore';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';

const DividerComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, color, thickness, width, marginTop } = node.attrs;
  const activeDevice = useUIStore(state => state.activeDevice);
  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this divider?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  const currentMarginTop = (typeof marginTop === 'object' && marginTop !== null)
    ? (marginTop[activeDevice] || '0px')
    : (marginTop || '0px');

  return (
    <NodeViewWrapper
      data-drag-handle
      className="group/divider relative my-4 w-full"
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos());
      }}
    >
      <div className={cn(
        'relative transition-all duration-300 flex items-center justify-center min-h-[20px]',
        selected ? 'ring-2 ring-indigo-500 ring-offset-4 rounded-lg' : 'hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4 rounded-lg',
        isHovered && 'ring-4 ring-indigo-500/40 z-50 shadow-2xl'
      )}>
        <ElementToolbar
          label="DIVIDER"
          selected={selected}
          isActive={editor.isActive('dividerElement')}
          node={node}
          groupName="divider"
          onDelete={handleDelete}
          onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
          onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
          onSelect={() => { if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos()); }}
        />

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
