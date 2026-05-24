import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import * as LucideIcons from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';

const IconComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, iconName, size, color, marginTop, textAlign } = node.attrs;
  const activeDevice = useUIStore(state => state.activeDevice);
  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this icon?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  const Icon = (LucideIcons as any)[iconName || 'Star'] || LucideIcons.HelpCircle;
  const currentMarginTop = (typeof marginTop === 'object' && marginTop !== null)
    ? (marginTop[activeDevice] || '0px')
    : (marginTop || '0px');

  return (
    <NodeViewWrapper
      data-drag-handle
      className={cn(
        'group/icon relative my-4 w-full flex',
        textAlign === 'text-center' ? 'justify-center' : textAlign === 'text-right' ? 'justify-end' : 'justify-start'
      )}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos());
      }}
    >
      <div
        className={cn(
          'relative transition-all duration-300 p-2',
          selected ? 'ring-2 ring-indigo-500 ring-offset-4 rounded-xl' : 'hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4 rounded-xl',
          isHovered && 'ring-4 ring-indigo-500/40 z-50 shadow-2xl'
        )}
        style={{ marginTop: currentMarginTop !== '0px' ? currentMarginTop : undefined }}
      >
        <ElementToolbar
          label="ICON"
          selected={selected}
          isActive={editor.isActive('iconElement')}
          node={node}
          groupName="icon"
          onDelete={handleDelete}
          onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
          onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
          onSelect={() => { if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos()); }}
        />

        <Icon
          size={size || 48}
          color={color || 'var(--primary-color)'}
          className="transition-all duration-500"
        />
      </div>
    </NodeViewWrapper>
  );
};

export const IconElement = Node.create({
  name: 'iconElement',
  group: 'block',
  draggable: true,

  addAttributes() {
    return {
      id: { default: null },
      iconName: { default: 'Star' },
      size: { default: 48 },
      color: { default: null },
      marginTop: { default: '0px' },
      textAlign: { default: 'text-left' }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="icon-element"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'icon-element' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(IconComponent);
  },
});
