import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { cn } from '../lib/utils';
import { useUIStore } from '../store/useUIStore';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';

const HeroSubheadlineComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, fontWeight, lineHeight, textAlign, color, letterSpacing, fontSizeScale, textTransform, opacity } = node.attrs;

  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const getFontSize = () => {
    if (fontSizeScale) return { fontSize: `${fontSizeScale}rem` };
    return {};
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this subtitle?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  return (
    <NodeViewWrapper
      data-drag-handle
      className="group/subheadline relative my-4"
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      <div className={cn(
        'relative transition-all duration-300',
        selected ? 'ring-2 ring-indigo-500 ring-offset-6 rounded-lg shadow-2xl' : 'hover:ring-2 hover:ring-indigo-100 hover:ring-offset-6 rounded-lg',
        isHovered && 'ring-4 ring-indigo-500/40 z-50 shadow-2xl'
      )}>
        <ElementToolbar
          label="SUBTITLE"
          selected={selected}
          isActive={editor.isActive('heroSubheadline')}
          node={node}
          groupName="subheadline"
          onDelete={handleDelete}
          onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
          onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
          onSelect={() => { if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos()); }}
        />

        <div
          style={{
            color: color || '#64748b',
            letterSpacing: letterSpacing || '0.1em',
            ...getFontSize()
          }}
          className={cn(
            'text-sm leading-relaxed max-w-lg transition-all duration-300 outline-none min-h-[1.5em]',
            fontWeight || 'font-black',
            lineHeight,
            textAlign,
            textTransform || 'uppercase',
            opacity || 'opacity-80'
          )}
        >
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const HeroSubheadline = Node.create({
  name: 'heroSubheadline',
  group: 'block heroBlock levelThreeElement',
  content: 'inline*',
  draggable: true,
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      id: { default: null },
      fontWeight: { default: 'font-black' },
      lineHeight: { default: 'leading-relaxed' },
      textAlign: { default: 'text-left' },
      color: { default: '#64748b' },
      letterSpacing: { default: '0.1em' },
      fontSizeScale: { default: null },
      textTransform: { default: null },
      opacity: { default: null }
    };
  },

  parseHTML() {
    return [{ tag: 'p[data-type="hero-subheadline"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes, { 'data-type': 'hero-subheadline' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeroSubheadlineComponent);
  },
});
