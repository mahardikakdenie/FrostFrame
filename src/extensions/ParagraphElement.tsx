import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';
import { cn } from '../lib/utils';
import { useUIStore } from '../store/useUIStore';
import { ElementToolbar } from './utils/ElementToolbar';
import { createMoveHandler } from './utils/nodeMove';

const ParagraphElementComponent = (props: any) => {
  const { node, selected, editor, getPos } = props;
  const { id, textAlign, color, fontSizeScale, lineHeight } = node.attrs;

  const hoveredId = useUIStore(state => state.hoveredId);
  const isHovered = hoveredId === id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this paragraph?')) {
      const pos = getPos();
      if (typeof pos === 'number') {
        editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize));
      }
    }
  };

  return (
    <NodeViewWrapper
      data-drag-handle
      className="group/para relative my-4"
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      <div className={cn(
        'relative transition-all duration-300 p-2',
        selected ? 'ring-2 ring-indigo-500 ring-offset-4 rounded-xl shadow-2xl' : 'hover:ring-2 hover:ring-indigo-100 hover:ring-offset-4 rounded-xl',
        isHovered && 'ring-4 ring-indigo-500/40 z-50 shadow-2xl'
      )}>
        <ElementToolbar
          label="PARAGRAPH"
          selected={selected}
          isActive={editor.isActive('paragraphElement')}
          node={node}
          groupName="para"
          onDelete={handleDelete}
          onMoveUp={createMoveHandler(editor, node, getPos, 'up')}
          onMoveDown={createMoveHandler(editor, node, getPos, 'down')}
          onSelect={() => { if (typeof getPos === 'function') editor.commands.setNodeSelection(getPos()); }}
        />

        <div
          style={{
            color: color || '#475569',
            fontSize: fontSizeScale ? `${fontSizeScale}rem` : '1rem'
          }}
          className={cn(
            'outline-none transition-all duration-300 min-h-[1.5em] leading-relaxed',
            textAlign || 'text-left'
          )}
        >
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export const ParagraphElement = Node.create({
  name: 'paragraphElement',
  group: 'block levelThreeElement',
  content: 'inline*',
  draggable: true,
  defining: true,

  addAttributes() {
    return {
      id: { default: null },
      textAlign: { default: 'text-left' },
      color: { default: '#475569' },
      fontSizeScale: { default: 1 },
      lineHeight: { default: 'relaxed' }
    };
  },

  parseHTML() {
    return [{ tag: 'p[data-type="paragraph-element"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes, { 'data-type': 'paragraph-element' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ParagraphElementComponent);
  },
});
