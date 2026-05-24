import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { cn } from '../lib/utils';
import { useUIStore } from '../store/useUIStore';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';

const HeroBadgeComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, color, textAlign, letterSpacing, fontSizeScale } = node.attrs;

  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const getFontSize = () => {
    if (fontSizeScale) return { fontSize: `${fontSizeScale}rem` };
    return {};
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this badge?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  return (
    <NodeViewWrapper
      data-drag-handle
      className={cn(
        'group/badge w-full relative my-2 z-10',
        textAlign === 'text-center' ? 'flex justify-center' : 'flex justify-start'
      )}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      <div className={cn(
        'relative transition-all duration-300 py-1',
        selected ? 'ring-2 ring-indigo-500 ring-offset-4 rounded-lg' : 'hover:ring-2 hover:ring-indigo-200 hover:ring-offset-4 rounded-lg',
        isHovered && 'ring-4 ring-indigo-500/40 z-50 shadow-2xl'
      )}>
        <ElementToolbar
          label="BADGE"
          selected={selected}
          isActive={editor.isActive('heroBadge')}
          node={node}
          groupName="badge"
          onDelete={handleDelete}
          onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
          onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
          onSelect={() => { if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos()); }}
        />

        <div
          style={{
            color: color || 'var(--primary-color)',
            backgroundColor: color ? `${color}15` : 'rgba(var(--primary-color-rgb), 0.1)',
            letterSpacing: letterSpacing || '0.2em',
            ...getFontSize()
          }}
          className="inline-block px-4 py-1.5 text-[10px] font-black uppercase rounded-lg italic outline-none min-w-[50px] min-h-[1.5em] shadow-sm skew-x--10 border border-current/10"
        >
          <div className="skew-x-10">
            <NodeViewContent />
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const HeroBadge = Node.create({
  name: 'heroBadge',
  group: 'block heroBlock levelThreeElement',
  content: 'inline*',
  draggable: true,
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      id: { default: null },
      color: { default: null },
      textAlign: { default: 'text-left' },
      letterSpacing: { default: null },
      fontSizeScale: { default: null }
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="hero-badge"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'hero-badge' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeroBadgeComponent);
  },
});
